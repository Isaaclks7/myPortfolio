"use client"
import Image from "next/image"
import { useState } from "react"
import { ChevronDown, ChevronRight } from "@deemlol/next-icons";
import useThemeStore from "@/stores" 
import PhotoViewer from "./photoViewer";

export default function Project({
    name, description, technologies, photos, startDate, endDate, projectImg, zoom, position
}) {
    const [isOpen, setIsOpen] = useState(false);
    const { darkMode, toggleDarkMode } = useThemeStore()

    return (
        <div>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`mb-4 rounded-lg w-full hover:shadow-xl border border-transparent ${darkMode ? "hover:border-white" : "hover:border-black"} cursor-pointer`}
            >
                <div className="rounded-full flex flex-row items-start p-1">
                    <span className="relative border border-gray-300 p-2 rounded-[50%] inline-block overflow-hidden bg-white" style={{width: '42px', height: '42px'}}>
                        <Image
                            src={projectImg}
                            alt="School Logo"
                            width={100}
                            height={100}
                            className="object-cover"
                            style={{
                                transform: `scale(${zoom})`,
                                transformOrigin: position
                        }}
                        />
                    </span>
                    <div className={`flex flex-col ${darkMode ? "text-white" : "text-black"} px-3 w-full`}>
                        <div className="flex justify-between text-sm">
                            <div className="flex font-bold items-center gap-1 text-left">
                                <span>
                                    {name} 
                                </span>
                                <span>
                                    {isOpen ?
                                        <ChevronDown size={16}/>
                                        :
                                        <ChevronRight size={16}/>
                                    }
                                </span>
                            </div>
                            <div className="text-sm text-right whitespace-nowrap">
                                {startDate} - {endDate}
                            </div>
                        </div>
                        <div className="flex text-left text-sm">
                            {description}
                        </div>
                        {isOpen ? 
                            <div className="text-sm flex mt-1">
                                <span className="text-left">{technologies}</span>
                            </div>
                            :
                            ""
                        }
                    </div>
                </div>
            </button>
            {isOpen ?  
                <PhotoViewer photos={photos}/>
                :
                ""
            }
        </div>
    )
}
