/**
 * Kairos: AI-Driven Cybersecurity Skill Mastery Engine
 * Main Application Bootstrap & Lifecycle Router
 */

import { store } from './state/store.js';
import { renderNavbar } from './components/Navbar.js';
import { renderTopicSelector } from './components/TopicSelector.js';
import { renderDiagnosticHub } from './components/DiagnosticHub.js';
import { renderSkillGapView } from './components/SkillGapView.js';
import { renderLearningLab } from './components/LearningLab.js';
import { renderMasteryArena } from './components/MasteryArena.js';
import { renderSocialDashboard } from './components/SocialDashboard.js';
import { setupELI5Tutor } from './components/ELI5Tutor.js';
import { setupPitchDeckAndSettings } from './components/PitchDeckModal.js';
import { setupAuthModal } from './components/AuthModal.js';

class KairosApp {
  constructor() {
    this.headerRoot = document.getElementById('header-root');
    this.mainContent = document.getElementById('main-content');
    this.footerStream = document.getElementById('footer-stream');
    this.tutorRoot = document.getElementById('tutor-root');
    this.modalRoot = document.getElementById('modal-root');
  }

  init() {
    // Setup persistent widgets
    setupELI5Tutor(this.tutorRoot);
    setupPitchDeckAndSettings(this.modalRoot);
    setupAuthModal(this.modalRoot);

    // Initial render
    this.render();

    // Subscribe to state changes
    store.subscribe(() => {
      this.render();
    });

    // Setup simulated live presence stream timer (pings every 8-15 seconds)
    this.startPresenceSimulator();
  }

  render() {
    // Render top Navbar
    renderNavbar(this.headerRoot);

    // Render active view in main content area
    const state = store.getState();
    const currentView = state.currentView;

    switch (currentView) {
      case 'topic-selector':
        renderTopicSelector(this.mainContent);
        break;
      case 'diagnostic':
        renderDiagnosticHub(this.mainContent);
        break;
      case 'skill-gap':
        renderSkillGapView(this.mainContent);
        break;
      case 'learning-lab':
        renderLearningLab(this.mainContent);
        break;
      case 'mastery-arena':
        renderMasteryArena(this.mainContent);
        break;
      case 'social-dashboard':
        renderSocialDashboard(this.mainContent);
        break;
      default:
        renderTopicSelector(this.mainContent);
    }

    // Render footer stream ticker
    this.renderFooterPresence();
  }

  renderFooterPresence() {
    const state = store.getState();
    const feed = state.presenceFeed;

    this.footerStream.innerHTML = `
      <div class="presence-stream-inner">
        ${feed.map(item => `
          <div class="presence-item">
            <span class="live-dot"></span>
            <span class="presence-user">${item.user}</span>
            <span>${item.action}</span>
            <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted);">(${item.time})</span>
          </div>
        `).join('')}
        ${feed.map(item => `
          <div class="presence-item">
            <span class="live-dot"></span>
            <span class="presence-user">${item.user}</span>
            <span>${item.action}</span>
            <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted);">(${item.time})</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  startPresenceSimulator() {
    const peerActions = [
      { user: 'Kavya_N', action: 'completed Anti-Zombie reflection on Subdomain Spoofing (+50 XP)', type: 'progress' },
      { user: 'Rohan_V', action: 'earned "Phishing Hunter" Tier 1 Badge', type: 'unlock' },
      { user: 'ZeroDay_Squad', action: 'reached Rank #2 on Global Leaderboard (14,200 XP)', type: 'progress' },
      { user: 'Dev_G', action: 'upvoted note: "DMARC p=reject is mandatory"', type: 'note' },
      { user: 'Aarav_M', action: 'launched 1v1 Scenario Duel vs ZeroDay_Bot', type: 'duel' }
    ];

    setInterval(() => {
      const rand = peerActions[Math.floor(Math.random() * peerActions.length)];
      store.broadcastPresence(rand.action, rand.type);
    }, 18000);
  }
}

// Bootstrap on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new KairosApp();
  app.init();
});
