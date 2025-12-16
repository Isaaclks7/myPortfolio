'use client'

import { useEffect, useRef } from 'react'
import Script from 'next/script'
import useThemeStore from '@/stores'

export default function VantaBackground() {
  const vantaRef = useRef(null)
  const vantaEffect = useRef(null)
  const { darkMode, toggleDarkMode } = useThemeStore()
  const bgColor = darkMode ? 0x8031d : 0xFFFFFF

  useEffect(() => {
    if (!window.VANTA || !vantaRef.current) return

    if (vantaEffect.current) {
      vantaEffect.current.destroy()
      vantaEffect.current = null
    }

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
      backgroundColor: bgColor,
      size: 3.1,
      spacing: 25.0,
      showLines: false,
    })

    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy()
        vantaEffect.current = null
      }
    }
  }, [darkMode])

  return (
    <>
      <div
        ref={vantaRef}
        className="w-screen h-screen fixed inset-0 -z-10"
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

