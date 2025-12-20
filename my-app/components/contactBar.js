import { Moon, Sun, Github, Linkedin, Mail  } from "@deemlol/next-icons";
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
        <div className="fixed flex flex-row text-white left-0 right-0 border-t border-white/20 shadow-xl items-center bottom-0 py-2 px-6 bg-black justify-between">
            <div className="w-6"/>
            <div className="gap-8 flex">
                <button className="cursor-pointer" onClick={() => window.open("https://github.com/isaaclks7", "_blank")}>
                <Github/>
                </button>
                <button className="cursor-pointer" onClick={() => window.open("https://linkedin.com/in/isaaclks7", "_blank")}>
                <Linkedin/>
                </button>
                <div ref={popupRef} className="relative flex items-center">
                    <button className="cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                    <Mail/>
                    </button>
                    {isOpen && (
                        <div className="absolute bottom-full mb-3
                                        flex flex-col gap-2
                                        bg-black border border-white/20
                                        rounded-lg shadow-xl p-2 left-1/2 -translate-x-1/2"
                        >
                        <button
                            className="px-3 py-2 text-sm rounded hover:bg-white/10 cursor-pointer"
                            onClick={() => window.location.href = "mailto:kaishaeng@gmail.com"}
                        >
                            Send Email
                        </button>

                        <button
                            className="px-3 py-2 text-sm rounded hover:bg-white/10 cursor-pointer"
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
            <p className="flex">
            {darkMode ?
                <button className="cursor-pointer" onClick={toggleDarkMode}>
                    <Sun/>
                </button>
                :
                <button className="cursor-pointer" onClick={toggleDarkMode}>
                    <Moon/>
                </button>
            }
            </p>
        </div>
    );
}