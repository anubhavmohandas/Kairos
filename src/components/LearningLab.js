/**
 * Step 4: The Learning Lab Component
 * Grounded YouTube video tutorials, pre-flight cheat sheets,
 * AI micro-notes, Anti-Zombie active reflection checkpoints, and PDF/notes ingestion.
 */

import { store } from '../state/store.js';
import { youtube } from '../services/youtubeService.js';
import { soundFX } from '../services/soundEffects.js';

export function renderLearningLab(container) {
  const state = store.getState();
  const isHinglish = state.language === 'hinglish';
  const labState = state.learningLab;
  const activeTopic = labState.activeMicroTopic || 'Subdomain Hierarchy & Lookalike Spoofing';
  const videoData = youtube.getVideoForTopic(activeTopic);
  const isCheckpointPassed = labState.checkpointPassed;

  container.innerHTML = `
    <div class="learning-lab-view">
      <!-- Section Header -->
      <div class="section-header" style="display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
        <div>
          <div class="section-eyebrow">
            <span>// PHASE 04</span>
            <span>•</span>
            <span>${isHinglish ? 'THE LEARNING LAB' : 'SURGICAL LEARNING LAB'}</span>
          </div>
          <h1 class="section-title" style="font-size: 1.9rem;">
            ${videoData.title}
          </h1>
          <p class="section-desc">
            ${isHinglish 
              ? `Aapke diagnosed gap: "${activeTopic}" par strictly mapped high-yield masterclass.`
              : `Strictly mapped to your diagnosed micro-weakness: "${activeTopic}".`}
          </p>
        </div>

        <div style="display: flex; gap: 0.75rem;">
          <button id="btn-lab-back" class="btn btn-ghost btn-sm">
            ← ${isHinglish ? 'Skill Gaps' : 'Skill Gaps'}
          </button>
          <button id="btn-lab-to-mastery" class="btn btn-cyan btn-sm">
            <span>${isHinglish ? 'Mastery Arena Test Dein' : 'Enter Mastery Arena'}</span>
            <span>→</span>
          </button>
        </div>
      </div>

      <!-- Main Learning Lab 2-Column Grid -->
      <div class="learning-lab-layout">
        <!-- Left Column: Video & Anti-Zombie Checkpoints -->
        <div class="video-section">
          <!-- Video Frame -->
          <div class="video-frame-wrap">
            <iframe 
              src="https://www.youtube-nocookie.com/embed/${videoData.videoId}?rel=0&modestbranding=1" 
              title="${videoData.title}" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowfullscreen>
            </iframe>
          </div>

          <!-- Pre-Flight Video Cheat-Sheet -->
          <div class="preflight-cheatsheet">
            <div class="cheatsheet-title">
              <span>🎯</span>
              <span>${isHinglish ? 'Pre-Flight Cheat-Sheet (Video se pehle ye 3 cheezein dekho)' : 'Pre-Flight Video Cheat-Sheet (3 Key Takeaways)'}</span>
            </div>
            <ul class="takeaways-list">
              ${(isHinglish && videoData.cheatSheetHinglish ? videoData.cheatSheetHinglish : videoData.cheatSheet).map((item, idx) => `
                <li class="takeaway-item">
                  <span class="takeaway-num">${idx + 1}</span>
                  <span>${item}</span>
                </li>
              `).join('')}
            </ul>
          </div>

          <!-- Anti-Zombie Active Reflection Checkpoint -->
          <div class="anti-zombie-checkpoint" id="checkpoint-box">
            <div class="checkpoint-header">
              <span>⚡ Anti-Zombie Active Reflection Checkpoint</span>
              <span style="margin-left: auto; font-size: 0.75rem; font-family: var(--font-mono); color: var(--text-primary);">
                ${isCheckpointPassed ? '✓ PASSED (+50 XP)' : 'PAUSED FOR RECALL'}
              </span>
            </div>
            <p class="checkpoint-q">
              ${isHinglish
                ? 'Quick Check: In the URL "https://login.paypal.com.account-security.xyz/auth", who actually owns the hosting server?'
                : 'Active Recall: In the URL "https://login.paypal.com.account-security.xyz/auth", who is the true owner of the destination server?'}
            </p>

            ${isCheckpointPassed ? `
              <div style="background: rgba(16, 185, 129, 0.2); padding: 0.75rem 1rem; border-radius: var(--radius-sm); border: 1px solid var(--neon-green); color: #fff; font-size: 0.9rem;">
                ✓ <strong>${isHinglish ? 'Shaabash!' : 'Correct Recall!'}</strong> "account-security.xyz" is the apex domain right before the first slash. "login.paypal.com" is an attacker subdomain.
              </div>
            ` : `
              <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; margin-top: 0.75rem;">
                <button class="btn btn-ghost btn-sm checkpoint-opt-btn" data-correct="false">
                  A) PayPal, Inc. (San Jose, CA)
                </button>
                <button class="btn btn-ghost btn-sm checkpoint-opt-btn" data-correct="true">
                  B) Attacker owning "account-security.xyz"
                </button>
                <button class="btn btn-ghost btn-sm checkpoint-opt-btn" data-correct="false">
                  C) Google Cloud Platform Root
                </button>
              </div>
            `}
          </div>
        </div>

        <!-- Right Column: Micro-Notes & Custom Syllabus Ingestion -->
        <div class="lab-sidebar-column">
          <!-- AI Micro-Notes Card -->
          <div class="glass-card notes-card">
            <div class="notes-header">
              <div style="font-weight: 700; font-size: 1.05rem; display: flex; align-items: center; gap: 0.5rem; color: var(--neon-cyan);">
                <span>📝</span>
                <span>${isHinglish ? 'AI Micro-Notes (Video ke saath dekho)' : 'AI Micro-Notes (Synchronized)'}</span>
              </div>
            </div>

            <div class="micro-notes-content">
              ${videoData.microNotes.map(n => `
                <div class="note-bubble">
                  <span class="note-timestamp">⏱️ ${n.time}</span>
                  <div>${isHinglish && n.noteHinglish ? n.noteHinglish : n.note}</div>
                </div>
              `).join('')}
            </div>

            <button id="btn-open-tutor-from-lab" class="btn btn-outline-cyan" style="width: 100%; margin-top: 1.25rem;">
              <span>🤖 ${isHinglish ? 'ELI5 Tutor se poochho' : 'Ask ELI5 Tutor (2-3 Lines)'}</span>
            </button>
          </div>

          <!-- Custom Reference / Syllabus Ingestion Dropzone -->
          <div class="glass-card notes-card">
            <div style="font-weight: 700; font-size: 0.95rem; margin-bottom: 0.4rem; color: #fff;">
              📂 ${isHinglish ? 'Custom Notes / PDF Syllabus Upload' : 'Custom Syllabus & Notes Ingestion'}
            </div>
            <p style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 1rem;">
              ${isHinglish
                ? 'Apne college ya company ke specific notes upload karein taaki AI unhi ke hisaab se teach kare.'
                : 'Upload your organization notes or textbook excerpt to ground the AI strictly to your curriculum.'}
            </p>

            <div class="pdf-upload-box" id="pdf-drop-zone">
              <div class="pdf-icon">📄</div>
              <div style="font-size: 0.88rem; font-weight: 600; color: #fff;">
                ${labState.customSyllabus ? '✓ ' + labState.customSyllabus.title : (isHinglish ? 'PDF / Text File Drop Karein' : 'Drop PDF / TXT Notes Here')}
              </div>
              <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 0.2rem;">
                ${labState.customSyllabus ? `${labState.customSyllabus.sourceTextLength} chars ingested & grounded` : 'or click to browse local files'}
              </div>
              <input type="file" id="pdf-file-input" accept=".txt,.pdf,.md" style="display: none;" />
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Attach Event Handlers
  container.querySelector('#btn-lab-back')?.addEventListener('click', () => {
    store.setView('skill-gap');
  });

  container.querySelector('#btn-lab-to-mastery')?.addEventListener('click', () => {
    store.setView('mastery-arena');
  });

  container.querySelector('#btn-open-tutor-from-lab')?.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('kairos:open-tutor', {
      detail: { topic: activeTopic, context: videoData.title }
    }));
  });

  // Anti-Zombie button handlers
  container.querySelectorAll('.checkpoint-opt-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const isCorrect = btn.getAttribute('data-correct') === 'true';
      if (isCorrect) {
        soundFX.playSuccess();
        store.state.learningLab.checkpointPassed = true;
        store.addXP(50);
        store.notify();
      } else {
        soundFX.playAlert();
        btn.style.borderColor = 'var(--neon-crimson)';
        btn.style.background = 'rgba(255, 0, 84, 0.2)';
      }
    });
  });

  // Custom File Ingestion handlers
  const dropZone = container.querySelector('#pdf-drop-zone');
  const fileInput = container.querySelector('#pdf-file-input');

  dropZone?.addEventListener('click', () => fileInput?.click());

  fileInput?.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        const parsed = youtube.parseCustomSyllabus(text);
        store.state.learningLab.customSyllabus = parsed;
        soundFX.playSuccess();
        store.addXP(30);
        store.broadcastPresence(`${store.state.user.name} uploaded custom syllabus: ${file.name}`, 'note');
        store.notify();
      };
      reader.readAsText(file);
    }
  });
}
