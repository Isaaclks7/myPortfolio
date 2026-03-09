"use client"
import skills from "@/data/skills.json"
import useThemeStore from "@/stores"

export default function Skills() {
  const { darkMode } = useThemeStore()

  return (
    <>
      <style>{`
        .skills-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          padding-bottom: 0.25rem;
        }

        .skill-pill {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.62rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--muted);
          border: 1px solid var(--border);
          border-radius: 100px;
          padding: 5px 13px;
          transition: color 0.2s, border-color 0.2s, background 0.2s;
          cursor: default;
          white-space: nowrap;
          user-select: none;
        }

        .skill-pill:hover {
          color: var(--text);
          border-color: var(--text);
          background: var(--surface);
        }
      `}</style>

      <div className="skills-wrap">
        {skills.map((skill, index) => (
          <span key={index} className="skill-pill">
            {skill}
          </span>
        ))}
      </div>
    </>
  )
}