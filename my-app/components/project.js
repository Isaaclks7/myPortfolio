"use client"
import { useState } from "react"
import useThemeStore from "@/stores"
import PhotoViewer from "./photoViewer"

export default function Project({
  name, description, technologies, photos, captions, startDate, endDate, vidZoom, vidPosition, width, githubLink
}) {
  const [isOpen, setIsOpen] = useState(false)
  const { darkMode } = useThemeStore()

  // technologies may be a string or array — normalise to array of tags
  const techList = Array.isArray(technologies)
    ? technologies
    : typeof technologies === "string"
      ? technologies.split(",").map(t => t.trim()).filter(Boolean)
      : []

  return (
    <>
      <style>{`
        .proj-card {
          border-top: 1px solid var(--border);
          padding: 1.25rem 0;
          cursor: pointer;
          transition: border-color 0.2s;
        }
        .proj-card:last-of-type {
          border-bottom: 1px solid var(--border);
        }
        .proj-card:hover { border-color: var(--text); }
        .proj-card:hover .proj-name { color: var(--text); }

        .proj-row {
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: start;
          gap: 1rem;
          width: 100%;
        }

        .proj-meta { display: flex; flex-direction: column; gap: 4px; }

        .proj-name-row {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .proj-name {
          font-family: 'Syne', sans-serif;
          font-size: 1.15rem;
          font-weight: 400;
          letter-spacing: 0.06em;
          color: ${darkMode ? 'white' : 'black'};
          transition: color 0.2s;
          line-height: 1;
        }

        .proj-chevron {
          display: inline-block;
          width: 10px;
          height: 10px;
          border-right: 1.5px solid var(--muted);
          border-bottom: 1.5px solid var(--muted);
          transform: rotate(45deg);
          transition: transform 0.25s cubic-bezier(0.22,1,0.36,1), border-color 0.2s;
          margin-top: 2px;
          flex-shrink: 0;
        }
        .proj-chevron.open {
          transform: rotate(-135deg);
          border-color: var(--text);
        }

        .proj-description {
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 0.8rem;
          font-weight: 300;
          color: ${darkMode ? 'white' : 'black'};
          letter-spacing: 0.02em;
          line-height: 1.5;
        }

        .proj-dates {
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
        .proj-dates-divider {
          width: 16px;
          height: 1px;
          background: var(--border);
          display: inline-block;
        }

        /* Expandable section */
        .proj-expand {
          overflow: hidden;
          max-height: 0;
          opacity: 0;
          transition: max-height 0.4s cubic-bezier(0.22,1,0.36,1), opacity 0.3s ease;
        }
        .proj-expand.open {
          max-height: 2000px;
          opacity: 1;
        }

        .proj-expand-inner {
          padding: 1rem 0 0.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        /* Tech tags */
        .proj-tech-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          align-items: center;
        }
        .proj-tech-tag {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.58rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--text);
          border: 1px solid var(--text);
          border-radius: 100px;
          padding: 3px 10px;
          opacity: 0.6;
          white-space: nowrap;
        }

        /* GitHub link */
        .proj-github {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.58rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--text);
          opacity: 0.6;
          text-decoration: none;
          transition: opacity 0.2s;
          white-space: nowrap;
        }
        .proj-github:hover { opacity: 1; }
        .proj-github svg {
          width: 11px;
          height: 11px;
          flex-shrink: 0;
        }
      `}</style>

      <div className="proj-card" onClick={() => setIsOpen(o => !o)}>
        {/* ── Header row ── */}
        <div className="proj-row">
          {/* Name + description */}
          <div className="proj-meta">
            <div className="proj-name-row">
              <span className="proj-name">{name}</span>
              <span className={`proj-chevron${isOpen ? " open" : ""}`} />
            </div>
            <span className="proj-description">{description}</span>
          </div>

          {/* Dates */}
          <div className="proj-dates">
            {startDate}
            <span className="proj-dates-divider" />
            {endDate}
          </div>
        </div>

        {/* ── Expandable: tech tags + github + photos ── */}
        <div className={`proj-expand${isOpen ? " open" : ""}`}>
          <div className="proj-expand-inner" onClick={e => e.stopPropagation()}>

            {/* Tech tags */}
            {techList.length > 0 && (
              <div className="proj-tech-list">
                {techList.map((tech, i) => (
                  <span key={i} className="proj-tech-tag">{tech}</span>
                ))}
              </div>
            )}

            {/* GitHub link — own row */}
            {githubLink && (
              <div>
                <a
                  href={githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="proj-github"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.418-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23A11.52 11.52 0 0 1 12 6.844c1.02.005 2.047.138 3.006.404 2.29-1.552 3.297-1.23 3.297-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                  View Code
                </a>
              </div>
            )}

            {/* Photos */}
            {photos && photos.length > 0 && (
              <PhotoViewer
                photos={photos}
                captions={captions}
              />
            )}
          </div>
        </div>
      </div>
    </>
  )
}