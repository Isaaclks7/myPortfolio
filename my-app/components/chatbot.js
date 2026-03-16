"use client"
import { useState, useRef, useEffect } from "react"

const STYLES = `
  @keyframes chatPanelIn {
    from { opacity: 0; transform: translateX(24px) scale(0.97); }
    to   { opacity: 1; transform: translateX(0)    scale(1);    }
  }
  @keyframes msgIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0);   }
  }
  @keyframes pulseRing {
    0%   { transform: scale(1);    opacity: 0.6; }
    70%  { transform: scale(1.55); opacity: 0;   }
    100% { transform: scale(1.55); opacity: 0;   }
  }
  @keyframes blink {
    0%, 100% { opacity: 1;   }
    50%       { opacity: 0.2; }
  }
  @keyframes typingDot {
    0%, 80%, 100% { transform: translateY(0);    opacity: 0.3; }
    40%           { transform: translateY(-4px); opacity: 1;   }
  }

  /* ── FAB button ── */
  .cb-fab {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    z-index: 200;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: var(--text);
    border: 1px solid var(--border);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1),
                background 0.2s;
    box-shadow: 0 4px 24px rgba(0,0,0,0.25);
  }
  .cb-fab:hover { transform: scale(1.1); }
  .cb-fab.open  { transform: scale(0.92) rotate(8deg); }

  /* pulse ring */
  .cb-fab::before {
    content: '';
    position: absolute;
    inset: -1px;
    border-radius: 50%;
    border: 1px solid var(--text);
    animation: pulseRing 2.8s ease-out infinite;
    pointer-events: none;
  }

  /* ── Robot SVG icon ── */
  .cb-robot { color: var(--bg); width: 26px; height: 26px; }
  .cb-close  { color: var(--bg); font-size: 1.25rem; line-height: 1; font-family: 'IBM Plex Mono', monospace; }

  /* ── Chat panel ── */
  .cb-panel {
    position: fixed;
    bottom: 5.5rem;
    right: 2rem;
    z-index: 199;
    width: clamp(300px, 90vw, 380px);
    height: clamp(440px, 65vh, 580px);
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    animation: chatPanelIn 0.35s cubic-bezier(0.22,1,0.36,1) both;
    box-shadow: 0 16px 48px rgba(0,0,0,0.2);
  }

  /* ── Panel header ── */
  .cb-header {
    padding: 0.85rem 1.1rem;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-shrink: 0;
  }
  .cb-header-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #22c55e;
    animation: blink 2s ease-in-out infinite;
    flex-shrink: 0;
  }
  .cb-header-title {
    font-family: 'Syne', sans-serif;
    font-size: 0.8rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text);
    flex: 1;
  }
  .cb-header-sub {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.55rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--muted);
  }

  /* ── Messages area ── */
  .cb-messages {
    flex: 1;
    overflow-y: auto;
    padding: 1.2rem 1.1rem;
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
    scrollbar-width: thin;
  }
  .cb-messages::-webkit-scrollbar { width: 3px; }
  .cb-messages::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

  /* ── Message bubble ── */
  .cb-msg {
    max-width: 82%;
    animation: msgIn 0.28s cubic-bezier(0.22,1,0.36,1) both;
  }
  .cb-msg.bot  { align-self: flex-start; }
  .cb-msg.user { align-self: flex-end; }

  .cb-bubble {
    padding: 0.6rem 0.85rem;
    border-radius: 2px;
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 0.8rem;
    line-height: 1.6;
    font-weight: 300;
  }
  .cb-msg.bot .cb-bubble {
    background: transparent;
    border: 1px solid var(--border);
    color: var(--text);
    border-bottom-left-radius: 0;
  }
  .cb-msg.user .cb-bubble {
    background: var(--text);
    color: var(--bg);
    border-bottom-right-radius: 0;
  }
  .cb-msg-meta {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.5rem;
    letter-spacing: 0.12em;
    color: var(--muted);
    margin-top: 4px;
    text-transform: uppercase;
  }
  .cb-msg.user .cb-msg-meta { text-align: right; }

  /* ── Typing indicator ── */
  .cb-typing {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 0.6rem 0.85rem;
    border: 1px solid var(--border);
    border-radius: 2px;
    border-bottom-left-radius: 0;
    width: fit-content;
  }
  .cb-typing span {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: var(--muted);
    display: inline-block;
    animation: typingDot 1.2s ease-in-out infinite;
  }
  .cb-typing span:nth-child(2) { animation-delay: 0.15s; }
  .cb-typing span:nth-child(3) { animation-delay: 0.3s;  }

  /* ── Input row ── */
  .cb-input-row {
    border-top: 1px solid var(--border);
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }
  .cb-input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    padding: 0.85rem 1.1rem;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.72rem;
    color: var(--text);
    caret-color: var(--text);
    letter-spacing: 0.03em;
  }
  .cb-input::placeholder { color: var(--muted); opacity: 0.6; }
  .cb-send {
    flex-shrink: 0;
    background: transparent;
    border: none;
    border-left: 1px solid var(--border);
    cursor: pointer;
    padding: 0 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--muted);
    transition: color 0.2s;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.65rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    min-height: 46px;
    white-space: nowrap;
  }
  .cb-send:hover:not(:disabled) { color: var(--text); }
  .cb-send:disabled { opacity: 0.3; cursor: default; }
`

