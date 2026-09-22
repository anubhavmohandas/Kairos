/**
 * Step 4: The Learning Lab Component (Neo-Brutalist Control Edition)
 * Grounded YouTube video tutorials with Custom Neo-Brutalist Video Controls,
 * pre-flight cheat sheets, timecoded AI micro-notes with 1-click seeking,
 * Anti-Zombie active reflection checkpoints, and PDF/notes ingestion.
 * Zero emojis — 100% bespoke SVG vector icons.
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

  // Helper: Convert "MM:SS" string to total seconds
  function parseTimeToSeconds(timeStr) {
    if (!timeStr) return 0;
    const parts = timeStr.split(':').map(Number);
    if (parts.length === 2) {
      return (parts[0] * 60) + parts[1];
    }
    return 0;
  }

  // Helper: Format seconds to "MM:SS"
  function formatSecondsToTime(sec) {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  const totalDurationSeconds = parseTimeToSeconds(videoData.duration) || 600;

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
          <h1 class="section-title" style="font-size: 1.85rem;">
            ${videoData.title}
          </h1>
          <p class="section-desc">
            ${isHinglish 
              ? `Aapke diagnosed gap: "${activeTopic}" par strictly mapped high-yield masterclass.`
              : `Strictly mapped to your diagnosed micro-weakness: "${activeTopic}".`}
          </p>
        </div>

        <div style="display: flex; gap: 0.75rem; align-items: center;">
          <button id="btn-lab-back" class="btn btn-ghost btn-sm">
            ← ${isHinglish ? 'Skill Gaps' : 'Skill Gaps'}
          </button>
          <button id="btn-lab-to-mastery" class="btn btn-cyan btn-sm">
            <span>${isHinglish ? 'Mastery Arena Test' : 'Enter Mastery Arena'}</span>
            <span>→</span>
          </button>
        </div>
      </div>

      <!-- Main Learning Lab 2-Column Grid -->
      <div class="learning-lab-layout">
        
        <!-- Left Column: Video & Custom Controls -->
        <div class="video-section">
          
          <!-- Unified Neo-Brutalist Video Player Console Deck -->
          <div class="neo-video-deck">
            
            <!-- Video Screen Display -->
            <div class="video-frame-screen">
              <iframe 
                id="yt-lab-iframe"
                src="https://www.youtube.com/embed/${videoData.videoId}?enablejsapi=1&rel=0&modestbranding=1" 
                title="${videoData.title}" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowfullscreen>
              </iframe>
            </div>

            <!-- Custom Neo-Brutalist Video Controller HUD (Attached seamlessly to video deck) -->
            <div class="neo-video-controls-hud">
            
            <!-- Scrubber Track & Time -->
            <div class="video-scrubber-row">
              <span class="scrubber-timestamp" id="video-current-time-label">00:00</span>
              <div class="video-scrubber-bar" id="video-scrubber-track">
                <div class="video-scrubber-progress" id="video-scrubber-progress" style="width: 0%;"></div>
                <div class="video-scrubber-head" id="video-scrubber-head" style="left: 0%;"></div>
              </div>
              <span class="scrubber-timestamp" id="video-total-time-label">${videoData.duration || '10:00'}</span>
            </div>

            <!-- Controller Buttons Bar -->
            <div class="video-buttons-bar">
              
              <!-- Left Action Group: Play/Pause, -10s, +10s, Restart -->
              <div class="ctrl-group-left">
                <!-- Play / Pause Toggle Button -->
                <button class="neo-ctrl-btn btn-play-main" id="ctrl-btn-play-pause" title="Play / Pause Video">
                  <span id="ctrl-play-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#111827" stroke="#111827" stroke-width="2">
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                  </span>
                  <span id="ctrl-pause-icon" style="display: none;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#111827" stroke="#111827" stroke-width="2">
                      <rect x="6" y="4" width="4" height="16"></rect>
                      <rect x="14" y="4" width="4" height="16"></rect>
                    </svg>
                  </span>
                  <span id="ctrl-play-text" style="font-size: 0.85rem; font-weight: 800;">Play</span>
                </button>

                <!-- Rewind 10 Seconds -->
                <button class="neo-ctrl-btn" id="ctrl-btn-rewind" title="Rewind 10s">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="1 4 1 10 7 10"></polyline>
                    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
                  </svg>
                  <span style="font-size: 0.76rem; font-family: var(--font-mono);">-10s</span>
                </button>

                <!-- Fast Forward 10 Seconds -->
                <button class="neo-ctrl-btn" id="ctrl-btn-forward" title="Forward 10s">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="23 4 23 10 17 10"></polyline>
                    <path d="M20.49 15a9 9 0 1 1-2.13-9.36L23 10"></path>
                  </svg>
                  <span style="font-size: 0.76rem; font-family: var(--font-mono);">+10s</span>
                </button>

                <!-- Replay from Start -->
                <button class="neo-ctrl-btn" id="ctrl-btn-replay" title="Restart from 00:00">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M2.5 2v6h6M21.5 22v-6h-6"/>
                    <path d="M22 11.5A10 10 0 0 0 3.2 7.2M2 12.5a10 10 0 0 0 18.8 4.2"/>
                  </svg>
                  <span style="font-size: 0.76rem;">Restart</span>
                </button>
              </div>

              <!-- Center Channel Pill -->
              <div class="ctrl-channel-pill" title="Masterclass Instructor">
                <span class="live-dot-pulse"></span>
                <span>${videoData.channel || 'Cyber Instructor'}</span>
              </div>

              <!-- Right Action Group: Speeds, Mute & External Link -->
              <div class="ctrl-group-right">
                
                <!-- Playback Speed Pills -->
                <div class="speed-capsule-group">
                  <button class="speed-pill-btn active" data-speed="1">1x</button>
                  <button class="speed-pill-btn" data-speed="1.25">1.25x</button>
                  <button class="speed-pill-btn" data-speed="1.5">1.5x</button>
                </div>

                <!-- Mute Toggle -->
                <button class="neo-ctrl-btn" id="ctrl-btn-mute" title="Toggle Sound Mute">
                  <span id="ctrl-sound-on-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                    </svg>
                  </span>
                  <span id="ctrl-sound-off-icon" style="display: none;">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                      <line x1="23" y1="9" x2="17" y2="15"></line>
                      <line x1="17" y1="9" x2="23" y2="15"></line>
                    </svg>
                  </span>
                </button>

                <!-- Direct YouTube Fallback Button -->
                <a href="https://www.youtube.com/watch?v=${videoData.videoId}" target="_blank" rel="noopener noreferrer" class="btn-yt-direct" title="Open directly in YouTube">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#e11d48"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                  <span>YouTube</span>
                </a>
              </div>

            </div>
          </div>
          </div>

          <!-- Pre-Flight Video Cheat-Sheet -->
          <div class="preflight-cheatsheet">
            <div class="cheatsheet-title">
              <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg></span>
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
              <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg> Anti-Zombie Active Reflection Checkpoint</span>
              <span style="margin-left: auto; font-size: 0.75rem; font-family: var(--font-mono); color: var(--text-primary);">
                ${isCheckpointPassed ? ' PASSED (+50 XP)' : 'PAUSED FOR RECALL'}
              </span>
            </div>
            <p class="checkpoint-q">
              ${isHinglish
                ? 'Quick Check: In the URL "https://login.paypal.com.account-security.xyz/auth", who actually owns the hosting server?'
                : 'Active Recall: In the URL "https://login.paypal.com.account-security.xyz/auth", who is the true owner of the destination server?'}
            </p>

            ${isCheckpointPassed ? `
              <div style="background: rgba(16, 185, 129, 0.2); padding: 0.75rem 1rem; border-radius: var(--radius-sm); border: 1px solid var(--neon-green); color: var(--text-main); font-size: 0.9rem;">
                 <strong>${isHinglish ? 'Shaabash!' : 'Correct Recall!'}</strong> "account-security.xyz" is the apex domain right before the first slash. "login.paypal.com" is an attacker subdomain.
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
          <!-- AI Micro-Notes Card with 1-Click Timestamp Seeking -->
          <div class="glass-card notes-card">
            <div class="notes-header">
              <div style="font-weight: 700; font-size: 1.05rem; display: flex; align-items: center; gap: 0.5rem; color: var(--neon-cyan);">
                <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg></span>
                <span>${isHinglish ? 'AI Micro-Notes (Click karke jump karein)' : 'AI Micro-Notes (Click timestamp to seek)'}</span>
              </div>
            </div>

            <div class="micro-notes-content">
              ${videoData.microNotes.map(n => `
                <div class="note-bubble note-interactive-item" data-seek-time="${n.time}">
                  <span class="note-timestamp note-seek-btn" title="Click to jump video to ${n.time}">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="vertical-align: middle; margin-right: 4px;">
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>${n.time}
                  </span>
                  <div>${isHinglish && n.noteHinglish ? n.noteHinglish : n.note}</div>
                </div>
              `).join('')}
            </div>

            <button id="btn-open-tutor-from-lab" class="btn btn-outline-cyan" style="width: 100%; margin-top: 1.25rem;">
              <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="10" rx="2"></rect><circle cx="12" cy="5" r="2"></circle><path d="M12 7v4"></path><line x1="8" y1="16" x2="8" y2="16"></line><line x1="16" y1="16" x2="16" y2="16"></line></svg> ${isHinglish ? 'ELI5 Tutor se poochho' : 'Ask ELI5 Tutor (2-3 Lines)'}</span>
            </button>
          </div>

          <!-- Custom Reference / Syllabus Ingestion Dropzone -->
          <div class="glass-card notes-card">
            <div style="font-weight: 700; font-size: 0.95rem; margin-bottom: 0.4rem; color: var(--text-main);">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg> ${isHinglish ? 'Custom Notes / PDF Syllabus Upload' : 'Custom Syllabus & Notes Ingestion'}
            </div>
            <p style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 1rem;">
              ${isHinglish
                ? 'Apne college ya company ke specific notes upload karein taaki AI unhi ke hisaab se teach kare.'
                : 'Upload your organization notes or textbook excerpt to ground the AI strictly to your curriculum.'}
            </p>

            <div class="pdf-upload-box" id="pdf-drop-zone">
              <div class="pdf-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg></div>
              <div style="font-size: 0.88rem; font-weight: 600; color: var(--text-main);">
                ${labState.customSyllabus ? ' ' + labState.customSyllabus.title : (isHinglish ? 'PDF / Text File Drop Karein' : 'Drop PDF / TXT Notes Here')}
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

  // --- Programmatic Video Controller Logic ---
  const iframe = container.querySelector('#yt-lab-iframe');
  let isPlaying = false;
  let isMuted = false;
  let currentElapsed = 0;
  let currentSpeed = 1;
  let tickerInterval = null;

  function postToPlayer(command, args = []) {
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(JSON.stringify({
        event: 'command',
        func: command,
        args: args
      }), '*');
    }
  }

  function updateScrubberUI() {
    const pct = Math.min(100, Math.max(0, (currentElapsed / totalDurationSeconds) * 100));
    const prog = container.querySelector('#video-scrubber-progress');
    const head = container.querySelector('#video-scrubber-head');
    const label = container.querySelector('#video-current-time-label');

    if (prog) prog.style.width = `${pct}%`;
    if (head) head.style.left = `${pct}%`;
    if (label) label.textContent = formatSecondsToTime(currentElapsed);
  }

  function startProgressTicker() {
    if (tickerInterval) clearInterval(tickerInterval);
    tickerInterval = setInterval(() => {
      if (isPlaying && currentElapsed < totalDurationSeconds) {
        currentElapsed += currentSpeed;
        updateScrubberUI();
      }
    }, 1000);
  }

  function stopProgressTicker() {
    if (tickerInterval) {
      clearInterval(tickerInterval);
      tickerInterval = null;
    }
  }

  // Play / Pause Button
  const btnPlayPause = container.querySelector('#ctrl-btn-play-pause');
  btnPlayPause?.addEventListener('click', () => {
    soundFX.playClick();
    isPlaying = !isPlaying;
    const playIcon = container.querySelector('#ctrl-play-icon');
    const pauseIcon = container.querySelector('#ctrl-pause-icon');
    const playText = container.querySelector('#ctrl-play-text');

    if (isPlaying) {
      postToPlayer('playVideo');
      if (playIcon) playIcon.style.display = 'none';
      if (pauseIcon) pauseIcon.style.display = 'inline-block';
      if (playText) playText.textContent = 'Pause';
      btnPlayPause.style.background = 'var(--color-yellow)';
      startProgressTicker();
    } else {
      postToPlayer('pauseVideo');
      if (playIcon) playIcon.style.display = 'inline-block';
      if (pauseIcon) pauseIcon.style.display = 'none';
      if (playText) playText.textContent = 'Play';
      btnPlayPause.style.background = 'var(--color-green)';
      stopProgressTicker();
    }
  });

  // Rewind 10s
  container.querySelector('#ctrl-btn-rewind')?.addEventListener('click', () => {
    soundFX.playClick();
    currentElapsed = Math.max(0, currentElapsed - 10);
    postToPlayer('seekTo', [currentElapsed, true]);
    updateScrubberUI();
  });

  // Forward 10s
  container.querySelector('#ctrl-btn-forward')?.addEventListener('click', () => {
    soundFX.playClick();
    currentElapsed = Math.min(totalDurationSeconds, currentElapsed + 10);
    postToPlayer('seekTo', [currentElapsed, true]);
    updateScrubberUI();
  });

  // Restart
  container.querySelector('#ctrl-btn-replay')?.addEventListener('click', () => {
    soundFX.playClick();
    currentElapsed = 0;
    postToPlayer('seekTo', [0, true]);
    postToPlayer('playVideo');
    isPlaying = true;
    const playIcon = container.querySelector('#ctrl-play-icon');
    const pauseIcon = container.querySelector('#ctrl-pause-icon');
    const playText = container.querySelector('#ctrl-play-text');
    if (playIcon) playIcon.style.display = 'none';
    if (pauseIcon) pauseIcon.style.display = 'inline-block';
    if (playText) playText.textContent = 'Pause';
    if (btnPlayPause) btnPlayPause.style.background = 'var(--color-yellow)';
    updateScrubberUI();
    startProgressTicker();
  });

  // Speed Selector
  container.querySelectorAll('.speed-pill-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      soundFX.playClick();
      container.querySelectorAll('.speed-pill-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentSpeed = parseFloat(btn.getAttribute('data-speed')) || 1;
      postToPlayer('setPlaybackRate', [currentSpeed]);
    });
  });

  // Mute / Unmute
  container.querySelector('#ctrl-btn-mute')?.addEventListener('click', () => {
    soundFX.playClick();
    isMuted = !isMuted;
    const onIcon = container.querySelector('#ctrl-sound-on-icon');
    const offIcon = container.querySelector('#ctrl-sound-off-icon');

    if (isMuted) {
      postToPlayer('mute');
      if (onIcon) onIcon.style.display = 'none';
      if (offIcon) offIcon.style.display = 'inline-block';
    } else {
      postToPlayer('unMute');
      if (onIcon) onIcon.style.display = 'inline-block';
      if (offIcon) offIcon.style.display = 'none';
    }
  });

  // Clickable Scrubber
  const scrubberTrack = container.querySelector('#video-scrubber-track');
  scrubberTrack?.addEventListener('click', (e) => {
    const rect = scrubberTrack.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, clickX / rect.width));
    currentElapsed = Math.floor(pct * totalDurationSeconds);
    postToPlayer('seekTo', [currentElapsed, true]);
    updateScrubberUI();
    soundFX.playClick();
  });

  // Interactive AI Micro-Notes seeking
  container.querySelectorAll('.note-interactive-item').forEach(item => {
    item.addEventListener('click', () => {
      const timeStr = item.getAttribute('data-seek-time');
      const targetSec = parseTimeToSeconds(timeStr);
      soundFX.playClick();
      currentElapsed = targetSec;
      postToPlayer('seekTo', [targetSec, true]);
      postToPlayer('playVideo');
      isPlaying = true;
      const playIcon = container.querySelector('#ctrl-play-icon');
      const pauseIcon = container.querySelector('#ctrl-pause-icon');
      const playText = container.querySelector('#ctrl-play-text');
      if (playIcon) playIcon.style.display = 'none';
      if (pauseIcon) pauseIcon.style.display = 'inline-block';
      if (playText) playText.textContent = 'Pause';
      if (btnPlayPause) btnPlayPause.style.background = 'var(--color-yellow)';
      updateScrubberUI();
      startProgressTicker();

      // Highlight active note
      container.querySelectorAll('.note-interactive-item').forEach(n => n.classList.remove('active-note-jump'));
      item.classList.add('active-note-jump');
    });
  });

  // Navigation handlers
  container.querySelector('#btn-lab-back')?.addEventListener('click', () => {
    stopProgressTicker();
    store.setView('skill-gap');
  });

  container.querySelector('#btn-lab-to-mastery')?.addEventListener('click', () => {
    stopProgressTicker();
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
