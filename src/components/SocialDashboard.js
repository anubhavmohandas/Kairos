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
              <span style="font-size: 1.4rem;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"></polyline><line x1="13" y1="19" x2="19" y2="13"></line></svg></span>
              <h3 style="font-size: 1.25rem; color: var(--text-main);">
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
              <div class="fighter-ring"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>
              <div style="font-weight: 700; font-size: 0.9rem; color: var(--text-main);">${state.user.name}</div>
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
              <div class="fighter-ring bot"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 12h.01M18 12h.01M9 16h6M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><rect x="4" y="8" width="16" height="12" rx="2"></rect></svg></div>
              <div style="font-weight: 700; font-size: 0.9rem; color: var(--text-main);">ZeroDay_Bot</div>
              <div style="font-size: 0.72rem; color: var(--neon-crimson); font-family: var(--font-mono);">
                HP: ${duelState.botHealth}%
              </div>
              <div class="health-bar-wrap">
                <div class="health-bar-fill" style="width: ${duelState.botHealth}%; background: var(--neon-crimson);"></div>
              </div>
            </div>
          </div>

          <!-- Active Duel Scenario Box -->
          <div style="background: var(--bg-card-alt); border: var(--border-mid); border-radius: var(--radius-md); padding: 1.25rem; margin-bottom: 1.25rem;">
            <div style="font-size: 0.75rem; font-family: var(--font-mono); color: var(--neon-amber); margin-bottom: 0.3rem;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg> SPEED ROUND #0${duelState.round} // TIME: ${duelState.timer}s
            </div>
            <div style="font-weight: 600; font-size: 0.95rem; color: var(--text-main); margin-bottom: 0.75rem;">
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
              <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg> ${isHinglish ? 'New Duel Round' : 'New Duel Round'}</span>
            </button>
          </div>
        </div>

        <!-- Right Column: Squad Leaderboard & Google Meet Study Room -->
        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
          <!-- Google Meet Instant Squad Call -->
          <div class="glass-card" style="padding: 1.25rem; border-color: rgba(0, 245, 212, 0.3); background: linear-gradient(135deg, rgba(0, 245, 212, 0.08), rgba(13, 19, 34, 0.9));">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <span style="font-size: 1.5rem;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg></span>
                <div>
                  <div style="font-weight: 700; font-size: 0.95rem; color: var(--text-main);">
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
              <h3 style="font-size: 1.1rem; color: var(--text-main);">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2"></path><path d="M18 9h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.45 1-1 1H7v4h10v-4h-2c-.55 0-1-.45-1-1v-2.34"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"></path></svg> ${isHinglish ? 'Weekly Squad Leaderboard' : 'Weekly Squad Leaderboard'}
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
                  <td style="color: var(--text-main); font-weight: 600;">Arjun_S</td>
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
                  <td style="color: var(--text-main); font-weight: 600;">Priya_K</td>
                  <td><span class="tier-badge tier-2">Tier 2</span></td>
                  <td style="color: var(--neon-cyan); font-family: var(--font-mono);">980 XP</td>
                </tr>
                <tr>
                  <td class="rank-pill">#04</td>
                  <td style="color: var(--text-main); font-weight: 600;">Vikram_R</td>
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
            <h3 style="font-size: 1.25rem; color: var(--text-main);">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg> ${isHinglish ? 'Squad Notes Repository' : 'Squad Collaborative Notes Repository'}
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
            <div style="background: var(--bg-card-alt); border: var(--border-thin); border-radius: var(--radius-md); padding: 1.2rem;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
                <span style="font-size: 0.75rem; font-family: var(--font-mono); color: var(--neon-cyan);">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> ${n.author} // ${n.timestamp}
                </span>
                <button class="btn btn-ghost btn-sm upvote-btn" data-note-id="${n.id}" style="padding: 0.2rem 0.5rem; font-size: 0.75rem; display: inline-flex; align-items: center; gap: 4px;">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"></polyline></svg> <span>${n.upvotes}</span>
                </button>
              </div>

              <h4 style="font-size: 0.95rem; color: var(--text-main); margin-bottom: 0.35rem;">${n.topic}</h4>
              <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.45;">
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
          store.broadcastPresence(`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2"></path><path d="M18 9h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.45 1-1 1H7v4h10v-4h-2c-.55 0-1-.45-1-1v-2.34"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"></path></svg> ${state.user.name} defeated ZeroDay_Bot in a 1v1 Scenario Duel!`, 'duel');
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
