import WorkComponent from "../components/workExp";
import experience from "@/experience.json"
import education from "@/education.json"
import Image from "next/image"
import AboutMe from "../components/aboutMe"
import Education from "../components/education"
import Skills from "../components/skills"

export default function Home() {
  return (
    <div className="px-4">
      <h1 className="flex flex-col mb-4 font-bold text-xl text-white">
        <span className="flex flex-row justify-center">
          Lim Kai Sheng Isaac
        </span>
        <span className="flex w-32 h-32 overflow-hidden flex-row justify-center">
          <Image
            src="/profile_pic.jpg"
            alt="Profile picture"
            width={120}
            height={120}
            className="rounded-full object-cover border-2 border-white"
            style={{
              objectPosition: "55%",
            }}
          />
        </span>
      </h1>
      <h1 className="flex justify-center mb-4 font-bold text-xl text-white">
        ABOUT
      </h1>
      <AboutMe/>
      <h1 className="flex justify-start mb-4 font-bold text-xl text-white">
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
          companyImg={item.companyImg}/>
      ))}
      <h1 className="flex justify-start mb-4 font-bold text-xl text-white">
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
          schoolImg={item.schoolImg}/>
      ))}
      <h1 className="flex justify-start mb-4 font-bold text-xl text-white">
        SKILLS
      </h1>
      <Skills/>
    </div>
  );
}
