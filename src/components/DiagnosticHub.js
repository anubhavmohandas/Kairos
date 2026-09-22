/**
 * Step 2: Diagnostic Hub Component
 * 5-Question Gemini-Powered Scenario Engine with EL10 mental models,
 * realistic evidence artifacts, and bilingual guidance.
 */

import { store } from '../state/store.js';

export function renderDiagnosticHub(container) {
  const state = store.getState();
  const isHinglish = state.language === 'hinglish';
  const domain = state.activeDomain;
  const diagState = state.diagnostic;
  const questions = domain.diagnostics;
  const currentQ = questions[diagState.questionIndex] || questions[0];
  const questionNum = diagState.questionIndex + 1;
  const selectedAnswer = diagState.userAnswers[currentQ.id];
  const isAnswered = selectedAnswer !== undefined;

  container.innerHTML = `
    <div class="diag-container">
      <!-- Top Diagnostic Navigation Bar -->
      <div class="diag-header-bar">
        <div style="display: flex; align-items: center; gap: 1rem;">
          <button id="diag-back-btn" class="btn btn-ghost btn-sm" title="Back to Topic Selector">
            ← ${isHinglish ? 'Peeche' : 'Back'}
          </button>
          <span style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--text-secondary);">
            ${isHinglish ? domain.titleHinglish : domain.title} // ${isHinglish ? 'DIAGNOSTIC' : 'DIAGNOSTIC'}
          </span>
        </div>

        <div style="display: flex; align-items: center; gap: 1.5rem;">
          <!-- Progress Track -->
          <div class="diag-progress-track">
            ${questions.map((q, idx) => {
              const isComp = diagState.userAnswers[q.id] !== undefined;
              const isAct = idx === diagState.questionIndex;
              return `<div class="progress-pill-step ${isAct ? 'active' : isComp ? 'completed' : ''}"></div>`;
            }).join('')}
          </div>
          <span style="font-family: var(--font-mono); font-size: 0.82rem; color: var(--neon-cyan);">
            ${questionNum} / ${questions.length}
          </span>
        </div>
      </div>

      <!-- Main Scenario Card -->
      <div class="glass-card scenario-card">
        <div class="scenario-badge-row">
          <span class="scenario-badge">${currentQ.microTopic}</span>
          <span style="font-size: 0.75rem; font-family: var(--font-mono); color: var(--text-muted);">
            SCENARIO #0${questionNum}
          </span>
        </div>

        <h2 class="scenario-title">
          ${isHinglish ? currentQ.titleHinglish : currentQ.title}
        </h2>

        <p class="scenario-context">
          ${isHinglish ? currentQ.scenarioHinglish : currentQ.scenario}
        </p>

        <!-- Visual Evidence Artifact Box -->
        ${currentQ.evidence ? `
          <div class="evidence-box">
            <div class="evidence-header">
              <span>🔍 ${currentQ.evidenceType === 'url' ? 'Network URL Payload' : currentQ.evidenceType === 'headers' ? 'Raw SMTP Headers' : currentQ.evidenceType === 'logs' ? 'System SIEM Log Capture' : 'Command Execution'}</span>
              <span>INSPECTION HUD</span>
            </div>
            <div class="evidence-content">${escapeHTML(currentQ.evidence)}</div>
          </div>
        ` : ''}

        <!-- Options List -->
        <div class="options-list">
          ${currentQ.options.map((opt, idx) => {
            const isSelected = selectedAnswer === idx;
            const isCorrect = idx === currentQ.correctIndex;
            let statusClass = '';
            if (isAnswered) {
              if (isCorrect) statusClass = 'correct';
              else if (isSelected) statusClass = 'incorrect';
            } else if (isSelected) {
              statusClass = 'selected';
            }

            const letters = ['A', 'B', 'C', 'D'];
            return `
              <button class="option-btn ${statusClass}" data-option-index="${idx}" ${isAnswered ? 'disabled' : ''}>
                <div class="option-letter">${letters[idx]}</div>
                <div style="flex: 1; line-height: 1.45;">
                  ${isHinglish ? opt.textHinglish : opt.text}
                </div>
              </button>
            `;
          }).join('')}
        </div>

        <!-- EL10 Explanation Banner (Appears after answer) -->
        ${isAnswered ? `
          <div class="el10-banner">
            <div class="el10-header">
              <span>💡 EL10 Intuition Mental Model</span>
              <span style="margin-left: auto; font-size: 0.75rem; color: var(--neon-cyan);">
                ${selectedAnswer === currentQ.correctIndex ? '✓ Correct Diagnosis (+20 XP)' : '✗ Vulnerability Overlooked'}
              </span>
            </div>
            <p class="el10-text">
              ${isHinglish ? currentQ.el10Hinglish : currentQ.el10}
            </p>
          </div>
        ` : ''}

        <!-- Action Footer -->
        <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 2rem; border-top: 1px solid var(--border-subtle); padding-top: 1.25rem;">
          <button id="btn-tutor-ask-diag" class="btn btn-ghost btn-sm">
            <span>🤖 ${isHinglish ? 'ELI5 Tutor se poochho' : 'Ask ELI5 Tutor'}</span>
          </button>

          ${isAnswered ? `
            <button id="diag-next-btn" class="btn btn-cyan">
              <span>${questionNum === questions.length ? (isHinglish ? 'Result Dekho' : 'Generate Skill Gap Analysis') : (isHinglish ? 'Agla Scenario' : 'Next Scenario')}</span>
              <span>→</span>
            </button>
          ` : `
            <span style="font-size: 0.85rem; color: var(--text-muted); font-family: var(--font-mono);">
              ${isHinglish ? 'Kripya ek option select karein...' : 'Select the most accurate diagnosis...'}
            </span>
          `}
        </div>
      </div>
    </div>
  `;

  // Event Listeners
  container.querySelector('#diag-back-btn')?.addEventListener('click', () => {
    store.setView('topic-selector');
  });

  container.querySelectorAll('.option-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-option-index'), 10);
      store.submitDiagnosticAnswer(currentQ.id, idx);
    });
  });

  container.querySelector('#diag-next-btn')?.addEventListener('click', () => {
    store.nextDiagnosticQuestion();
  });

  container.querySelector('#btn-tutor-ask-diag')?.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('kairos:open-tutor', {
      detail: { topic: currentQ.microTopic, context: currentQ.scenario }
    }));
  });
}

function escapeHTML(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
