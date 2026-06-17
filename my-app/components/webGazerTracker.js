"use client"
import { useState, useEffect, useRef } from "react"
import Script from "next/script"

const STYLES = `
  @keyframes wg-fade-in {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .wg-fab {
    position: fixed;
    bottom: 2rem;
    left: 2rem;
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
    color: var(--bg);
  }
  .wg-fab:hover { transform: scale(1.1); }
  .wg-fab.active { background: #3b82f6; border-color: #3b82f6; color: white; }

  .wg-status {
    position: fixed;
    bottom: 6rem;
    left: 2rem;
    z-index: 199;
    background: var(--bg);
    border: 1px solid var(--border);
    padding: 0.75rem 1rem;
    border-radius: 4px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.7rem;
    color: var(--text);
    animation: wg-fade-in 0.3s ease-out both;
    max-width: 240px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.15);
  }

  .wg-dot {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 8px;
  }
  .wg-dot.red { background: #ef4444; }
  .wg-dot.green { background: #22c55e; }

  /* Gaze highlighting */
  .gaze-highlight {
    outline: 2px solid #3b82f6 !important;
    outline-offset: 4px;
    transition: outline 0.2s ease;
  }

  /* WebGazer overrides */
  #webgazerVideoContainer, #webgazerFaceOverlay, #webgazerFaceFeedbackBox, #webgazerGazeDot {
    pointer-events: none !important;
  }
  #webgazerVideoContainer {
    top: 20px !important;
    left: auto !important;
    right: 20px !important;
    width: 160px !important;
    height: 120px !important;
    border: 2px solid var(--border) !important;
    border-radius: 8px !important;
    overflow: hidden !important;
    z-index: 1000 !important;
    pointer-events: auto !important;
  }
`

function EyeIcon({ className }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      width="24" 
      height="24"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

export default function WebGazerTracker() {
  const [active, setActive] = useState(false)
  const [status, setStatus] = useState("Inactive")
  const [initialized, setInitialized] = useState(false)
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const lastHighlightedRef = useRef(null)

  useEffect(() => {
    if (!scriptLoaded) return
    const wg = window.webgazer
    if (!wg) return

    const handleGaze = (data) => {
      if (!data) return

      // 1. Auto-scroll logic
      const scrollThreshold = 0.15
      const scrollSpeed = 15
      const { x, y } = data
      const vh = window.innerHeight
      
      if (y < vh * scrollThreshold) {
        window.scrollBy(0, -scrollSpeed)
      } else if (y > vh * (1 - scrollThreshold)) {
        window.scrollBy(0, scrollSpeed)
      }

      // 2. Highlighting logic
      const element = document.elementFromPoint(x, y)
      if (element && element !== lastHighlightedRef.current) {
        if (lastHighlightedRef.current) {
          lastHighlightedRef.current.classList.remove("gaze-highlight")
        }
        
        const isClickable = element.tagName === "A" || 
                          element.tagName === "BUTTON" || 
                          element.closest("section") ||
                          element.classList.contains("proj-card")
        
        if (isClickable) {
          element.classList.add("gaze-highlight")
          lastHighlightedRef.current = element
        } else {
          lastHighlightedRef.current = null
        }
      }
    }

    const startWebGazer = async () => {
      try {
        setStatus("Initializing Camera...")
        wg.setGazeListener((data) => handleGaze(data))
        await wg.begin()
        wg.showVideoPreview(true)
          .showPredictionPoints(true)
          .applyKalmanFilter(true)
          .setRegression('ridge')
          .addMouseEventListeners()

        setInitialized(true)
        setStatus("Tracking Active")
      } catch (err) {
        console.error("WebGazer failed to initialize:", err)
        setStatus("Error: " + (err.message || "Could not start camera"))
        setActive(false)
      }
    }

    if (active) {
      if (!initialized) {
        startWebGazer()
      } else {
        wg.resume()
        setStatus("Tracking Resumed")
        const els = ["webgazerVideoContainer", "webgazerFaceOverlay", "webgazerFaceFeedbackBox", "webgazerGazeDot"]
        els.forEach(id => {
          const el = document.getElementById(id)
          if (el) el.style.display = "block"
        })
      }
    } else if (initialized) {
      wg.pause()
      setStatus("Paused")
      const els = ["webgazerVideoContainer", "webgazerFaceOverlay", "webgazerFaceFeedbackBox", "webgazerGazeDot"]
      els.forEach(id => {
        const el = document.getElementById(id)
        if (el) el.style.display = "none"
      })
      if (lastHighlightedRef.current) {
        lastHighlightedRef.current.classList.remove("gaze-highlight")
        lastHighlightedRef.current = null
      }
    }

  }, [active, initialized, scriptLoaded])

  const toggleTracking = () => {
    setActive(!active)
  }

  return (
    <>
      <Script 
        src="https://webgazer.cs.brown.edu/webgazer.js" 
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
      />
      <style>{STYLES}</style>
      
      {active && (
        <div className="wg-status">
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
            <span className={`wg-dot ${initialized ? 'green' : 'red'}`} />
            <strong>WebGazer: {status}</strong>
          </div>
          <p style={{ fontSize: '0.6rem', opacity: 0.7, margin: 0 }}>
            Tip: Click around the screen to calibrate the tracker. Watch the red dot!
          </p>
        </div>
      )}

      <button 
        className={`wg-fab ${active ? 'active' : ''}`}
        onClick={toggleTracking}
        title={active ? "Deactivate Eye Tracking" : "Activate Eye Tracking"}
        aria-label="Toggle Eye Tracking"
      >
        <EyeIcon />
      </button>
    </>
  )
}
