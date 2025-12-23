"use client"
import WorkComponent from "@/components/workExp";
import experience from "@/data/experience.json"
import education from "@/data/education.json"
import projects from "@/data/projects.json"
import Image from "next/image"
import AboutMe from "@/components/aboutMe"
import Education from "@/components/education"
import Skills from "@/components/skills"
import Project from "@/components/project"
import ContactBar from "@/components/contactBar"
import VantaBackground from "./vantaBackground";
import useThemeStore from "@/stores" 

export default function Home() {
  const { darkMode, toggleDarkMode } = useThemeStore()

  return (
    <div className="px-4 md:px-20 lg:px-50 xl:px-75 mb-20 mt-5">
      <VantaBackground isDarkMode={darkMode}/>
      <h1 className={`flex flex-col py-6 font-bold text-xl ${darkMode ? "text-white" : "text-black"}`}>
        <div className="flex flex-col items-center">
          <span className={`relative border ${darkMode ? "border-white" : "border-black"} p-2 rounded-[50%] inline-block overflow-hidden bg-white"`} style={{width: '90px', height: '90px'}}>
            <Image
              src="/profile_pic.jpg"
              alt="Profile picture"
              width={300}
              height={300}
              className="object-cover"
              style={{
                transformOrigin: "39px 16px",
                transform: "scale(2.3)"
              }}
            />
          </span>
          <p className="flex flex-row justify-between gap-2">
            <span>
              Lim Kai Sheng Isaac
            </span>
          </p>
        </div>
      </h1>
      <h1 className={`flex justify-start py-4 font-bold text-xl ${darkMode ? "text-white" : "text-black"}`}>
        ABOUT <br/> (This website is still a work in progress, expect some bugs)
      </h1>
      <AboutMe/>
      <h1 className={`flex justify-start py-4 font-bold text-xl ${darkMode ? "text-white" : "text-black"}`}>
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
        companyImg={item.companyImg}
        zoom={item.zoom}
        position={item.position}/>
      ))}
      <h1 className={`flex justify-start py-4 font-bold text-xl ${darkMode ? "text-white" : "text-black"}`}>
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
      <h1 className={`flex justify-start py-4 font-bold text-xl ${darkMode ? "text-white" : "text-black"}`}>
        SKILLS
      </h1>
      <Skills/>
      <h1 className={`flex justify-start py-4 font-bold text-xl ${darkMode ? "text-white" : "text-black"}`}>
        PROJECTS
      </h1>
      {projects.map((item) => (
          <Project key={item.id}
            name={item.name}
            description={item.description}
            technologies={item.technologies}
            photos={item.photos}
            captions={item.photoCaption}
            startDate={item.startDate}
            endDate={item.endDate}
            projectImg={item.projectImg}
            zoom={item.zoom}
            position={item.position}
            vidZoom={item.vidZoom}
            vidPosition={item.vidPosition}
            width={item.width}
          />
      ))}
      <ContactBar/>
      <div className="flex"/>
    </div>
  );
}
