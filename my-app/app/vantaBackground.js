'use client'

import { useEffect, useRef } from 'react'
import Script from 'next/script'

export default function VantaBackground() {
  const vantaRef = useRef(null)
  const vantaEffect = useRef(null)

  useEffect(() => {
    if (!window.VANTA || vantaEffect.current) return

    vantaEffect.current = window.VANTA.DOTS({
      el: vantaRef.current,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.0,
      minWidth: 200.0,
      scale: 1.0,
      scaleMobile: 1.0,
      color: 0x0f10d4,
      color2: 0x1010d1,
      backgroundColor: 0x060606,
      size: 3.1,
      spacing: 28.0,
      showLines: false,
    })

    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy()
        vantaEffect.current = null
      }
    }
  }, [])

  return (
    <>
      <div
        ref={vantaRef}
        className="w-full h-screen fixed inset-0 -z-10"
      />
      <Script
        src="/three.r134.min.js"
        strategy="beforeInteractive"
      />
      <Script
        src="/vanta.dots.min.js"
        strategy="beforeInteractive"
      />
    </>
  )
}

