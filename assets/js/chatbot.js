/* chatbot.js — AXIOM interactive chatbot: click mascot to open, sends to Cloudflare Worker */

/* ══════════════════════════════════════════════════════════
   CONFIGURE URL CLOUDFLARE WORKER KAMU DI SINI:
   ══════════════════════════════════════════════════════════ */
const AXIOM_API_URL = "https://axiom-chatbot-proxy.mohwisam27.workers.dev/";
/* ══════════════════════════════════════════════════════════ */

let _chatOpen     = false;
let _chatWaiting  = false;
let _chatPanel    = null;
let _chatMessages = null;
let _chatInput    = null;
let _chatSend     = null;

/* ── Build chat panel HTML ────────────────────────────────── */
function _buildChatPanel() {
  const wrap = document.createElement('div');
  wrap.id = 'axiom-chat';
  wrap.innerHTML = `
    <div class="chat-panel">
      <div class="chat-header">
        <span class="chat-status-dot"></span>
        <div>
          <div class="chat-title">AXIOM</div>
          <div class="chat-subtitle">AI Assistant &nbsp;·&nbsp; Online</div>
        </div>
        <button class="chat-close" id="chat-close" aria-label="Tutup chat">&#x2715;</button>
      </div>
      <div class="chat-messages" id="chat-messages"></div>
      <div class="chat-input-wrap">
        <input class="chat-input" id="chat-input" type="text"
          placeholder="Ketik pesan untuk AXIOM..." maxlength="500" autocomplete="off" />
        <button class="chat-send" id="chat-send" aria-label="Kirim">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(wrap);
  return wrap;
}

/* ── Append message bubble ────────────────────────────────── */
function _addMessage(text, role, isError = false) {
  const msg = document.createElement('div');
  msg.className = `chat-msg ${role}`;

  const avatar = document.createElement('div');
  avatar.className = 'msg-avatar';
  avatar.textContent = role === 'axiom' ? 'AX' : 'YOU';

  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble' + (isError ? ' error' : '');
  bubble.textContent = text;

  msg.appendChild(avatar);
  msg.appendChild(bubble);
  _chatMessages.appendChild(msg);
  _chatMessages.scrollTop = _chatMessages.scrollHeight;
  return msg;
}

/* ── Show / hide typing indicator ────────────────────────── */
function _showTyping() {
  const el = document.createElement('div');
  el.className = 'chat-typing';
  el.id = '_chat_typing';
  el.innerHTML = `
    <div class="msg-avatar" style="background:rgba(0,245,255,.12);border:1px solid rgba(0,245,255,.4);color:#00F5FF;font-family:'Orbitron',sans-serif;font-size:.55rem;font-weight:700;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;">AX</div>
    <div class="typing-dots"><span></span><span></span><span></span></div>
  `;
  _chatMessages.appendChild(el);
  _chatMessages.scrollTop = _chatMessages.scrollHeight;
}

function _hideTyping() {
  const el = document.getElementById('_chat_typing');
  if (el) el.remove();
}

/* ── Send message to Cloudflare Worker ───────────────────── */
async function _sendToAPI(userMessage) {
  _chatWaiting = true;
  _chatSend.disabled = true;
  _showTyping();

  try {
    const res = await fetch(AXIOM_API_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ message: userMessage })
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();

    /* Sesuaikan dengan format response dari Cloudflare Worker kamu.
       Coba beberapa format umum: */
    const reply = data.response
      ?? data.reply
      ?? data.message
      ?? data.result
      ?? data.text
      ?? (typeof data === 'string' ? data : JSON.stringify(data));

    _hideTyping();
    _addMessage(reply, 'axiom');

  } catch (err) {
    _hideTyping();
    _addMessage(
      err.message.includes('GANTI_DENGAN')
        ? '[ API URL belum dikonfigurasi. Isi AXIOM_API_URL di chatbot.js ]'
        : `[ Error: ${err.message} ]`,
      'axiom', true
    );
  }

  _chatWaiting = false;
  _chatSend.disabled = false;
  _chatInput.focus();
}

/* ── Handle send ──────────────────────────────────────────── */
function _handleSend() {
  const text = _chatInput.value.trim();
  if (!text || _chatWaiting) return;
  _chatInput.value = '';
  _addMessage(text, 'user');
  _sendToAPI(text);
}

/* ── Open / close chat panel ─────────────────────────────── */
function openChat() {
  if (_chatOpen) return;
  _chatOpen = true;

  if (!_chatPanel) {
    _chatPanel    = _buildChatPanel();
    _chatMessages = document.getElementById('chat-messages');
    _chatInput    = document.getElementById('chat-input');
    _chatSend     = document.getElementById('chat-send');

    /* Send handlers */
    _chatSend.addEventListener('click', _handleSend);
    _chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); _handleSend(); }
    });

    /* Close button */
    document.getElementById('chat-close').addEventListener('click', closeChat);

    /* Greeting */
    setTimeout(() => {
      _addMessage('Halo! Saya AXIOM. Ada yang ingin kamu tanyakan tentang Wisam?', 'axiom');
    }, 350);

    /* Register cursor hover */
    if (window.addCursorHover) {
      addCursorHover([_chatSend, document.getElementById('chat-close'), _chatInput]);
    }
  }

  requestAnimationFrame(() => _chatPanel.classList.add('open'));

  const mascot = document.getElementById('axiom-sticky');
  if (mascot) mascot.classList.add('chatbot-open');
}

function closeChat() {
  if (!_chatOpen) return;
  _chatOpen = false;
  if (_chatPanel) _chatPanel.classList.remove('open');
  const mascot = document.getElementById('axiom-sticky');
  if (mascot) mascot.classList.remove('chatbot-open');
}

/* ── Attach click handler to mascot ──────────────────────── */
function initChatbot() {

  function _attachToMascot(mascot) {
    mascot.style.pointerEvents = 'auto';
    mascot.addEventListener('click', () => {
      _chatOpen ? closeChat() : openChat();
    });
  }

  /* Mascot may not exist yet (created by axiom.js on first scroll) */
  const existing = document.getElementById('axiom-sticky');
  if (existing) {
    _attachToMascot(existing);
  } else {
    const observer = new MutationObserver(() => {
      const mascot = document.getElementById('axiom-sticky');
      if (!mascot) return;
      _attachToMascot(mascot);
      observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: false });
  }

  /* Click OUTSIDE chat panel + mascot → close (history kept) */
  document.addEventListener('click', (e) => {
    if (!_chatOpen) return;
    const panel  = document.getElementById('axiom-chat');
    const mascot = document.getElementById('axiom-sticky');
    const outside = (!panel  || !panel.contains(e.target)) &&
                    (!mascot || !mascot.contains(e.target));
    if (outside) closeChat();
  });

  /* Escape key closes chat */
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeChat(); });
}
