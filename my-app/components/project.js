"use client"
import Image from "next/image"
import { useState } from "react"
import useThemeStore from "@/stores"
import PhotoViewer from "./photoViewer"

export default function Project({
  name, description, technologies, photos, captions, startDate, endDate, projectImg, zoom, position, vidZoom, vidPosition, width
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
          grid-template-columns: 36px 1fr auto;
          align-items: start;
          gap: 1rem;
          width: 100%;
        }

        .proj-logo {
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
        .proj-card:hover .proj-logo { border-color: var(--text); }

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
          color: var(--muted);
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
          color: var(--muted);
          letter-spacing: 0.02em;
          line-height: 1.5;
        }

        .proj-dates {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--muted);
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
          padding: 1rem 0 0.5rem calc(36px + 1rem);
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        /* Tech tags */
        .proj-tech-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
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

        /* Photo viewer wrapper */
        .proj-photos {
          padding-left: calc(36px + 1rem);
        }

        @media (max-width: 640px) {
          .proj-expand-inner { padding-left: 0; }
          .proj-photos { padding-left: 0; }
        }
      `}</style>

      <div className="proj-card" onClick={() => setIsOpen(o => !o)}>
        {/* ── Header row ── */}
        <div className="proj-row">
          {/* Logo */}
          <div className="proj-logo">
            <Image
              src={projectImg}
              alt={`${name} thumbnail`}
              width={100}
              height={100}
              className="object-cover"
              style={{ transform: `scale(${zoom})`, transformOrigin: position, width: "100%", height: "100%" }}
            />
          </div>

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

        {/* ── Expandable: tech tags + photos ── */}
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

            {/* Photos */}
            {photos && photos.length > 0 && (
              <div className="proj-photos">
                <PhotoViewer
                  photos={photos}
                  captions={captions}
                  zoom={vidZoom}
                  position={vidPosition}
                  width={width}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}