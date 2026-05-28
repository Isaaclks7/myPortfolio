"use client"
import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"

export default function PhotoViewer({ photos, captions }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loadedIndices, setLoadedIndices] = useState(new Set([0]))
  const [videoVisible, setVideoVisible] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
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
    }, 200)
  }, [isTransitioning, photos.length, preloadMedia])

  const goToIndex = (i) => {
    if (i === currentIndex || isTransitioning) return
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentIndex(i)
      preloadMedia(i)
      setIsTransitioning(false)
    }, 200)
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
      if (e.key === "Escape") setIsFullscreen(false)
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

  const mediaStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "center",
    transition: "opacity 0.25s cubic-bezier(0.22,1,0.36,1)",
    opacity: isTransitioning ? 0 : 1,
  }

  return (
    <>
      <style>{`
        .pv-root {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
          padding: 1.5rem 0;
          user-select: none;
        }

        .pv-stage-wrapper {
          position: relative;
          width: 100%;
          max-width: 550px;
          margin: 0 auto;
        }

        .pv-stage {
          position: relative;
          width: 100%;
          aspect-ratio: 1;
          border-radius: 12px;
          overflow: hidden;
          background: var(--surface);
          border: 1px solid var(--border);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          cursor: ${photos.length > 1 ? 'pointer' : 'default'};
          transition: box-shadow 0.3s ease;
        }

        .pv-stage:hover {
          box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
        }

        .pv-skeleton {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            var(--border) 0%,
            var(--surface) 50%,
            var(--border) 100%
          );
          background-size: 200% 100%;
          animation: pv-shimmer 2s infinite ease-in-out;
          z-index: 2;
        }

        @keyframes pv-shimmer {
          0%   { background-position: 200% 0 }
          100% { background-position: -200% 0 }
        }

        .pv-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }

        .pv-nav-group {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .pv-nav {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          border: 1px solid var(--border);
          background: var(--surface);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--muted);
          transition: all 0.25s cubic-bezier(0.22,1,0.36,1);
          flex-shrink: 0;
          padding: 0;
        }
        .pv-nav:hover {
          background: var(--text);
          color: var(--bg);
          border-color: var(--text);
          transform: scale(1.08);
        }
        .pv-nav:active {
          transform: scale(0.96);
        }
        .pv-nav svg {
          width: 14px;
          height: 14px;
          stroke-width: 2;
        }

        .pv-fullscreen-btn {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          border: 1px solid var(--border);
          background: var(--surface);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--muted);
          transition: all 0.25s cubic-bezier(0.22,1,0.36,1);
          padding: 0;
        }
        .pv-fullscreen-btn:hover {
          background: var(--text);
          color: var(--bg);
          border-color: var(--text);
          transform: scale(1.08);
        }
        .pv-fullscreen-btn svg {
          width: 14px;
          height: 14px;
          stroke-width: 2;
        }

        .pv-counter {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.75rem;
          letter-spacing: 0.12em;
          color: var(--muted);
          padding: 0.4rem 0.8rem;
          border: 1px solid var(--border);
          border-radius: 6px;
          background: var(--surface);
          transition: all 0.2s ease;
        }
        .pv-counter:hover {
          background: var(--text);
          color: var(--bg);
        }

        .pv-caption {
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 0.85rem;
          font-weight: 300;
          color: var(--text);
          text-align: center;
          letter-spacing: 0.02em;
          line-height: 1.6;
          max-width: 550px;
          margin: 0 auto;
          padding: 0.5rem 0;
        }

        .pv-thumbs {
          display: flex;
          gap: 8px;
          align-items: center;
          justify-content: center;
          max-width: 550px;
          flex-wrap: wrap;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .pv-thumb {
          width: 56px;
          height: 56px;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          border: 2px solid transparent;
          transition: all 0.25s cubic-bezier(0.22,1,0.36,1);
          background: var(--surface);
          flex-shrink: 0;
          position: relative;
          opacity: 0.5;
        }
        .pv-thumb.active {
          border-color: var(--text);
          opacity: 1;
          transform: scale(1.1);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        }
        .pv-thumb:hover:not(.active) {
          opacity: 0.75;
          transform: scale(1.05);
        }

        .pv-dots {
          display: flex;
          gap: 6px;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          margin: 0 auto;
        }
        .pv-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--border);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.22,1,0.36,1);
          border: none;
          padding: 0;
        }
        .pv-dot:hover:not(.active) {
          background: var(--muted);
          transform: scale(1.4);
        }
        .pv-dot.active {
          background: var(--text);
          width: 20px;
          border-radius: 3px;
          transform: scale(1);
        }

        .pv-fullscreen-modal {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.95);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .pv-fullscreen-content {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .pv-fullscreen-stage {
          position: relative;
          width: 100%;
          height: 100%;
          max-width: 90vw;
          max-height: 85vh;
          border-radius: 8px;
          overflow: hidden;
        }

        .pv-fullscreen-close {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.3);
          background: rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: white;
          transition: all 0.2s ease;
          z-index: 1001;
        }
        .pv-fullscreen-close:hover {
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.5);
        }
        .pv-fullscreen-close svg {
          width: 20px;
          height: 20px;
          stroke-width: 2;
        }

        .pv-fullscreen-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.3);
          background: rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: white;
          transition: all 0.2s ease;
          z-index: 1001;
          padding: 0;
        }
        .pv-fullscreen-nav:hover {
          background: rgba(255,255,255,0.15);
          border-color: rgba(255,255,255,0.5);
          transform: translateY(-50%) scale(1.1);
        }
        .pv-fullscreen-nav svg {
          width: 18px;
          height: 18px;
          stroke-width: 2;
        }
        .pv-fullscreen-nav.prev { left: 1.5rem; }
        .pv-fullscreen-nav.next { right: 1.5rem; }

        @media (max-width: 768px) {
          .pv-stage-wrapper {
            max-width: 100%;
            padding: 0 0.5rem;
          }
          .pv-stage {
            border-radius: 8px;
          }
          .pv-thumb {
            width: 48px;
            height: 48px;
            min-width: 48px;
          }
          .pv-controls {
            flex-wrap: wrap;
            justify-content: center;
            gap: 0.75rem;
            padding: 0 1rem;
          }
          .pv-nav {
            width: 44px;
            height: 44px;
          }
          .pv-counter {
            font-size: 0.7rem;
            padding: 0.35rem 0.7rem;
          }
          .pv-thumbs {
            padding: 0 0.5rem;
            gap: 6px;
          }
          .pv-caption {
            font-size: 0.8rem;
            padding: 0.5rem 1rem;
          }
          .pv-fullscreen-nav {
            width: 44px;
            height: 44px;
          }
          .pv-fullscreen-nav svg {
            width: 18px;
            height: 18px;
          }
          .pv-fullscreen-close {
            width: 40px;
            height: 40px;
            top: 1rem;
            right: 1rem;
          }
          .pv-fullscreen-nav.prev {
            left: 1rem;
          }
          .pv-fullscreen-nav.next {
            right: 1rem;
          }
        }

        @media (max-width: 480px) {
          .pv-root {
            gap: 1rem;
            padding: 1rem 0;
          }
          .pv-stage-wrapper {
            padding: 0 0.25rem;
          }
          .pv-controls {
            gap: 0.5rem;
            padding: 0 0.5rem;
          }
          .pv-nav {
            width: 40px;
            height: 40px;
          }
          .pv-nav svg {
            width: 12px;
            height: 12px;
          }
          .pv-fullscreen-btn {
            width: 40px;
            height: 40px;
          }
          .pv-thumb {
            width: 44px;
            height: 44px;
            min-width: 44px;
          }
        }
      `}</style>

      {isFullscreen && (
        <div className="pv-fullscreen-modal" onClick={() => setIsFullscreen(false)}>
          <div className="pv-fullscreen-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="pv-fullscreen-close"
              onClick={() => setIsFullscreen(false)}
              aria-label="Close"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="pv-fullscreen-stage" ref={mediaRef}>
              {!isLoaded && <div className="pv-skeleton" />}
              <div style={{ width: "100%", height: "100%", overflow: "hidden" }}>
                {isVideo ? (
                  <video
                    key={`fs-video-${currentIndex}`}
                    src={isLoaded ? photos[currentIndex] : undefined}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    style={mediaStyle}
                  />
                ) : (
                  isLoaded && (
                    <Image
                      key={`fs-img-${currentIndex}`}
                      src={photos[currentIndex]}
                      alt={captions?.[currentIndex] || `Photo ${currentIndex + 1}`}
                      fill
                      sizes="90vw"
                      style={mediaStyle}
                    />
                  )
                )}
              </div>
            </div>

            {photos.length > 1 && (
              <>
                <button
                  className="pv-fullscreen-nav prev"
                  onClick={() => navigate("prev")}
                  aria-label="Previous"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
                <button
                  className="pv-fullscreen-nav next"
                  onClick={() => navigate("next")}
                  aria-label="Next"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <div className="pv-root">
        <div className="pv-stage-wrapper">
          <div
            className="pv-stage"
            ref={mediaRef}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onClick={() => photos.length > 1 && setIsFullscreen(true)}
          >
            {!isLoaded && <div className="pv-skeleton" />}
            <div style={{ width: "100%", height: "100%", overflow: "hidden" }}>
              {isVideo ? (
                <video
                  key={`video-${currentIndex}`}
                  src={isLoaded ? photos[currentIndex] : undefined}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  style={mediaStyle}
                />
              ) : (
                isLoaded && (
                  <Image
                    key={`img-${currentIndex}`}
                    src={photos[currentIndex]}
                    alt={captions?.[currentIndex] || `Photo ${currentIndex + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 550px"
                    style={mediaStyle}
                  />
                )
              )}
            </div>
          </div>
        </div>

        {photos.length > 1 && (
          <div className="pv-controls">
            <div className="pv-nav-group">
              <button
                className="pv-nav"
                onClick={() => navigate("prev")}
                aria-label="Previous"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                className="pv-nav"
                onClick={() => navigate("next")}
                aria-label="Next"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>

            <div className="pv-counter">{currentIndex + 1} / {photos.length}</div>

            {photos.length > 1 && (
              <button
                className="pv-fullscreen-btn"
                onClick={() => setIsFullscreen(true)}
                aria-label="Fullscreen"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                </svg>
              </button>
            )}
          </div>
        )}

        {captions?.[currentIndex] && (
          <p className="pv-caption">{captions[currentIndex]}</p>
        )}

        {photos.length > 1 && photos.length <= 8 && (
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
                    preload="metadata"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <Image
                    src={src}
                    alt={`Thumb ${i + 1}`}
                    fill
                    sizes="56px"
                    style={{ objectFit: "cover" }}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {photos.length > 8 && (
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
      </div>
    </>
  )
}
