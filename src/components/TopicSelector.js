/**
 * Step 1: Topic Selector & Complete Platform Landing View
 * Full Neo-Brutalist Layout matching the user reference screenshot:
 * Hero with 3 floating animated badges, 6-course Catalog Grid,
 * 4 Features Grid, 4 Testimonials with Shakya Vinit spotlight review,
 * Steam-Style Social Duels Hub, and Full Application Footer.
 * Zero emojis — 100% bespoke SVG vector icons.
 */

import { CYBER_DOMAINS } from '../data/cyberCurriculum.js';
import { store } from '../state/store.js';
import { api } from '../services/apiClient.js';
import { soundFX } from '../services/soundEffects.js';

export function renderTopicSelector(container) {
  const state = store.getState();
  const isHinglish = state.language === 'hinglish';
  let isGenerating = false;

  container.innerHTML = `
    <div class="topic-selector-view">
      
      <!-- ==========================================================
           SECTION 1: HERO SPLIT SECTION (EXACT REFERENCE SCREENSHOT)
           ========================================================== -->
      <div class="hero-split-grid">
        
        <!-- LEFT HERO CONTENT -->
        <div class="hero-left-content">
          <!-- Pill Badge -->
          <div class="hero-badge-pill" ${state.user.isAuthenticated ? 'style="border-color: var(--neon-cyan); background: rgba(0, 245, 212, 0.08);"' : ''}>
            <span class="badge-pulse-indicator"></span>
            <span>${state.user.isAuthenticated 
              ? `${state.user.callSign || state.user.username} [${state.user.squad}] • LVL ${state.user.level} (${state.user.xp} XP)`
              : (isHinglish ? 'Naya: AI-Powered Cyber Learning' : 'New: AI-Powered Cyber Learning')}</span>
          </div>

          <!-- Big Bold 3-Line Headline -->
          <h1 class="hero-main-heading">
            Master Cybersecurity,<br>
            <span class="text-accent-green">Anytime</span>,<br>
            Anywhere!
          </h1>

          <p class="hero-subparagraph">
            ${isHinglish 
              ? 'Duniya bhar ke 2M+ ambitious learners ke saath judo. 10,000+ courses aur real-world scenario simulations expert instructors se seekho.' 
              : 'Join millions of learners worldwide. Access 10,000+ courses taught by expert instructors.'}
          </p>

          <!-- Custom AI Topic Synthesizer Search Console -->
          <form id="custom-topic-form" class="custom-synth-box">
            <div class="input-with-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input 
                type="text" 
                id="custom-topic-input" 
                class="neo-input" 
                placeholder="${isHinglish ? 'Kya seekhna hai? e.g. Active Directory Kerberoasting, Web Development, Kubernetes...' : 'What do you want to master? (e.g., Active Directory Kerberoasting, Web Development)'}" 
                value="Active Directory Kerberoasting"
              />
            </div>
          </form>

          <!-- CTA Buttons Row -->
          <div class="hero-cta-buttons">
            <button class="btn-primary-action" id="btn-hero-primary-start">
              <span>${state.user.isAuthenticated 
                ? (isHinglish ? 'Mission Shuru Karein' : 'Launch Diagnostic HUD') 
                : (isHinglish ? 'Start Learning Free' : 'Start Learning Free')}</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
            <button class="btn-secondary-action" id="btn-hero-browse-tracks">
              <span>${isHinglish ? 'Browse Courses' : 'Browse Courses'}</span>
            </button>
            ${!state.user.isAuthenticated ? `
              <button class="btn-secondary-action" id="btn-hero-enlist" style="border-color: var(--neon-cyan); color: var(--neon-cyan);" title="Enlist Operative Account">
                <span>${isHinglish ? 'Enlist / Sign Up' : 'Enlist Operative'}</span>
              </button>
            ` : ''}
          </div>

          <!-- Quick Exploit Prompt Chips -->
          <div class="quick-prompt-tray">
            <span class="tray-label">${isHinglish ? 'Popular Disciplines:' : 'Popular Disciplines:'}</span>
            <button class="prompt-chip topic-chip" data-topic="Active Directory Kerberoasting">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 2l-2 2m-1.5 1.5L10 13l-4 4-2-2-4 4 4 4 2-2 4-4 7.5-7.5"></path></svg>
              <span>Kerberoasting</span>
            </button>
            <button class="prompt-chip topic-chip" data-topic="Kubernetes ServiceAccount Token Theft">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="2" y="2" width="20" height="20" rx="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path></svg>
              <span>Kubernetes Token Theft</span>
            </button>
            <button class="prompt-chip topic-chip" data-topic="Web Development Bootcamp">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
              <span>Web Development</span>
            </button>
            <button class="prompt-chip topic-chip" data-topic="Smart Contract Reentrancy Exploit">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
              <span>Smart Contracts</span>
            </button>
          </div>

          <!-- Social Proof Stats Strip -->
          <div class="stats-strip">
            <div class="stat-item">
              <span class="stat-number">10K+</span>
              <span class="stat-label">${isHinglish ? 'Courses' : 'Courses'}</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">2M+</span>
              <span class="stat-label">${isHinglish ? 'Students' : 'Students'}</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">500+</span>
              <span class="stat-label">${isHinglish ? 'Instructors' : 'Instructors'}</span>
            </div>
          </div>
        </div>

        <!-- RIGHT HERO VISUAL: SHOWCASE CARD WITH 3 FLOATING BADGES -->
        <div class="hero-right-showcase">
          
          <!-- Floating Badge 1: Top-Right Threat Recon Target -->
          <div class="floating-badge badge-pos-target" id="heroBadgeTarget" title="Active Threat Vector Recon">
            <div class="badge-icon-box">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#e11d48" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="22" y1="12" x2="18" y2="12"></line>
                <line x1="6" y1="12" x2="2" y2="12"></line>
                <line x1="12" y1="6" x2="12" y2="2"></line>
                <line x1="12" y1="22" x2="12" y2="18"></line>
              </svg>
            </div>
          </div>

          <!-- Floating Badge 2: Bottom-Right Operative Rank & Streak -->
          <div class="floating-badge badge-pos-star" id="heroBadgeRank" title="Operative Rank & XP Progression">
            <div class="badge-icon-box">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="#facc15" stroke="#ca8a04" stroke-width="1.8" stroke-linejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            </div>
          </div>

          <!-- Floating Badge 3: Bottom-Left Knowledge Tracks -->
          <div class="floating-badge badge-pos-books" id="heroBadgeTracks" title="Curated Cybersecurity Mastery Tiers">
            <div class="badge-icon-box">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0284c7" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
            </div>
          </div>

          <!-- The Main Neo-Brutalist Operative Mission Radar Card -->
          <div class="student-showcase-card operative-radar-card" id="heroOperativeCard">
            <!-- Top Banner -->
            <div class="showcase-top-banner">
              <div class="course-play-icon-box operative-icon-box" id="heroPlayIconBox" title="Click to launch active discipline simulation">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                  <polyline points="2 17 12 22 22 17"></polyline>
                  <polyline points="2 12 12 17 22 12"></polyline>
                </svg>
              </div>
              <div class="course-header-text">
                <div class="active-track-eyebrow">
                  <span class="live-dot-pulse"></span>
                  <span id="heroMissionStatus">${state.user.isAuthenticated ? 'OPERATIVE MISSION' : 'ACTIVE DISCIPLINE'}</span>
                </div>
                <h3 class="active-track-name" id="heroCardTitle">Active Directory Kerberoasting</h3>
                <span class="active-track-meta" id="heroCardMeta">
                  5 Micro-Topics • SPN Recon & TGS Tickets
                </span>
              </div>
            </div>

            <!-- Dynamic Telemetry Badges Strip -->
            <div class="hero-card-telemetry-row">
              <div class="telemetry-pill">
                <span class="telemetry-pill-dot dot-cyan"></span>
                <span id="heroTelemetryThreat">Hashcat Mode 13100</span>
              </div>
              <div class="telemetry-pill">
                <span class="telemetry-pill-dot dot-amber"></span>
                <span id="heroTelemetrySIEM">Event ID 4769</span>
              </div>
              <div class="telemetry-pill">
                <span class="telemetry-pill-dot dot-green"></span>
                <span id="heroTelemetryLab">Live SIEM Ready</span>
              </div>
            </div>

            <!-- Progress Bar -->
            <div class="progress-bar-wrap">
              <div class="progress-header-labels">
                <span class="progress-label-text">${isHinglish ? 'Operative Readiness' : 'Operative Readiness'}</span>
                <span class="progress-pct-text" id="heroPercentText">85%</span>
              </div>
              <div class="progress-track-bg">
                <div class="progress-track-fill" id="heroProgressFill" style="width: 85%;"></div>
              </div>
            </div>

            <!-- Continue / Engage Mission Action Button -->
            <button class="btn-continue-action btn-engage-mission" id="btn-continue-active-mission">
              <span id="heroContinueBtnText">${isHinglish ? 'Mission Shuru Karein' : 'Engage Mission HUD'}</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>

        </div>

      </div>

      <!-- ==========================================================
           SECTION 2: EXPLORE TOP-RATED COURSES (CATALOG 6-CARDS GRID)
           ========================================================== -->
      <div class="catalog-section" id="courseCatalogSection">
        <div class="section-badge-center">
          <span class="section-head-badge">${isHinglish ? 'Popular Courses' : 'Popular Courses'}</span>
        </div>
        <h2 class="section-big-title text-center">
          ${isHinglish ? 'Explore Top-Rated Courses' : 'Explore Top-Rated Courses'}
        </h2>
        <p class="section-subtitle text-center">
          ${isHinglish 
            ? 'Industry experts se seekho aur adaptive AI diagnostic roadmap ke sath practical skills master karo.' 
            : 'Learn from industry experts and gain real-world skills with adaptive milestone roadmaps.'}
        </p>

        <div class="catalog-cards-grid">
          <!-- Course 1 -->
          <div class="course-item-card catalog-card-item" data-topic="Web Development Bootcamp">
            <div class="course-card-top">
              <div class="course-icon-square bg-coral">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="16 18 22 12 16 6"></polyline>
                  <polyline points="8 6 2 12 8 18"></polyline>
                </svg>
              </div>
              <div class="course-info-group">
                <h3 class="course-title-text">Web Development Bootcamp</h3>
                <span class="course-instructor-text">by Sarah Chen</span>
              </div>
              <div class="course-rating-pill">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                <span>4.9</span>
              </div>
            </div>
            <div class="course-meta-bottom">
              <div class="meta-item">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                <span>48 lessons</span>
              </div>
              <div class="meta-item">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                <span>24h</span>
              </div>
              <div class="meta-item">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>
                <span>12.5K students</span>
              </div>
            </div>
          </div>

          <!-- Course 2 -->
          <div class="course-item-card catalog-card-item" data-topic="UI/UX Design Mastery">
            <div class="course-card-top">
              <div class="course-icon-square bg-cyan">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="3" y1="9" x2="21" y2="9"></line>
                  <line x1="9" y1="21" x2="9" y2="9"></line>
                </svg>
              </div>
              <div class="course-info-group">
                <h3 class="course-title-text">UI/UX Design Mastery</h3>
                <span class="course-instructor-text">by Mike Johnson</span>
              </div>
              <div class="course-rating-pill">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                <span>4.8</span>
              </div>
            </div>
            <div class="course-meta-bottom">
              <div class="meta-item">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                <span>36 lessons</span>
              </div>
              <div class="meta-item">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                <span>18h</span>
              </div>
              <div class="meta-item">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>
                <span>8.2K students</span>
              </div>
            </div>
          </div>

          <!-- Course 3 -->
          <div class="course-item-card catalog-card-item" data-topic="Data Science with Python">
            <div class="course-card-top">
              <div class="course-icon-square bg-purple">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10"></line>
                  <line x1="12" y1="20" x2="12" y2="4"></line>
                  <line x1="6" y1="20" x2="6" y2="14"></line>
                </svg>
              </div>
              <div class="course-info-group">
                <h3 class="course-title-text">Data Science with Python</h3>
                <span class="course-instructor-text">by Emily Davis</span>
              </div>
              <div class="course-rating-pill">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                <span>4.9</span>
              </div>
            </div>
            <div class="course-meta-bottom">
              <div class="meta-item">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                <span>52 lessons</span>
              </div>
              <div class="meta-item">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                <span>30h</span>
              </div>
              <div class="meta-item">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>
                <span>15.3K students</span>
              </div>
            </div>
          </div>

          <!-- Course 4 -->
          <div class="course-item-card catalog-card-item" data-topic="Mobile App Development">
            <div class="course-card-top">
              <div class="course-icon-square bg-green">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                  <line x1="12" y1="18" x2="12.01" y2="18"></line>
                </svg>
              </div>
              <div class="course-info-group">
                <h3 class="course-title-text">Mobile App Development</h3>
                <span class="course-instructor-text">by Alex Kim</span>
              </div>
              <div class="course-rating-pill">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                <span>4.7</span>
              </div>
            </div>
            <div class="course-meta-bottom">
              <div class="meta-item">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                <span>42 lessons</span>
              </div>
              <div class="meta-item">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                <span>22h</span>
              </div>
              <div class="meta-item">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>
                <span>9.8K students</span>
              </div>
            </div>
          </div>

          <!-- Course 5: Active Directory & Network Security -->
          <div class="course-item-card catalog-card-item" data-topic="Active Directory Kerberoasting">
            <div class="course-card-top">
              <div class="course-icon-square bg-cyan">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <path d="m9 12 2 2 4-4"/>
                </svg>
              </div>
              <div class="course-info-group">
                <h3 class="course-title-text">Active Directory Defense</h3>
                <span class="course-instructor-text">by Shakya Vinit</span>
              </div>
              <div class="course-rating-pill">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                <span>4.96</span>
              </div>
            </div>
            <div class="course-meta-bottom">
              <div class="meta-item">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                <span>38 lessons</span>
              </div>
              <div class="meta-item">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                <span>20h</span>
              </div>
              <div class="meta-item">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>
                <span>14.2K students</span>
              </div>
            </div>
          </div>

          <!-- Course 6: Quantum Cryptography -->
          <div class="course-item-card catalog-card-item" data-topic="Quantum Cryptography Primer">
            <div class="course-card-top">
              <div class="course-icon-square bg-amber">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="3"></circle>
                  <circle cx="12" cy="12" r="8"></circle>
                </svg>
              </div>
              <div class="course-info-group">
                <h3 class="course-title-text">Quantum Cryptography Primer</h3>
                <span class="course-instructor-text">by Dr. Elena Vance</span>
              </div>
              <div class="course-rating-pill">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                <span>4.98</span>
              </div>
            </div>
            <div class="course-meta-bottom">
              <div class="meta-item">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                <span>28 lessons</span>
              </div>
              <div class="meta-item">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                <span>16h</span>
              </div>
              <div class="meta-item">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>
                <span>7.5K students</span>
              </div>
            </div>
          </div>
        </div>

        <div class="catalog-cta-wrap">
          <button class="btn-secondary-pill" id="btn-view-all-courses">
            <span>View All Courses</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>
      </div>

      <!-- ==========================================================
           SECTION 3: STEAM-STYLE 1v1 DUEL BANNER
           ========================================================== -->
      <div class="social-hub-banner" id="social-hub-banner-box" style="margin: 40px 0;">
        <div style="display: flex; align-items: center; gap: 14px;">
          <div style="width: 48px; height: 48px; border-radius: var(--radius-md); background: var(--color-purple); border: var(--border-mid); box-shadow: var(--shadow-sm); display: flex; align-items: center; justify-content: center; color: #111827;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"></polyline>
              <line x1="13" y1="19" x2="19" y2="13"></line>
              <line x1="16" y1="16" x2="20" y2="20"></line>
              <line x1="19" y1="21" x2="21" y2="19"></line>
            </svg>
          </div>
          <div>
            <div style="font-weight: 800; font-size: 1.15rem; color: var(--text-main);">
              ${isHinglish ? 'Steam-Style Squad Hub & 1v1 Scenario Duels' : 'Steam-Style Squad Hub & 1v1 Scenario Duels'}
            </div>
            <div style="font-size: 0.9rem; color: var(--text-muted);">
              ${isHinglish ? 'ZeroDay_Bot ya squad peers ke saath live scenario battle khelo' : 'Challenge peers or ZeroDay_Bot in live timed cyber defense scenario battles'}
            </div>
          </div>
        </div>
        <button id="btn-open-social" class="btn btn-sm" style="background: var(--color-yellow); color: #111827; padding: 10px 20px;">
          <span>${isHinglish ? 'Social Hub Kholo' : 'Open Social Hub'}</span>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
        </button>
      </div>

      <!-- ==========================================================
           SECTION 4: WHY CHOOSE US / EVERYTHING YOU NEED TO SUCCEED
           ========================================================== -->
      <div class="features-section" id="whyUsSection">
        <div class="section-badge-center">
          <span class="section-head-badge">${isHinglish ? 'Why Choose Us' : 'Why Choose Us'}</span>
        </div>
        <h2 class="section-big-title text-center">
          ${isHinglish ? 'Everything You Need to Succeed' : 'Everything You Need to Succeed'}
        </h2>
        <p class="section-subtitle text-center">
          ${isHinglish 
            ? 'Autonomous diagnostics, verified curricula aur real-world mentors ke sath deep concepts cement karo.' 
            : 'Master technical disciplines through autonomous diagnostics, verified curricula, and world-class mentors.'}
        </p>

        <div class="features-cards-grid">
          <!-- Feature 1 -->
          <div class="feature-item-card">
            <div class="feature-icon-square bg-coral">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <h3 class="feature-card-title">Learn at Your Pace</h3>
            <p class="feature-card-desc">Access courses anytime, anywhere. Pause, rewind, and replay lessons as needed to cement deep mental models.</p>
          </div>

          <!-- Feature 2 -->
          <div class="feature-item-card">
            <div class="feature-icon-square bg-cyan">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
              </svg>
            </div>
            <h3 class="feature-card-title">Expert Instructors</h3>
            <p class="feature-card-desc">Learn from industry professionals with real-world production experience from top-tier tech organizations.</p>
          </div>

          <!-- Feature 3 -->
          <div class="feature-item-card">
            <div class="feature-icon-square bg-purple">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <polyline points="9 12 11 14 15 10"></polyline>
              </svg>
            </div>
            <h3 class="feature-card-title">Certificates</h3>
            <p class="feature-card-desc">Earn recognized certificates and cryptographically verified skill badges to showcase your technical competence.</p>
          </div>

          <!-- Feature 4 -->
          <div class="feature-item-card">
            <div class="feature-icon-square bg-green">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <h3 class="feature-card-title">Community Support</h3>
            <p class="feature-card-desc">Join a thriving global community of 2M+ ambitious learners. Ask questions, pair program, and share knowledge.</p>
          </div>
        </div>
      </div>

      <!-- ==========================================================
           SECTION 5: WHAT OUR STUDENTS SAY (TESTIMONIALS)
           ========================================================== -->
      <div class="testimonials-section" id="testimonialsSection">
        <div class="section-badge-center">
          <span class="section-head-badge">${isHinglish ? 'Student Stories' : 'Student Stories'}</span>
        </div>
        <h2 class="section-big-title text-center">
          ${isHinglish ? 'What Our Students Say' : 'What Our Students Say'}
        </h2>
        <p class="section-subtitle text-center">
          ${isHinglish 
            ? 'Ambitious practitioners apne career ko precision AI-calibrated learning se transform kar rahe hain.' 
            : 'Join ambitious practitioners transforming their careers with precision AI-calibrated learning.'}
        </p>

        <div class="testimonials-cards-grid">
          <!-- Story 1 -->
          <div class="testimonial-card">
            <div class="star-rating-row">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#eab308"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#eab308"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#eab308"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#eab308"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#eab308"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            </div>
            <p class="testimonial-quote">"Kairos helped me transition from marketing to cybersecurity engineering. The courses are well-structured and the community is supportive!"</p>
            <div class="testimonial-author-row">
              <div class="author-avatar-box bg-coral">J</div>
              <div class="author-details">
                <strong class="author-name">Jessica Wang</strong>
                <span class="author-role">Software Security Engineer</span>
              </div>
            </div>
          </div>

          <!-- Story 2 -->
          <div class="testimonial-card">
            <div class="star-rating-row">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#eab308"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#eab308"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#eab308"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#eab308"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#eab308"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            </div>
            <p class="testimonial-quote">"The UI/UX and vulnerability diagnostics were exactly what I needed. I landed my dream SOC analyst job within 3 months!"</p>
            <div class="testimonial-author-row">
              <div class="author-avatar-box bg-cyan">D</div>
              <div class="author-details">
                <strong class="author-name">David Miller</strong>
                <span class="author-role">SOC Lead & Analyst</span>
              </div>
            </div>
          </div>

          <!-- Story 3 -->
          <div class="testimonial-card">
            <div class="star-rating-row">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#eab308"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#eab308"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#eab308"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#eab308"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#eab308"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            </div>
            <p class="testimonial-quote">"Best platform investment I've made. The hands-on simulations gave me practical skills I use every single day at work."</p>
            <div class="testimonial-author-row">
              <div class="author-avatar-box bg-purple">M</div>
              <div class="author-details">
                <strong class="author-name">Maria Garcia</strong>
                <span class="author-role">Cloud Security Specialist</span>
              </div>
            </div>
          </div>

          <!-- Story 4: Featured Spotlight with Shakya Vinit's Studio Portrait -->
          <div class="testimonial-card featured-testimonial">
            <div class="featured-student-badge">
              <span class="badge-pulse-indicator"></span>
              <span>Top Scholar Spotlight</span>
            </div>
            <div class="star-rating-row">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#eab308"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#eab308"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#eab308"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#eab308"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#eab308"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            </div>
            <p class="testimonial-quote">"The AI-calibrated diagnostic found my exact system gaps in 5 minutes. The tailored 4-milestone roadmap cut my prep time by half!"</p>
            <div class="testimonial-author-row">
              <img class="author-photo-avatar" src="shakya_vinit.jpg" alt="Shakya Vinit" onerror="this.src='/shakya_vinit.jpg'" />
              <div class="author-details">
                <strong class="author-name">Shakya Vinit</strong>
                <span class="author-role">Computer Science & ML • Level 4 Scholar</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ==========================================================
           SECTION 6: COMPLETE APPLICATION FOOTER
           ========================================================== -->
      <footer class="app-footer">
        <div class="footer-container">
          <div class="footer-brand-column">
            <div class="brand-section" style="cursor: default;">
              <div class="brand-icon-box">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#111827" stroke-width="2.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <path d="m9 12 2 2 4-4"/>
                </svg>
              </div>
              <div class="brand-title">
                KAIROS
              </div>
            </div>
            <p class="footer-desc">Autonomous precision learning platform engineered for ambitious technical minds.</p>
            <div class="footer-status-pill">
              <span class="green-dot-pulse"></span>
              <span>Adaptive AI Engine Online • Latency 14ms</span>
            </div>
          </div>

          <div class="footer-links-grid">
            <div class="footer-links-col">
              <span class="footer-col-heading">Curriculum</span>
              <a class="footer-link footer-topic-link" data-topic="Web Development Bootcamp">Web Development</a>
              <a class="footer-link footer-topic-link" data-topic="UI/UX Design Mastery">UI/UX Design</a>
              <a class="footer-link footer-topic-link" data-topic="Data Science with Python">Data Science</a>
              <a class="footer-link footer-topic-link" data-topic="Active Directory Kerberoasting">Cyber Defense</a>
            </div>
            <div class="footer-links-col">
              <span class="footer-col-heading">Platform</span>
              <a class="footer-link" id="footer-link-home">Home</a>
              <a class="footer-link" id="footer-link-courses">Browse Courses</a>
              <a class="footer-link" id="footer-link-whyus">Why Choose Us</a>
              <a class="footer-link" id="footer-link-stories">Student Stories</a>
            </div>
            <div class="footer-links-col">
              <span class="footer-col-heading">Student Dossier</span>
              <span class="footer-static-item">Shakya Vinit (Active)</span>
              <span class="footer-static-item">Level 4 • 2,450 XP</span>
              <span class="footer-static-item">Top 2% Velocity</span>
            </div>
          </div>
        </div>
        <div class="footer-bottom-line">
          <span>© 2026 Kairos. Precision Adaptive Learning Architecture.</span>
          <span>Zero Cognitive Filler • Neo-Brutalist Edition</span>
        </div>
      </footer>

    </div>
  `;

  // ==========================================================
  // EVENT LISTENERS & NAVIGATION
  // ==========================================================

  // 1. Catalog Course Cards Click Handler
  container.querySelectorAll('.catalog-card-item').forEach(card => {
    card.addEventListener('click', () => {
      soundFX.playClick();
      const topic = card.getAttribute('data-topic');
      const input = container.querySelector('#custom-topic-input');
      if (input) input.value = topic;
      updateHeroCard(topic);
      synthesizeCustomTopic(topic);
    });
  });

  // 2. Open Social Duels Hub
  container.querySelector('#btn-open-social')?.addEventListener('click', () => {
    soundFX.playClick();
    store.setView('social-dashboard');
  });

  // 3. Browse Courses Smooth Scroll
  container.querySelector('#btn-hero-browse-tracks')?.addEventListener('click', () => {
    soundFX.playClick();
    const sec = container.querySelector('#courseCatalogSection');
    if (sec) sec.scrollIntoView({ behavior: 'smooth' });
  });

  container.querySelector('#btn-view-all-courses')?.addEventListener('click', () => {
    soundFX.playClick();
    const sec = container.querySelector('#courseCatalogSection');
    if (sec) sec.scrollIntoView({ behavior: 'smooth' });
  });

  // Helper to dynamically synchronize showcase card with active topic input
  function updateHeroCard(topicName) {
    const cardTitle = container.querySelector('#heroCardTitle');
    const cardMeta = container.querySelector('#heroCardMeta');
    const threatTag = container.querySelector('#heroTelemetryThreat');
    const siemTag = container.querySelector('#heroTelemetrySIEM');
    const labTag = container.querySelector('#heroTelemetryLab');
    const btnText = container.querySelector('#heroContinueBtnText');
    const pctText = container.querySelector('#heroPercentText');
    const fillBar = container.querySelector('#heroProgressFill');

    const clean = (topicName || '').trim();
    if (!clean) return;

    const lower = clean.toLowerCase();
    let meta = '5 Micro-Topics • Level 1: Mechanics';
    let threat = 'Threat Recon';
    let siem = 'Telemetry Stream';
    let pct = 75;

    if (lower.includes('kerberoast') || lower.includes('active directory')) {
      meta = '5 Micro-Topics • SPN Recon & TGS Tickets';
      threat = 'Hashcat Mode 13100';
      siem = 'Event ID 4769';
      pct = 85;
    } else if (lower.includes('kubernetes') || lower.includes('token')) {
      meta = '4 Micro-Topics • ServiceAccount Token Hijacking';
      threat = 'Kubelet RBAC';
      siem = 'API Server Audit';
      pct = 70;
    } else if (lower.includes('smart contract') || lower.includes('reentrancy')) {
      meta = '4 Micro-Topics • EVM Fallback & State Drain';
      threat = 'Reentrancy Vector';
      siem = 'Tx Trace Analysis';
      pct = 80;
    } else if (lower.includes('web') || lower.includes('bootcamp')) {
      meta = '6 Micro-Topics • XSS, CSP & Defensive Coding';
      threat = 'XSS Payload';
      siem = 'WAF Telemetry';
      pct = 90;
    } else {
      meta = `AI Grounded Roadmap • Tier 0${store.getState().currentTier} Mechanics`;
      threat = 'Vulnerability Triage';
      siem = 'Dynamic Telemetry';
      pct = 65;
    }

    if (cardTitle) cardTitle.textContent = clean;
    if (cardMeta) cardMeta.textContent = meta;
    if (threatTag) threatTag.textContent = threat;
    if (siemTag) siemTag.textContent = siem;
    if (labTag) labTag.textContent = 'Live SIEM Ready';
    if (pctText) pctText.textContent = `${pct}%`;
    if (fillBar) fillBar.style.width = `${pct}%`;
    if (btnText) {
      btnText.textContent = isHinglish ? `"${clean.slice(0, 16)}..." Shuru Karein` : `Engage "${clean.slice(0, 18)}"`;
    }
  }

  // Real-time synchronization as user types
  const customInput = container.querySelector('#custom-topic-input');
  customInput?.addEventListener('input', (e) => {
    updateHeroCard(e.target.value);
  });

  // 4. Engage Mission Button in Showcase Card (Real Launch, Not Demo!)
  container.querySelector('#btn-continue-active-mission')?.addEventListener('click', () => {
    soundFX.playClick();
    const topic = customInput?.value.trim() || 'Active Directory Kerberoasting';
    synthesizeCustomTopic(topic);
  });

  container.querySelector('#heroPlayIconBox')?.addEventListener('click', () => {
    soundFX.playClick();
    const topic = customInput?.value.trim() || 'Active Directory Kerberoasting';
    synthesizeCustomTopic(topic);
  });

  // 5. Start Learning Free Hero Button
  container.querySelector('#btn-hero-primary-start')?.addEventListener('click', () => {
    soundFX.playClick();
    const input = container.querySelector('#custom-topic-input');
    const topic = input?.value.trim() || 'Active Directory Kerberoasting';
    synthesizeCustomTopic(topic);
  });

  // 5b. Enlist Operative CTA Button (Guest Mode)
  container.querySelector('#btn-hero-enlist')?.addEventListener('click', () => {
    soundFX.playClick();
    window.dispatchEvent(new CustomEvent('kairos:open-auth-modal', { detail: { mode: 'register' } }));
  });

  // 6. Quick Exploit Chips
  container.querySelectorAll('.topic-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      soundFX.playClick();
      const topic = chip.getAttribute('data-topic');
      const input = container.querySelector('#custom-topic-input');
      if (input) input.value = topic;
      updateHeroCard(topic);
      synthesizeCustomTopic(topic);
    });
  });

  // 7. Custom Topic Form Submit
  container.querySelector('#custom-topic-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = container.querySelector('#custom-topic-input');
    const topic = input?.value.trim();
    if (topic) {
      synthesizeCustomTopic(topic);
    }
  });

  // 8. Footer Links
  container.querySelector('#footer-link-home')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  container.querySelector('#footer-link-courses')?.addEventListener('click', () => {
    container.querySelector('#courseCatalogSection')?.scrollIntoView({ behavior: 'smooth' });
  });

  container.querySelector('#footer-link-whyus')?.addEventListener('click', () => {
    container.querySelector('#whyUsSection')?.scrollIntoView({ behavior: 'smooth' });
  });

  container.querySelector('#footer-link-stories')?.addEventListener('click', () => {
    container.querySelector('#testimonialsSection')?.scrollIntoView({ behavior: 'smooth' });
  });

  container.querySelectorAll('.footer-topic-link').forEach(link => {
    link.addEventListener('click', () => {
      soundFX.playClick();
      const topic = link.getAttribute('data-topic');
      const input = container.querySelector('#custom-topic-input');
      if (input) input.value = topic;
      updateHeroCard(topic);
      synthesizeCustomTopic(topic);
    });
  });

  async function synthesizeCustomTopic(topicName) {
    if (isGenerating) return;
    const cleanTopic = (topicName || '').trim();
    const lower = cleanTopic.toLowerCase();

    // Check if topic matches a curated domain in CYBER_DOMAINS (Instant zero-latency high fidelity)
    const matchedCurriculum = CYBER_DOMAINS.find(d => 
      d.id === cleanTopic || 
      d.id.toLowerCase() === lower ||
      d.title.toLowerCase().includes(lower) || 
      lower.includes(d.id.toLowerCase()) ||
      (lower.includes('kerberoast') && d.id === 'ad-kerberoasting') ||
      (lower.includes('active directory') && d.id === 'ad-kerberoasting') ||
      (lower.includes('phishing') && d.id === 'phishing-social-eng') ||
      (lower.includes('malware') && d.id === 'malware-defense') ||
      (lower.includes('network') && d.id === 'network-exploitation') ||
      (lower.includes('jwt') && d.id === 'identity-token') ||
      (lower.includes('token') && d.id === 'identity-token') ||
      (lower.includes('cloud') && d.id === 'cloud-security')
    );

    if (matchedCurriculum) {
      soundFX.playSuccess();
      store.selectDomain(matchedCurriculum.id);
      return;
    }

    isGenerating = true;

    const btn = container.querySelector('#btn-hero-primary-start');
    if (btn) {
      btn.innerHTML = `<span>Synthesizing AI Scenarios...</span>`;
      btn.style.opacity = '0.7';
    }

    try {
      soundFX.playClick();
      const generated = await api.generateScenarios(cleanTopic, store.getState().currentTier, store.getState().language);
      
      const customDomain = {
        id: 'dyn_' + Date.now(),
        title: generated.domainTitle || topicName,
        titleHinglish: generated.domainTitleHinglish || topicName,
        icon: 'defense',
        description: generated.description || `AI Synthesized scenario suite for ${topicName}`,
        descriptionHinglish: generated.descriptionHinglish || `${topicName} par custom scenarios`,
        activeLearners: 1,
        microTopics: generated.scenarios?.map(s => s.microTopic) || [topicName],
        tiers: [
          { id: 1, name: 'Level 1: Awareness', focus: 'Threat Identification' },
          { id: 2, name: 'Level 2: Mechanics', focus: 'Attack Vectors' },
          { id: 3, name: 'Level 3: Mastery', focus: 'Forensic Remediation' }
        ],
        diagnostics: generated.scenarios || []
      };

      store.setActiveCustomDomain(customDomain);
      soundFX.playSuccess();
    } catch (err) {
      console.error('Custom synthesis error:', err);
      // Fallback: If custom synthesis fails, load preset domain so learning is never blocked
      const fallbackDomain = CYBER_DOMAINS[0];
      store.selectDomain(fallbackDomain.id);
    } finally {
      isGenerating = false;
      if (btn) {
        btn.innerHTML = `<span>${isHinglish ? 'Start Learning Free' : 'Start Learning Free'}</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`;
        btn.style.opacity = '1';
      }
    }
  }
}
