"use client"
import useThemeStore from "@/stores";

export default function AboutMe() {
    const { darkMode, toggleDarkMode } = useThemeStore()

    return (
        <div className={`${darkMode ? "text-white" : "text-black"} flex flex-row justify-start text-sm mb-4`}>
            Penultimate Computer Engineering student @ NUS.
            <br/>
            Interested in AI and Backend Software Engineering.
            <br/>
            Currently looking for an internship between 11 May - 1 Aug 2026 (summer).
        </div>
    );
}