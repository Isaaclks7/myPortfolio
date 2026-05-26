"use client"
import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"

export default function PhotoViewer({ photos, captions, zoom, position, width }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loadedIndices, setLoadedIndices] = useState(new Set([0]))
  const [videoVisible, setVideoVisible] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const mediaRef = useRef(null)
  const touchStartX = useRef(null)
  const touchStartY = useRef(null)

  const preloadMedia = useCallback((idx) => {
    setLoadedIndices(prev => {
      if (prev.has(idx)) return prev
      return new Set(prev).add(idx)
    })
  }, [])

  const navigate = useCallback((dir) => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentIndex(i => {
        const newIdx = dir === "next"
          ? (i === photos.length - 1 ? 0 : i + 1)
          : (i === 0 ? photos.length - 1 : i - 1)
        preloadMedia(newIdx)
        return newIdx
      })
      setIsTransitioning(false)
    }, 180)
  }, [isTransitioning, photos.length, preloadMedia])

  const goToIndex = (i) => {
    if (i === currentIndex || isTransitioning) return
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentIndex(i)
      preloadMedia(i)
      setIsTransitioning(false)
    }, 180)
  }

  useEffect(() => {
    const nextIdx = (currentIndex + 1) % photos.length
    const prevIdx = currentIndex === 0 ? photos.length - 1 : currentIndex - 1
    preloadMedia(nextIdx)
    preloadMedia(prevIdx)
  }, [currentIndex, photos.length, preloadMedia])

  useEffect(() => {
    const isVideo = photos[currentIndex]?.endsWith(".mp4")
    if (!isVideo || !mediaRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => setVideoVisible(entry.isIntersecting),
      { threshold: 0.1 }
    )
    observer.observe(mediaRef.current)
    return () => observer.disconnect()
  }, [currentIndex, photos])

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowLeft") navigate("prev")
      if (e.key === "ArrowRight") navigate("next")
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [navigate])

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    const dy = e.changedTouches[0].clientY - touchStartY.current
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      navigate(dx < 0 ? "next" : "prev")
    }
    touchStartX.current = null
    touchStartY.current = null
  }

  if (!photos || photos.length === 0) return null

  const isVideo = photos[currentIndex]?.endsWith(".mp4")
  const isLoaded = loadedIndices.has(currentIndex)
  const showThumbs = photos.length > 1 && photos.length <= 8
  const showDots = photos.length > 8

  const mediaStyle = {
    transform: `scale(${zoom?.[currentIndex] ?? 1})`,
    transformOrigin: position?.[currentIndex] ?? "center",
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "opacity 0.18s ease",
    opacity: isTransitioning ? 0 : 1,
  }

  return (
    <>
      <style>{`
        .pv-root {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 0.5rem 0 1rem;
          user-select: none;
        }

        .pv-row {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          justify-content: center;
        }

        .pv-stage {
          position: relative;
          width: 260px;
          height: 260px;
          border-radius: 6px;
          overflow: hidden;
          background: var(--surface, #f5f5f5);
          border: 1px solid var(--border, #e8e8e8);
          flex-shrink: 0;
        }

        .pv-skeleton {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            var(--border, #ebebeb) 0%,
            var(--surface, #f5f5f5) 50%,
            var(--border, #ebebeb) 100%
          );
          background-size: 200% 100%;
          animation: pv-shimmer 1.8s infinite ease-in-out;
          z-index: 2;
        }

        @keyframes pv-shimmer {
          0%   { background-position: 200% 0 }
          100% { background-position: -200% 0 }
        }

        .pv-nav {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 1px solid var(--border, #e0e0e0);
          background: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--muted, #999);
          transition: border-color 0.15s, color 0.15s;
          flex-shrink: 0;
          padding: 0;
        }
        .pv-nav:hover {
          border-color: var(--text, #1a1a1a);
          color: var(--text, #1a1a1a);
        }
        .pv-nav svg { width: 11px; height: 11px; stroke-width: 1.5; }

        .pv-caption {
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 0.68rem;
          font-weight: 400;
          color: var(--muted, #aaa);
          text-align: center;
          letter-spacing: 0.03em;
          max-width: 260px;
          line-height: 1.5;
        }

        .pv-thumbs {
          display: flex;
          gap: 4px;
          align-items: center;
          justify-content: center;
          max-width: 260px;
          flex-wrap: wrap;
        }

        .pv-thumb {
          width: 36px;
          height: 36px;
          border-radius: 4px;
          overflow: hidden;
          cursor: pointer;
          border: 1.5px solid transparent;
          opacity: 0.4;
          transition: opacity 0.15s, border-color 0.15s, transform 0.15s;
          background: var(--surface, #f0f0f0);
          flex-shrink: 0;
          position: relative;
        }
        .pv-thumb.active {
          border-color: var(--text, #1a1a1a);
          opacity: 1;
          transform: scale(1.06);
        }
        .pv-thumb:hover:not(.active) { opacity: 0.7; }

        .pv-footer {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .pv-counter {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.12em;
          color: var(--muted, #bbb);
        }

        .pv-dots {
          display: flex;
          gap: 5px;
          align-items: center;
        }
        .pv-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: var(--border, #ddd);
          cursor: pointer;
          transition: background 0.2s, width 0.2s;
          border: none;
          padding: 0;
        }
        .pv-dot.active {
          background: var(--text, #1a1a1a);
          width: 10px;
          border-radius: 2px;
        }
      `}</style>

      <div className="pv-root">
        <div className="pv-row">
          {photos.length > 1 && (
            <button className="pv-nav" onClick={() => navigate("prev")} aria-label="Previous">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
          )}

          <div
            className="pv-stage"
            ref={mediaRef}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {!isLoaded && <div className="pv-skeleton" />}
            <div style={{ width: "100%", height: "100%", overflow: "hidden" }}>
              {isVideo ? (
                <video
                  key={`video-${currentIndex}`}
                  src={isLoaded ? photos[currentIndex] : undefined}
                  autoPlay={videoVisible}
                  muted
                  loop
                  playsInline
                  style={mediaStyle}
                />
              ) : (
                isLoaded && (
                  <Image
                    key={`img-${currentIndex}`}
                    src={photos[currentIndex]}
                    alt={captions?.[currentIndex] || `Photo ${currentIndex + 1}`}
                    width={520}
                    height={520}
                    style={mediaStyle}
                  />
                )
              )}
            </div>
          </div>

          {photos.length > 1 && (
            <button className="pv-nav" onClick={() => navigate("next")} aria-label="Next">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          )}
        </div>

        {captions?.[currentIndex] && (
          <p className="pv-caption">{captions[currentIndex]}</p>
        )}

        {showThumbs && (
          <div className="pv-thumbs">
            {photos.map((src, i) => (
              <div
                key={i}
                className={`pv-thumb${i === currentIndex ? " active" : ""}`}
                onClick={() => goToIndex(i)}
                role="button"
                tabIndex={0}
                aria-label={`Go to photo ${i + 1}`}
                onKeyDown={e => e.key === "Enter" && goToIndex(i)}
              >
                {src.endsWith(".mp4") ? (
                  <video
                    src={src}
                    muted
                    playsInline
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <Image
                    src={src}
                    alt={`Thumb ${i + 1}`}
                    width={72}
                    height={72}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {photos.length > 1 && (
          <div className="pv-footer">
            {showDots && (
              <div className="pv-dots">
                {photos.map((_, i) => (
                  <button
                    key={i}
                    className={`pv-dot${i === currentIndex ? " active" : ""}`}
                    onClick={() => goToIndex(i)}
                    aria-label={`Go to photo ${i + 1}`}
                  />
                ))}
              </div>
            )}
            <span className="pv-counter">{currentIndex + 1} / {photos.length}</span>
          </div>
        )}
      </div>
    </>
  )
}