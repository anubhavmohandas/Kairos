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
        '<svg width="10" height="10" viewBox="0 0 24 24" fill="#e11d48"><circle cx="12" cy="12" r="10"></circle></svg> <strong>Generic Video Overload:</strong> Watching 20-minute videos leads to cognitive fatigue and zero retention.',
        '<svg width="10" height="10" viewBox="0 0 24 24" fill="#e11d48"><circle cx="12" cy="12" r="10"></circle></svg> <strong>False Sense of Security:</strong> Passing multiple-choice memorization tests does not prepare engineers for real-world DNS spoofing or token replays.',
        '<svg width="10" height="10" viewBox="0 0 24 24" fill="#e11d48"><circle cx="12" cy="12" r="10"></circle></svg> <strong>Language Tax:</strong> Complex English jargon creates unnecessary barriers for regional tech talent.'
      ],
      highlight: 'Key Metric: 85% of corporate breaches still originate from human identity & phishing deception.'
    },
    {
      badge: 'SLIDE 02 // THE SOLUTION',
      title: 'Kairos: AI-Driven Skill Mastery Engine',
      subtitle: 'Where high-fidelity diagnostics meet surgical, grounded remediation.',
      points: [
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg> <strong>EL10 Scenario Engine:</strong> Real-world artifacts (URLs, headers, tokens) translated into intuitive mental models.',
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg> <strong>Native Hinglish Toggle:</strong> 1-click toggle to remove the cognitive translation tax.',
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg> <strong>3-Tier Difficulty Ramp:</strong> Seamless progression from Awareness → Mechanics → Forensic Mastery.'
      ],
      highlight: 'Core Philosophy: Explain Like I’m 10 intuition before technical syntax.'
    },
    {
      badge: 'SLIDE 03 // TECH STACK',
      title: '100% Google-Native Architecture',
      subtitle: 'Enterprise scalability with seamless Google ecosystem handshakes.',
      points: [
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20M2 12h20"></path></svg> <strong>Google Gemini API (gemini-3.8-flash):</strong> Generates scenario diagnostics, JSON skill-gap schemas, and powers the ELI5 Tutor.',
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect><polyline points="17 2 12 7 7 2"></polyline></svg> <strong>YouTube Data API v3:</strong> Automatically delivers grounded video masterclasses mapped to micro-weaknesses.',
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg> <strong>Google Meet & Chat API:</strong> Powers instant drop-in squad triage calls and live presence pings.'
      ],
      highlight: 'Zero Hallucinations: Strict boundary matching grounds all AI evaluations.'
    },
    {
      badge: 'SLIDE 04 // THE SOCIAL ENGINE',
      title: '"Steam-Style" Peer Learning & 1v1 Duels',
      subtitle: 'Transforming cybersecurity training into an engaging competitive sport.',
      points: [
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"></polyline><line x1="13" y1="19" x2="19" y2="13"></line></svg> <strong>1v1 Scenario Duels:</strong> Timed combat battles diagnosing attack vectors under pressure.',
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"></path><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"></path><circle cx="12" cy="12" r="2"></circle><path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"></path><path d="M19.1 4.9C23 8.8 23 15.1 19.1 19"></path></svg> <strong>Live Presence Stream:</strong> Discord/Steam style live campus activity feed creating peer motivation.',
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg> <strong>Squad Collaborative Notes:</strong> Shared crowdsourced micro-cheat sheets and upvoting.'
      ],
      highlight: 'Engagement Multiplier: Social proof drives 3.4x higher completion rates.'
    },
    {
      badge: 'SLIDE 05 // THE IMPACT',
      title: 'From Passive Watching to 100% Grounded Mastery',
      subtitle: 'Measurable, surgical skill gap closure.',
      points: [
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg> <strong>"So What?" Factor:</strong> Engineers understand the exact financial & operational breach consequences of each mistake.',
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon></svg> <strong>Anti-Zombie Checkpoints:</strong> Active reflection stops mindless scrolling and forces active recall.',
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2"></path><path d="M18 9h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.45 1-1 1H7v4h10v-4h-2c-.55 0-1-.45-1-1v-2.34"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"></path></svg> <strong>Adaptive Progression Loops:</strong> High-stakes mastery testing ensures concepts are truly locked in.'
      ],
      highlight: 'Final Takeaway: Kairos turns human vulnerability into an impenetrable defense perimeter.'
    },
    {
      badge: 'SLIDE 06 // CORE ENGINEERING TEAM',
      title: 'The Minds Behind Kairos',
      subtitle: 'Cross-functional engineering team pioneering precision AI cybersecurity mastery.',
      points: [
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="7" r="4"></circle><path d="M5.5 21a8.38 8.38 0 0 1 13 0"></path></svg> <strong>Anubhav Mohandas:</strong> Lead Cybersecurity Architect & Full-Stack Systems Engineering.',
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="7" r="4"></circle><path d="M5.5 21a8.38 8.38 0 0 1 13 0"></path></svg> <strong>Vedantkumar Chaudhri:</strong> AI Systems, Gemini Multi-Agent Orchestration & Cloud Infrastructure.',
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="7" r="4"></circle><path d="M5.5 21a8.38 8.38 0 0 1 13 0"></path></svg> <strong>Dhruv Rana:</strong> Security Research, Offensive Threat Emulation & SIEM Telemetry.',
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="7" r="4"></circle><path d="M5.5 21a8.38 8.38 0 0 1 13 0"></path></svg> <strong>Shakya Vinit:</strong> UI/UX Product Design, Neo-Brutalist HUD & Visual Experience Systems.'
      ],
      highlight: 'Core Team: Built for speed, precision, and cognitive cybersecurity skill retention.'
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
        <button id="btn-modal-close" class="modal-close-btn" title="Close"></button>

        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
          <span style="font-size: 0.8rem; font-family: var(--font-mono); color: var(--neon-cyan); font-weight: 700; letter-spacing: 0.08em;">
            ${slide.badge}
          </span>
          <span style="font-family: var(--font-mono); font-size: 0.82rem; color: var(--text-muted);">
            SLIDE ${currentSlide + 1} / ${slides.length}
          </span>
        </div>

        <h2 style="font-size: 1.8rem; margin-bottom: 0.35rem; color: var(--text-main);">${slide.title}</h2>
        <p style="color: var(--text-secondary); font-size: 0.95rem; margin-bottom: 1.5rem;">${slide.subtitle}</p>

        <div class="pitch-slide-content glass-card" style="padding: 1.5rem; border-color: rgba(0, 245, 212, 0.25);">
          <div style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.25rem;">
            ${slide.points.map(p => `<div style="font-size: 0.98rem; line-height: 1.5;">${p}</div>`).join('')}
          </div>

          <div style="background: rgba(0, 245, 212, 0.1); border-left: 3px solid var(--neon-cyan); padding: 0.75rem 1rem; border-radius: var(--radius-sm); font-size: 0.88rem; color: var(--text-main); font-weight: 600;">
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
        <button id="btn-modal-close" class="modal-close-btn" title="Close"></button>

        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.4rem;">
          <span style="font-size: 1.4rem;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg></span>
          <h2 style="font-size: 1.5rem; color: var(--text-main);">Engine Settings & Gemini Key</h2>
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
              style="width: 100%; background: var(--bg-card-alt); border: var(--border-mid); border-radius: var(--radius-sm); padding: 0.65rem 0.85rem; color: var(--text-main); font-family: var(--font-mono); font-size: 0.88rem;"
            />
            <span style="font-size: 0.72rem; color: var(--text-muted); margin-top: 0.25rem; display: block;">
              Saved safely in your browser localStorage. If left blank, Kairos uses high-fidelity built-in offline intelligence.
            </span>
          </div>

          <div>
            <label style="display: block; font-size: 0.82rem; font-family: var(--font-mono); color: var(--neon-cyan); margin-bottom: 0.4rem;">
              MODEL SELECTION:
            </label>
            <select id="select-model" style="width: 100%; background: var(--bg-card-alt); border: var(--border-mid); border-radius: var(--radius-sm); padding: 0.65rem 0.85rem; color: var(--text-main); font-family: var(--font-mono); font-size: 0.88rem;">
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
