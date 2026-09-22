/**
 * Kairos Full-Stack Backend Server
 * High-performance REST API handling Auth, Dynamic Scenario Synthesis,
 * Squad Notes Persistence, 1v1 Duels, and Static Frontend Serving.
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import url from 'url';
import crypto from 'crypto';
import { db } from './db.js';
import { geminiBackend } from './services/geminiBackend.js';
import { youtubeBackend } from './services/youtubeBackend.js';

// Native .env loader
try {
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...rest] = trimmed.split('=');
        if (key && !process.env[key.trim()]) {
          process.env[key.trim()] = rest.join('=').trim();
        }
      }
    });
  }
} catch {}

const PORT = process.env.PORT || 3000;

// Session Helpers (backed by db.json persistent store)
function generateToken(userId) {
  return db.createSession(userId);
}

function getUserIdFromReq(req) {
  const authHeader = req.headers['authorization'] || '';
  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const session = db.getSession(token);
    return session ? session.userId : null;
  }
  return null;
}

// Request Body Parser Helper
function parseJSONBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 2 * 1024 * 1024) { // 2MB limit
        reject(new Error('Payload Too Large'));
      }
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (e) {
        reject(new Error('Invalid JSON Payload'));
      }
    });
    req.on('error', reject);
  });
}

// Response Helpers
function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin'
  });
  res.end(JSON.stringify(data));
}

function sendError(res, statusCode, message) {
  sendJSON(res, statusCode, { error: message });
}

// MIME Type Map for Static File Serving
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2'
};

// Main HTTP Request Handler
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // Handle CORS Pre-flight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY'
    });
    return res.end();
  }

  // ==========================================
  // REST API ROUTES
  // ==========================================

  try {
    // 1. AUTH: Register
    if (pathname === '/api/auth/register' && method === 'POST') {
      const body = await parseJSONBody(req);
      if (!body.username || !body.password) {
        return sendError(res, 400, 'Username and password are required.');
      }
      const user = db.createUser(body);
      const token = generateToken(user.id);
      return sendJSON(res, 201, { user, token });
    }

    // 2. AUTH: Login
    if (pathname === '/api/auth/login' && method === 'POST') {
      const body = await parseJSONBody(req);
      if (!body.username || !body.password) {
        return sendError(res, 400, 'Username/email and password are required.');
      }
      const user = db.authenticateUser(body.username, body.password);
      const token = generateToken(user.id);
      return sendJSON(res, 200, { user, token });
    }

    // 3. AUTH: Logout
    if (pathname === '/api/auth/logout' && method === 'POST') {
      const authHeader = req.headers['authorization'] || '';
      if (authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        db.deleteSession(token);
      }
      return sendJSON(res, 200, { success: true });
    }

    // 4. AUTH: Me (Profile)
    if (pathname === '/api/auth/me' && method === 'GET') {
      const userId = getUserIdFromReq(req);
      if (!userId) {
        return sendError(res, 401, 'Unauthorized session.');
      }
      const user = db.getUserById(userId);
      if (!user) return sendError(res, 404, 'User not found.');
      return sendJSON(res, 200, { user });
    }

    // 5. AUTH: Update Profile
    if (pathname === '/api/auth/profile' && method === 'PUT') {
      const userId = getUserIdFromReq(req);
      if (!userId) return sendError(res, 401, 'Unauthorized session.');
      const body = await parseJSONBody(req);
      const updated = db.updateUser(userId, body);
      return sendJSON(res, 200, { user: updated });
    }

    // 6. SCENARIOS: 100% Dynamic Synthesis for ANY Topic
    if (pathname === '/api/scenarios/generate' && method === 'POST') {
      const body = await parseJSONBody(req);
      const topic = body.topic || 'Web Application Exploitation';
      const tier = parseInt(body.tier, 10) || 1;
      const language = body.language || 'en';

      const scenarios = await geminiBackend.generateScenariosForTopic({ topic, tier, language });
      return sendJSON(res, 200, scenarios);
    }

    // 7. SCENARIOS: Dynamic Evaluation & Skill-Gap Schema
    if (pathname === '/api/scenarios/evaluate' && method === 'POST') {
      const body = await parseJSONBody(req);
      const userId = getUserIdFromReq(req);
      const { domain, missedQuestions = [], score = 0 } = body;

      const record = db.saveDiagnosticResult(userId || 'guest', {
        domain: typeof domain === 'object' ? domain.title : domain,
        score,
        missedCount: missedQuestions.length,
        missedQuestions
      });

      return sendJSON(res, 200, {
        savedRecord: record,
        blueprint: {
          domain: typeof domain === 'object' ? domain.title : domain,
          score,
          status: score >= 80 ? 'PASSED_BASELINE' : 'NEEDS_SURGICAL_REMEDIATION',
          weaknesses: missedQuestions.map(m => ({
            micro_topic: m.microTopic,
            real_world_risk: m.soWhat,
            suggested_video_query: m.remediationQuery,
            takeaways: m.cheatSheet
          }))
        }
      });
    }

    // 8. TUTOR: Dynamic ELI5 Explanations
    if (pathname === '/api/tutor/ask' && method === 'POST') {
      const body = await parseJSONBody(req);
      const { topic, userQuery, language } = body;
      const explanation = await geminiBackend.getELI5Explanation({ topic, userQuery, language });
      return sendJSON(res, 200, { explanation });
    }

    // 9. YOUTUBE: Dynamic Video Search
    if (pathname === '/api/youtube/search' && method === 'GET') {
      const query = parsedUrl.query.query || 'cybersecurity defense fundamentals';
      const video = await youtubeBackend.searchVideo(query);
      return sendJSON(res, 200, video);
    }

    // 10. SQUADS: Get Notes
    if (pathname === '/api/squads/notes' && method === 'GET') {
      const squad = parsedUrl.query.squad;
      const notes = db.getSquadNotes(squad);
      return sendJSON(res, 200, { notes });
    }

    // 11. SQUADS: Post Note
    if (pathname === '/api/squads/notes' && method === 'POST') {
      const userId = getUserIdFromReq(req);
      const body = await parseJSONBody(req);
      let authorName = body.author || 'Agent_Operative';
      let squadName = body.squad || 'ZeroDay Hunters';

      if (userId) {
        const currentUser = db.getUserById(userId);
        if (currentUser) {
          authorName = currentUser.callSign || currentUser.username;
          squadName = currentUser.squad || squadName;
        }
      }

      const note = db.addSquadNote({
        author: authorName,
        authorId: userId || 'anon',
        squad: squadName,
        topic: body.topic,
        content: body.content,
        contentHinglish: body.contentHinglish
      });
      return sendJSON(res, 201, { note });
    }

    // 12. SQUADS: Upvote Note
    if (pathname.startsWith('/api/squads/notes/') && pathname.endsWith('/upvote') && method === 'POST') {
      const userId = getUserIdFromReq(req);
      if (!userId) {
        return sendError(res, 401, 'Authentication required to upvote notes.');
      }
      const parts = pathname.split('/');
      const noteId = parts[parts.length - 2];
      const updated = db.upvoteSquadNote(noteId, userId);
      return sendJSON(res, 200, { note: updated });
    }

    // 13. DUELS: Dynamic Speed Scenario Round
    if (pathname === '/api/duels/generate-round' && method === 'POST') {
      const body = await parseJSONBody(req);
      const round = geminiBackend.generateDuelRound(body.topic);
      return sendJSON(res, 200, round);
    }
  } catch (err) {
    console.error('API Error:', err);
    return sendError(res, 500, err.message || 'Internal Server Error');
  }

  // ==========================================
  // STATIC FILE SERVING FOR CLIENT SPA
  // ==========================================
  const normalizedPath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  let filePath = path.join(process.cwd(), normalizedPath === '/' || normalizedPath === '\\' ? 'index.html' : normalizedPath);

  // Security check: strictly enforce path containment inside current directory
  const rootDir = process.cwd();
  if (!filePath.startsWith(rootDir)) {
    res.writeHead(403, { 'X-Content-Type-Options': 'nosniff' });
    return res.end('Forbidden');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // SPA Fallback: serve index.html
      filePath = path.join(rootDir, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(404, { 'X-Content-Type-Options': 'nosniff' });
        return res.end('Not Found');
      }
      res.writeHead(200, {
        'Content-Type': contentType,
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'Referrer-Policy': 'strict-origin-when-cross-origin'
      });
      res.end(content);
    });
  });
});

server.listen(PORT, () => {
  console.log(`⚡ Kairos Full-Stack Server running at http://localhost:${PORT}`);
});
