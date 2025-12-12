import Image from "next/image"

export default function WorkComponent({
    jobTitle, company, description, startDate, endDate, companyWeb, companyImg 
}) {
    return (
        <div className="flex bg-blue-200 mb-4 border-5 border-green-300 rounded-lg">
            <Image
                className="border border-red-200 border-5"
                src={companyImg}
                alt="Example WebP"
                width={150}
                height={100}
            />
            <p className="ml-2 mt-1 text-black">
                {company}
                <br/>
                {jobTitle}
            </p>
        </div>
        
    )
}
