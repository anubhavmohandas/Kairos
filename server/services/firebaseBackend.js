/**
 * Kairos Google Firebase Cloud Database Service
 * Provides direct HTTP REST communication with Google Cloud Firestore & Realtime DB.
 * Supports automatic cloud persistence for project: kairos-avdv.
 */

import fs from 'fs';
import path from 'path';

// Load .env natively
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

export class FirebaseBackendService {
  constructor() {
    this.projectId = process.env.FIREBASE_PROJECT_ID || 'kairos-avdv';
    this.apiKey = process.env.FIREBASE_API_KEY || '';
    this.databaseUrl = process.env.FIREBASE_DATABASE_URL || `https://${this.projectId}-default-rtdb.firebaseio.com`;
    this.enabled = Boolean(this.projectId);
  }

  isConfigured() {
    return Boolean(this.projectId && this.projectId.length > 2);
  }

  /**
   * Sync full dataset to Google Cloud Firestore & Realtime DB
   */
  async syncToCloud(collectionName = 'db', data = {}) {
    if (!this.isConfigured()) return false;

    let synced = false;

    // 1. Sync to Cloud Firestore REST API
    try {
      const docPath = collectionName === 'db' ? 'state' : collectionName;
      const patchUrl = `https://firestore.googleapis.com/v1/projects/${this.projectId}/databases/(default)/documents/kairos_app/${docPath}`;
      const createUrl = `https://firestore.googleapis.com/v1/projects/${this.projectId}/databases/(default)/documents/kairos_app?documentId=${docPath}`;

      const payload = {
        fields: {
          usersCount: { integerValue: String(data.users ? data.users.length : 0) },
          squadNotesCount: { integerValue: String(data.squadNotes ? data.squadNotes.length : 0) },
          diagnosticsCount: { integerValue: String(data.diagnostics ? data.diagnostics.length : 0) },
          rawSnapshot: { stringValue: JSON.stringify(data) },
          updatedAt: { stringValue: new Date().toISOString() }
        }
      };

      const res = await fetch(patchUrl, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        synced = true;
      } else {
        // Document doesn't exist yet, create document in collection
        const createRes = await fetch(createUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (createRes.ok) synced = true;
      }
    } catch (e) {
      console.warn(`[Firestore Cloud DB] Sync warning:`, e.message || e);
    }

    // 2. Sync to Realtime Database REST API (fallback/dual mode)
    try {
      const rtdbUrl = `${this.databaseUrl.replace(/\/$/, '')}/${collectionName}.json${this.apiKey ? `?auth=${this.apiKey}` : ''}`;
      const res = await fetch(rtdbUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) synced = true;
    } catch {}

    return synced;
  }

  /**
   * Fetch dataset from Google Firebase Cloud (Firestore or Realtime DB)
   */
  async fetchFromCloud(collectionName = 'db') {
    if (!this.isConfigured()) return null;

    // 1. Try Firestore REST API
    try {
      const docPath = collectionName === 'db' ? 'state' : collectionName;
      const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${this.projectId}/databases/(default)/documents/kairos_app/${docPath}`;
      const res = await fetch(firestoreUrl);
      if (res.ok) {
        const doc = await res.json();
        const rawJson = doc.fields?.rawSnapshot?.stringValue;
        if (rawJson) {
          return JSON.parse(rawJson);
        }
      }
    } catch {}

    // 2. Try Realtime Database REST API
    try {
      const rtdbUrl = `${this.databaseUrl.replace(/\/$/, '')}/${collectionName}.json${this.apiKey ? `?auth=${this.apiKey}` : ''}`;
      const res = await fetch(rtdbUrl);
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data === 'object') return data;
      }
    } catch {}

    return null;
  }
}

export const firebaseBackend = new FirebaseBackendService();
