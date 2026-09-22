/**
 * Kairos Centralized Reactive Store
 * Manages user progress, difficulty tiers, diagnostic state, language toggle, and social streams.
 */

import { CYBER_DOMAINS } from '../data/cyberCurriculum.js';
import { soundFX } from '../services/soundEffects.js';

class StateStore {
  constructor() {
    this.listeners = [];

    // Load initial state or defaults from localStorage
    const savedState = this.loadPersistedState();

    this.state = {
      // User Profile
      user: {
        name: 'Agent_Specter',
        level: savedState?.user?.level || 1,
        xp: savedState?.user?.xp || 350,
        streak: savedState?.user?.streak || 5,
        squad: savedState?.user?.squad || 'ZeroDay Hunters',
        soundEnabled: true
      },

      // Language Mode: 'en' | 'hinglish'
      language: localStorage.getItem('kairos_lang') || 'en',

      // Navigation View: 'topic-selector' | 'diagnostic' | 'skill-gap' | 'learning-lab' | 'mastery-arena' | 'social-dashboard'
      currentView: 'topic-selector',

      // Active Domain & Tier
      activeDomain: CYBER_DOMAINS[0],
      currentTier: 1, // 1: Awareness, 2: Mechanics, 3: Mastery
      unlockedTiers: {
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
        { id: 'p1', user: 'Arjun_S', action: 'is mastering MFA Fatigue Protection', time: '1m ago', type: 'progress' },
        { id: 'p2', user: 'Priya_K', action: 'unlocked Level 2: Malware Mechanics (+150 XP)', time: '3m ago', type: 'unlock' },
        { id: 'p3', user: 'Vikram_R', action: 'won a 1v1 Scenario Duel vs ZeroDay_Bot (Score: 240)', time: '6m ago', type: 'duel' },
        { id: 'p4', user: 'Sneha_M', action: 'added a note to Squad Notes: "Always check TLD apex"', time: '11m ago', type: 'note' },
        { id: 'p5', user: 'Dev_G', action: 'is analyzing JWT alg:none signature bypass', time: '14m ago', type: 'progress' }
      ],

      // Squad Notes Collaborative Repository
      squadNotes: [
        {
          id: 'sn_1',
          author: 'Arjun_S',
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
          squad: 'ZeroDay Hunters',
          topic: 'DMARC p=none is useless',
          content: 'Remember for the exam: DMARC p=none only generates telemetry reports. Only p=quarantine or p=reject blocks forged emails.',
          contentHinglish: 'DMARC p=none sirf report banata hai, email block nahi karta. Block karne ke liye p=reject chahiye!',
          upvotes: 24,
          timestamp: 'Yesterday'
        }
      ]
    };
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

  finishDiagnostic() {
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
      this.state.learningLab.activeMicroTopic = diagnostics[0].microTopic;
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
  }

  unlockNextTier(domainId) {
    const current = this.state.unlockedTiers[domainId] || 1;
    if (current < 3) {
      this.state.unlockedTiers[domainId] = current + 1;
      this.state.currentTier = current + 1;
      this.addXP(200);
      soundFX.playFanfare();
      this.broadcastPresence(`${this.state.user.name} unlocked Tier ${this.state.currentTier} in ${this.state.activeDomain.title}!`, 'unlock');
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

  addSquadNote(note) {
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
    this.addXP(50);
    soundFX.playSuccess();
    this.broadcastPresence(`${this.state.user.name} posted a new tip to Squad Notes!`, 'note');
    this.notify();
  }

  upvoteSquadNote(noteId) {
    const note = this.state.squadNotes.find(n => n.id === noteId);
    if (note) {
      note.upvotes++;
      soundFX.playClick();
      this.notify();
    }
  }
}

export const store = new StateStore();
