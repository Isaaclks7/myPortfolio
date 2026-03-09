"use client"
import { useState } from "react"
import Image from "next/image"
import useThemeStore from "@/stores"

export default function PhotoViewer({ photos, captions, zoom, position, width }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const { darkMode } = useThemeStore()

  const prev = () => setCurrentIndex(i => (i === 0 ? photos.length - 1 : i - 1))
  const next = () => setCurrentIndex(i => (i === photos.length - 1 ? 0 : i + 1))

  if (!photos || photos.length === 0) return null

  const isVideo = photos[currentIndex].endsWith(".mp4")
  const mediaStyle = {
    transform: `scale(${zoom[currentIndex]})`,
    transformOrigin: position[currentIndex],
    width: "100%",
    height: "100%",
    objectFit: "cover",
  }

  return (
    <>
      <style>{`
        .pv-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem 0 1.25rem;
        }

        .pv-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          width: 100%;
        }

        .pv-media {
          flex: 1;
          aspect-ratio: 1 / 1;
          max-width: 260px;
          overflow: hidden;
          border-radius: 8px;
          border: 1px solid var(--border);
          background: var(--surface);
          margin: 0 auto;
        }

        .pv-btn {
          flex-shrink: 0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--border);
          border-radius: 50%;
          background: none;
          cursor: pointer;
          color: var(--muted);
          transition: border-color 0.2s, color 0.2s;
        }
        .pv-btn:hover { border-color: var(--text); color: var(--text); }
        .pv-btn svg { width: 14px; height: 14px; }

        /* arrow shapes via CSS — no icon dep */
        .pv-arrow {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-right: 1.5px solid currentColor;
          border-bottom: 1.5px solid currentColor;
        }
        .pv-arrow-left  { transform: rotate(135deg) translate(-1px, -1px); }
        .pv-arrow-right { transform: rotate(-45deg) translate(-1px, -1px); }

        .pv-caption {
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 0.75rem;
          font-weight: 300;
          color: var(--muted);
          text-align: center;
          min-height: 1.2em;
          letter-spacing: 0.02em;
          max-width: 260px;
        }

        .pv-counter {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.58rem;
          letter-spacing: 0.18em;
          color: var(--muted);
          text-align: center;
        }

        /* dot indicators */
        .pv-dots {
          display: flex;
          gap: 5px;
          align-items: center;
        }
        .pv-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--border);
          cursor: pointer;
          transition: background 0.2s, transform 0.2s;
          border: none;
          padding: 0;
        }
        .pv-dot.active {
          background: var(--text);
          transform: scale(1.3);
        }
      `}</style>

      <div className="pv-wrap">
        {/* media + arrows */}
        <div className="pv-row">
          <button className="pv-btn" onClick={prev} aria-label="Previous">
            <span className="pv-arrow pv-arrow-left" />
          </button>

          <div className="pv-media">
            {isVideo ? (
              <video
                src={photos[currentIndex]}
                autoPlay
                muted
                loop
                playsInline
                style={mediaStyle}
              />
            ) : (
              <Image
                src={photos[currentIndex]}
                alt={captions?.[currentIndex] || `Photo ${currentIndex + 1}`}
                width={500}
                height={500}
                style={mediaStyle}
              />
            )}
          </div>

          <button className="pv-btn" onClick={next} aria-label="Next">
            <span className="pv-arrow pv-arrow-right" />
          </button>
        </div>

        {/* caption */}
        {captions?.[currentIndex] && (
          <p className="pv-caption">{captions[currentIndex]}</p>
        )}

        {/* dots + counter */}
        {photos.length > 1 && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem" }}>
            <div className="pv-dots">
              {photos.map((_, i) => (
                <button
                  key={i}
                  className={`pv-dot${i === currentIndex ? " active" : ""}`}
                  onClick={() => setCurrentIndex(i)}
                  aria-label={`Go to photo ${i + 1}`}
                />
              ))}
            </div>
            <span className="pv-counter">{currentIndex + 1} / {photos.length}</span>
          </div>
        )}
      </div>
    </>
  )
}