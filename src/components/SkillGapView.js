/**
 * Step 3: Skill-Gap Analysis & "So What?" Factor View
 * Transforms raw test scores into surgical remediation blueprints with structured JSON schema.
 */

import { store } from '../state/store.js';

export function renderSkillGapView(container) {
  const state = store.getState();
  const isHinglish = state.language === 'hinglish';
  const domain = state.activeDomain;
  const diagState = state.diagnostic;
  const score = diagState.score ?? 60;
  const isPassed = score >= 80;
  const missed = diagState.missedQuestions || [];

  container.innerHTML = `
    <div class="skillgap-wrapper">
      <!-- Section Header -->
      <div class="section-header">
        <div class="section-eyebrow">
          <span>// PHASE 03</span>
          <span>•</span>
          <span>${isHinglish ? 'SMART SKILL-GAP BLUEPRINT' : 'SMART SKILL-GAP ANALYSIS'}</span>
        </div>
        <h1 class="section-title">
          ${isHinglish ? 'Surgical Weakness Mapping & "So What?" Factor' : 'Surgical Weakness Mapping & "So What?" Factor'}
        </h1>
        <p class="section-desc">
          ${isHinglish
            ? 'Aam courses ki tarah generic videos nahi milenge. Aapki specific galtiyo ke aadhar par custom syllabus taiyaar ho chuka hai.'
            : 'Instead of generic re-teaching, the engine has isolated your specific mental model gaps and mapped them to surgical remediation micro-topics.'}
        </p>
      </div>

      <!-- Score Overview Card -->
      <div class="glass-card score-overview-card">
        <div class="score-radial-box">
          <div class="score-number ${isPassed ? 'pass' : 'fail'}">${score}%</div>
          <div class="score-label">${isPassed ? (isHinglish ? 'Tier 1 Clear!' : 'Baseline Cleared') : (isHinglish ? 'Practice Needed' : 'Remediation Needed')}</div>
        </div>

        <div class="overview-details">
          <h3>
            ${isPassed 
              ? (isHinglish ? 'Zabardast! Aapke concepts strong hain.' : 'Strong Diagnostic Performance!') 
              : (isHinglish ? 'Critical Micro-Gaps Detect Hue Hain.' : 'Critical Micro-Vulnerabilities Detected.')}
          </h3>
          <p>
            ${isPassed 
              ? (isHinglish ? 'Aap directly Mastery Arena mein ja kar Level 2 Mechanics unlock kar sakte hain.' : 'You have mastered basic awareness. You can jump directly to the Mastery Arena or review micro-topics.')
              : (isHinglish ? `Aapne ${missed.length} specific scenarios miss kiye. Niche dekhiye ye production mein kyun khatarnaak hai.` : `You struggled with ${missed.length} attack vectors. See the "So What?" factor breakdown below.`)}
          </p>
          <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
            <button id="btn-goto-lab" class="btn btn-cyan">
              <span>🚀 ${isHinglish ? 'Surgical Learning Lab Kholo' : 'Enter Surgical Learning Lab'}</span>
            </button>
            <button id="btn-goto-mastery" class="btn btn-violet">
              <span>⚔️ ${isHinglish ? 'Mastery Arena Test' : 'Attempt Mastery Arena'}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- The "So What?" Factor Breakdown Cards -->
      <h3 style="font-size: 1.3rem; margin-bottom: 1rem; color: #fff; display: flex; align-items: center; gap: 0.5rem;">
        <span>🎯</span>
        <span>${isHinglish ? 'The "So What?" Factor (Real-World Risk)' : 'The "So What?" Factor (Real-World Impact)'}</span>
      </h3>

      <div class="sowhat-grid">
        ${missed.length > 0 ? missed.map(q => `
          <div class="glass-card sowhat-card">
            <div class="sowhat-pill">⚠️ ${q.microTopic}</div>
            <h4 class="sowhat-title">${isHinglish ? q.titleHinglish : q.title}</h4>
            <div class="sowhat-body">
              <strong style="color: #f1f5f9;">${isHinglish ? 'Asal Mein Kya Nuksaan Hoga:' : 'Production Reality:'}</strong>
              <div style="margin-top: 0.25rem;">${q.soWhat}</div>
            </div>
            <div class="remediation-remedy">
              <strong>🛠️ ${isHinglish ? 'Surgical Path:' : 'Remediation Focus:'}</strong>
              <span>${q.cheatSheet?.[0] || 'Domain tree inspection & cryptographic validation'}</span>
            </div>
          </div>
        `).join('') : `
          <div class="glass-card sowhat-card" style="border-left-color: var(--neon-green);">
            <div class="sowhat-pill" style="color: var(--neon-green);">✓ Flawless Diagnostic</div>
            <h4 class="sowhat-title">Zero Baseline Weaknesses Detected</h4>
            <div class="sowhat-body">You correctly identified every single deceptive attack vector and protocol spoofing attempt.</div>
            <div class="remediation-remedy">
              <strong>🛠️ Next Step:</strong> Advance to Tier 2 attack simulation mechanics.
            </div>
          </div>
        `}
      </div>

      <!-- JSON Weakness Schema Drawer -->
      <div class="json-schema-drawer">
        <div class="json-header-toggle" id="btn-toggle-json">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span>📄</span>
            <span>STRUCTURED JSON WEAKNESS SCHEMA (Gemini AI Output)</span>
          </div>
          <span id="json-toggle-icon">▼</span>
        </div>
        <div class="json-code-block" id="json-block-content">
          <pre>${escapeHTML(JSON.stringify({
            domain: domain.title,
            current_tier: `Level ${state.currentTier}`,
            score: `${score}%`,
            diagnostic_status: isPassed ? 'PASSED_BASELINE' : 'NEEDS_SURGICAL_REMEDIATION',
            timestamp: new Date().toISOString(),
            micro_weaknesses: missed.map(m => ({
              micro_topic: m.microTopic,
              question_id: m.id,
              real_world_risk: m.soWhat,
              suggested_video_query: m.remediationQuery,
              takeaways: m.cheatSheet
            }))
          }, null, 2))}</pre>
        </div>
      </div>
    </div>
  `;

  // Attach Event Handlers
  container.querySelector('#btn-goto-lab')?.addEventListener('click', () => {
    store.setView('learning-lab');
  });

  container.querySelector('#btn-goto-mastery')?.addEventListener('click', () => {
    store.setView('mastery-arena');
  });

  const toggleBtn = container.querySelector('#btn-toggle-json');
  const jsonBlock = container.querySelector('#json-block-content');
  const toggleIcon = container.querySelector('#json-toggle-icon');

  toggleBtn?.addEventListener('click', () => {
    if (jsonBlock.style.display === 'none') {
      jsonBlock.style.display = 'block';
      toggleIcon.textContent = '▼';
    } else {
      jsonBlock.style.display = 'none';
      toggleIcon.textContent = '▶';
    }
  });
}

function escapeHTML(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
