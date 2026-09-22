/**
 * Auth & Operative Profile Modal Component
 * Real User Account Creation, Login, Call-Sign Customization, Squad Enlistment,
 * and Persistent Career Dossier Management.
 * 100% SVG Vector Icons — Zero Emojis.
 */

import { api } from '../services/apiClient.js';
import { store } from '../state/store.js';
import { soundFX } from '../services/soundEffects.js';

export function setupAuthModal(modalRoot) {
  let mode = 'login'; // 'login' | 'register' | 'profile'
  let errorMsg = '';
  let successMsg = '';

  function openModal(targetMode = 'login') {
    mode = targetMode;
    errorMsg = '';
    successMsg = '';
    render();
  }

  function closeModal() {
    modalRoot.classList.add('hidden');
    modalRoot.setAttribute('aria-hidden', 'true');
    modalRoot.innerHTML = '';
  }

  function render() {
    const state = store.getState();
    const isHinglish = state.language === 'hinglish';
    const user = state.user;
    const isProfile = mode === 'profile';
    const isRegister = mode === 'register';

    modalRoot.classList.remove('hidden');
    modalRoot.setAttribute('aria-hidden', 'false');

    modalRoot.innerHTML = `
      <div class="modal-card" style="max-width: 500px; max-height: 90vh; overflow-y: auto;">
        <!-- Clean SVG Close Button -->
        <button id="btn-auth-close" class="modal-close-btn" title="Close" aria-label="Close" style="display: flex; align-items: center; justify-content: center; cursor: pointer;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <!-- Header -->
        <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;">
          <div class="brand-icon-box" style="width: 36px; height: 36px; background: rgba(0, 245, 212, 0.1); border: 1.5px solid var(--neon-cyan); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
            ${isProfile ? `
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--neon-cyan)" stroke-width="2.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            ` : `
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--neon-cyan)" stroke-width="2.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            `}
          </div>
          <div>
            <h2 style="font-size: 1.35rem; color: var(--text-main); font-weight: 800; line-height: 1.2;">
              ${isProfile 
                ? (isHinglish ? 'Operative Profile & Squad Dossier' : 'Operative Profile & Squad Dossier') 
                : isRegister 
                  ? (isHinglish ? 'Naya Agent Account Banao' : 'Enlist New Operative') 
                  : (isHinglish ? 'Agent Terminal Login' : 'Operative Terminal Login')}
            </h2>
            <div style="font-size: 0.72rem; font-family: var(--font-mono); color: var(--neon-cyan); text-transform: uppercase;">
              ${isProfile ? '// SECURITY CLEARANCE & DOSSIER' : '// CRYPTOGRAPHIC SESSION GATEWAY'}
            </div>
          </div>
        </div>

        <p style="color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 1.2rem; line-height: 1.45;">
          ${isProfile 
            ? (isHinglish ? 'Apna call-sign badlein, squad change karein, aur live database stats dekhein.' : 'Customize your operative call-sign, switch squad affiliation, and review telemetry.')
            : isRegister 
              ? (isHinglish ? 'Apna cyber call-sign aur squad choose karein taaki rank aur XP database mein save ho.' : 'Create an operative account to persist XP, streak, and squad rank in the cloud database.')
              : (isHinglish ? 'Apne credentials daal kar terminal session authenticate karein.' : 'Authenticate your security session to access your personal dashboard.')}
        </p>

        <!-- Alerts -->
        ${errorMsg ? `
          <div style="background: rgba(255, 0, 84, 0.12); border: 1.5px solid var(--neon-crimson); padding: 0.65rem 0.85rem; border-radius: var(--radius-sm); color: var(--text-main); font-size: 0.82rem; margin-bottom: 1rem; display: flex; align-items: center; gap: 8px;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--neon-crimson)" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            <span>${errorMsg}</span>
          </div>
        ` : ''}

        ${successMsg ? `
          <div style="background: rgba(0, 245, 212, 0.12); border: 1.5px solid var(--neon-cyan); padding: 0.65rem 0.85rem; border-radius: var(--radius-sm); color: var(--text-main); font-size: 0.82rem; margin-bottom: 1rem; display: flex; align-items: center; gap: 8px;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--neon-cyan)" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span>${successMsg}</span>
          </div>
        ` : ''}

        ${isProfile ? `
          <!-- PROFILE EDIT MODE -->
          <form id="profile-form" style="display: flex; flex-direction: column; gap: 1rem;">
            <!-- Career Telemetry Stat Cards -->
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; margin-bottom: 0.5rem;">
              <div style="background: var(--bg-card-alt); border: 1.5px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 0.6rem; text-align: center;">
                <div style="font-size: 0.68rem; font-family: var(--font-mono); color: var(--text-secondary);">SECURITY LVL</div>
                <div style="font-size: 1.25rem; font-weight: 800; color: var(--neon-cyan); font-family: var(--font-mono);">${user.level || 1}</div>
              </div>
              <div style="background: var(--bg-card-alt); border: 1.5px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 0.6rem; text-align: center;">
                <div style="font-size: 0.68rem; font-family: var(--font-mono); color: var(--text-secondary);">TOTAL XP</div>
                <div style="font-size: 1.25rem; font-weight: 800; color: var(--neon-cyan); font-family: var(--font-mono);">${user.xp || 0}</div>
              </div>
              <div style="background: var(--bg-card-alt); border: 1.5px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 0.6rem; text-align: center;">
                <div style="font-size: 0.68rem; font-family: var(--font-mono); color: var(--text-secondary);">STREAK</div>
                <div style="font-size: 1.25rem; font-weight: 800; color: var(--neon-amber); font-family: var(--font-mono);">${user.streak || 1}d</div>
              </div>
            </div>

            <div>
              <label style="display: block; font-size: 0.75rem; font-family: var(--font-mono); color: var(--neon-cyan); margin-bottom: 0.35rem;">
                OPERATIVE CALL-SIGN:
              </label>
              <input 
                type="text" 
                id="profile-callsign" 
                required 
                value="${user.callSign || user.username || ''}"
                style="width: 100%; background: var(--bg-card-alt); border: 1.5px solid var(--border-mid); border-radius: var(--radius-sm); padding: 0.65rem 0.85rem; color: var(--text-main); font-family: var(--font-mono); font-size: 0.9rem;"
              />
            </div>

            <div>
              <label style="display: block; font-size: 0.75rem; font-family: var(--font-mono); color: var(--neon-cyan); margin-bottom: 0.35rem;">
                SQUAD AFFILIATION:
              </label>
              <select id="profile-squad" style="width: 100%; background: var(--bg-card-alt); border: 1.5px solid var(--border-mid); border-radius: var(--radius-sm); padding: 0.65rem 0.85rem; color: var(--text-main); font-family: var(--font-body); font-size: 0.9rem;">
                <option value="ZeroDay Hunters" ${user.squad === 'ZeroDay Hunters' ? 'selected' : ''}>ZeroDay Hunters (Offensive Triage)</option>
                <option value="RedTeam Alpha" ${user.squad === 'RedTeam Alpha' ? 'selected' : ''}>RedTeam Alpha (Adversary Emulation)</option>
                <option value="CyberSentinels" ${user.squad === 'CyberSentinels' ? 'selected' : ''}>CyberSentinels (Defensive Forensics)</option>
                <option value="CloudGuard" ${user.squad === 'CloudGuard' ? 'selected' : ''}>CloudGuard (Cloud & IAM Hardening)</option>
              </select>
            </div>

            <div>
              <label style="display: block; font-size: 0.75rem; font-family: var(--font-mono); color: var(--neon-cyan); margin-bottom: 0.35rem;">
                SPECIALIZATION TRACK:
              </label>
              <select id="profile-track" style="width: 100%; background: var(--bg-card-alt); border: 1.5px solid var(--border-mid); border-radius: var(--radius-sm); padding: 0.65rem 0.85rem; color: var(--text-main); font-family: var(--font-body); font-size: 0.9rem;">
                <option value="ad-kerberoasting" ${user.targetTrack === 'ad-kerberoasting' ? 'selected' : ''}>Active Directory Kerberoasting Defense</option>
                <option value="phishing-social-eng" ${user.targetTrack === 'phishing-social-eng' ? 'selected' : ''}>Phishing & Social Engineering</option>
                <option value="malware-defense" ${user.targetTrack === 'malware-defense' ? 'selected' : ''}>Malware Analysis & Endpoint Defense</option>
                <option value="network-exploitation" ${user.targetTrack === 'network-exploitation' ? 'selected' : ''}>Network Traffic Analysis & Wireshark</option>
                <option value="identity-token" ${user.targetTrack === 'identity-token' ? 'selected' : ''}>Identity & Session Token Security (JWT)</option>
                <option value="cloud-security" ${user.targetTrack === 'cloud-security' ? 'selected' : ''}>Cloud Infrastructure & IAM Security</option>
              </select>
            </div>

            <button type="submit" class="btn btn-cyan" style="width: 100%; margin-top: 0.5rem; justify-content: center; font-weight: 800;">
              <span>${isHinglish ? 'Profile Changes Save Karein' : 'Save Dossier Profile'}</span>
              <span>→</span>
            </button>
          </form>
        ` : `
          <!-- LOGIN / REGISTER MODE -->
          <form id="auth-form" style="display: flex; flex-direction: column; gap: 0.9rem;">
            <div>
              <label style="display: block; font-size: 0.75rem; font-family: var(--font-mono); color: var(--neon-cyan); margin-bottom: 0.3rem;">
                OPERATIVE USERNAME:
              </label>
              <input 
                type="text" 
                id="auth-username" 
                required 
                placeholder="e.g. Cipher_Knight" 
                style="width: 100%; background: var(--bg-card-alt); border: 1.5px solid var(--border-mid); border-radius: var(--radius-sm); padding: 0.65rem 0.85rem; color: var(--text-main); font-family: var(--font-body); font-size: 0.9rem;"
              />
            </div>

            ${isRegister ? `
              <div>
                <label style="display: block; font-size: 0.75rem; font-family: var(--font-mono); color: var(--neon-cyan); margin-bottom: 0.3rem;">
                  EMAIL ADDRESS:
                </label>
                <input 
                  type="email" 
                  id="auth-email" 
                  required 
                  placeholder="agent@cybercorp.org" 
                  style="width: 100%; background: var(--bg-card-alt); border: 1.5px solid var(--border-mid); border-radius: var(--radius-sm); padding: 0.65rem 0.85rem; color: var(--text-main); font-family: var(--font-body); font-size: 0.9rem;"
                />
              </div>

              <div>
                <label style="display: block; font-size: 0.75rem; font-family: var(--font-mono); color: var(--neon-cyan); margin-bottom: 0.3rem;">
                  SQUAD AFFILIATION:
                </label>
                <select id="auth-squad" style="width: 100%; background: var(--bg-card-alt); border: 1.5px solid var(--border-mid); border-radius: var(--radius-sm); padding: 0.65rem 0.85rem; color: var(--text-main); font-family: var(--font-body); font-size: 0.9rem;">
                  <option value="ZeroDay Hunters">ZeroDay Hunters (Offensive Triage)</option>
                  <option value="RedTeam Alpha">RedTeam Alpha (Adversary Emulation)</option>
                  <option value="CyberSentinels">CyberSentinels (Defensive Forensics)</option>
                  <option value="CloudGuard">CloudGuard (Cloud & IAM Hardening)</option>
                </select>
              </div>
            ` : ''}

            <div>
              <label style="display: block; font-size: 0.75rem; font-family: var(--font-mono); color: var(--neon-cyan); margin-bottom: 0.3rem;">
                PASSPHRASE:
              </label>
              <input 
                type="password" 
                id="auth-password" 
                required 
                placeholder="••••••••••••" 
                style="width: 100%; background: var(--bg-card-alt); border: 1.5px solid var(--border-mid); border-radius: var(--radius-sm); padding: 0.65rem 0.85rem; color: var(--text-main); font-family: var(--font-mono); font-size: 0.9rem;"
              />
            </div>

            <button type="submit" class="btn btn-cyan" style="width: 100%; margin-top: 0.5rem; justify-content: center; font-weight: 800;">
              <span>${isRegister ? (isHinglish ? 'Account Create Karein' : 'Enlist Operative') : (isHinglish ? 'Terminal Login Karein' : 'Authenticate Session')}</span>
              <span>→</span>
            </button>
          </form>

          <div style="text-align: center; margin-top: 1.15rem; font-size: 0.82rem; color: var(--text-secondary); border-top: 1px solid var(--border-subtle); padding-top: 0.85rem;">
            ${isRegister ? `
              <span>${isHinglish ? 'Pehle se account hai?' : 'Already have an operative account?'}</span>
              <a href="#" id="btn-switch-login" style="color: var(--neon-cyan); font-weight: 700; margin-left: 0.3rem; text-decoration: none;">
                ${isHinglish ? 'Login karein' : 'Login here'}
              </a>
            ` : `
              <span>${isHinglish ? 'Naya account banana hai?' : "Don't have an operative account?"}</span>
              <a href="#" id="btn-switch-register" style="color: var(--neon-cyan); font-weight: 700; margin-left: 0.3rem; text-decoration: none;">
                ${isHinglish ? 'Enlist / Sign up' : 'Enlist / Sign up'}
              </a>
            `}
          </div>
        `}
      </div>
    `;

    // Attach Event Handlers
    modalRoot.querySelector('#btn-auth-close')?.addEventListener('click', closeModal);

    modalRoot.querySelector('#btn-switch-login')?.addEventListener('click', (e) => {
      e.preventDefault();
      openModal('login');
    });

    modalRoot.querySelector('#btn-switch-register')?.addEventListener('click', (e) => {
      e.preventDefault();
      openModal('register');
    });

    // Profile Save Form
    modalRoot.querySelector('#profile-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const callSign = modalRoot.querySelector('#profile-callsign').value.trim();
      const squad = modalRoot.querySelector('#profile-squad').value;
      const targetTrack = modalRoot.querySelector('#profile-track').value;

      try {
        await store.updateUserProfile({ callSign, squad, targetTrack });
        soundFX.playSuccess();
        successMsg = isHinglish ? 'Operative profile update ho gayi!' : 'Dossier updated successfully!';
        errorMsg = '';
        render();
        setTimeout(() => {
          closeModal();
        }, 1200);
      } catch (err) {
        errorMsg = err.message || 'Failed to update profile.';
        soundFX.playAlert();
        render();
      }
    });

    // Login / Register Form
    modalRoot.querySelector('#auth-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = modalRoot.querySelector('#auth-username').value.trim();
      const password = modalRoot.querySelector('#auth-password').value;

      try {
        if (isRegister) {
          const email = modalRoot.querySelector('#auth-email').value.trim();
          const squad = modalRoot.querySelector('#auth-squad').value;
          const user = await api.register({ username, email, password, callSign: username, squad });
          store.setUser(user);
        } else {
          const user = await api.login({ username, password });
          store.setUser(user);
        }
        soundFX.playSuccess();
        closeModal();
      } catch (err) {
        errorMsg = err.message || 'Authentication failed.';
        soundFX.playAlert();
        render();
      }
    });
  }

  // Global triggers
  window.addEventListener('kairos:open-auth-modal', (e) => {
    openModal(e.detail?.mode || 'login');
  });
}