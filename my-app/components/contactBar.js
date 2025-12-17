import { Moon, Sun, Github, Linkedin, Mail  } from "@deemlol/next-icons";
import useThemeStore from "@/stores" 

export default function ContactBar(){
    const { darkMode, toggleDarkMode } = useThemeStore()

    return (
        <div className="fixed flex flex-row text-white left-0 right-0 border-t shadow-xl items-center bottom-0 py-2 px-6 bg-black justify-between">
            <div className="w-6"/>
            <p className="gap-8 flex">
                <button className="cursor-pointer" onClick={() => window.open("https://github.com/isaaclks7", "_blank")}>
                <Github/>
                </button>
                <button className="cursor-pointer" onClick={() => window.open("www.linkedin.com/in/isaaclks7", "_blank")}>
                <Linkedin/>
                </button>
                <button className="cursor-pointer">
                <Mail/>
                </button>
            </p>
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