// ── Robot SVG ──
function RobotIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* head */}
      <rect x="5" y="6" width="14" height="10" rx="2" />
      {/* eyes */}
      <circle cx="9"  cy="11" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="15" cy="11" r="1.2" fill="currentColor" stroke="none" />
      {/* antenna */}
      <line x1="12" y1="6"  x2="12" y2="3" />
      <circle cx="12" cy="2.5" r="0.8" fill="currentColor" stroke="none" />
      {/* body */}
      <rect x="8" y="16" width="8" height="4" rx="1" />
      {/* arms */}
      <line x1="5"  y1="8.5" x2="3"  y2="10" />
      <line x1="19" y1="8.5" x2="21" y2="10" />
      {/* mouth */}
      <line x1="9.5" y1="13.5" x2="14.5" y2="13.5" />
    </svg>
  )
}

function now() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

const GREETING = {
  role: "bot",
  text: "Hey — I'm Isaac's assistant. Ask me anything about his work, skills, or projects.",
  time: now(),
}

// ── Simulated responses — swap getBotReply for a real API call if needed ──
async function getBotReply(userMsg) {
  return "Sorry, this bot is still a work in progress."
}

export default function Chatbot() {
  const [open, setOpen]       = useState(false)
  const [messages, setMessages] = useState([GREETING])
  const [input, setInput]     = useState("")
  const [typing, setTyping]   = useState(false)
  const bottomRef = useRef(null)
  const inputRef  = useRef(null)

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, typing])

  // Focus input when panel opens
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 350)
  }, [open])

  const send = async () => {
    const text = input.trim()
    if (!text || typing) return
    setInput("")
    setMessages(prev => [...prev, { role: "user", text, time: now() }])
    setTyping(true)
    const reply = await getBotReply(text)
    setTyping(false)
    setMessages(prev => [...prev, { role: "bot", text: reply, time: now() }])
  }

  const onKey = e => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send() }
  }

  return (
    <>
      <style>{STYLES}</style>

      {/* ── Chat panel ── */}
      {open && (
        <div className="cb-panel" role="dialog" aria-label="Chat with Isaac's assistant">
          {/* Header */}
          <div className="cb-header">
            <span className="cb-header-dot" />
            <span className="cb-header-title">Isaac's Assistant</span>
            <span className="cb-header-sub">AI — online</span>
          </div>

          {/* Messages */}
          <div className="cb-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`cb-msg ${msg.role}`}>
                <div className="cb-bubble">{msg.text}</div>
                <div className="cb-msg-meta">{msg.time}</div>
              </div>
            ))}

            {typing && (
              <div className="cb-msg bot">
                <div className="cb-typing">
                  <span /><span /><span />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="cb-input-row">
            <input
              ref={inputRef}
              className="cb-input"
              placeholder="Ask something…"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKey}
              disabled={typing}
            />
            <button
              className="cb-send"
              onClick={send}
              disabled={!input.trim() || typing}
            >
              Send →
            </button>
          </div>
        </div>
      )}

      {/* ── FAB ── */}
      <button
        className={`cb-fab${open ? " open" : ""}`}
        onClick={() => setOpen(v => !v)}
        aria-label={open ? "Close chat" : "Open chat"}
      >
        {open
          ? <span className="cb-close">✕</span>
          : <RobotIcon className="cb-robot" />
        }
      </button>
    </>
  )
}