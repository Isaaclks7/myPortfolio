import Image from "next/image"
import WorkComponent from "../work_component/work_component";
import experience from "@/experience.json"

export default function Home() {
  return (
    <div className="m-4">
      <h1 className="flex justify-center mb-4 font-bold text-xl underline">
        WORK EXPERIENCES
      </h1>
      {experience.map((item) => (
        <WorkComponent
          key={item.id}
          jobTitle={item.jobTitle}
          company={item.company}
          startDate={item.startDate}
          endDate={item.endDate}
          companyWeb={item.companyWeb}
          companyImg={item.companyImg}/>
      ))}
    </div>
  );
}
