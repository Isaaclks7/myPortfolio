import { Moon, Sun, Github, Linkedin, Mail, Download  } from "@deemlol/next-icons";
import useThemeStore from "@/stores" 
import { useState, useRef, useEffect } from "react"

export default function ContactBar(){
    const { darkMode, toggleDarkMode } = useThemeStore();
    const [ isOpen, setIsOpen ] = useState(false);
    const popupRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                popupRef.current &&
                !popupRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen])

    return (
        <div className={`fixed flex flex-row text-white left-0 right-0 border-t shadow-xl bottom-0 py-2 px-6 ${darkMode ? "bg-black border-white/20" : "bg-white border-black/40"} justify-between`}>
            <p className="flex flex-1 justify-start">
                <button
                    className={`flex gap-2 ${darkMode ? "text-white" : "text-black"} py-1 px-3 cursor-pointer rounded ${darkMode ? "hover:bg-white/10" : "hover:bg-black/20"}`}
                    onClick={() => {
                        if (typeof gtag === "function") {
                            gtag("event", "resume_download", {
                              event_category: "engagement",
                              event_label: "Resume Button",
                            });
                        }
                        const link = document.createElement("a")
                        link.href = "resume.pdf"
                        link.download = "Isaac's Resume"
                        link.click()
                    }}    
                >
                    Resume
                    <Download size={24} color={darkMode ? "#FFFFFF" : "#000000"}/>
                </button>
            </p>
            <div className="gap-8 flex flex-1 justify-center">
                <button className="cursor-pointer" onClick={() => window.open("https://github.com/isaaclks7", "_blank")}>
                <Github color={darkMode ? "#FFFFFF" : "#000000"}/>
                </button>
                <button className="cursor-pointer" onClick={() => window.open("https://linkedin.com/in/isaaclks7", "_blank")}>
                <Linkedin color={darkMode ? "#FFFFFF" : "#000000"}/>
                </button>
                <div ref={popupRef} className="relative flex items-center">
                    <button className="cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                    <Mail color={darkMode ? "#FFFFFF" : "#000000"}/>
                    </button>
                    {isOpen && (
                        <div className={`absolute bottom-full mb-3
                                        flex flex-col gap-2
                                        ${darkMode ? "bg-black text-white border-white/20" : "bg-white text-black border-black/40"} border 
                                        rounded-lg shadow-xl p-2 left-1/2 -translate-x-1/2`}
                        >
                        <button
                            className={`px-3 py-2 text-sm rounded ${darkMode ? "hover:bg-white/10" : "hover:bg-black/20"} cursor-pointer`}
                            onClick={() => window.location.href = "mailto:kaishaeng@gmail.com"}
                        >
                            Send Email
                        </button>

                        <button
                            className={`px-3 py-2 text-sm rounded ${darkMode ? "hover:bg-white/10" : "hover:bg-black/20"} cursor-pointer`}
                            onClick={() => {
                            navigator.clipboard.writeText("kaishaeng@gmail.com");
                            setIsOpen(false);
                            }}
                        >
                            Copy Email
                        </button>
                        </div>
                    )}
                </div>
            </div>
            <p className="flex flex-1 justify-end">
            {darkMode ?
                <button className="cursor-pointer" onClick={toggleDarkMode}>
                    <Sun color={darkMode ? "#FFFFFF" : "#000000"}/>
                </button>
                :
                <button className="cursor-pointer" onClick={toggleDarkMode}>
                    <Moon color={darkMode ? "#FFFFFF" : "#000000"}/>
                </button>
            }
            </p>
        </div>
    );
}