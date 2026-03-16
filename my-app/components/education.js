"use client"
import Image from "next/image"
import { useState } from "react"
import useThemeStore from "@/stores"

export default function Education({
  major, school, schoolShort, grade, startDate, endDate, schoolWeb, schoolImg, zoom, position
}) {
  const [isOpen, setIsOpen] = useState(false)
  const { darkMode } = useThemeStore()

  return (
    <>
      <style>{`
        .edu-card {
          border-top: 1px solid var(--border);
          padding: 1.25rem 0;
          cursor: pointer;
          transition: border-color 0.2s;
        }
        .edu-card:last-of-type {
          border-bottom: 1px solid var(--border);
        }
        .edu-card:hover { border-color: var(--text); }
        .edu-card:hover .edu-school { color: var(--text); }

        .edu-row {
          display: grid;
          grid-template-columns: 36px 1fr auto;
          align-items: start;
          gap: 1rem;
          width: 100%;
          background: none;
          border: none;
          cursor: pointer;
          text-align: left;
          padding: 0;
        }

        .edu-logo {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid var(--border);
          background: #fff;
          overflow: hidden;
          flex-shrink: 0;
          margin-top: 2px;
          transition: border-color 0.2s;
        }
        .edu-card:hover .edu-logo { border-color: var(--text); }

        .edu-meta { display: flex; flex-direction: column; gap: 3px; }

        .edu-school {
          font-family: 'Syne', sans-serif;
          font-size: 1.15rem;
          letter-spacing: 0.06em;
          color: ${darkMode ? 'white' : 'black'};
          transition: color 0.2s;
          line-height: 1;
        }

        .edu-major {
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 0.8rem;
          font-weight: 300;
          color: ${darkMode ? 'white' : 'black'};
          letter-spacing: 0.02em;
        }

        .edu-dates {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: ${darkMode ? 'white' : 'black'};
          white-space: nowrap;
          padding-top: 3px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .edu-dates-divider {
          width: 16px;
          height: 1px;
          background: var(--border);
          display: inline-block;
        }

        .edu-chevron {
          display: inline-block;
          width: 10px;
          height: 10px;
          border-right: 1.5px solid var(--muted);
          border-bottom: 1.5px solid var(--muted);
          transform: rotate(45deg);
          transition: transform 0.25s cubic-bezier(0.22,1,0.36,1), border-color 0.2s;
          margin-left: 4px;
          margin-top: 2px;
          flex-shrink: 0;
        }
        .edu-chevron.open {
          transform: rotate(-135deg);
          border-color: var(--text);
        }

        .edu-description {
          overflow: hidden;
          max-height: 0;
          transition: max-height 0.35s cubic-bezier(0.22,1,0.36,1), opacity 0.25s ease;
          opacity: 0;
        }
        .edu-description.open {
          max-height: 200px;
          opacity: 1;
        }
        .edu-description-inner {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 0.85rem;
          font-weight: 300;
          line-height: 1.75;
          color: var(--muted);
          padding: 1rem 0 0.25rem calc(36px + 1rem);
        }
        .edu-grade-label {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.62rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--text);
          border: 1px solid var(--text);
          border-radius: 100px;
          padding: 3px 10px;
          white-space: nowrap;
          opacity: 0.75;
        }
      `}</style>

      <div className="edu-card" onClick={() => setIsOpen(o => !o)}>
        <div className="edu-row">
          {/* Logo */}
          <div className="edu-logo">
            <Image
              src={schoolImg}
              alt={`${school} logo`}
              width={300}
              height={300}
              className="object-cover"
              style={{ transform: `scale(${zoom})`, transformOrigin: position, width: "100%", height: "100%" }}
            />
          </div>

          {/* Text */}
          <div className="edu-meta">
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span className="edu-school">
                <span className="hidden sm:inline">{school}</span>
                <span className="inline sm:hidden">{schoolShort}</span>
              </span>
              <span className={`edu-chevron${isOpen ? " open" : ""}`} />
            </div>
            <span className="edu-major">{major}</span>
          </div>

          {/* Dates */}
          <div className="edu-dates">
            {startDate}
            <span className="edu-dates-divider" />
            {endDate}
          </div>
        </div>

        {/* Expandable grade + link */}
        <div className={`edu-description${isOpen ? " open" : ""}`}>
          <div className="edu-description-inner">
            {grade && <span className="edu-grade-label">{grade}</span>}
          </div>
        </div>
      </div>
    </>
  )
}