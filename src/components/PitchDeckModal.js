/**
 * Pitch Deck Modal & Settings Component
 * Interactive 5-slide Hackathon Pitch Deck + Gemini API Configuration modal.
 */

import { gemini } from '../services/geminiService.js';
import { soundFX } from '../services/soundEffects.js';

export function setupPitchDeckAndSettings(modalRoot) {
  let currentSlide = 0;

  const slides = [
    {
      badge: 'SLIDE 01 // THE CRISIS',
      title: 'The "Passive Consumption" Trap in Cybersecurity',
      subtitle: 'Why 90% of traditional security awareness training fails in production.',
      points: [
        '🔴 <strong>Generic Video Overload:</strong> Watching 20-minute videos leads to cognitive fatigue and zero retention.',
        '🔴 <strong>False Sense of Security:</strong> Passing multiple-choice memorization tests does not prepare engineers for real-world DNS spoofing or token replays.',
        '🔴 <strong>Language Tax:</strong> Complex English jargon creates unnecessary barriers for regional tech talent.'
      ],
      highlight: 'Key Metric: 85% of corporate breaches still originate from human identity & phishing deception.'
    },
    {
      badge: 'SLIDE 02 // THE SOLUTION',
      title: 'Kairos: AI-Driven Skill Mastery Engine',
      subtitle: 'Where high-fidelity diagnostics meet surgical, grounded remediation.',
      points: [
        '⚡ <strong>EL10 Scenario Engine:</strong> Real-world artifacts (URLs, headers, tokens) translated into intuitive mental models.',
        '⚡ <strong>Native Hinglish Toggle:</strong> 1-click toggle to remove the cognitive translation tax.',
        '⚡ <strong>3-Tier Difficulty Ramp:</strong> Seamless progression from Awareness → Mechanics → Forensic Mastery.'
      ],
      highlight: 'Core Philosophy: Explain Like I’m 10 intuition before technical syntax.'
    },
    {
      badge: 'SLIDE 03 // TECH STACK',
      title: '100% Google-Native Architecture',
      subtitle: 'Enterprise scalability with seamless Google ecosystem handshakes.',
      points: [
        '🧠 <strong>Google Gemini API (gemini-3.8-flash):</strong> Generates scenario diagnostics, JSON skill-gap schemas, and powers the ELI5 Tutor.',
        '📺 <strong>YouTube Data API v3:</strong> Automatically delivers grounded video masterclasses mapped to micro-weaknesses.',
        '🤝 <strong>Google Meet & Chat API:</strong> Powers instant drop-in squad triage calls and live presence pings.'
      ],
      highlight: 'Zero Hallucinations: Strict boundary matching grounds all AI evaluations.'
    },
    {
      badge: 'SLIDE 04 // THE SOCIAL ENGINE',
      title: '"Steam-Style" Peer Learning & 1v1 Duels',
      subtitle: 'Transforming cybersecurity training into an engaging competitive sport.',
      points: [
        '⚔️ <strong>1v1 Scenario Duels:</strong> Timed combat battles diagnosing attack vectors under pressure.',
        '📡 <strong>Live Presence Stream:</strong> Discord/Steam style live campus activity feed creating peer motivation.',
        '📚 <strong>Squad Collaborative Notes:</strong> Shared crowdsourced micro-cheat sheets and upvoting.'
      ],
      highlight: 'Engagement Multiplier: Social proof drives 3.4x higher completion rates.'
    },
    {
      badge: 'SLIDE 05 // THE IMPACT',
      title: 'From Passive Watching to 100% Grounded Mastery',
      subtitle: 'Measurable, surgical skill gap closure.',
      points: [
        '🎯 <strong>"So What?" Factor:</strong> Engineers understand the exact financial & operational breach consequences of each mistake.',
        '🛑 <strong>Anti-Zombie Checkpoints:</strong> Active reflection stops mindless scrolling and forces active recall.',
        '🏆 <strong>Adaptive Progression Loops:</strong> High-stakes mastery testing ensures concepts are truly locked in.'
      ],
      highlight: 'Final Takeaway: Kairos turns human vulnerability into an impenetrable defense perimeter.'
    }
  ];

  function openPitchModal() {
    currentSlide = 0;
    renderPitchModal();
  }

  function renderPitchModal() {
    modalRoot.classList.remove('hidden');
    modalRoot.setAttribute('aria-hidden', 'false');
    const slide = slides[currentSlide];

    modalRoot.innerHTML = `
      <div class="modal-card">
        <button id="btn-modal-close" class="modal-close-btn" title="Close">✕</button>

        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
          <span style="font-size: 0.8rem; font-family: var(--font-mono); color: var(--neon-cyan); font-weight: 700; letter-spacing: 0.08em;">
            ${slide.badge}
          </span>
          <span style="font-family: var(--font-mono); font-size: 0.82rem; color: var(--text-muted);">
            SLIDE ${currentSlide + 1} / ${slides.length}
          </span>
        </div>

        <h2 style="font-size: 1.8rem; margin-bottom: 0.35rem; color: #fff;">${slide.title}</h2>
        <p style="color: var(--text-secondary); font-size: 0.95rem; margin-bottom: 1.5rem;">${slide.subtitle}</p>

        <div class="pitch-slide-content glass-card" style="padding: 1.5rem; border-color: rgba(0, 245, 212, 0.25);">
          <div style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.25rem;">
            ${slide.points.map(p => `<div style="font-size: 0.98rem; line-height: 1.5;">${p}</div>`).join('')}
          </div>

          <div style="background: rgba(0, 245, 212, 0.1); border-left: 3px solid var(--neon-cyan); padding: 0.75rem 1rem; border-radius: var(--radius-sm); font-size: 0.88rem; color: #e2e8f0;">
            ${slide.highlight}
          </div>
        </div>

        <!-- Carousel Slide Indicators -->
        <div class="pitch-slide-indicator">
          ${slides.map((_, idx) => `
            <span class="slide-dot ${idx === currentSlide ? 'active' : ''}" data-slide-index="${idx}"></span>
          `).join('')}
        </div>

        <!-- Navigation Buttons -->
        <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 1.5rem; border-top: 1px solid var(--border-subtle); padding-top: 1rem;">
          <button id="btn-pitch-prev" class="btn btn-ghost btn-sm" ${currentSlide === 0 ? 'disabled style="opacity: 0.4;"' : ''}>
            ← Previous
          </button>

          <button id="btn-pitch-next" class="btn btn-cyan">
            <span>${currentSlide === slides.length - 1 ? 'Finish Pitch' : 'Next Slide'}</span>
            <span>→</span>
          </button>
        </div>
      </div>
    `;

    modalRoot.querySelector('#btn-modal-close')?.addEventListener('click', closeModal);

    modalRoot.querySelector('#btn-pitch-prev')?.addEventListener('click', () => {
      if (currentSlide > 0) {
        currentSlide--;
        soundFX.playClick();
        renderPitchModal();
      }
    });

    modalRoot.querySelector('#btn-pitch-next')?.addEventListener('click', () => {
      if (currentSlide < slides.length - 1) {
        currentSlide++;
        soundFX.playClick();
        renderPitchModal();
      } else {
        closeModal();
      }
    });

    modalRoot.querySelectorAll('.slide-dot').forEach(dot => {
      dot.addEventListener('click', () => {
        currentSlide = parseInt(dot.getAttribute('data-slide-index'), 10);
        soundFX.playClick();
        renderPitchModal();
      });
    });
  }

  function openSettingsModal() {
    modalRoot.classList.remove('hidden');
    modalRoot.setAttribute('aria-hidden', 'false');

    modalRoot.innerHTML = `
      <div class="modal-card" style="max-width: 580px;">
        <button id="btn-modal-close" class="modal-close-btn" title="Close">✕</button>

        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.4rem;">
          <span style="font-size: 1.4rem;">⚙️</span>
          <h2 style="font-size: 1.5rem; color: #fff;">Engine Settings & Gemini Key</h2>
        </div>
        <p style="color: var(--text-secondary); font-size: 0.88rem; margin-bottom: 1.5rem;">
          Configure live Google GenAI credentials or use built-in offline simulation.
        </p>

        <form id="settings-form" style="display: flex; flex-direction: column; gap: 1.25rem;">
          <div>
            <label style="display: block; font-size: 0.82rem; font-family: var(--font-mono); color: var(--neon-cyan); margin-bottom: 0.4rem;">
              GEMINI API KEY (Optional for live API):
            </label>
            <input 
              type="password" 
              id="input-api-key" 
              value="${gemini.apiKey}" 
              placeholder="AIzaSy..." 
              style="width: 100%; background: #03060c; border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 0.65rem 0.85rem; color: #fff; font-family: var(--font-mono); font-size: 0.88rem;"
            />
            <span style="font-size: 0.72rem; color: var(--text-muted); margin-top: 0.25rem; display: block;">
              Saved safely in your browser localStorage. If left blank, Kairos uses high-fidelity built-in offline intelligence.
            </span>
          </div>

          <div>
            <label style="display: block; font-size: 0.82rem; font-family: var(--font-mono); color: var(--neon-cyan); margin-bottom: 0.4rem;">
              MODEL SELECTION:
            </label>
            <select id="select-model" style="width: 100%; background: #03060c; border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 0.65rem 0.85rem; color: #fff; font-family: var(--font-mono); font-size: 0.88rem;">
              <option value="gemini-2.5-flash" ${gemini.model === 'gemini-2.5-flash' ? 'selected' : ''}>gemini-2.5-flash (Fast & Accurate)</option>
              <option value="gemini-3.8-flash" ${gemini.model === 'gemini-3.8-flash' ? 'selected' : ''}>gemini-3.8-flash (Latest Model)</option>
            </select>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 0.5rem;">
            <button type="button" id="btn-cancel-settings" class="btn btn-ghost btn-sm">Cancel</button>
            <button type="submit" class="btn btn-cyan btn-sm">Save Settings</button>
          </div>
        </form>
      </div>
    `;

    modalRoot.querySelector('#btn-modal-close')?.addEventListener('click', closeModal);
    modalRoot.querySelector('#btn-cancel-settings')?.addEventListener('click', closeModal);

    modalRoot.querySelector('#settings-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const key = modalRoot.querySelector('#input-api-key').value.trim();
      const model = modalRoot.querySelector('#select-model').value;
      gemini.setApiKey(key);
      gemini.setModel(model);
      soundFX.playSuccess();
      closeModal();
    });
  }

  function closeModal() {
    modalRoot.classList.add('hidden');
    modalRoot.setAttribute('aria-hidden', 'true');
    modalRoot.innerHTML = '';
  }

  // Global triggers
  window.addEventListener('kairos:open-pitch-modal', openPitchModal);
  window.addEventListener('kairos:open-settings-modal', openSettingsModal);
}
