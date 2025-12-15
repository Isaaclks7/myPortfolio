"use client"
import WorkComponent from "@/components/workExp";
import experience from "@/experience.json"
import education from "@/education.json"
import Image from "next/image"
import AboutMe from "@/components/aboutMe"
import Education from "@/components/education"
import Skills from "@/components/skills"
import VantaBackground from "./vantaBackground";
import { Moon, Sun } from "@deemlol/next-icons";
import useThemeStore from "@/stores" 

export default function Home() {
  const { darkMode, toggleDarkMode } = useThemeStore()

  return (
    <div className="px-4">
      <VantaBackground isDarkMode={darkMode}/>
      <h1 className="flex flex-col mb-4 font-bold text-xl text-white">
        <span className="flex flex-row justify-center mb-4">
          Work in progress...
        </span>
        <div className="flex flex-col items-center">
          <span className="flex w-32 h-32 overflow-hidden flex-row justify-center">
            <Image
              src="/profile_pic.jpg"
              alt="Profile picture"
              width={120}
              height={120}
              className={`rounded-full object-cover mb-2 border-2 ${darkMode ? "border-white" : "border-black"}`}
              style={{
                objectPosition: "55%",
              }}
            />
          </span>
          <p className="flex flex-row justify-between bg-green-300">
            <span>
              Lim Kai Sheng Isaac
            </span>
            {darkMode ?
              <button className="cursor-pointer" onClick={toggleDarkMode}>
                <Moon/>
              </button>
              :
              <button className="cursor-pointer" onClick={toggleDarkMode}>
                <Sun/>
              </button>
            }
          </p>
        </div>
      </h1>
      <h1 className={`flex justify-center mb-4 font-bold text-xl ${darkMode ? "text-white" : "text-black"}`}>
        ABOUT
      </h1>
      <AboutMe/>
      <h1 className={`flex justify-start mb-4 font-bold text-xl ${darkMode ? "text-white" : "text-black"}`}>
        WORK EXPERIENCES
      </h1>
      {experience.map((item) => (
        <WorkComponent
          key={item.id}
          jobTitle={item.jobTitle}
          company={item.company}
          description={item.description}
          startDate={item.startDate}
          endDate={item.endDate}
          companyWeb={item.companyWeb}
          companyImg={item.companyImg}
          zoom={item.zoom}
          position={item.position}/>
      ))}
      <h1 className={`flex justify-start mb-4 font-bold text-xl ${darkMode ? "text-white" : "text-black"}`}>
        EDUCATION
      </h1>
      {education.map((item) => (
        <Education
          key={item.id}
          major={item.major}
          school={item.school}
          schoolShort={item.schoolShort}
          grade={item.grade}
          startDate={item.startDate}
          endDate={item.endDate}
          schoolWeb={item.schoolWeb}
          schoolImg={item.schoolImg}
          zoom={item.zoom}
          position={item.position}/>
      ))}
      <h1 className={`flex justify-start mb-4 font-bold text-xl ${darkMode ? "text-white" : "text-black"}`}>
        SKILLS
      </h1>
      <Skills/>
    </div>
  );
}
