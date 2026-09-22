/**
 * Auth Modal Component
 * Real User Account Creation, Login, Call-Sign Customization, and Squad Enlistment.
 */

import { api } from '../services/apiClient.js';
import { store } from '../state/store.js';
import { soundFX } from '../services/soundEffects.js';

export function setupAuthModal(modalRoot) {
  let isRegister = false;
  let errorMsg = '';

  function openModal(mode = 'login') {
    isRegister = mode === 'register';
    errorMsg = '';
    render();
  }

  function closeModal() {
    modalRoot.classList.add('hidden');
    modalRoot.setAttribute('aria-hidden', 'true');
    modalRoot.innerHTML = '';
  }

  function render() {
    const isHinglish = store.getState().language === 'hinglish';
    modalRoot.classList.remove('hidden');
    modalRoot.setAttribute('aria-hidden', 'false');

    modalRoot.innerHTML = `
      <div class="modal-card" style="max-width: 480px;">
        <button id="btn-auth-close" class="modal-close-btn" title="Close">✕</button>

        <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.5rem;">
          <div class="brand-icon-box" style="width: 36px; height: 36px;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <h2 style="font-size: 1.5rem; color: #fff;">
            ${isRegister ? (isHinglish ? 'Naya Agent Account Banao' : 'Enlist New Operative') : (isHinglish ? 'Agent Terminal Login' : 'Operative Terminal Login')}
          </h2>
        </div>

        <p style="color: var(--text-secondary); font-size: 0.88rem; margin-bottom: 1.5rem;">
          ${isRegister 
            ? (isHinglish ? 'Apna cyber call-sign aur squad choose karein taaki rank aur XP save ho.' : 'Create an operative account to save persistent XP, streak, and squad rank.')
            : (isHinglish ? 'Apne account mein login karein.' : 'Authenticate your security session to access your personal dashboard.')}
        </p>

        ${errorMsg ? `
          <div style="background: rgba(255, 0, 84, 0.15); border: 1px solid var(--neon-crimson); padding: 0.65rem 0.85rem; border-radius: var(--radius-sm); color: #fff; font-size: 0.85rem; margin-bottom: 1rem;">
            ⚠️ ${errorMsg}
          </div>
        ` : ''}

        <form id="auth-form" style="display: flex; flex-direction: column; gap: 1rem;">
          <div>
            <label style="display: block; font-size: 0.8rem; font-family: var(--font-mono); color: var(--neon-cyan); margin-bottom: 0.3rem;">
              OPERATIVE USERNAME:
            </label>
            <input 
              type="text" 
              id="auth-username" 
              required 
              placeholder="e.g. Cipher_Knight" 
              style="width: 100%; background: #03060c; border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 0.65rem 0.85rem; color: #fff; font-family: var(--font-body); font-size: 0.9rem;"
            />
          </div>

          ${isRegister ? `
            <div>
              <label style="display: block; font-size: 0.8rem; font-family: var(--font-mono); color: var(--neon-cyan); margin-bottom: 0.3rem;">
                EMAIL ADDRESS:
              </label>
              <input 
                type="email" 
                id="auth-email" 
                required 
                placeholder="agent@cybercorp.org" 
                style="width: 100%; background: #03060c; border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 0.65rem 0.85rem; color: #fff; font-family: var(--font-body); font-size: 0.9rem;"
              />
            </div>

            <div>
              <label style="display: block; font-size: 0.8rem; font-family: var(--font-mono); color: var(--neon-cyan); margin-bottom: 0.3rem;">
                SQUAD AFFILIATION:
              </label>
              <select id="auth-squad" style="width: 100%; background: #03060c; border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 0.65rem 0.85rem; color: #fff; font-family: var(--font-body); font-size: 0.9rem;">
                <option value="ZeroDay Hunters">ZeroDay Hunters (Offensive Triage)</option>
                <option value="RedTeam Alpha">RedTeam Alpha (Adversary Emulation)</option>
                <option value="CyberSentinels">CyberSentinels (Defensive Forensics)</option>
                <option value="CloudGuard">CloudGuard (Cloud & IAM Hardening)</option>
              </select>
            </div>
          ` : ''}

          <div>
            <label style="display: block; font-size: 0.8rem; font-family: var(--font-mono); color: var(--neon-cyan); margin-bottom: 0.3rem;">
              PASSPHRASE:
            </label>
            <input 
              type="password" 
              id="auth-password" 
              required 
              placeholder="••••••••••••" 
              style="width: 100%; background: #03060c; border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 0.65rem 0.85rem; color: #fff; font-family: var(--font-mono); font-size: 0.9rem;"
            />
          </div>

          <button type="submit" class="btn btn-cyan" style="width: 100%; margin-top: 0.5rem;">
            <span>${isRegister ? (isHinglish ? 'Account Create Karein' : 'Enlist Operative') : (isHinglish ? 'Terminal Login Karein' : 'Authenticate Session')}</span>
            <span>→</span>
          </button>
        </form>

        <div style="text-align: center; margin-top: 1.25rem; font-size: 0.85rem; color: var(--text-secondary); border-top: 1px solid var(--border-subtle); padding-top: 1rem;">
          ${isRegister ? `
            <span>${isHinglish ? 'Pehle se account hai?' : 'Already have an account?'}</span>
            <a href="#" id="btn-switch-login" style="color: var(--neon-cyan); font-weight: 700; margin-left: 0.3rem; text-decoration: none;">
              ${isHinglish ? 'Login karein' : 'Login here'}
            </a>
          ` : `
            <span>${isHinglish ? 'Naya account banana hai?' : "Don't have an operative account?"}</span>
            <a href="#" id="btn-switch-register" style="color: var(--neon-cyan); font-weight: 700; margin-left: 0.3rem; text-decoration: none;">
              ${isHinglish ? 'Sign up karein' : 'Sign up here'}
            </a>
          `}
        </div>
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
