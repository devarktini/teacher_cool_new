import React from 'react'
import Image from 'next/image';
import django from "@/public/images/courseicons/Django.png";
import pythonicon from "@/public/images/courseicons/python.png";
import nodejsicon from "@/public/images/courseicons/Nodejs.png";
import mongodbicon from "@/public/images/courseicons/MongoDB.png";
import powerbi from "@/public/images/courseicons/PowerBI.png";
import ricon from "@/public/images/courseicons/Ricon.png";
import reacticon from "@/public/images/courseicons/Reacticon.png";
import sqlicon from "@/public/images/courseicons/sqlicon.png";
import Tableauicon from "@/public/images/courseicons/Tableauicon.png";
import Link from 'next/link';
const topics = [
  { name: "Python", icon: pythonicon },
  { name: "React JS", icon: reacticon },
  { name: "Mongo DB", icon: mongodbicon },
  { name: "C#", icon: Tableauicon },
  { name: "Redhat", icon: sqlicon },
  { name: "AWS", icon: ricon },
  { name: "Azure", icon: powerbi },
  { name: "Angular", icon: nodejsicon },
  { name: "R", icon: django },
];

function PopularTopics() {
  return (
    <div className="bg-gradient-to-r flex-col items-center lg:flex lg:flex-row xl:flex xl:flex-row from-blue-900 to-cyan-900 p-8 justify-around">
      <div className="text-white flex flex-col lg:flex-col md:flex-row md:justify-between items-center md:items-start gap-3 ">
        <h2 className="text-xl md:text-2xl font-bold">Popular Topics To Learn Now</h2>
        <Link
          href={{
            pathname: "/courses",
            search: "?query=free",
          }}
          // href= "/courses"
          className="w-[13rem] cursor-pointer text-black text-center  bg-white hover:text-white rounded-sm py-2 px-5 hover:bg-blue-900 hover:border transition duration-300"
        >
          View All Courses
        </Link>
      </div>
      <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-6 ">
        {topics.map((topic, index) => (
          <div key={index} className="">
            <Image
              src={topic.icon}
              alt={topic.name}
              className="w-20 h-20 rounded-lg transition duration-300 ease-in-out border-2 border-transparent hover:border-cyan-300"
            />
          </div>
        ))}
      </div>


    </div>
  )
}

export default PopularTopics
