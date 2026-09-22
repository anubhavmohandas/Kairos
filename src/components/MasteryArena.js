/**
 * Step 5: Mastery Arena Component
 * High-stakes progression test with two pathways:
 * Pass (>=80%): Unlocks next difficulty tier & broadcasts to social stream.
 * Needs Practice (<80%): Triggers Surgical Remediation Loop.
 */

import { store } from '../state/store.js';
import { soundFX } from '../services/soundEffects.js';

export function renderMasteryArena(container) {
  const state = store.getState();
  const isHinglish = state.language === 'hinglish';
  const domain = state.activeDomain;
  const currentTier = state.currentTier;
  const masteryState = state.mastery;

  // 3-Question High Stakes Arena Exam
  const examQuestions = [
    {
      id: 'mq_1',
      title: 'Real-time DNS Triage Under Incident Response',
      titleHinglish: 'Live Attack Mein DNS Domain Triage',
      scenario: 'During a live incident, an employee submits an email asking if "https://update-security.google.com.it-support.online/patch" is genuine IT communication. What is the immediate forensic verdict?',
      scenarioHinglish: 'Ek employee ne suspicious link report kiya. Kya ye link safe hai?',
      options: [
        { text: 'Safe: The domain starts with "google.com" which has an active EV SSL certificate.', textHinglish: 'Safe hai: URL mein google.com likha hai.' },
        { text: 'Malicious Phishing: The actual destination apex domain is "it-support.online". Block at DNS firewall immediately.', textHinglish: 'Phishing Attack: Asli domain "it-support.online" hai. DNS firewall par block karo.' },
        { text: 'Safe: "online" is Google’s official cloud datacenter top-level domain.', textHinglish: 'Safe hai: "online" Google ka official domain hai.' }
      ],
      correctIndex: 1
    },
    {
      id: 'mq_2',
      title: 'Email Hardening Forensic Policy',
      titleHinglish: 'Email Hardening aur Spoofing Protection',
      scenario: 'To eliminate Business Email Compromise (BEC) and stop spoofed CEO wire transfer requests, which DMARC record must be published in DNS?',
      scenarioHinglish: 'Fake CEO emails ko 100% block karne ke liye DNS mein kaun sa DMARC record hona chahiye?',
      options: [
        { text: 'v=DMARC1; p=none; rua=mailto:dmarc-reports@megacorp.com', textHinglish: 'v=DMARC1; p=none (Sirf report banata hai)' },
        { text: 'v=DMARC1; p=reject; sp=reject; pct=100; rua=mailto:soc@megacorp.com', textHinglish: 'v=DMARC1; p=reject (Fake emails ko turant block karo)' },
        { text: 'v=SPF1 +all (Allow all IP addresses to send on behalf of domain)', textHinglish: 'v=SPF1 +all (Sabko allow kar do)' }
      ],
      correctIndex: 1
    },
    {
      id: 'mq_3',
      title: 'Credential Theft Mitigation',
      titleHinglish: 'MFA Bypass aur Session Theft Mitigation',
      scenario: 'Which authentication technology completely neutralizes both Evilginx reverse proxy phishing and MFA push fatigue attacks?',
      scenarioHinglish: 'Kaunsi technology reverse proxy phishing aur push fatigue dono ko 100% rokti hai?',
      options: [
        { text: 'SMS 6-digit one-time passcodes with 30-second expiry.', textHinglish: 'SMS OTP verification.' },
        { text: 'FIDO2 / WebAuthn Hardware Passkeys with cryptographic origin binding.', textHinglish: 'FIDO2 Hardware Passkeys (Cryptographic Origin Binding ke saath).' },
        { text: 'Changing user passwords every 14 days.', textHinglish: 'Har 14 din mein password badalna.' }
      ],
      correctIndex: 1
    }
  ];

  const currentQIndex = masteryState.questionIndex;
  const currentQ = examQuestions[currentQIndex];
  const isAnswered = masteryState.answers[currentQ.id] !== undefined;

  if (masteryState.completed) {
    const isPassed = masteryState.score >= 80;

    container.innerHTML = `
      <div class="glass-card" style="max-width: 720px; margin: 2rem auto; padding: 2.5rem; text-align: center;">
        <div style="font-size: 3.5rem; margin-bottom: 0.5rem;">
          ${isPassed ? '🏆' : '⚠️'}
        </div>

        <h2 style="font-size: 2.2rem; margin-bottom: 0.5rem;">
          ${isPassed 
            ? (isHinglish ? 'Badhai Ho! Mastery Proven!' : 'Mastery Proven!') 
            : (isHinglish ? 'Surgical Remediation Triggered' : 'Mastery Threshold Missed')}
        </h2>

        <div class="mastery-score-pill" style="border-color: ${isPassed ? 'var(--neon-green)' : 'var(--neon-amber)'}; color: ${isPassed ? 'var(--neon-green)' : 'var(--neon-amber)'};">
          Score: ${masteryState.score}% // ${isPassed ? 'TIER ADVANCEMENT UNLOCKED' : 'NEEDS RE-ALIGNMENT'}
        </div>

        <p style="color: var(--text-secondary); margin-bottom: 2rem; font-size: 1.05rem;">
          ${isPassed 
            ? (isHinglish 
                ? `Aapne ${domain.title} ke Tier ${currentTier} ko master kar liya hai. Level ${Math.min(3, currentTier + 1)} mechanics unlock ho chuka hai!` 
                : `You successfully demonstrated forensic understanding of ${domain.title}. Tier ${Math.min(3, currentTier + 1)} has been unlocked.`)
            : (isHinglish 
                ? 'Aap 80% cutoff se thoda peeche reh gaye. Surgical Remediation loop ke zariye micro-topics review karein.'
                : 'You scored below the 80% threshold. The Surgical Remediation loop has updated your focus areas.')}
        </p>

        <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
          ${isPassed ? `
            <button id="btn-mastery-next-tier" class="btn btn-cyan">
              <span>🚀 ${isHinglish ? 'Agla Tier Unlock Karo' : `Unlock Tier ${Math.min(3, currentTier + 1)}`}</span>
            </button>
            <button id="btn-mastery-to-social" class="btn btn-violet">
              <span>⚔️ ${isHinglish ? '1v1 Arena Mein Challenge Karo' : 'Enter 1v1 Duel Arena'}</span>
            </button>
          ` : `
            <button id="btn-mastery-remediate" class="btn btn-cyan">
              <span>🔄 ${isHinglish ? 'Surgical Learning Lab Kholo' : 'Review in Learning Lab'}</span>
            </button>
            <button id="btn-mastery-retry" class="btn btn-ghost">
              <span>🔁 ${isHinglish ? 'Test Dobara Dein' : 'Retry Mastery Exam'}</span>
            </button>
          `}
        </div>
      </div>
    `;

    container.querySelector('#btn-mastery-next-tier')?.addEventListener('click', () => {
      store.unlockNextTier(domain.id);
      store.setView('topic-selector');
    });

    container.querySelector('#btn-mastery-to-social')?.addEventListener('click', () => {
      store.setView('social-dashboard');
    });

    container.querySelector('#btn-mastery-remediate')?.addEventListener('click', () => {
      store.setView('learning-lab');
    });

    container.querySelector('#btn-mastery-retry')?.addEventListener('click', () => {
      store.state.mastery = {
        questionIndex: 0,
        answers: {},
        score: null,
        passed: false,
        completed: false
      };
      store.notify();
    });

    return;
  }

  // Active Exam View
  container.innerHTML = `
    <div class="diag-container">
      <div class="mastery-hero">
        <div class="section-eyebrow">
          <span>// PHASE 05</span>
          <span>•</span>
          <span>${isHinglish ? 'HIGH-STAKES MASTERY ARENA' : 'HIGH-STAKES MASTERY EVALUATION'}</span>
        </div>
        <h2>${isHinglish ? 'Tier 1 Mastery Challenge' : 'Tier Progression Exam'}</h2>
        <p style="color: var(--text-secondary); font-size: 0.95rem;">
          ${isHinglish ? 'Agla Level (Tier 2 Mechanics) unlock karne ke liye kam se kam 80% score karein.' : 'Achieve 80% or higher to prove retention and unlock Tier 2 Mechanics.'}
        </p>
      </div>

      <div class="glass-card scenario-card">
        <div class="scenario-badge-row">
          <span class="scenario-badge" style="background: rgba(168, 85, 247, 0.15); border-color: var(--neon-violet); color: var(--neon-violet);">
            QUESTION ${currentQIndex + 1} OF ${examQuestions.length}
          </span>
        </div>

        <h3 class="scenario-title">${isHinglish ? currentQ.titleHinglish : currentQ.title}</h3>
        <p class="scenario-context">${isHinglish ? currentQ.scenarioHinglish : currentQ.scenario}</p>

        <div class="options-list">
          ${currentQ.options.map((opt, idx) => {
            const isSelected = masteryState.answers[currentQ.id] === idx;
            const isCorrect = idx === currentQ.correctIndex;
            let statusClass = '';
            if (isAnswered) {
              if (isCorrect) statusClass = 'correct';
              else if (isSelected) statusClass = 'incorrect';
            } else if (isSelected) {
              statusClass = 'selected';
            }

            const letters = ['A', 'B', 'C'];
            return `
              <button class="option-btn ${statusClass}" data-opt-idx="${idx}" ${isAnswered ? 'disabled' : ''}>
                <div class="option-letter">${letters[idx]}</div>
                <div style="flex: 1;">${isHinglish ? opt.textHinglish : opt.text}</div>
              </button>
            `;
          }).join('')}
        </div>

        <div style="display: flex; justify-content: flex-end; margin-top: 1.5rem; border-top: 1px solid var(--border-subtle); padding-top: 1rem;">
          ${isAnswered ? `
            <button id="btn-mastery-next" class="btn btn-cyan">
              <span>${currentQIndex === examQuestions.length - 1 ? (isHinglish ? 'Final Score Dekho' : 'Submit Final Exam') : (isHinglish ? 'Agla Sawal' : 'Next Question')}</span>
              <span>→</span>
            </button>
          ` : `
            <span style="font-size: 0.85rem; color: var(--text-muted); font-family: var(--font-mono);">
              ${isHinglish ? 'Answer select karein...' : 'Select your forensic answer...'}
            </span>
          `}
        </div>
      </div>
    </div>
  `;

  // Attach Handlers
  container.querySelectorAll('.option-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-opt-idx'), 10);
      masteryState.answers[currentQ.id] = idx;
      if (idx === currentQ.correctIndex) {
        soundFX.playSuccess();
      } else {
        soundFX.playAlert();
      }
      store.notify();
    });
  });

  container.querySelector('#btn-mastery-next')?.addEventListener('click', () => {
    if (currentQIndex < examQuestions.length - 1) {
      masteryState.questionIndex++;
      soundFX.playClick();
      store.notify();
    } else {
      // Calculate exam result
      let correct = 0;
      examQuestions.forEach(q => {
        if (masteryState.answers[q.id] === q.correctIndex) correct++;
      });
      const score = Math.round((correct / examQuestions.length) * 100);
      masteryState.score = score;
      masteryState.passed = score >= 80;
      masteryState.completed = true;

      if (masteryState.passed) {
        soundFX.playFanfare();
        store.broadcastPresence(`🏆 ${store.state.user.name} PASSED Tier 1 Mastery in ${domain.title}!`, 'unlock');
      } else {
        soundFX.playAlert();
      }
      store.notify();
    }
  });
}
