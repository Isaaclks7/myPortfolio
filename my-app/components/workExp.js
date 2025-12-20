"use client"
import Image from "next/image"
import { useState } from "react"
import { ChevronDown, ChevronRight } from "@deemlol/next-icons";
import useThemeStore from "@/stores" 

export default function WorkComponent({
    jobTitle, company, description, startDate, endDate, companyImg, zoom, position
}) {
    const [isOpen, setIsOpen] = useState(false);
    const { darkMode, toggleDarkMode } = useThemeStore()

    return (
        <button
            onClick={() => setIsOpen(!isOpen)}
            className={`mb-4 rounded-lg w-full hover:shadow-xl border border-transparent ${darkMode ? "hover:border-white" : "hover:border-black"} cursor-pointer`}
        >
            <div className="rounded-full flex flex-row items-start p-1">
                <span className="relative border border-gray-300 p-2 rounded-[50%] inline-block overflow-hidden bg-white" style={{width: '42px', height: '42px'}}>
                    <Image
                        src={companyImg}
                        alt="Company Logo"
                        width={300}
                        height={300}
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
                            <span className="whitespace-nowrap">
                                {company} 
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
                    <div className="text-sm text-left">
                        {jobTitle}
                    </div>
                    {isOpen ?
                        <div className="text-sm text-left mt-1">
                            {description}
                        </div>
                        :
                        ""
                    }
                </div>
            </div>
        </button>
    );
}
