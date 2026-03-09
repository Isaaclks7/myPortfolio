"use client"
import "./globals.css";
import Gtag from "./gtag";
import useThemeStore from "@/stores";
import { useEffect } from "react";

export default function RootLayout({ children }) {
  const { darkMode } = useThemeStore()

  // Sync theme class on <html> so CSS variables cascade to body/background
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.remove("light-mode")
    } else {
      document.documentElement.classList.add("light-mode")
    }
  }, [darkMode])

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=IBM+Plex+Mono:ital,wght@0,300;0,400;0,500;1,300&family=IBM+Plex+Sans:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Gtag />
        <div style={{ position: "relative", zIndex: 10, isolation: "isolate" }}>
          {children}
        </div>
      </body>
    </html>
  );
}