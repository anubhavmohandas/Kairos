/**
 * Kairos Persistent Database Engine
 * File-backed persistent storage for Users, Sessions, Diagnostics, Squad Notes, and Duels.
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const DATA_DIR = path.resolve(process.cwd(), '.kairos_data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

class Database {
  constructor() {
    this.data = {
      users: [],
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
      } catch (e) {
        console.warn('Could not read existing db.json, initializing fresh store:', e);
      }
    } else {
      this.save();
    }
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to save db.json:', e);
    }
  }

  // Password Hashing
  hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
  }

  // User Methods
  createUser({ username, email, password, callSign, squad = 'ZeroDay Hunters', targetTrack = 'phishing-social-eng' }) {
    const existing = this.data.users.find(u => u.username.toLowerCase() === username.toLowerCase() || u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      throw new Error('User with this username or email already exists.');
    }

    const user = {
      id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      username,
      email,
      passwordHash: this.hashPassword(password),
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
    const hash = this.hashPassword(password);
    const user = this.data.users.find(
      u => (u.username.toLowerCase() === usernameOrEmail.toLowerCase() || u.email.toLowerCase() === usernameOrEmail.toLowerCase()) && u.passwordHash === hash
    );
    if (!user) {
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
        user[field] = updates[field];
      }
    });

    this.save();
    return this.sanitizeUser(user);
  }

  sanitizeUser(user) {
    const { passwordHash, ...safe } = user;
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
      id: 'sn_' + Date.now(),
      author,
      authorId,
      squad: squad || 'ZeroDay Hunters',
      topic,
      content,
      contentHinglish: contentHinglish || content,
      upvotes: 1,
      timestamp: 'Just now',
      createdAt: new Date().toISOString()
    };
    this.data.squadNotes.unshift(note);
    this.save();
    return note;
  }

  upvoteSquadNote(noteId) {
    const note = this.data.squadNotes.find(n => n.id === noteId);
    if (note) {
      note.upvotes++;
      this.save();
      return note;
    }
    throw new Error('Note not found');
  }
}

export const db = new Database();
