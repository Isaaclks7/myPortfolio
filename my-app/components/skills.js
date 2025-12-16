import skills from "@/data/skills.json"
import useThemeStore from "@/stores";

export default function Skills() {
    const { darkMode, toggleDarkMode } = useThemeStore()

    return(
        <div className={`flex flex-wrap ${darkMode ? "text-white" : "text-black"} gap-2 mb-4`}>
            {skills.map((skill, index) => (
                <p key={index} className="border rounded-lg px-2 py-1">
                    {skill}
                </p>
            ))
            }
        </div>
    );
}