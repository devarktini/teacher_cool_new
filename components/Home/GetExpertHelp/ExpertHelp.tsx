import React from "react";

// import { ExpertRight } from "./ExpertRight";
import getExpert from '@/public/images/getExpertHelp.jpg'
import { ExpertHelpLeft } from "./ExpertHelpLeft";
export const ExpertHelp = () => {
  return (
    <>
    <div
  className="my-10 mx-auto lg:px-[7.25rem] md:px-8 grid lg:grid-cols-12 md:grid-cols-8 sm:grid-cols-1 max-sm:grid-cols-1 
             lg:gap-10 max-sm:gap-2 mt-10"
  style={{
    backgroundImage: `url(${getExpert.src})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
>
        <div className=" md:col-span-full  lg:col-span-6 bg-[#fbfbfb] border border-gray-300 rounded-lg bg-opacity-70 p-5 shadow-lg">
          <ExpertHelpLeft />
          </div>
      </div>

     
    </>
  );
};
