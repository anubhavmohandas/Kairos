/**
 * Step 1: Topic Selector & Custom Cyber Topic Explorer
 * Supports preset cybersecurity domains AND 100% dynamic AI scenario synthesis
 * for ANY arbitrary user-specified cybersecurity topic (Zero Hardcoding).
 */

import { CYBER_DOMAINS } from '../data/cyberCurriculum.js';
import { store } from '../state/store.js';
import { api } from '../services/apiClient.js';
import { soundFX } from '../services/soundEffects.js';

export function renderTopicSelector(container) {
  const state = store.getState();
  const isHinglish = state.language === 'hinglish';
  let isGenerating = false;

  container.innerHTML = `
    <div class="topic-selector-view">
      <!-- Section Header -->
      <div class="section-header">
        <div class="section-eyebrow">
          <span>// PHASE 01</span>
          <span>•</span>
          <span>${isHinglish ? 'DYNAMIC CYBER TOPIC EXPLORER' : 'DYNAMIC CYBER TOPIC EXPLORER'}</span>
        </div>
        <h1 class="section-title">
          ${isHinglish ? 'Koi Bhi Cyber Topic Likho ya Preset Chuno' : 'Explore ANY Cybersecurity Topic or Select Preset'}
        </h1>
        <p class="section-desc">
          ${isHinglish 
            ? 'Zero Hardcoding Engine! Aap koi bhi advanced cyber attack vector enter karein (e.g. Kerberoasting, Kubernetes Token Theft, Smart Contract Hacks), AI turant real scenarios synthesize karega.'
            : 'Powered by 100% Dynamic AI Synthesis. Enter ANY custom cybersecurity topic or exploit vector to generate high-fidelity diagnostic scenarios on the fly.'}
        </p>
      </div>

      <!-- Custom AI Topic Synthesizer Search Bar -->
      <div class="glass-card" style="padding: 1.5rem; margin-bottom: 2.5rem; border-color: rgba(0, 245, 212, 0.4); background: linear-gradient(135deg, rgba(0, 245, 212, 0.08), rgba(13, 19, 34, 0.95)); box-shadow: var(--shadow-hud);">
        <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.75rem;">
          <span style="font-size: 1.3rem;">🧠</span>
          <span style="font-size: 0.82rem; font-family: var(--font-mono); color: var(--neon-cyan); font-weight: 700; letter-spacing: 0.08em;">
            AI SCENARIO SYNTHESIS ENGINE (ANY TOPIC)
          </span>
        </div>

        <form id="custom-topic-form" style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
          <input 
            type="text" 
            id="custom-topic-input" 
            placeholder="${isHinglish ? 'Type ANY topic: e.g. Active Directory Kerberoasting, Kubernetes Token Theft, BGP Hijacking...' : 'Type ANY topic: e.g. Active Directory Kerberoasting, Kubernetes Token Theft, BGP Hijacking...'}" 
            style="flex: 1; min-width: 280px; background: #03060c; border: 1px solid var(--border-glow); border-radius: var(--radius-md); padding: 0.75rem 1.1rem; color: #fff; font-family: var(--font-body); font-size: 0.95rem;"
          />
          <button type="submit" id="btn-synthesize-topic" class="btn btn-cyan" style="min-width: 220px;">
            <span>${isHinglish ? '✨ AI Scenario Banao' : '✨ Synthesize AI Scenarios'}</span>
            <span>→</span>
          </button>
        </form>

        <!-- Quick Idea Chips -->
        <div style="display: flex; align-items: center; gap: 0.4rem; flex-wrap: wrap; margin-top: 1rem;">
          <span style="font-size: 0.72rem; font-family: var(--font-mono); color: var(--text-muted);">Try:</span>
          <button class="prompt-chip topic-chip" data-topic="Active Directory Kerberoasting">🔑 Kerberoasting</button>
          <button class="prompt-chip topic-chip" data-topic="Kubernetes ServiceAccount Token Theft">☸️ Kubernetes Token Theft</button>
          <button class="prompt-chip topic-chip" data-topic="Smart Contract Reentrancy Exploit">📜 Smart Contract Hacks</button>
          <button class="prompt-chip topic-chip" data-topic="BGP Route Hijacking Forensics">🌐 BGP Hijacking</button>
        </div>
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

      <!-- Preset Domain Cards Grid -->
      <h3 style="font-size: 1.2rem; color: #fff; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
        <span>🎯</span>
        <span>${isHinglish ? 'Core Foundational Tracks' : 'Core Cybersecurity Tracks'}</span>
      </h3>

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
                    DIFFICULTY RAMP
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

  // Attach card click handlers for preset domains
  container.querySelectorAll('.topic-card').forEach(card => {
    card.addEventListener('click', () => {
      const domainId = card.getAttribute('data-domain-id');
      store.selectDomain(domainId);
    });
  });

  container.querySelector('#btn-open-social')?.addEventListener('click', () => {
    store.setView('social-dashboard');
  });

  // Handle Quick Topic Chips
  container.querySelectorAll('.topic-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const topic = chip.getAttribute('data-topic');
      const input = container.querySelector('#custom-topic-input');
      if (input) input.value = topic;
      synthesizeCustomTopic(topic);
    });
  });

  // Handle Custom Topic Form Submission
  container.querySelector('#custom-topic-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = container.querySelector('#custom-topic-input');
    const topic = input?.value.trim();
    if (topic) {
      synthesizeCustomTopic(topic);
    }
  });

  async function synthesizeCustomTopic(topicName) {
    if (isGenerating) return;
    isGenerating = true;

    const btn = container.querySelector('#btn-synthesize-topic');
    if (btn) {
      btn.innerHTML = `<span>⏳ Synthesizing AI Scenarios...</span>`;
      btn.style.opacity = '0.7';
    }

    try {
      soundFX.playClick();
      const generated = await api.generateScenarios(topicName, store.getState().currentTier, store.getState().language);
      
      const customDomain = {
        id: 'dyn_' + Date.now(),
        title: generated.domainTitle || topicName,
        titleHinglish: generated.domainTitleHinglish || topicName,
        icon: '⚡',
        description: generated.description || `AI Synthesized scenario suite for ${topicName}`,
        descriptionHinglish: generated.descriptionHinglish || `${topicName} par custom scenarios`,
        activeLearners: 1,
        microTopics: generated.scenarios?.map(s => s.microTopic) || [topicName],
        tiers: [
          { id: 1, name: 'Level 1: Awareness', focus: 'Threat Identification' },
          { id: 2, name: 'Level 2: Mechanics', focus: 'Attack Vectors' },
          { id: 3, name: 'Level 3: Mastery', focus: 'Forensic Remediation' }
        ],
        diagnostics: generated.scenarios || []
      };

      store.setActiveCustomDomain(customDomain);
      soundFX.playSuccess();
    } catch (err) {
      console.error('Custom synthesis error:', err);
      soundFX.playAlert();
      alert(`Could not synthesize scenarios: ${err.message}`);
    } finally {
      isGenerating = false;
      if (btn) {
        btn.innerHTML = `<span>${isHinglish ? '✨ AI Scenario Banao' : '✨ Synthesize AI Scenarios'}</span><span>→</span>`;
        btn.style.opacity = '1';
      }
    }
  }
}
