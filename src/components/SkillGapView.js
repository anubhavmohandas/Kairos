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
              <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path></svg> ${isHinglish ? 'Surgical Learning Lab Kholo' : 'Enter Surgical Learning Lab'}</span>
            </button>
            <button id="btn-goto-mastery" class="btn btn-violet">
              <span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"></polyline><line x1="13" y1="19" x2="19" y2="13"></line></svg> ${isHinglish ? 'Mastery Arena Test' : 'Attempt Mastery Arena'}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- The "So What?" Factor Breakdown Cards -->
      <h3 style="font-size: 1.3rem; margin-bottom: 1rem; color: var(--text-main); display: flex; align-items: center; gap: 0.5rem;">
        <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg></span>
        <span>${isHinglish ? 'The "So What?" Factor (Real-World Risk)' : 'The "So What?" Factor (Real-World Impact)'}</span>
      </h3>

      <div class="sowhat-grid">
        ${missed.length > 0 ? missed.map(q => `
          <div class="glass-card sowhat-card">
            <div class="sowhat-pill"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg> ${q.microTopic}</div>
            <h4 class="sowhat-title">${isHinglish ? q.titleHinglish : q.title}</h4>
            <div class="sowhat-body">
              <strong style="color: var(--text-main);">${isHinglish ? 'Asal Mein Kya Nuksaan Hoga:' : 'Production Reality:'}</strong>
              <div style="margin-top: 0.25rem;">${q.soWhat}</div>
            </div>
            <div class="remediation-remedy">
              <strong><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg> ${isHinglish ? 'Surgical Path:' : 'Remediation Focus:'}</strong>
              <span>${q.cheatSheet?.[0] || 'Domain tree inspection & cryptographic validation'}</span>
            </div>
          </div>
        `).join('') : `
          <div class="glass-card sowhat-card" style="border-left-color: var(--neon-green);">
            <div class="sowhat-pill" style="color: var(--neon-green);"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg> Flawless Diagnostic</div>
            <h4 class="sowhat-title">Zero Baseline Weaknesses Detected</h4>
            <div class="sowhat-body">You correctly identified every single deceptive attack vector and protocol spoofing attempt.</div>
            <div class="remediation-remedy">
              <strong><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg> Next Step:</strong> Advance to Tier 2 attack simulation mechanics.
            </div>
          </div>
        `}
      </div>

      <!-- JSON Weakness Schema Drawer -->
      <div class="json-schema-drawer">
        <div class="json-header-toggle" id="btn-toggle-json">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg></span>
            <span>STRUCTURED JSON WEAKNESS SCHEMA (Gemini AI Output)</span>
          </div>
          <span id="json-toggle-icon">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </span>
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
      toggleIcon.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>';
    } else {
      jsonBlock.style.display = 'none';
      toggleIcon.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>';
    }
  });
}

function escapeHTML(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
