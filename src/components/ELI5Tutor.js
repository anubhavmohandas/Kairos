/**
 * Persistent ELI5 AI Tutor Component
 * High-tech Glassmorphism drawer adhering to strict 2-3 line brevity rule
 * and real-life intuition metaphors with zero emojis and 100% SVG iconography.
 */

import { gemini } from '../services/geminiService.js';
import { store } from '../state/store.js';
import { soundFX } from '../services/soundEffects.js';

export function setupELI5Tutor(container) {
  let isOpen = false;
  let activeTopic = 'DNS & Subdomain Spoofing';
  let messages = [
    {
      sender: 'tutor',
      text: 'Hey Operative! I am your KAIROS ELI5 Tutor. Ask me any cybersecurity concept—I will break it down in 2-3 crisp lines using an intuitive real-world analogy!'
    }
  ];

  function render() {
    const state = store.getState();
    const isHinglish = state.language === 'hinglish';

    container.innerHTML = `
      <!-- Persistent Floating Glassmorphism Action Button -->
      <button class="eli5-floating-btn" id="btn-toggle-tutor" title="Explain Like I'm 5 AI Tutor">
        <span class="eli5-fab-icon-box">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <rect x="3" y="11" width="18" height="10" rx="2"></rect>
            <circle cx="12" cy="5" r="2"></circle>
            <path d="M12 7v4"></path>
            <line x1="8" y1="16" x2="8" y2="16"></line>
            <line x1="16" y1="16" x2="16" y2="16"></line>
          </svg>
        </span>
        <span class="eli5-fab-label">${isHinglish ? 'ELI5 Cyber Tutor' : 'ELI5 AI Tutor'}</span>
        <span class="fab-pulse-dot"></span>
      </button>

      <!-- Slide-Out Glassmorphism Cyber Drawer -->
      <div class="eli5-drawer ${isOpen ? 'open' : ''}" id="tutor-drawer">
        
        <!-- Header -->
        <div class="eli5-drawer-header">
          <div class="eli5-title-group">
            <div class="eli5-avatar">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111827" stroke-width="2.5">
                <rect x="3" y="11" width="18" height="10" rx="2"></rect>
                <circle cx="12" cy="5" r="2"></circle>
                <path d="M12 7v4"></path>
                <line x1="8" y1="16" x2="8" y2="16"></line>
                <line x1="16" y1="16" x2="16" y2="16"></line>
              </svg>
            </div>
            <div>
              <div class="eli5-header-title">
                KAIROS ELI5 TUTOR
              </div>
              <div class="eli5-engine-badge">
                <span class="engine-indicator-dot"></span>
                <span>${gemini.hasApiKey() ? 'Gemini 3.8 Flash Active' : 'EL10 High-Fidelity Engine'}</span>
              </div>
            </div>
          </div>

          <button id="btn-close-tutor" class="eli5-close-btn" title="Close ELI5 Tutor">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <!-- Active Topic Context Strip -->
        <div class="eli5-context-strip">
          <span class="context-tag-label">${isHinglish ? 'Topic Focus:' : 'Focus:'}</span>
          <span class="context-topic-name">${activeTopic}</span>
          <span class="rule-badge">2-Line Rule</span>
        </div>

        <!-- Chat Messages -->
        <div class="eli5-messages" id="tutor-messages-list">
          ${messages.map(m => `
            <div class="chat-bubble ${m.sender}">
              <div class="chat-sender-tag ${m.sender === 'user' ? 'user-tag' : ''}">
                ${m.sender === 'user' ? `
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  <span>YOU</span>
                ` : `
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="10" rx="2"></rect><circle cx="12" cy="5" r="2"></circle><path d="M12 7v4"></path></svg>
                  <span>ELI5 AI TUTOR</span>
                `}
              </div>
              <div class="chat-text-body">${m.text}</div>
            </div>
          `).join('')}
        </div>

        <!-- Prompt Quick Chips Tray -->
        <div class="eli5-prompt-chips">
          <button class="prompt-chip" data-prompt="Explain this like I am 5 years old">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>
            <span>${isHinglish ? 'Simple Analogy' : 'ELI5 Analogy'}</span>
          </button>
          <button class="prompt-chip" data-prompt="Why is this dangerous in production?">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            <span>${isHinglish ? 'Asal Risk Kya Hai?' : 'Production Risk'}</span>
          </button>
          <button class="prompt-chip" data-prompt="Hinglish mein 2 line mein samjhao">
            <span style="font-weight:800; font-size: 0.72rem; font-family: var(--font-mono); color: #e11d48;">[HI]</span>
            <span>${isHinglish ? 'Hinglish 2-Line' : 'Hinglish Tip'}</span>
          </button>
        </div>

        <!-- Input Bar -->
        <form class="eli5-input-bar" id="tutor-form">
          <input 
            type="text" 
            id="tutor-input" 
            placeholder="${isHinglish ? 'Cybersecurity sawal poochho (2 line answer)...' : 'Ask any cyber question (e.g. JWT secret spoof)...'}" 
            autocomplete="off"
          />
          <button type="submit" class="btn-tutor-send" title="Send question">
            <span>Send</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>

      </div>
    `;

    // Event handlers
    container.querySelector('#btn-toggle-tutor')?.addEventListener('click', () => {
      isOpen = !isOpen;
      soundFX.playClick();
      render();
    });

    container.querySelector('#btn-close-tutor')?.addEventListener('click', () => {
      isOpen = false;
      soundFX.playClick();
      render();
    });

    container.querySelectorAll('.prompt-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const text = chip.getAttribute('data-prompt');
        handleUserQuery(text);
      });
    });

    container.querySelector('#tutor-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = container.querySelector('#tutor-input');
      const val = input.value.trim();
      if (val) {
        handleUserQuery(val);
      }
    });

    // Scroll chat to bottom
    const msgList = container.querySelector('#tutor-messages-list');
    if (msgList) msgList.scrollTop = msgList.scrollHeight;
  }

  async function handleUserQuery(queryText) {
    messages.push({ sender: 'user', text: queryText });
    messages.push({ sender: 'tutor', text: 'Synthesizing 2-3 line analogy...' });
    render();

    const state = store.getState();
    const explanation = await gemini.getELI5Explanation({
      topic: activeTopic,
      userQuery: queryText,
      language: state.language
    });

    // Replace thinking placeholder
    messages.pop();
    messages.push({ sender: 'tutor', text: explanation });
    soundFX.playSuccess();
    render();
  }

  // Global event listener to trigger tutor externally
  window.addEventListener('kairos:open-tutor', (e) => {
    if (e.detail?.topic) activeTopic = e.detail.topic;
    isOpen = true;
    if (e.detail?.context) {
      messages.push({
        sender: 'user',
        text: `Explain ${activeTopic} in simple terms.`
      });
      handleUserQuery(`Explain ${activeTopic} in 2-3 lines.`);
    } else {
      render();
    }
  });

  render();
}
