"use client"
import { Github, Linkedin, Mail, Download } from "@deemlol/next-icons"
import useThemeStore from "@/stores"
import { useState, useRef, useEffect } from "react"

export default function ContactBar() {
  const { darkMode } = useThemeStore()
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const popupRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    if (isOpen) document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen])

  function handleDownload() {
    if (typeof gtag === "function") {
      gtag("event", "resume_download", {
        event_category: "engagement",
        event_label: "Resume Button",
      })
    }
    const link = document.createElement("a")
    link.href = "resume.pdf"
    link.download = "Isaac's Resume"
    link.click()
  }

  function handleCopy() {
    navigator.clipboard.writeText("kaishaeng@gmail.com")
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
      setIsOpen(false)
    }, 1400)
  }

  return (
    <>
      <style>{`
        .cbar {
          position: fixed;
          bottom: 0; left: 0; right: 0;
          z-index: 200;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 clamp(1.5rem, 6vw, 5rem);
          height: 52px;
          border-top: 1px solid var(--border);
          background: var(--bg);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          transition: background 0.4s ease, border-color 0.4s ease;
        }

        /* left slot */
        .cbar-resume {
          display: flex;
          align-items: center;
          gap: 7px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.62rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--bg);
          background: var(--text);
          border: 1px solid var(--text);
          border-radius: 100px;
          padding: 6px 15px;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.15s;
          white-space: nowrap;
          font-weight: 500;
        }
        .cbar-resume:hover { opacity: 0.8; transform: translateY(-1px); }
        .cbar-resume:active { transform: translateY(0); }

        /* centre icons */
        .cbar-icons {
          display: flex;
          align-items: center;
          gap: 1.75rem;
        }
        .cbar-icon-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          opacity: 0.5;
          transition: opacity 0.2s;
        }
        .cbar-icon-btn:hover { opacity: 1; }

        /* mail popup */
        .mail-wrap { position: relative; display: flex; align-items: center; }
        .mail-popup {
          position: absolute;
          bottom: calc(100% + 12px);
          left: 50%;
          transform: translateX(-50%);
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 6px;
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 148px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
          animation: popIn 0.15s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        @keyframes popIn {
          from { opacity: 0; transform: translateX(-50%) translateY(6px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        .mail-popup-item {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.62rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--muted);
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px 12px;
          border-radius: 6px;
          text-align: left;
          transition: background 0.15s, color 0.15s;
          white-space: nowrap;
        }
        .mail-popup-item:hover { background: var(--border); color: var(--text); }
        .mail-popup-item.copied { color: #4ade80; }



        /* push page content above bar */
        .cbar-spacer { height: 52px; }
      `}</style>

      <div className="cbar-spacer" />

      <footer className="cbar">
        {/* ── Resume ── */}
        <button className="cbar-resume" onClick={handleDownload} aria-label="Download resume">
          <Download size={13} color="var(--bg)" />
          Resume
        </button>

        {/* ── Social icons ── */}
        <div className="cbar-icons">
          <button
            className="cbar-icon-btn"
            onClick={() => window.open("https://github.com/isaaclks7", "_blank")}
            aria-label="GitHub"
          >
            <Github size={18} color="var(--text)" />
          </button>

          <button
            className="cbar-icon-btn"
            onClick={() => window.open("https://linkedin.com/in/isaaclks7", "_blank")}
            aria-label="LinkedIn"
          >
            <Linkedin size={18} color="var(--text)" />
          </button>

          <div className="mail-wrap" ref={popupRef}>
            <button
              className="cbar-icon-btn"
              onClick={() => setIsOpen(o => !o)}
              aria-label="Email"
            >
              <Mail size={18} color="var(--text)" />
            </button>

            {isOpen && (
              <div className="mail-popup" role="menu">
                <button
                  className="mail-popup-item"
                  onClick={() => { window.location.href = "mailto:kaishaeng@gmail.com"; setIsOpen(false) }}
                >
                  Send email
                </button>
                <button
                  className={`mail-popup-item${copied ? " copied" : ""}`}
                  onClick={handleCopy}
                >
                  {copied ? "✓ Copied!" : "Copy address"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* spacer to keep icons centred */}
        <div style={{ visibility: "hidden", pointerEvents: "none" }} className="cbar-resume">Resume</div>
      </footer>
    </>
  )
}