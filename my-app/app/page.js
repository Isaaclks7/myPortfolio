"use client"
import WorkComponent from "@/components/workExp";
import experience from "@/data/experience.json"
import education from "@/data/education.json"
import projects from "@/data/projects.json"
import Image from "next/image"
import AboutMe from "@/components/aboutMe"
import Education from "@/components/education"
import Skills from "@/components/skills"
import Project from "@/components/project"
import ContactBar from "@/components/contactBar"
import VantaBackground from "./vantaBackground";
import useThemeStore from "@/stores"
import { useEffect, useState } from "react"

export default function Home() {
  const { darkMode, toggleDarkMode } = useThemeStore()
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setScrolled(window.scrollY > 40)
      setScrollY(window.scrollY)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (!mounted) return null

  const dm = darkMode

  // Fade out the hero image as user scrolls — fully gone by 400px
  const heroImgOpacity = Math.max(0, 1 - scrollY / 400)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=IBM+Plex+Mono:ital,wght@0,300;0,400;0,500;1,300&family=IBM+Plex+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: var(--bg); }
        ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

        /* ── Sticky nav ── */
        .nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 clamp(1.5rem, 6vw, 5rem);
          height: 56px;
          background: transparent;
          transition: background 0.35s ease, border-bottom 0.35s ease;
          border-bottom: 1px solid transparent;
        }
        .nav.scrolled {
          background: var(--bg);
          border-bottom: 1px solid var(--border);
        }
        .nav-wordmark {
          font-family: 'Syne', sans-serif;
          font-size: 1.25rem;
          letter-spacing: 0.12em;
          color: var(--text);
          text-decoration: none;
          opacity: 0.85;
        }
        .nav-links {
          display: flex;
          align-items: center;
          gap: 2rem;
          list-style: none;
        }
        .nav-links a {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--muted);
          text-decoration: none;
          transition: color 0.2s;
        }
        .nav-links a:hover { color: var(--text); }

        /* ── Theme toggle ── */
        .toggle-btn {
          background: var(--toggle-bg);
          border: 1px solid var(--border);
          border-radius: 100px;
          padding: 5px 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--muted);
          transition: color 0.2s, border-color 0.2s;
          white-space: nowrap;
        }
        .toggle-btn:hover { color: var(--text); border-color: var(--text); }
        .toggle-icon { font-size: 0.75rem; }

        /* ── Main layout ── */
        .main-wrap {
          padding: 0 clamp(1.5rem, 6vw, 5rem);
          padding-top: 56px;
        }

        /* ── Hero ── */
        .hero {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 8rem 0 5rem;
          position: relative;
        }

        /* ── Hero background image ── */
        .hero-bg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          z-index: -1;
          pointer-events: none;
        }
        .hero-bg img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
        }
        /* Dark gradient overlay so text stays readable */
        .hero-bg::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(0,0,0,0.35) 0%,
            rgba(0,0,0,0.55) 60%,
            var(--bg) 100%
          );
        }

        .hero-eyebrow {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 1.5rem;
        }
        .hero-name {
          font-family: 'Syne', sans-serif;
          font-size: clamp(4rem, 12vw, 9rem);
          line-height: 0.92;
          letter-spacing: 0.03em;
          color: #ffffff;
        }
        .hero-name .line-muted { color: var(--muted); }
        .hero-sub {
          margin-top: 2rem;
          font-size: clamp(0.85rem, 1.5vw, 1rem);
          color: var(--text);
          max-width: 420px;
          line-height: 1.7;
          font-weight: 300;
        }

        /* ── Section ── */
        .section {
          padding: 6rem 0 0;
          border-top: 1px solid var(--border);
          margin-top: 6rem;
        }
        .section-label {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 3rem;
        }
        .section-label-num {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.2em;
          color: var(--muted);
        }
        .section-label-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(1.6rem, 4vw, 2.5rem);
          letter-spacing: 0.08em;
          color: var(--text);
        }

        /* ── WIP badge ── */
        .wip-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.58rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--muted);
          border: 1px solid var(--border);
          border-radius: 100px;
          padding: 4px 10px;
          margin-bottom: 2.5rem;
          opacity: 0.7;
        }
        .wip-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #f59e0b;
          animation: blink 2s ease-in-out infinite;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }

        /* ── Divider line ── */
        .thin-rule {
          height: 1px;
          background: var(--border);
          margin: 5rem 0 0;
        }

        /* ── Mobile nav hide ── */
        @media (max-width: 640px) {
          .nav-links { display: none; }
          .hero { padding-top: 6rem; }
        }

        /* ── Fade-in animation ── */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .fade-up-d1 { animation-delay: 0.1s; }
        .fade-up-d2 { animation-delay: 0.22s; }
        .fade-up-d3 { animation-delay: 0.34s; }
        .fade-up-d4 { animation-delay: 0.46s; }
      `}</style>

      <VantaBackground isDarkMode={dm} />

      {/* ── Hero background image (fixed, fades on scroll) ── */}
      <div className="hero-bg" style={{ opacity: heroImgOpacity }}>
        <Image
          src="/profile_pic.jpg"
          alt=""
          fill
          priority
          style={{ objectFit: "cover", objectPosition: "center top" }}
        />
      </div>

      {/* ── Navbar ── */}
      <nav className={`nav${scrolled ? " scrolled" : ""}`}>
        <a href="#" className="nav-wordmark">Isaac LKS</a>
        <ul className="nav-links">
          <li><a href="#about">About</a></li>
          <li><a href="#work">Work</a></li>
          <li><a href="#education">Education</a></li>
          <li><a href="#skills">Skills</a></li>
          <li><a href="#projects">Projects</a></li>
        </ul>
        <button className="toggle-btn" onClick={toggleDarkMode} aria-label="Toggle theme">
          <span className="toggle-icon">{dm ? "☀" : "◑"}</span>
          {dm ? "Light" : "Dark"}
        </button>
      </nav>

      {/* ── Main ── */}
      <div className="main-wrap">

        {/* ── Hero ── */}
        <section className="hero">
          <p className="hero-eyebrow fade-up">— Portfolio</p>

          <h1 className="hero-name fade-up fade-up-d1">
            Lim Kai<br />
            <span className="line-muted">Sheng</span><br />
            Isaac
          </h1>

          <p className="hero-sub fade-up fade-up-d2">
            Developer · Designer · Builder.<br />
            Crafting thoughtful digital experiences one commit at a time.
          </p>

          <div style={{ marginTop: "2rem" }} className="fade-up fade-up-d3">
            <span className="wip-badge">
              <span className="wip-dot" />
              Site under construction — expect some bugs
            </span>
          </div>
        </section>

        {/* ── About ── */}
        <section id="about" className="section">
          <div className="section-label">
            <span className="section-label-num">01</span>
            <span className="section-label-title">About</span>
          </div>
          <AboutMe />
        </section>

        {/* ── Work ── */}
        <section id="work" className="section">
          <div className="section-label">
            <span className="section-label-num">02</span>
            <span className="section-label-title">Work Experiences</span>
          </div>
          {experience.map((item) => (
            <WorkComponent
              key={item.id}
              jobTitle={item.jobTitle}
              company={item.company}
              description={item.description}
              startDate={item.startDate}
              endDate={item.endDate}
              companyImg={item.companyImg}
              zoom={item.zoom}
              position={item.position}
            />
          ))}
        </section>

        {/* ── Education ── */}
        <section id="education" className="section">
          <div className="section-label">
            <span className="section-label-num">03</span>
            <span className="section-label-title">Education</span>
          </div>
          {education.map((item) => (
            <Education
              key={item.id}
              major={item.major}
              school={item.school}
              schoolShort={item.schoolShort}
              grade={item.grade}
              startDate={item.startDate}
              endDate={item.endDate}
              schoolWeb={item.schoolWeb}
              schoolImg={item.schoolImg}
              zoom={item.zoom}
              position={item.position}
            />
          ))}
        </section>

        {/* ── Skills ── */}
        <section id="skills" className="section">
          <div className="section-label">
            <span className="section-label-num">04</span>
            <span className="section-label-title">Skills</span>
          </div>
          <Skills />
        </section>

        {/* ── Projects ── */}
        <section id="projects" className="section">
          <div className="section-label">
            <span className="section-label-num">05</span>
            <span className="section-label-title">Projects</span>
          </div>
          {projects.map((item) => (
            <Project
              key={item.id}
              name={item.name}
              description={item.description}
              technologies={item.technologies}
              githubLink={item.githubLink}
              photos={item.photos}
              captions={item.photoCaption}
              startDate={item.startDate}
              endDate={item.endDate}
              projectImg={item.projectImg}
              zoom={item.zoom}
              position={item.position}
              vidZoom={item.vidZoom}
              vidPosition={item.vidPosition}
              width={item.width}
            />
          ))}
        </section>

        {/* ── Contact ── */}
        <div className="thin-rule" />
        <ContactBar />

        <div style={{ height: "5rem" }} />
      </div>
    </>
  )
}