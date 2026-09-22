/**
 * Step 1: Topic Selector Component
 * Allows learners to choose a cybersecurity domain, preview the 3-tier ramp,
 * and view live active squad presence.
 */

import { CYBER_DOMAINS } from '../data/cyberCurriculum.js';
import { store } from '../state/store.js';

export function renderTopicSelector(container) {
  const state = store.getState();
  const isHinglish = state.language === 'hinglish';

  container.innerHTML = `
    <div class="topic-selector-view">
      <!-- Section Header -->
      <div class="section-header">
        <div class="section-eyebrow">
          <span>// PHASE 01</span>
          <span>•</span>
          <span>${isHinglish ? 'CYBER DOMAIN SELECTOR' : 'CYBER DOMAIN SELECTION'}</span>
        </div>
        <h1 class="section-title">
          ${isHinglish ? 'Apna Cybersecurity Battleground Chuno' : 'Choose Your Cybersecurity Domain'}
        </h1>
        <p class="section-desc">
          ${isHinglish 
            ? 'Generic videos dekhna band karo. 5-question scenario diagnostic ke through apni micro-weakness identify karo aur surgical remediation lo.'
            : 'Move beyond passive video watching. Take a 5-question real-world diagnostic to uncover your exact micro-weaknesses and get a surgically tailored syllabus.'}
        </p>
      </div>

      <!-- Quick Action Hub Bar (Social / Duels) -->
      <div class="glass-card" style="padding: 1.2rem 1.5rem; margin-bottom: 2rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; border-color: rgba(168, 85, 247, 0.35);">
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <span style="font-size: 1.5rem;">⚔️</span>
          <div>
            <div style="font-weight: 700; font-size: 0.95rem; color: #fff;">
              ${isHinglish ? 'Steam-Style Squad Hub & 1v1 Duels' : 'Steam-Style Social Hub & 1v1 Duels'}
            </div>
            <div style="font-size: 0.8rem; color: var(--text-secondary);">
              ${isHinglish ? 'ZeroDay_Bot ya squad peers ke saath live scenario battle khelo' : 'Challenge peers or ZeroDay_Bot in live timed cybersecurity scenario battles'}
            </div>
          </div>
        </div>
        <button id="btn-open-social" class="btn btn-violet btn-sm">
          <span>${isHinglish ? 'Social Hub Kholo' : 'Open Social Hub'}</span>
          <span>→</span>
        </button>
      </div>

      <!-- Domain Cards Grid -->
      <div class="topic-grid">
        ${CYBER_DOMAINS.map(domain => {
          const unlockedTier = state.unlockedTiers[domain.id] || 1;
          return `
            <div class="glass-card topic-card" data-domain-id="${domain.id}">
              <div>
                <div class="topic-header">
                  <div class="topic-icon-wrap">${domain.icon}</div>
                  <div class="active-learners-badge">
                    <span class="live-dot"></span>
                    <span>${domain.activeLearners} ${isHinglish ? 'Active' : 'Active'}</span>
                  </div>
                </div>

                <h3 class="topic-title">
                  ${isHinglish ? domain.titleHinglish : domain.title}
                </h3>
                <p class="topic-desc">
                  ${isHinglish ? domain.descriptionHinglish : domain.description}
                </p>

                <div class="topic-micro-tags">
                  ${domain.microTopics.slice(0, 3).map(tag => `<span class="micro-tag">${tag}</span>`).join('')}
                </div>
              </div>

              <div class="topic-footer">
                <div style="display: flex; flex-direction: column; gap: 0.3rem;">
                  <span style="font-size: 0.72rem; font-family: var(--font-mono); color: var(--text-muted);">
                    ${isHinglish ? 'DIFFICULTY RAMP' : 'DIFFICULTY RAMP'}
                  </span>
                  <div class="tier-ramp-dots">
                    <span class="ramp-dot ${unlockedTier >= 1 ? 'completed' : ''}" title="Level 1: Awareness"></span>
                    <span class="ramp-dot ${unlockedTier >= 2 ? 'completed' : ''}" title="Level 2: Mechanics"></span>
                    <span class="ramp-dot ${unlockedTier >= 3 ? 'completed' : ''}" title="Level 3: Mastery"></span>
                    <span style="font-size: 0.75rem; font-family: var(--font-mono); color: var(--neon-cyan); margin-left: 0.3rem;">
                      Lvl ${unlockedTier}
                    </span>
                  </div>
                </div>

                <button class="btn btn-cyan btn-sm">
                  <span>${isHinglish ? 'Test Shuru Karo' : 'Start Diagnostic'}</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  // Attach card click handlers
  container.querySelectorAll('.topic-card').forEach(card => {
    card.addEventListener('click', () => {
      const domainId = card.getAttribute('data-domain-id');
      store.selectDomain(domainId);
    });
  });

  container.querySelector('#btn-open-social')?.addEventListener('click', () => {
    store.setView('social-dashboard');
  });
}
