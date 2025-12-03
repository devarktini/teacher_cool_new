import React from "react";
import earningIcon from "@/public/images/icon1.png";
import totalIcon from "@/public/images/icon2.png";
import trainingIcon from "@/public/images/icon3.png";
import trainNotIcon from "@/public/images/icon4.png";
import studyMatIcon from "@/public/images/icon5.png";
import Image from "next/image";

export const DashViewData = [
  { title: "Total Earning", counts: "0", img: earningIcon },
  { title: "Total Training", counts: "0", img: totalIcon },
  { title: "Training Done", counts: "0", img: trainingIcon },
  { title: "Training not done", counts: "0", img: trainNotIcon },
  { title: "Study Materials", counts: "0", img: studyMatIcon },
];

export const DashDataView = ( ) => {
  return (
    <>
      <div className="container mx-auto">
        <div className=" grid  grid-cols-3  max-sm:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-5">
          {DashViewData.map((item, index) => (
            <div
              key={index}
              className="card p-3 border-2 textColor rounded-[10px] cursor-pointer bg-white"
            >
              <div className="flex gap-4">
                <Image className="w-[34px] h-[34px]" src={item.img} alt="" />
                <div className="flex flex-col ">
                  <h1 className="text-sm text-textColor ">{item.title}</h1>
                  <h1 className="text-2xl font-medium text-customBlue">
                    {item.counts}
                  </h1>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
