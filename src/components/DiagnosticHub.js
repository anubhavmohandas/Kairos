/**
 * Step 2: Diagnostic Hub Component (High-Fidelity Cyber Inspection Edition)
 * Grounded 5-scenario engine for Active Directory Kerberoasting and core cyber tracks.
 * Features realistic terminal evidence HUD with copy functionality,
 * high-contrast accessible option cards, deep EL10 mental models,
 * "So What?" production impact breakdown, and seamless ELI5 Tutor integration.
 * Zero emojis — 100% bespoke SVG vector icons.
 */

import { store } from '../state/store.js';
import { soundFX } from '../services/soundEffects.js';

export function renderDiagnosticHub(container) {
  const state = store.getState();
  const isHinglish = state.language === 'hinglish';
  const domain = state.activeDomain;
  const diagState = state.diagnostic;
  const questions = domain.diagnostics || [];
  const currentQ = questions[diagState.questionIndex] || questions[0];
  const questionNum = diagState.questionIndex + 1;
  const totalQuestions = questions.length;
  const selectedAnswer = diagState.userAnswers[currentQ?.id];
  const isAnswered = selectedAnswer !== undefined;
  const isCorrect = isAnswered && selectedAnswer === currentQ.correctIndex;

  if (!currentQ) {
    container.innerHTML = `
      <div class="diag-container">
        <div class="glass-card" style="padding: 40px; text-align: center;">
          <h2>No diagnostic scenarios available for this domain.</h2>
          <button class="btn btn-cyan" id="diag-fallback-home" style="margin-top: 16px;">Back to Catalog</button>
        </div>
      </div>
    `;
    container.querySelector('#diag-fallback-home')?.addEventListener('click', () => {
      store.setView('topic-selector');
    });
    return;
  }

  // Determine Evidence Header Label
  let evidenceLabel = 'SYSTEM ARTIFACT INSPECTION';
  if (currentQ.evidenceType === 'command') {
    evidenceLabel = 'TERMINAL / COMMAND EXECUTION HUD';
  } else if (currentQ.evidenceType === 'logs') {
    evidenceLabel = 'SECURITY SIEM TELEMETRY LOG';
  } else if (currentQ.evidenceType === 'headers') {
    evidenceLabel = 'RAW NETWORK / PROTOCOL HEADERS';
  } else if (currentQ.evidenceType === 'url') {
    evidenceLabel = 'NETWORK PAYLOAD / URL STRING';
  } else if (currentQ.evidenceType === 'code') {
    evidenceLabel = 'APPLICATION SOURCE / TOKEN PAYLOAD';
  }

  container.innerHTML = `
    <div class="diag-container">
      
      <!-- ==========================================================
           TOP DIAGNOSTIC NAVIGATION & STATUS BAR
           ========================================================== -->
      <div class="diag-header-bar">
        <div class="diag-header-left">
          <button id="diag-back-btn" class="btn btn-ghost btn-sm" title="${isHinglish ? 'Tracks par wapas jayein' : 'Return to Catalog'}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            <span>${isHinglish ? 'Tracks' : 'Tracks'}</span>
          </button>

          <div class="diag-track-info">
            <span class="diag-track-title">${isHinglish ? domain.titleHinglish : domain.title}</span>
            <span class="diag-track-sep">//</span>
            <span class="diag-track-badge">TIER ${state.currentTier}: AWARENESS</span>
          </div>
        </div>

        <div class="diag-header-right">
          <!-- Step Progression Pills -->
          <div class="diag-progress-track" title="Scenario Progress">
            ${questions.map((q, idx) => {
              const isComp = diagState.userAnswers[q.id] !== undefined;
              const isAct = idx === diagState.questionIndex;
              const wasRight = isComp && diagState.userAnswers[q.id] === q.correctIndex;
              let stepClass = '';
              if (isAct) stepClass = 'active';
              else if (isComp) stepClass = wasRight ? 'completed-right' : 'completed-wrong';

              return `
                <div class="progress-pill-step ${stepClass}" title="Scenario ${idx + 1}: ${q.microTopic}">
                  ${isComp ? (wasRight ? `<svg class="pill-check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5"><polyline points="20 6 9 17 4 12"></polyline></svg>` : `<svg class="pill-x-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`) : ''}
                </div>
              `;
            }).join('')}
          </div>

          <div class="diag-counter-pill">
            <span class="counter-curr">#0${questionNum}</span>
            <span class="counter-sep">/</span>
            <span class="counter-total">0${totalQuestions}</span>
          </div>
        </div>
      </div>

      <!-- ==========================================================
           MAIN SCENARIO CARD
           ========================================================== -->
      <div class="glass-card scenario-card">
        
        <!-- Metadata Header: Micro-Topic & MITRE Classification -->
        <div class="scenario-badge-row">
          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
            <span class="scenario-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="2" y="2" width="20" height="20" rx="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path></svg>
              <span>${currentQ.microTopic}</span>
            </span>
            <span class="scenario-mitre-tag">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              <span>MITRE ATT&CK T1558.003</span>
            </span>
          </div>

          <span class="scenario-case-tag">CASE FILE #AD-0${questionNum}</span>
        </div>

        <!-- Headline & Incident Context -->
        <h2 class="scenario-title">
          ${isHinglish ? currentQ.titleHinglish : currentQ.title}
        </h2>

        <p class="scenario-context">
          ${isHinglish ? currentQ.scenarioHinglish : currentQ.scenario}
        </p>

        <!-- ==========================================================
             HIGH-FIDELITY EVIDENCE INSPECTION HUD
             ========================================================== -->
        ${currentQ.evidence ? `
          <div class="evidence-box">
            <div class="evidence-header">
              <div class="evidence-header-left">
                <div class="terminal-dots">
                  <span class="term-dot dot-red"></span>
                  <span class="term-dot dot-yellow"></span>
                  <span class="term-dot dot-green"></span>
                </div>
                <span class="evidence-type-badge">${evidenceLabel}</span>
              </div>
              <div class="evidence-header-right">
                <button class="btn-copy-evidence" id="btn-copy-evidence" title="Copy Raw Artifact">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                  <span id="copy-btn-text">${isHinglish ? 'Copy Karein' : 'Copy Artifact'}</span>
                </button>
              </div>
            </div>
            <div class="evidence-content" id="evidence-raw-block">${escapeHTML(currentQ.evidence)}</div>
          </div>
        ` : ''}

        <!-- ==========================================================
             INTERACTIVE OPTIONS LIST
             ========================================================== -->
        <div class="options-container">
          <div class="options-header-label">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            <span>${isAnswered ? (isHinglish ? 'Nateeja aur Analysis:' : 'Diagnostic Assessment:') : (isHinglish ? 'Sahi option select karein:' : 'Select the most accurate technical analysis:')}</span>
          </div>

          <div class="options-list">
            ${currentQ.options.map((opt, idx) => {
              const isSelected = selectedAnswer === idx;
              const isThisCorrect = idx === currentQ.correctIndex;
              let statusClass = '';
              let badgeIcon = '';

              if (isAnswered) {
                if (isThisCorrect) {
                  statusClass = 'correct';
                  badgeIcon = `<svg class="status-icon-check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
                } else if (isSelected) {
                  statusClass = 'incorrect';
                  badgeIcon = `<svg class="status-icon-cross" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
                } else {
                  statusClass = 'dimmed';
                }
              }

              const letters = ['A', 'B', 'C', 'D'];
              return `
                <button class="option-btn ${statusClass}" data-option-index="${idx}" ${isAnswered ? 'disabled' : ''}>
                  <div class="option-letter">
                    ${badgeIcon ? badgeIcon : letters[idx]}
                  </div>
                  <div class="option-text-wrapper">
                    <span class="option-text-main">${isHinglish ? opt.textHinglish : opt.text}</span>
                  </div>
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <!-- ==========================================================
             POST-ANSWER FEEDBACK DECK (REVEALED ON ANSWER)
             ========================================================== -->
        ${isAnswered ? `
          <div class="diag-feedback-deck">
            
            <!-- 1. Triage Status Banner -->
            <div class="triage-status-banner ${isCorrect ? 'status-pass' : 'status-fail'}">
              <div class="status-badge-icon">
                ${isCorrect ? `
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                ` : `
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                `}
              </div>
              <div class="status-text-block">
                <strong>${isCorrect 
                  ? (isHinglish ? 'Bilkul Sahi Diagnosis! (+20 XP)' : 'Accurate Threat Diagnosis (+20 XP)') 
                  : (isHinglish ? 'Vulnerability Overlooked!' : 'Exploit Vector Overlooked!')}</strong>
                <span>${isCorrect 
                  ? (isHinglish ? 'Aapne Active Directory exploit vector ko bilkul accurately diagnose kiya.' : 'You correctly identified the protocol vulnerability and attack surface.') 
                  : (isHinglish ? 'Is scenario mein attack mechanism ko samajhna zaroori hai. Niche detail dekhiye.' : 'Review the underlying mechanics below to master this defense technique.')}</span>
              </div>
            </div>

            <!-- 2. EL10 Intuition Mental Model -->
            <div class="el10-banner">
              <div class="el10-header">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9 18h6"></path>
                  <path d="M10 22h4"></path>
                  <path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7z"></path>
                </svg>
                <span>${isHinglish ? 'EL10 Mental Model (Aasan Bhasha Mein Samjho):' : 'EL10 Intuition (Explain Like I\'m 10):'}</span>
              </div>
              <p class="el10-text">
                ${isHinglish ? currentQ.el10Hinglish : currentQ.el10}
              </p>
            </div>

            <!-- 3. "So What?" Real-World Blast Radius -->
            <div class="sowhat-banner">
              <div class="sowhat-header">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span>${isHinglish ? 'The "So What?" Factor (Production Nuksaan):' : 'The "So What?" Factor (Production Blast Radius):'}</span>
              </div>
              <p class="sowhat-text">
                ${currentQ.soWhat}
              </p>
            </div>

            <!-- 4. Key Remediation Blueprint Takeaways -->
            ${currentQ.cheatSheet && currentQ.cheatSheet.length > 0 ? `
              <div class="remediation-summary-card">
                <div class="remediation-header">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                  <span>${isHinglish ? 'Surgical Remediation Takeaways:' : 'Surgical Defense Takeaways:'}</span>
                </div>
                <ul class="remediation-bullets">
                  ${currentQ.cheatSheet.map(item => `<li>${item}</li>`).join('')}
                </ul>
              </div>
            ` : ''}

          </div>
        ` : ''}

        <!-- ==========================================================
             ACTION FOOTER
             ========================================================== -->
        <div class="diag-action-footer">
          <button id="btn-tutor-ask-diag" class="btn btn-ghost btn-sm" title="${isHinglish ? 'AI Tutor se baat karein' : 'Chat with ELI5 AI Tutor'}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="10" rx="2"></rect>
              <circle cx="12" cy="5" r="2"></circle>
              <path d="M12 7v4"></path>
              <line x1="8" y1="16" x2="8" y2="16"></line>
              <line x1="16" y1="16" x2="16" y2="16"></line>
            </svg>
            <span>${isHinglish ? 'ELI5 Tutor se poochho' : 'Ask ELI5 Tutor'}</span>
          </button>

          <div class="diag-footer-right">
            ${isAnswered ? `
              <button id="diag-next-btn" class="btn btn-cyan btn-next-scenario">
                <span>${questionNum === totalQuestions ? (isHinglish ? 'Skill Gap Analysis Dekho' : 'Generate Skill Gap Blueprint') : (isHinglish ? 'Agla Scenario' : 'Next Scenario')}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            ` : `
              <span class="diag-selection-prompt">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 8 12 12 14 14"></polyline></svg>
                <span>${isHinglish ? 'Pehle ek option par click karein...' : 'Select your diagnosis above to verify the vector...'}</span>
              </span>
            `}
          </div>
        </div>

      </div>
    </div>
  `;

  // ==========================================================
  // EVENT LISTENERS
  // ==========================================================

  // Back to Catalog
  container.querySelector('#diag-back-btn')?.addEventListener('click', () => {
    soundFX.playClick();
    store.setView('topic-selector');
  });

  // Copy Evidence Artifact
  container.querySelector('#btn-copy-evidence')?.addEventListener('click', () => {
    soundFX.playClick();
    if (currentQ.evidence) {
      navigator.clipboard.writeText(currentQ.evidence).then(() => {
        const txt = container.querySelector('#copy-btn-text');
        if (txt) {
          txt.textContent = isHinglish ? 'Copied!' : 'Copied!';
          setTimeout(() => {
            if (txt) txt.textContent = isHinglish ? 'Copy Karein' : 'Copy Artifact';
          }, 2000);
        }
      }).catch(err => {
        console.warn('Clipboard write error:', err);
      });
    }
  });

  // Option Click Handler
  container.querySelectorAll('.option-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-option-index'), 10);
      store.submitDiagnosticAnswer(currentQ.id, idx);
    });
  });

  // Next Scenario Button
  container.querySelector('#diag-next-btn')?.addEventListener('click', () => {
    soundFX.playClick();
    store.nextDiagnosticQuestion();
  });

  // Open ELI5 Tutor with Scenario Context
  container.querySelector('#btn-tutor-ask-diag')?.addEventListener('click', () => {
    soundFX.playClick();
    window.dispatchEvent(new CustomEvent('kairos:open-tutor', {
      detail: { 
        topic: `${domain.title}: ${currentQ.microTopic}`, 
        context: `${currentQ.scenario}\\n\\nArtifact: ${currentQ.evidence}` 
      }
    }));
  });
}

function escapeHTML(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
