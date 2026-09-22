/**
 * Step 6: "Steam-Style" Social & Peer Learning Ecosystem
 * Live presence stream, 1v1 Scenario Duels, Squad Leaderboards,
 * Shared Notes repository, and Google Meet study room generator.
 */

import { store } from '../state/store.js';
import { soundFX } from '../services/soundEffects.js';

export function renderSocialDashboard(container) {
  const state = store.getState();
  const isHinglish = state.language === 'hinglish';
  const duelState = state.duel;

  container.innerHTML = `
    <div class="social-dashboard-view">
      <!-- Section Header -->
      <div class="section-header" style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
        <div>
          <div class="section-eyebrow">
            <span>// PHASE 06</span>
            <span>•</span>
            <span>${isHinglish ? 'STEAM-STYLE SOCIAL HUB' : 'PEER COLLABORATION ECOSYSTEM'}</span>
          </div>
          <h1 class="section-title">
            ${isHinglish ? 'Squad Leaderboards & 1v1 Duel Arena' : 'Squad Leaderboards & 1v1 Scenario Arena'}
          </h1>
          <p class="section-desc">
            ${isHinglish 
              ? 'Social proof aur healthy competition se learning speed 3x ho jaati hai. Apne squad ke saath compete karein.'
              : 'Learning amplified by social presence, collaborative squad notes, and 1v1 timed scenario battles.'}
          </p>
        </div>

        <button id="btn-back-to-domains" class="btn btn-ghost btn-sm">
          ← ${isHinglish ? 'Domain Selector' : 'Domain Selector'}
        </button>
      </div>

      <!-- Main Social 2-Column Grid -->
      <div class="social-layout-grid">
        <!-- Left Column: 1v1 Scenario Duel Arena -->
        <div class="glass-card duel-card">
          <div class="duel-header">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span style="font-size: 1.4rem;">⚔️</span>
              <h3 style="font-size: 1.25rem; color: #fff;">
                ${isHinglish ? '1v1 Scenario Duel Arena' : '1v1 Scenario Duel Arena'}
              </h3>
            </div>
            <span class="duel-badge">LIVE MATCHMAKING</span>
          </div>

          <p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 1.25rem;">
            ${isHinglish 
              ? '60-second timed showdown! Scenario ko sabse pehle accurately mitigate karo aur opponent ki shield drop karo.'
              : 'Timed scenario showdown! Diagnose the attack vector under pressure to drain your opponent\'s shield.'}
          </p>

          <!-- Fighters Ring -->
          <div class="duel-fighters">
            <!-- Player -->
            <div class="fighter-avatar">
              <div class="fighter-ring">🛡️</div>
              <div style="font-weight: 700; font-size: 0.9rem; color: #fff;">${state.user.name}</div>
              <div style="font-size: 0.72rem; color: var(--neon-cyan); font-family: var(--font-mono);">
                HP: ${duelState.playerHealth}%
              </div>
              <div class="health-bar-wrap">
                <div class="health-bar-fill" style="width: ${duelState.playerHealth}%;"></div>
              </div>
            </div>

            <!-- VS Badge -->
            <div class="vs-badge">VS</div>

            <!-- AI / Peer Opponent -->
            <div class="fighter-avatar">
              <div class="fighter-ring bot">👾</div>
              <div style="font-weight: 700; font-size: 0.9rem; color: #fff;">ZeroDay_Bot</div>
              <div style="font-size: 0.72rem; color: var(--neon-crimson); font-family: var(--font-mono);">
                HP: ${duelState.botHealth}%
              </div>
              <div class="health-bar-wrap">
                <div class="health-bar-fill" style="width: ${duelState.botHealth}%; background: var(--neon-crimson);"></div>
              </div>
            </div>
          </div>

          <!-- Active Duel Scenario Box -->
          <div style="background: rgba(0,0,0,0.4); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1.25rem; margin-bottom: 1.25rem;">
            <div style="font-size: 0.75rem; font-family: var(--font-mono); color: var(--neon-amber); margin-bottom: 0.3rem;">
              ⚡ SPEED ROUND #0${duelState.round} // TIME: ${duelState.timer}s
            </div>
            <div style="font-weight: 600; font-size: 0.95rem; color: #fff; margin-bottom: 0.75rem;">
              "Attacker sent an email with from: ceo@bank.com. SPF failed, DMARC p=none. What happens?"
            </div>

            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
              <button class="btn btn-ghost btn-sm duel-attack-btn" data-correct="false" style="text-align: left; justify-content: flex-start;">
                A) Email is automatically bounced by the router.
              </button>
              <button class="btn btn-ghost btn-sm duel-attack-btn" data-correct="true" style="text-align: left; justify-content: flex-start;">
                B) Email lands directly in victim inbox (p=none offers zero block).
              </button>
              <button class="btn btn-ghost btn-sm duel-attack-btn" data-correct="false" style="text-align: left; justify-content: flex-start;">
                C) SPF converts DMARC to p=reject dynamically.
              </button>
            </div>
          </div>

          <!-- Duel Result / Action -->
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span style="font-family: var(--font-mono); font-size: 0.82rem; color: var(--text-muted);">
              Score: ${duelState.playerScore} PTS
            </span>
            <button id="btn-reset-duel" class="btn btn-crimson btn-sm">
              <span>🔥 ${isHinglish ? 'New Duel Round' : 'New Duel Round'}</span>
            </button>
          </div>
        </div>

        <!-- Right Column: Squad Leaderboard & Google Meet Study Room -->
        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
          <!-- Google Meet Instant Squad Call -->
          <div class="glass-card" style="padding: 1.25rem; border-color: rgba(0, 245, 212, 0.3); background: linear-gradient(135deg, rgba(0, 245, 212, 0.08), rgba(13, 19, 34, 0.9));">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <span style="font-size: 1.5rem;">📹</span>
                <div>
                  <div style="font-weight: 700; font-size: 0.95rem; color: #fff;">
                    ${isHinglish ? 'Drop-in Google Meet Study Room' : 'Drop-in Google Meet Study Room'}
                  </div>
                  <div style="font-size: 0.78rem; color: var(--text-secondary);">
                    ${isHinglish ? 'Squad ke saath screen share karke complex CVEs debug karo' : 'Instant 1-click room link for live squad incident triage'}
                  </div>
                </div>
              </div>
              <a href="https://meet.google.com/new" target="_blank" rel="noopener noreferrer" class="btn btn-cyan btn-sm" id="btn-create-meet">
                <span>Join Meet</span>
              </a>
            </div>
          </div>

          <!-- Squad Leaderboard Table -->
          <div class="glass-card" style="padding: 1.5rem;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
              <h3 style="font-size: 1.1rem; color: #fff;">
                🏆 ${isHinglish ? 'Weekly Squad Leaderboard' : 'Weekly Squad Leaderboard'}
              </h3>
              <span style="font-size: 0.75rem; font-family: var(--font-mono); color: var(--neon-cyan);">
                SQUAD: ${state.user.squad}
              </span>
            </div>

            <table class="leaderboard-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Agent</th>
                  <th>Tier</th>
                  <th>Weekly XP</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="rank-pill">#01</td>
                  <td style="color: #fff; font-weight: 600;">Arjun_S</td>
                  <td><span class="tier-badge tier-2">Tier 2</span></td>
                  <td style="color: var(--neon-cyan); font-family: var(--font-mono);">1,420 XP</td>
                </tr>
                <tr style="background: rgba(0, 245, 212, 0.08);">
                  <td class="rank-pill">#02</td>
                  <td style="color: var(--neon-cyan); font-weight: 700;">${state.user.name} (You)</td>
                  <td><span class="tier-badge tier-${state.currentTier}">Tier ${state.currentTier}</span></td>
                  <td style="color: var(--neon-cyan); font-family: var(--font-mono); font-weight: 700;">${state.user.xp} XP</td>
                </tr>
                <tr>
                  <td class="rank-pill">#03</td>
                  <td style="color: #fff; font-weight: 600;">Priya_K</td>
                  <td><span class="tier-badge tier-2">Tier 2</span></td>
                  <td style="color: var(--neon-cyan); font-family: var(--font-mono);">980 XP</td>
                </tr>
                <tr>
                  <td class="rank-pill">#04</td>
                  <td style="color: #fff; font-weight: 600;">Vikram_R</td>
                  <td><span class="tier-badge tier-1">Tier 1</span></td>
                  <td style="color: var(--neon-cyan); font-family: var(--font-mono);">760 XP</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Squad Notes Repository -->
      <div class="glass-card" style="padding: 1.75rem; margin-bottom: 2rem;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.75rem;">
          <div>
            <h3 style="font-size: 1.25rem; color: #fff;">
              📚 ${isHinglish ? 'Squad Notes Repository' : 'Squad Collaborative Notes Repository'}
            </h3>
            <p style="font-size: 0.85rem; color: var(--text-secondary);">
              ${isHinglish ? 'Apne squad ke dosto ke saath verified exam tips share karein.' : 'Crowdsourced micro-cheat sheets and exam tips from active squad peers.'}
            </p>
          </div>

          <button id="btn-post-note" class="btn btn-outline-cyan btn-sm">
            <span>+ ${isHinglish ? 'Tip Post Karein (+50 XP)' : 'Post Tip (+50 XP)'}</span>
          </button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1rem;">
          ${state.squadNotes.map(n => `
            <div style="background: rgba(0,0,0,0.3); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1.2rem;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
                <span style="font-size: 0.75rem; font-family: var(--font-mono); color: var(--neon-cyan);">
                  👤 ${n.author} // ${n.timestamp}
                </span>
                <button class="btn btn-ghost btn-sm upvote-btn" data-note-id="${n.id}" style="padding: 0.2rem 0.5rem; font-size: 0.75rem;">
                  ▲ ${n.upvotes}
                </button>
              </div>

              <h4 style="font-size: 0.95rem; color: #fff; margin-bottom: 0.35rem;">${n.topic}</h4>
              <p style="font-size: 0.85rem; color: #cbd5e1; line-height: 1.45;">
                ${isHinglish ? n.contentHinglish : n.content}
              </p>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  // Attach Event Handlers
  container.querySelector('#btn-back-to-domains')?.addEventListener('click', () => {
    store.setView('topic-selector');
  });

  // Duel attack button handler
  container.querySelectorAll('.duel-attack-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const isCorrect = btn.getAttribute('data-correct') === 'true';
      if (isCorrect) {
        soundFX.playHit();
        duelState.botHealth = Math.max(0, duelState.botHealth - 35);
        duelState.playerScore += 50;
        store.addXP(30);
        btn.style.borderColor = 'var(--neon-green)';
        btn.style.background = 'rgba(16, 185, 129, 0.2)';
        if (duelState.botHealth === 0) {
          soundFX.playFanfare();
          store.broadcastPresence(`🏆 ${state.user.name} defeated ZeroDay_Bot in a 1v1 Scenario Duel!`, 'duel');
        }
      } else {
        soundFX.playAlert();
        duelState.playerHealth = Math.max(0, duelState.playerHealth - 25);
        btn.style.borderColor = 'var(--neon-crimson)';
      }
      store.notify();
    });
  });

  container.querySelector('#btn-reset-duel')?.addEventListener('click', () => {
    duelState.botHealth = 100;
    duelState.playerHealth = 100;
    duelState.round++;
    soundFX.playClick();
    store.notify();
  });

  container.querySelectorAll('.upvote-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const noteId = btn.getAttribute('data-note-id');
      store.upvoteSquadNote(noteId);
    });
  });

  container.querySelector('#btn-post-note')?.addEventListener('click', () => {
    const topic = prompt('Enter Tip Title (e.g. Always check apex domain):');
    if (topic) {
      const content = prompt('Enter Tip Details:');
      if (content) {
        store.addSquadNote({ topic, content });
      }
    }
  });
}
