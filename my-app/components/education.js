"use client"
import Image from "next/image"
import { useState } from "react"
import { ChevronDown, ChevronRight } from "@deemlol/next-icons";


export default function Education({
    major, school, grade, startDate, endDate, schoolWeb, schoolImg 
}) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <button
            onClick={() => setIsOpen(!isOpen)}
            className="mb-4 rounded-lg w-full border hover:shadow-xl hover:border hover:border-white hover:border-1 cursor-pointer"
        >
            <div className="rounded-full flex flex-row items-start p-1">
				<Image
					className="rounded-lg object-contain bg-white"
					src={schoolImg}
					alt="School Logo"
					width={100}
					height={25}
				/>
                <div className="flex flex-col text-white px-3 w-full">
                    <div className="flex justify-between text-sm">
                        <div className="flex font-bold items-center gap-1 text-left">
							<span className="whitespace-nowrap">
                                {school} 
							</span>
							<span>
								{isOpen ?
									<ChevronRight size={16}/>
									:
									<ChevronDown size={16}/>
								}
							</span>
                        </div>
                        <div className="text-sm text-right whitespace-nowrap">
							{startDate} - {endDate}
						</div>
                    </div>
                    <div className="text-sm flex">
                        {major}
                    </div>
                    {isOpen ? "" :
                        <div className="text-sm flex mt-1">
                            <span className="text-left">{grade}</span>
                        </div>
                    }
                </div>
            </div>
        </button>
        
    )
}
