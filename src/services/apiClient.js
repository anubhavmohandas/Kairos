/**
 * Kairos API Client
 * Seamless communication with Kairos Full-Stack Backend Server.
 */

class ApiClient {
  constructor() {
    this.token = localStorage.getItem('kairos_token') || '';
    this.baseUrl = window.location.origin;
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('kairos_token', token);
    } else {
      localStorage.removeItem('kairos_token');
    }
  }

  getHeaders() {
    const headers = { 'Content-Type': 'application/json' };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...(options.headers || {})
      }
    };

    try {
      const res = await fetch(url, config);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      return data;
    } catch (err) {
      console.warn(`API request to ${endpoint} failed:`, err);
      throw err;
    }
  }

  // Auth Methods
  async register({ username, email, password, callSign, squad }) {
    const data = await this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password, callSign, squad })
    });
    if (data.token) this.setToken(data.token);
    return data.user;
  }

  async login({ username, password }) {
    const data = await this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
    if (data.token) this.setToken(data.token);
    return data.user;
  }

  async getMe() {
    if (!this.token) return null;
    try {
      const data = await this.request('/api/auth/me');
      return data.user;
    } catch {
      this.setToken('');
      return null;
    }
  }

  async updateProfile(updates) {
    const data = await this.request('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
    return data.user;
  }

  logout() {
    this.setToken('');
  }

  // 100% Dynamic Scenario Synthesis for ANY Topic
  async generateScenarios(topic, tier = 1, language = 'en') {
    return await this.request('/api/scenarios/generate', {
      method: 'POST',
      body: JSON.stringify({ topic, tier, language })
    });
  }

  async evaluateScenarios(domain, missedQuestions, score) {
    return await this.request('/api/scenarios/evaluate', {
      method: 'POST',
      body: JSON.stringify({ domain, missedQuestions, score })
    });
  }

  // ELI5 Tutor
  async askTutor(topic, userQuery, language = 'en') {
    const data = await this.request('/api/tutor/ask', {
      method: 'POST',
      body: JSON.stringify({ topic, userQuery, language })
    });
    return data.explanation;
  }

  // Dynamic Video Search
  async searchYouTube(query) {
    return await this.request(`/api/youtube/search?query=${encodeURIComponent(query)}`);
  }

  // Squads & Notes
  async getSquadNotes(squad) {
    const url = squad ? `/api/squads/notes?squad=${encodeURIComponent(squad)}` : '/api/squads/notes';
    const data = await this.request(url);
    return data.notes;
  }

  async postSquadNote(note) {
    const data = await this.request('/api/squads/notes', {
      method: 'POST',
      body: JSON.stringify(note)
    });
    return data.note;
  }

  async upvoteSquadNote(noteId) {
    const data = await this.request(`/api/squads/notes/${noteId}/upvote`, {
      method: 'POST'
    });
    return data.note;
  }

  // 1v1 Duels
  async generateDuelRound(topic) {
    return await this.request('/api/duels/generate-round', {
      method: 'POST',
      body: JSON.stringify({ topic })
    });
  }
}

export const api = new ApiClient();
