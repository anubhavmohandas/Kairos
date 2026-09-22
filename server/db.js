/**
 * Kairos Persistent Database Engine
 * File-backed persistent storage for Users, Sessions, Diagnostics, Squad Notes, and Duels.
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { firebaseBackend } from './services/firebaseBackend.js';

const DATA_DIR = path.resolve(process.cwd(), '.kairos_data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

class Database {
  constructor() {
    this.data = {
      users: [],
      sessions: [],
      diagnostics: [],
      squadNotes: [
        {
          id: 'sn_1',
          author: 'Arjun_S',
          authorId: 'u_arjun',
          squad: 'ZeroDay Hunters',
          topic: 'Subdomain Spoofing Rule of Thumb',
          content: 'Read URLs backwards from the first slash (/): apex domain is right before the TLD (.com, .org). Never trust subdomains alone!',
          contentHinglish: 'URL ko hamesha pehle slash (/) se ulta pado! Asli domain TLD ke theek pehle hota hai.',
          upvotes: 18,
          upvotedBy: [],
          timestamp: '2 hours ago'
        },
        {
          id: 'sn_2',
          author: 'Priya_K',
          authorId: 'u_priya',
          squad: 'ZeroDay Hunters',
          topic: 'DMARC p=none is useless',
          content: 'Remember for the exam: DMARC p=none only generates telemetry reports. Only p=quarantine or p=reject blocks forged emails.',
          contentHinglish: 'DMARC p=none sirf report banata hai, email block nahi karta. Block karne ke liye p=reject chahiye!',
          upvotes: 24,
          upvotedBy: [],
          timestamp: 'Yesterday'
        }
      ],
      duels: [],
      syllabi: []
    };
    this.init();
  }

  init() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        this.data = { ...this.data, ...parsed };
        if (!Array.isArray(this.data.sessions)) {
          this.data.sessions = [];
        }
      } catch (e) {
        console.warn('Could not read existing db.json, initializing fresh store:', e);
      }
    } else {
      this.save();
    }
  }

  save() {
    try {
      const tmpFile = DB_FILE + '.tmp';
      fs.writeFileSync(tmpFile, JSON.stringify(this.data, null, 2), 'utf-8');
      fs.renameSync(tmpFile, DB_FILE);
      if (firebaseBackend.isConfigured()) {
        firebaseBackend.syncToCloud('db', this.data).catch(() => {});
      }
    } catch (e) {
      console.error('Failed to save db.json safely:', e);
    }
  }

  // Password Hashing with PBKDF2 & Salt
  hashPassword(password, salt) {
    if (!salt) {
      salt = crypto.randomBytes(16).toString('hex');
    }
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return { salt, hash };
  }

  verifyPassword(password, salt, storedHash) {
    if (!salt || !storedHash) return false;
    // Legacy single-pass sha256 fallback for existing test accounts
    if (salt === 'sha256_legacy') {
      const legacyHash = crypto.createHash('sha256').update(password).digest('hex');
      return legacyHash === storedHash;
    }
    const { hash } = this.hashPassword(password, salt);
    try {
      return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(storedHash, 'hex'));
    } catch {
      return false;
    }
  }

  // Session Token Methods (Persisted in db.json)
  createSession(userId, ttlMs = 7 * 24 * 60 * 60 * 1000) {
    const token = 'tok_' + crypto.randomBytes(24).toString('hex');
    const session = {
      token,
      userId,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + ttlMs).toISOString()
    };
    if (!this.data.sessions) this.data.sessions = [];
    this.data.sessions.push(session);
    this.save();
    return token;
  }

  getSession(token) {
    if (!token || !this.data.sessions) return null;
    const index = this.data.sessions.findIndex(s => s.token === token);
    if (index === -1) return null;
    const session = this.data.sessions[index];
    if (new Date(session.expiresAt) < new Date()) {
      this.data.sessions.splice(index, 1);
      this.save();
      return null;
    }
    return session;
  }

  deleteSession(token) {
    if (!token || !this.data.sessions) return false;
    const initialLen = this.data.sessions.length;
    this.data.sessions = this.data.sessions.filter(s => s.token !== token);
    if (this.data.sessions.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // User Methods
  createUser({ username, email = '', password, callSign, squad = 'ZeroDay Hunters', targetTrack = 'phishing-social-eng' }) {
    if (!username || typeof username !== 'string' || !password || typeof password !== 'string') {
      throw new Error('Username and password are required.');
    }
    const cleanUsername = username.trim().toLowerCase();
    const cleanEmail = email && typeof email === 'string' ? email.trim().toLowerCase() : '';

    const existing = this.data.users.find(u => {
      const uName = u.username ? u.username.toLowerCase() : '';
      const uMail = u.email ? u.email.toLowerCase() : '';
      return (uName && uName === cleanUsername) || (cleanEmail && uMail && uMail === cleanEmail);
    });

    if (existing) {
      throw new Error('User with this username or email already exists.');
    }

    const { salt, hash } = this.hashPassword(password);

    const user = {
      id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      username,
      email: email || '',
      passwordSalt: salt,
      passwordHash: hash,
      callSign: callSign || `Agent_${username}`,
      squad: squad || 'ZeroDay Hunters',
      targetTrack: targetTrack || 'phishing-social-eng',
      level: 1,
      xp: 250,
      streak: 1,
      unlockedTiers: {
        'phishing-social-eng': 1,
        'malware-defense': 1,
        'network-exploitation': 1,
        'identity-token': 1,
        'cloud-security': 1
      },
      createdAt: new Date().toISOString()
    };

    this.data.users.push(user);
    this.save();
    return this.sanitizeUser(user);
  }

  authenticateUser(usernameOrEmail, password) {
    if (!usernameOrEmail || !password) {
      throw new Error('Username/email and password are required.');
    }
    const cleanInput = usernameOrEmail.trim().toLowerCase();
    const user = this.data.users.find(u => {
      const uName = u.username ? u.username.toLowerCase() : '';
      const uMail = u.email ? u.email.toLowerCase() : '';
      return uName === cleanInput || (uMail && uMail === cleanInput);
    });

    if (!user) {
      throw new Error('Invalid username or password.');
    }

    const salt = user.passwordSalt || 'sha256_legacy';
    if (!this.verifyPassword(password, salt, user.passwordHash)) {
      throw new Error('Invalid username or password.');
    }

    return this.sanitizeUser(user);
  }

  getUserById(id) {
    const user = this.data.users.find(u => u.id === id);
    return user ? this.sanitizeUser(user) : null;
  }

  updateUser(id, updates) {
    const user = this.data.users.find(u => u.id === id);
    if (!user) throw new Error('User not found');

    const allowed = ['callSign', 'squad', 'targetTrack', 'xp', 'level', 'streak', 'unlockedTiers'];
    allowed.forEach(field => {
      if (updates[field] !== undefined) {
        if ((field === 'xp' || field === 'level' || field === 'streak') && typeof updates[field] === 'number') {
          user[field] = Math.max(0, updates[field]);
        } else if (typeof updates[field] === 'string' || typeof updates[field] === 'object') {
          user[field] = updates[field];
        }
      }
    });

    this.save();
    return this.sanitizeUser(user);
  }

  sanitizeUser(user) {
    const { passwordHash, passwordSalt, ...safe } = user;
    return safe;
  }

  // Diagnostic History Methods
  saveDiagnosticResult(userId, result) {
    const record = {
      id: 'diag_' + Date.now(),
      userId,
      ...result,
      timestamp: new Date().toISOString()
    };
    this.data.diagnostics.unshift(record);
    this.save();
    return record;
  }

  // Squad Notes Methods
  getSquadNotes(squadName) {
    if (!squadName) return this.data.squadNotes;
    return this.data.squadNotes.filter(n => n.squad.toLowerCase() === squadName.toLowerCase() || n.squad === 'Global');
  }

  addSquadNote({ author, authorId, squad, topic, content, contentHinglish }) {
    const note = {
      id: 'sn_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5),
      author,
      authorId,
      squad: squad || 'ZeroDay Hunters',
      topic,
      content,
      contentHinglish: contentHinglish || content,
      upvotes: 1,
      upvotedBy: authorId && authorId !== 'anon' ? [authorId] : [],
      timestamp: 'Just now',
      createdAt: new Date().toISOString()
    };
    this.data.squadNotes.unshift(note);
    this.save();
    return note;
  }

  upvoteSquadNote(noteId, userId = 'anon') {
    const note = this.data.squadNotes.find(n => n.id === noteId);
    if (!note) throw new Error('Note not found');

    if (!note.upvotedBy) note.upvotedBy = [];
    if (userId !== 'anon' && note.upvotedBy.includes(userId)) {
      throw new Error('You have already upvoted this note.');
    }

    note.upvotes++;
    if (userId !== 'anon') {
      note.upvotedBy.push(userId);
    }
    this.save();
    return note;
  }
}

export const db = new Database();

