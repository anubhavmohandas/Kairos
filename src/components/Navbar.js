/**
 * Kairos Top HUD Navbar (Neo-Brutalist Floating Pill Edition)
 * Translucent glassmorphic header with extended width.
 * Reordered nav actions: Pitch Deck -> Quick Toggle Capsule -> Operative Profile Dossier (at the end).
 */

import { store } from '../state/store.js';

export function renderNavbar(container) {
  const state = store.getState();
  const isHinglish = state.language === 'hinglish';
  const user = state.user;
  const currentView = state.currentView;
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const isAuthenticated = Boolean(user.isAuthenticated);

  container.innerHTML = `
    <nav class="cyber-nav" aria-label="Kairos Navigation">
      <div class="nav-content">
        
        <!-- Brand Section (Classic Pill Neo-Brutalist) -->
        <a class="brand-section" id="nav-brand-btn" title="Kairos Home">
          <div class="brand-icon-box">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111827" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <path d="m9 12 2 2 4-4"/>
            </svg>
          </div>
          <span class="brand-title">KAIROS</span>
        </a>

        <!-- Center Nav Links -->
        <div class="nav-menu-links">
          <button class="nav-link-btn ${currentView === 'topic-selector' ? 'active' : ''}" id="nav-link-curriculum">
            <span>${isHinglish ? 'Curriculum' : 'Curriculum'}</span>
          </button>
          <button class="nav-link-btn ${currentView === 'diagnostic' || currentView === 'skill-gap' ? 'active' : ''}" id="nav-link-diag">
            <span>${isHinglish ? 'Diagnostics' : 'Diagnostics'}</span>
          </button>
          <button class="nav-link-btn ${currentView === 'social-dashboard' ? 'active' : ''}" id="nav-link-duels">
            <span>${isHinglish ? 'Social Duels' : 'Social Duels'}</span>
          </button>
          <button class="nav-link-btn ${currentView === 'learning-lab' || currentView === 'mastery-arena' ? 'active' : ''}" id="nav-link-lab">
            <span>${isHinglish ? 'Learning Lab' : 'Learning Lab'}</span>
          </button>
        </div>

        <!-- Right Nav Actions (Pitch Deck -> Toggle Capsule -> Profile Pill at very end) -->
        <div class="nav-actions">
          
          <!-- 1. Pitch Deck Button -->
          <button id="nav-pitch-btn" class="btn-pitch-compact" title="Open Interactive Pitch Deck">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
            <span>Pitch Deck</span>
          </button>

          <!-- 2. Unified 3-in-1 Quick Toggle Capsule (Theme | Sound | Language) -->
          <div class="hud-toggle-capsule" title="Quick Toggle Controls">
            <!-- Theme Toggle -->
            <button id="nav-theme-toggle" class="capsule-sub-btn" title="Toggle Theme (Dark / Light)" aria-label="Toggle Theme">
              ${isDark ? `
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              ` : `
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
              `}
            </button>
            <span class="capsule-sep"></span>
            
            <!-- Sound Toggle -->
            <button id="nav-sound-toggle" class="capsule-sub-btn" title="Toggle Sound FX">
              ${user.soundEnabled ? `
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                </svg>
              ` : `
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                  <line x1="23" y1="9" x2="17" y2="15"></line>
                  <line x1="17" y1="9" x2="23" y2="15"></line>
                </svg>
              `}
            </button>
            <span class="capsule-sep"></span>

            <!-- Language Toggle -->
            <button id="nav-lang-toggle" class="capsule-sub-btn lang-badge-btn ${isHinglish ? 'active-hi' : ''}" title="Toggle Language (English / Hinglish)">
              <span>${isHinglish ? 'HI' : 'EN'}</span>
            </button>
          </div>

          <!-- 3. Operative Profile Dossier Pill (AT THE VERY LAST / FAR RIGHT) -->
          <div class="account-menu-wrapper" id="account-menu-wrapper">
            <button class="operative-dossier-pill" id="nav-profile-toggle" title="Account & Profile Menu" aria-haspopup="true" aria-expanded="false">
              ${isAuthenticated ? `
                ${user.name && user.name.toLowerCase().includes('vinit') ? `
                  <img class="operative-avatar-img" src="shakya_vinit.jpg" alt="Profile" onerror="this.style.display='none'; if (this.nextElementSibling) this.nextElementSibling.style.display='flex';" />
                  <div class="operative-avatar-fallback" style="display:none; width: 26px; height: 26px; border-radius: 50%; background: var(--neon-cyan); color: #000; font-family: var(--font-mono); font-weight: 800; font-size: 0.72rem; align-items: center; justify-content: center;">
                    ${(user.callSign || user.name || 'OP').slice(0, 2).toUpperCase()}
                  </div>
                ` : `
                  <div class="operative-avatar-fallback" style="display:flex; width: 26px; height: 26px; border-radius: 50%; background: rgba(0, 245, 212, 0.15); border: 1.5px solid var(--neon-cyan); color: var(--neon-cyan); font-family: var(--font-mono); font-weight: 800; font-size: 0.72rem; align-items: center; justify-content: center;">
                    ${(user.callSign || user.username || 'OP').slice(0, 2).toUpperCase()}
                  </div>
                `}
                <div class="operative-info-text">
                  <span class="operative-name">${user.callSign || user.username || user.name}</span>
                  <span class="operative-rank">Lvl ${user.level || 1} • ${user.xp || 0} XP</span>
                </div>
              ` : `
                <div class="operative-avatar-fallback" style="display:flex; width: 26px; height: 26px; border-radius: 50%; background: var(--bg-card-alt); border: 1.5px dashed var(--border-mid); color: var(--text-secondary); align-items: center; justify-content: center;">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                </div>
                <div class="operative-info-text">
                  <span class="operative-name">${isHinglish ? 'Guest Operative' : 'Guest Operative'}</span>
                  <span class="operative-rank" style="color: var(--neon-cyan); font-weight: 700;">${isHinglish ? 'Sign In / Enlist →' : 'Sign In / Enlist →'}</span>
                </div>
              `}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" id="account-chevron-icon" style="transition: transform 0.2s ease;">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>

            <!-- Neo-Brutalist Account Dropdown Menu (Opens inwards from right) -->
            <div class="account-dropdown-popover hidden" id="account-dropdown-popover">
              <div class="account-popover-header">
                <div style="display: flex; align-items: center; gap: 10px;">
                  ${isAuthenticated ? `
                    <div class="operative-avatar-fallback" style="display:flex; width: 34px; height: 34px; border-radius: 50%; background: rgba(0, 245, 212, 0.15); border: 1.5px solid var(--neon-cyan); color: var(--neon-cyan); font-family: var(--font-mono); font-weight: 800; font-size: 0.85rem; align-items: center; justify-content: center;">
                      ${(user.callSign || user.username || 'OP').slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div class="popover-user-name">${user.callSign || user.username || user.name}</div>
                      <div class="popover-user-squad">${user.squad || 'ZeroDay Hunters'}</div>
                    </div>
                  ` : `
                    <div class="operative-avatar-fallback" style="display:flex; width: 34px; height: 34px; border-radius: 50%; background: var(--bg-card-alt); border: 1.5px dashed var(--border-mid); color: var(--text-secondary); align-items: center; justify-content: center;">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    </div>
                    <div>
                      <div class="popover-user-name">${isHinglish ? 'Guest Operative' : 'Guest Operative'}</div>
                      <div class="popover-user-squad" style="color: var(--neon-amber);">${isHinglish ? 'Local Session (Unsaved)' : 'Local Session (Unsaved)'}</div>
                    </div>
                  `}
                </div>
                <div class="popover-rank-badge">
                  ${isAuthenticated ? `Level ${user.level || 1} • ${user.xp || 0} XP` : (isHinglish ? 'Guest Mode' : 'Guest Mode')}
                </div>
              </div>

              <div class="account-popover-divider"></div>

              <div class="account-popover-actions">
                ${isAuthenticated ? `
                  <button class="account-popover-item" id="dropdown-action-profile">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    <span>${isHinglish ? 'Operative Profile & Squad' : 'Operative Profile & Squad'}</span>
                  </button>
                ` : `
                  <button class="account-popover-item item-login" id="dropdown-action-login" style="background: rgba(0, 245, 212, 0.1); border: 1px solid var(--neon-cyan); font-weight: 700;">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
                    <span>${isHinglish ? 'Operative Login / Enlist' : 'Authenticate / Enlist'}</span>
                  </button>
                `}

                <button class="account-popover-item" id="dropdown-action-settings">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                  <span>${isHinglish ? 'Gemini Engine & API Key' : 'Gemini Engine & API Key'}</span>
                </button>

                ${isAuthenticated ? `
                  <div class="account-popover-divider"></div>
                  <button class="account-popover-item item-logout" id="dropdown-action-logout">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                    <span>${isHinglish ? 'Session Logout Karein' : 'Logout Operative'}</span>
                  </button>
                ` : ''}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  `;

  // --- Event Listeners ---
  container.querySelector('#nav-brand-btn')?.addEventListener('click', () => {
    store.setView('topic-selector');
  });

  container.querySelector('#nav-link-curriculum')?.addEventListener('click', () => {
    store.setView('topic-selector');
  });

  container.querySelector('#nav-link-diag')?.addEventListener('click', () => {
    store.setView('diagnostic');
  });

  container.querySelector('#nav-link-duels')?.addEventListener('click', () => {
    store.setView('social-dashboard');
  });

  container.querySelector('#nav-link-lab')?.addEventListener('click', () => {
    store.setView('learning-lab');
  });

  // Account Popover Toggle
  const profileToggle = container.querySelector('#nav-profile-toggle');
  const popover = container.querySelector('#account-dropdown-popover');
  const chevron = container.querySelector('#account-chevron-icon');

  function closeAccountMenu() {
    if (popover && !popover.classList.contains('hidden')) {
      popover.classList.add('hidden');
      profileToggle?.setAttribute('aria-expanded', 'false');
      if (chevron) chevron.style.transform = 'rotate(0deg)';
    }
  }

  function openAccountMenu() {
    if (popover) {
      popover.classList.remove('hidden');
      profileToggle?.setAttribute('aria-expanded', 'true');
      if (chevron) chevron.style.transform = 'rotate(180deg)';
    }
  }

  profileToggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (popover?.classList.contains('hidden')) {
      openAccountMenu();
    } else {
      closeAccountMenu();
    }
  });

  // Close popover when clicking anywhere outside
  const onDocClick = (e) => {
    const wrapper = container.querySelector('#account-menu-wrapper');
    if (wrapper && !wrapper.contains(e.target)) {
      closeAccountMenu();
    }
  };
  document.removeEventListener('click', onDocClick);
  document.addEventListener('click', onDocClick);

  // Actions inside dropdown
  container.querySelector('#dropdown-action-profile')?.addEventListener('click', (e) => {
    e.stopPropagation();
    closeAccountMenu();
    window.dispatchEvent(new CustomEvent('kairos:open-auth-modal', { detail: { mode: 'profile' } }));
  });

  container.querySelector('#dropdown-action-settings')?.addEventListener('click', (e) => {
    e.stopPropagation();
    closeAccountMenu();
    window.dispatchEvent(new CustomEvent('kairos:open-settings-modal'));
  });

  container.querySelector('#dropdown-action-logout')?.addEventListener('click', async (e) => {
    e.stopPropagation();
    closeAccountMenu();
    await store.logout();
    renderNavbar(container);
  });

  container.querySelector('#dropdown-action-login')?.addEventListener('click', (e) => {
    e.stopPropagation();
    closeAccountMenu();
    window.dispatchEvent(new CustomEvent('kairos:open-auth-modal', { detail: { mode: 'login' } }));
  });

  // Toggle buttons
  container.querySelector('#nav-theme-toggle')?.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('kairos_theme', newTheme);
    renderNavbar(container);
  });

  container.querySelector('#nav-sound-toggle')?.addEventListener('click', () => {
    store.toggleSound();
    renderNavbar(container);
  });

  container.querySelector('#nav-lang-toggle')?.addEventListener('click', () => {
    store.toggleLanguage();
    renderNavbar(container);
  });

  container.querySelector('#nav-pitch-btn')?.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('kairos:open-pitch-deck'));
  });
}
