/**
 * Kairos Centralized Reactive Store
 * Manages authenticated user state, difficulty tiers, dynamic diagnostic synthesis,
 * language toggle, and backend persistence synchronization.
 */

import { CYBER_DOMAINS } from '../data/cyberCurriculum.js';
import { soundFX } from '../services/soundEffects.js';
import { api } from '../services/apiClient.js';

class StateStore {
  constructor() {
    this.listeners = [];

    // Load initial state or defaults from localStorage
    const savedState = this.loadPersistedState();

    this.state = {
      // User Profile (Synchronized with Backend DB)
      user: {
        id: savedState?.user?.id || 'guest_user',
        username: savedState?.user?.username || 'Guest_Operative',
        name: savedState?.user?.callSign || savedState?.user?.username || 'Guest Operative',
        callSign: savedState?.user?.callSign || '',
        level: savedState?.user?.level || 1,
        xp: savedState?.user?.xp || 0,
        streak: savedState?.user?.streak || 1,
        squad: savedState?.user?.squad || 'ZeroDay Hunters',
        soundEnabled: true,
        isAuthenticated: Boolean(savedState?.user?.id && savedState.user.id !== 'guest_user')
      },

      // Language Mode: 'en' | 'hinglish'
      language: localStorage.getItem('kairos_lang') || 'en',

      // Navigation View: 'topic-selector' | 'diagnostic' | 'skill-gap' | 'learning-lab' | 'mastery-arena' | 'social-dashboard'
      currentView: 'topic-selector',

      // Active Domain & Tier
      activeDomain: CYBER_DOMAINS[0],
      currentTier: 1, // 1: Awareness, 2: Mechanics, 3: Mastery
      unlockedTiers: {
        'ad-kerberoasting': 1,
        'phishing-social-eng': 1,
        'malware-defense': 1,
        'network-exploitation': 1,
        'identity-token': 1,
        'cloud-security': 1
      },

      // Diagnostic State
      diagnostic: {
        questionIndex: 0,
        userAnswers: {},
        score: null,
        skillGapJSON: null,
        missedQuestions: [],
        completed: false
      },

      // Learning Lab State
      learningLab: {
        activeMicroTopic: 'Subdomain Hierarchy & Lookalike Spoofing',
        checkpointPassed: false,
        customSyllabus: null,
        completedVideos: []
      },

      // Mastery Arena State
      mastery: {
        questionIndex: 0,
        answers: {},
        score: null,
        passed: false,
        completed: false
      },

      // 1v1 Duel Arena State
      duel: {
        active: false,
        round: 1,
        timer: 45,
        playerHealth: 100,
        botHealth: 100,
        playerScore: 0,
        botScore: 0,
        winner: null
      },

      // Steam-style Live Presence Feed
      presenceFeed: [
        { id: 'p1', user: 'Anubhav_M', action: 'is mastering Active Directory Kerberoasting (+200 XP)', time: '1m ago', type: 'progress' },
        { id: 'p2', user: 'Vedant_C', action: 'unlocked Level 3: Forensic Mastery (+250 XP)', time: '3m ago', type: 'unlock' },
        { id: 'p3', user: 'Dhruv_R', action: 'won a 1v1 Scenario Duel on K8s Token Theft (Score: 280)', time: '6m ago', type: 'duel' },
        { id: 'p4', user: 'Shakya_V', action: 'shipped Neo-Brutalist HUD & UI/UX Design System (+180 XP)', time: '9m ago', type: 'note' },
        { id: 'p5', user: 'Anubhav_M', action: 'analyzing Event ID 4769 ticket encryption downgrade', time: '14m ago', type: 'progress' }
      ],

      // Squad Notes Collaborative Repository
      squadNotes: [
        {
          id: 'sn_1',
          author: 'Anubhav Mohandas',
          squad: 'ZeroDay Hunters',
          topic: 'Kerberoasting SPN Target Selection',
          content: 'Target user service accounts (svc_sql_prod) rather than machine accounts ($). User accounts have human-created static passwords crackable offline via Hashcat mode 13100.',
          contentHinglish: 'User accounts (svc_sql_prod) ko target karo, computer accounts ($) ko nahi. User accounts ke passwords human-made hote hain jo offline crack ho sakte hain.',
          upvotes: 32,
          timestamp: '1 hour ago'
        },
        {
          id: 'sn_2',
          author: 'Shakya Vinit',
          squad: 'ZeroDay Hunters',
          topic: 'UI/UX Cognitive Load Reduction',
          content: 'Visual telemetry badges, high-contrast borders, and color-coded attack tags cut cognitive strain by 65%, allowing instant pattern recognition under incident triage.',
          contentHinglish: 'High-contrast borders aur color-coded indicators se cognitive strain 65% kam ho jata hai aur attack vectors turant pehchane jaate hain.',
          upvotes: 28,
          timestamp: '2 hours ago'
        },
        {
          id: 'sn_3',
          author: 'Vedantkumar Chaudhri',
          squad: 'ZeroDay Hunters',
          topic: 'Gemini AI Telemetry Grounding',
          content: 'Strict schema validation on Gemini API responses ensures 100% grounded evaluations with zero hallucinations when scoring student answers.',
          contentHinglish: 'Gemini API me strict schema validation lagane se student evaluation 100% accurate aur zero-hallucination rehta hai.',
          upvotes: 25,
          timestamp: 'Yesterday'
        },
        {
          id: 'sn_4',
          author: 'Dhruv Rana',
          squad: 'ZeroDay Hunters',
          topic: 'Event ID 4769 Detection Logic',
          content: 'Look for Ticket Encryption Type 0x17 (RC4-HMAC) in Kerberos Service Ticket Operations to flag suspicious downgrade activity.',
          contentHinglish: 'SIEM logs me Ticket Encryption 0x17 (RC4-HMAC) check karo, ye suspicious downgrade attack ka sign hai.',
          upvotes: 21,
          timestamp: 'Yesterday'
        }
      ]
    };

    // Attempt to verify existing backend session
    this.checkSession();
  }

