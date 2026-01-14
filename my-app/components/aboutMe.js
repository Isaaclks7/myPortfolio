"use client"
import useThemeStore from "@/stores";

export default function AboutMe() {
    const { darkMode, toggleDarkMode } = useThemeStore()

    return (
        <div className={`${darkMode ? "text-white" : "text-black"} flex flex-row justify-start text-sm mb-4`}>
            I am currently a Penultimate Computer Engineering Student @ NUS looking for an internship between 11 May - 1 Aug 2026 (summer).<br/>
            <br/>
            I have a strong interest in AI Engineering, particularly in building scalable and impactful systems.
            My passion lies in integrating intelligent solutions into real-world applications, and I am keen to further strengthen my software engineering skills.
            <br/>
            
        </div>
    );
}