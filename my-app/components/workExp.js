"use client"
import Image from "next/image"
import { useState } from "react"
import useThemeStore from "@/stores"

export default function WorkComponent({
  jobTitle, company, description, startDate, endDate, companyImg, zoom, position
}) {
  const [isOpen, setIsOpen] = useState(false)
  const { darkMode, toggleDarkMode } = useThemeStore()

  return (
    <>
      <style>{`
        .work-card {
          border-top: 1px solid var(--border);
          padding: 1.25rem 0;
          cursor: pointer;
          transition: border-color 0.2s;
        }
        .work-card:last-of-type {
          border-bottom: 1px solid var(--border);
        }
        .work-card:hover { border-color: var(--text); }
        .work-card:hover .work-company { color: var(--text); }

        .work-row {
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

        .work-logo {
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
        .work-card:hover .work-logo { border-color: var(--text); }

        .work-meta { display: flex; flex-direction: column; gap: 3px; }

        .work-company {
          font-family: 'Syne', sans-serif;
          font-size: 1.15rem;
          letter-spacing: 0.06em;
          color: ${darkMode ? 'white' : 'black'};
          transition: color 0.2s;
          line-height: 1;
        }

        .work-title {
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 0.8rem;
          font-weight: 300;
          color: ${darkMode ? 'white' : 'black'};
          letter-spacing: 0.02em;
        }

        .work-dates {
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
        .work-dates-divider {
          width: 16px;
          height: 1px;
          background: var(--border);
          display: inline-block;
        }

        .work-chevron {
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
        .work-chevron.open {
          transform: rotate(-135deg);
          border-color: var(--text);
        }

        .work-description {
          overflow: hidden;
          max-height: 0;
          transition: max-height 0.35s cubic-bezier(0.22,1,0.36,1), opacity 0.25s ease;
          opacity: 0;
        }
        .work-description.open {
          max-height: 400px;
          opacity: 1;
        }
        .work-description-inner {
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 0.85rem;
          font-weight: 300;
          line-height: 1.75;
          color: ${darkMode ? 'white' : 'black'};
          padding: 1rem 0 0.25rem calc(36px + 1rem);
          border-left: none;
        }
      `}</style>

      <div className="work-card" onClick={() => setIsOpen(o => !o)}>
        <div className="work-row">
          {/* Logo */}
          <div className="work-logo">
            <Image
              src={companyImg}
              alt={`${company} logo`}
              width={300}
              height={300}
              className="object-cover"
              style={{ transform: `scale(${zoom})`, transformOrigin: position, width: "100%", height: "100%" }}
            />
          </div>

          {/* Text */}
          <div className="work-meta">
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span className="work-company">{company}</span>
              <span className={`work-chevron${isOpen ? " open" : ""}`} />
            </div>
            <span className="work-title">{jobTitle}</span>
          </div>

          {/* Dates */}
          <div className="work-dates">
            {startDate}
            <span className="work-dates-divider" />
            {endDate}
          </div>
        </div>

        {/* Expandable description */}
        <div className={`work-description${isOpen ? " open" : ""}`}>
          <p className="work-description-inner">{description}</p>
        </div>
      </div>
    </>
  )
}