  async checkSession() {
    try {
      const me = await api.getMe();
      if (me) {
        this.setUser(me);
      } else if (this.state.user.isAuthenticated) {
        await this.logout();
      }
    } catch {
      // Continue in guest mode
    }
  }

  loadPersistedState() {
    try {
      const data = localStorage.getItem('kairos_state');
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  savePersistedState() {
    try {
      localStorage.setItem('kairos_state', JSON.stringify({
        user: this.state.user,
        unlockedTiers: this.state.unlockedTiers
      }));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }

  getState() {
    return this.state;
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.savePersistedState();
    this.listeners.forEach(fn => fn(this.state));
  }

  setUser(user) {
    this.state.user = {
      ...this.state.user,
      ...user,
      name: user.callSign || user.username || 'Agent_Operative',
      callSign: user.callSign || user.username || 'Agent_Operative',
      isAuthenticated: true
    };
    if (user.unlockedTiers) {
      this.state.unlockedTiers = { ...this.state.unlockedTiers, ...user.unlockedTiers };
    }
    this.broadcastPresence(`Operative ${this.state.user.name} authenticated into terminal.`, 'progress');
    this.notify();
  }

  async logout() {
    await api.logout();
    this.state.user = {
      id: 'guest_user',
      username: 'Guest_Operative',
      name: 'Guest Operative',
      callSign: '',
      level: 1,
      xp: 0,
      streak: 1,
      squad: 'ZeroDay Hunters',
      soundEnabled: this.state.user.soundEnabled ?? true,
      isAuthenticated: false
    };
    this.notify();
  }

  async updateUserProfile(updates) {
    if (this.state.user.isAuthenticated) {
      try {
        const updated = await api.updateProfile(updates);
        this.setUser(updated);
        return updated;
      } catch (e) {
        console.warn('Update profile failed:', e);
        throw e;
      }
    } else {
      if (updates.callSign) {
        this.state.user.name = updates.callSign;
        this.state.user.callSign = updates.callSign;
      }
      if (updates.squad) {
        this.state.user.squad = updates.squad;
      }
      if (updates.targetTrack) {
        this.state.user.targetTrack = updates.targetTrack;
      }
      this.notify();
      return this.state.user;
    }
  }

  setView(viewName) {
    this.state.currentView = viewName;
    soundFX.playClick();
    this.notify();
  }

  toggleLanguage() {
    this.state.language = this.state.language === 'en' ? 'hinglish' : 'en';
    localStorage.setItem('kairos_lang', this.state.language);
    soundFX.playClick();
    this.notify();
  }

  toggleSound() {
    this.state.user.soundEnabled = soundFX.toggle();
    this.notify();
  }

  selectDomain(domainId) {
    const domain = CYBER_DOMAINS.find(d => d.id === domainId) || CYBER_DOMAINS[0];
    this.state.activeDomain = domain;
    this.state.currentTier = this.state.unlockedTiers[domainId] || 1;
    this.resetDiagnostic();
    this.state.currentView = 'diagnostic';
    soundFX.playClick();
    this.notify();
  }

  setActiveCustomDomain(customDomain) {
    this.state.activeDomain = customDomain;
    this.state.currentTier = 1;
    this.resetDiagnostic();
    this.state.currentView = 'diagnostic';
    this.notify();
  }

  resetDiagnostic() {
    this.state.diagnostic = {
      questionIndex: 0,
      userAnswers: {},
      score: null,
      skillGapJSON: null,
      missedQuestions: [],
      completed: false
    };
  }

  submitDiagnosticAnswer(questionId, selectedIndex) {
    this.state.diagnostic.userAnswers[questionId] = selectedIndex;
    const currentQ = this.state.activeDomain.diagnostics[this.state.diagnostic.questionIndex];
    
    if (selectedIndex === currentQ.correctIndex) {
      soundFX.playSuccess();
      this.addXP(20);
    } else {
      soundFX.playAlert();
    }

    this.notify();
  }

  nextDiagnosticQuestion() {
    if (this.state.diagnostic.questionIndex < this.state.activeDomain.diagnostics.length - 1) {
      this.state.diagnostic.questionIndex++;
      soundFX.playClick();
    } else {
      this.finishDiagnostic();
    }
    this.notify();
  }

  async finishDiagnostic() {
    const diagnostics = this.state.activeDomain.diagnostics;
    const answers = this.state.diagnostic.userAnswers;
    let correctCount = 0;
    const missed = [];

    diagnostics.forEach(q => {
      if (answers[q.id] === q.correctIndex) {
        correctCount++;
      } else {
        missed.push(q);
      }
    });

    const score = Math.round((correctCount / diagnostics.length) * 100);
    this.state.diagnostic.score = score;
    this.state.diagnostic.missedQuestions = missed;
    this.state.diagnostic.completed = true;

    // Set first micro-topic for Learning lab
    if (missed.length > 0) {
      this.state.learningLab.activeMicroTopic = missed[0].microTopic;
    } else {
      this.state.learningLab.activeMicroTopic = diagnostics[0]?.microTopic || 'Threat Analysis';
    }

    // Persist evaluation with backend API
    try {
      await api.evaluateScenarios(this.state.activeDomain.title, missed, score);
    } catch (e) {
      console.warn('Backend diagnostic save bypassed:', e);
    }

    this.state.currentView = 'skill-gap';
    soundFX.playFanfare();
    this.broadcastPresence(`${this.state.user.name} completed diagnostic in ${this.state.activeDomain.title} (Score: ${score}%)`, 'progress');
  }

  addXP(amount) {
    this.state.user.xp += amount;
    if (this.state.user.xp >= this.state.user.level * 500) {
      this.state.user.level++;
      soundFX.playFanfare();
      this.broadcastPresence(`${this.state.user.name} leveled up to Level ${this.state.user.level}!`, 'unlock');
    }

    if (this.state.user.isAuthenticated) {
      api.updateProfile({ xp: this.state.user.xp, level: this.state.user.level }).catch(() => {});
    }
  }

  unlockNextTier(domainId) {
    const current = this.state.unlockedTiers[domainId] || 1;
    if (current < 3) {
      this.state.unlockedTiers[domainId] = current + 1;
      this.state.currentTier = current + 1;
      this.addXP(200);
      soundFX.playFanfare();
      this.broadcastPresence(`${this.state.user.name} unlocked Tier ${this.state.currentTier} in ${this.state.activeDomain.title}!`, 'unlock');
      
      if (this.state.user.isAuthenticated) {
        api.updateProfile({ unlockedTiers: this.state.unlockedTiers }).catch(() => {});
      }
    }
    this.notify();
  }

  broadcastPresence(actionText, type = 'progress') {
    const item = {
      id: 'p_' + Date.now(),
      user: this.state.user.name,
      action: actionText,
      time: 'Just now',
      type
    };
    this.state.presenceFeed.unshift(item);
    if (this.state.presenceFeed.length > 15) {
      this.state.presenceFeed.pop();
    }
    this.notify();
  }

  async addSquadNote(note) {
    try {
      const saved = await api.postSquadNote({
        author: this.state.user.name,
        squad: this.state.user.squad,
        topic: note.topic,
        content: note.content,
        contentHinglish: note.contentHinglish || note.content
      });
      this.state.squadNotes.unshift(saved);
    } catch {
      this.state.squadNotes.unshift({
        id: 'sn_' + Date.now(),
        author: this.state.user.name,
        squad: this.state.user.squad,
        topic: note.topic,
        content: note.content,
        contentHinglish: note.contentHinglish || note.content,
        upvotes: 1,
        timestamp: 'Just now'
      });
    }

    this.addXP(50);
    soundFX.playSuccess();
    this.broadcastPresence(`${this.state.user.name} posted a new tip to Squad Notes!`, 'note');
    this.notify();
  }

  async upvoteSquadNote(noteId) {
    const note = this.state.squadNotes.find(n => n.id === noteId);
    if (note) {
      note.upvotes++;
      soundFX.playClick();
      api.upvoteSquadNote(noteId).catch(() => {});
      this.notify();
    }
  }
}

export const store = new StateStore();
