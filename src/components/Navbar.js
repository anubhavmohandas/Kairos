/**
 * Kairos Top HUD Navbar
 * Displays platform branding, user level, XP, daily streak flame, 
 * English/Hinglish language toggle, Audio toggle, and Hackathon Pitch Deck launcher.
 */

import { store } from '../state/store.js';

export function renderNavbar(container) {
  const state = store.getState();
  const isHinglish = state.language === 'hinglish';
  const tier = state.currentTier;

  container.innerHTML = `
    <nav class="cyber-nav">
      <div class="nav-content">
        <!-- Brand Section -->
        <div class="brand-section" id="nav-brand-btn">
          <div class="brand-icon-box">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <path d="m9 12 2 2 4-4"/>
            </svg>
          </div>
          <div class="brand-title">
            KAIROS
            <span class="brand-tag">Cyber AI Engine</span>
          </div>
        </div>

        <!-- Center HUD Stats -->
        <div class="hud-stats-group">
          <!-- Daily Streak -->
          <div class="stat-item" title="Active Learning Streak">
            <span class="streak-flame">🔥</span>
            <span>${state.user.streak} ${isHinglish ? 'Din Streak' : 'Day Streak'}</span>
          </div>

          <div style="width: 1px; height: 16px; background: rgba(255,255,255,0.1);"></div>

          <!-- XP & Level -->
          <div class="stat-item" title="Current Cyber XP">
            <span class="xp-pill">LVL ${state.user.level} // ${state.user.xp} XP</span>
          </div>

          <div style="width: 1px; height: 16px; background: rgba(255,255,255,0.1);"></div>

          <!-- Tier Badge -->
          <div class="tier-badge tier-${tier}">
            Tier ${tier}: ${tier === 1 ? 'Awareness' : tier === 2 ? 'Mechanics' : 'Mastery'}
          </div>
        </div>

        <!-- Right Nav Actions -->
        <div class="nav-actions">
          <!-- Multilingual English / Hinglish Toggle -->
          <button id="nav-lang-toggle" class="lang-toggle-btn ${isHinglish ? 'active-hinglish' : ''}" title="Switch between English and Hinglish">
            <span>${isHinglish ? '🇮🇳 Hinglish' : '🌐 English'}</span>
          </button>

          <!-- Audio Toggle -->
          <button id="nav-sound-toggle" class="nav-icon-btn" title="Toggle Cyber Audio Synthesizer">
            ${state.user.soundEnabled ? '🔊' : '🔇'}
          </button>

          <!-- Settings / API Key Button -->
          <button id="nav-settings-btn" class="nav-icon-btn" title="Configure Gemini API Settings">
            ⚙️
          </button>

          <!-- Hackathon Pitch Deck & Demo Walkthrough Button -->
          <button id="nav-pitch-btn" class="btn-pitch">
            <span>⚡ Pitch Deck</span>
          </button>
        </div>
      </div>
    </nav>
  `;

  // Attach Event Listeners
  container.querySelector('#nav-brand-btn')?.addEventListener('click', () => {
    store.setView('topic-selector');
  });

  container.querySelector('#nav-lang-toggle')?.addEventListener('click', () => {
    store.toggleLanguage();
  });

  container.querySelector('#nav-sound-toggle')?.addEventListener('click', () => {
    store.toggleSound();
  });

  container.querySelector('#nav-pitch-btn')?.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('kairos:open-pitch-modal'));
  });

  container.querySelector('#nav-settings-btn')?.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('kairos:open-settings-modal'));
  });
}
