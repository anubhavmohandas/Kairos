/**
 * Persistent ELI5 AI Tutor Component
 * Floating side button & slide-out cyber drawer adhering to strict 2-3 line brevity rule
 * and real-life intuition metaphors.
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
      text: 'Hey Agent! I am your ELI5 Cyber Tutor. Ask me any concept—I will explain it in 2-3 lines with a real-life analogy!'
    }
  ];

  function render() {
    const state = store.getState();
    const isHinglish = state.language === 'hinglish';

    container.innerHTML = `
      <!-- Persistent Floating Button -->
      <button class="eli5-floating-btn" id="btn-toggle-tutor" title="Explain Like I'm 5 AI Tutor">
        <span style="font-size: 1.2rem;">🤖</span>
        <span>${isHinglish ? 'ELI5 Cyber Tutor' : 'ELI5 AI Tutor'}</span>
      </button>

      <!-- Slide-Out Drawer -->
      <div class="eli5-drawer ${isOpen ? 'open' : ''}" id="tutor-drawer">
        <!-- Header -->
        <div class="eli5-drawer-header">
          <div class="eli5-title-group">
            <div class="eli5-avatar">🤖</div>
            <div>
              <div style="font-weight: 800; font-size: 0.95rem; color: #fff;">
                KAIROS ELI5 TUTOR
              </div>
              <div style="font-size: 0.72rem; color: var(--neon-cyan); font-family: var(--font-mono);">
                ${gemini.hasApiKey() ? '• Gemini 3.8 Flash Active' : '• Built-in EL10 Engine'}
              </div>
            </div>
          </div>

          <button id="btn-close-tutor" class="modal-close-btn" style="position: static; width: 32px; height: 32px;">
            ✕
          </button>
        </div>

        <!-- Chat Messages -->
        <div class="eli5-messages" id="tutor-messages-list">
          ${messages.map(m => `
            <div class="chat-bubble ${m.sender}">
              ${m.text}
            </div>
          `).join('')}
        </div>

        <!-- Prompt Quick Chips -->
        <div class="eli5-prompt-chips">
          <button class="prompt-chip" data-prompt="Explain this like I am 5 years old">
            👶 ${isHinglish ? 'Simple Analogy' : 'ELI5 Analogy'}
          </button>
          <button class="prompt-chip" data-prompt="Why is this dangerous in production?">
            ⚠️ ${isHinglish ? 'Asal Risk Kya Hai?' : 'Real-world Risk'}
          </button>
          <button class="prompt-chip" data-prompt="Hinglish mein 2 line mein samjhao">
            🇮🇳 ${isHinglish ? 'Hinglish 2-Line' : 'Hinglish Quick Tip'}
          </button>
        </div>

        <!-- Input Bar -->
        <form class="eli5-input-bar" id="tutor-form">
          <input 
            type="text" 
            id="tutor-input" 
            placeholder="${isHinglish ? 'Koi bhi cybersecurity sawal poochho...' : 'Ask any cyber question (e.g. JWT alg none)...'}" 
            autocomplete="off"
          />
          <button type="submit" class="btn btn-cyan btn-sm">
            <span>Send</span>
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
    messages.push({ sender: 'tutor', text: 'Thinking in 2-3 lines...' });
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
