'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

import slide_2 from "@/public/images/Carousal/slider2.png";
// import slide_4 from "../../assests/images/carousel/slide4.jpg";
import slide5 from "@/public/images/Carousal/slider5.jpg";
import slide6 from "@/public/images/Carousal/slider6.png";
import slide7 from "@/public/images/Carousal/slider7.jpg";
import ai from "@/public/images/Carousal/aibanner.jpg";
import aitwo from "@/public/images/Carousal/dataScience.jpg";

import mob2 from '@/public/images/Carousal/mob2.png';
import mob3 from '@/public/images/Carousal/mob3.png';
import mob4 from '@/public/images/Carousal/mob4.png';
import mob5 from '@/public/images/Carousal/mob5.png';



export default function Carousel() {
  const slides = [ai,aitwo, slide_2,slide5,slide6,slide7];
  const slidesMob = [mob2,mob3,mob4,mob5];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentSlideMob, setCurrentSlideMob] = useState(0);

  // Automatically change slides every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [slides.length]);

  // Mob
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlideMob((prev) => (prev + 1) % slidesMob.length);
    }, 3000);
    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [slidesMob.length]);



  const goToSlide = (index:any) => {
    setCurrentSlide(index);
  };

  const goToslideMob = (index:any) =>{
    setCurrentSlideMob(index)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const prevSlideMob = () => {
    setCurrentSlideMob((prev) => (prev - 1 + slidesMob.length) % slidesMob.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };
  const nextSlideMob = () => {
    setCurrentSlideMob((prev) => (prev + 1) % slidesMob.length);
  };

  return (
      <>
      <div className="hidden lg:block relative w-full ">
        {/* Carousel Wrapper */}
        <div className="relative h-96 overflow-hidden ">
          {/* Slides */}
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                currentSlide === index ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={slide}
                alt={`Slide ${index + 1}`}
                className="block w-full h-full object-fit"
              />
           
            </div>
          ))}
        </div>

        {/* Navigation Dots */}
        <div className="absolute bottom-5 left-1/2 flex space-x-3 -translate-x-1/2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full ${
                currentSlide === index ? "bg-white" : "bg-gray-400"
              } opacity-70 hover:opacity-100`}
              aria-label={`Slide ${index + 1}`}
            ></button>
          ))}
        </div>

        {/* Previous Button */}
        <button
          type="button"
          className="absolute top-0 left-0 z-10 flex items-center justify-center h-full px-4 group"
          onClick={prevSlide}
        >
          <span className="w-10 h-10 flex items-center justify-center rounded-full bg-white/30 group-hover:bg-white/50">
            <svg
              className="w-4 h-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 1L1 5l4 4"
              />
            </svg>
            <span className="sr-only">Previous</span>
          </span>
        </button>

        {/* Next Button */}
        <button
          type="button"
          className="absolute top-0 right-0 z-10 flex items-center justify-center h-full px-4 group"
          onClick={nextSlide}
        >
          <span className="w-10 h-10 flex items-center justify-center rounded-full bg-white/30 group-hover:bg-white/50">
            <svg
              className="w-4 h-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 9l4-4-4-4"
              />
            </svg>
            <span className="sr-only">Next</span>
          </span>
        </button>
      </div>


      {/* formobile  */}


      <div className="relative w-full h-56 md:h-96  lg:hidden">
        {/* Carousel Wrapper */}
        <div className="relative h-full overflow-hidden ">
          {/* Slides */}
          {slidesMob.map((slidesMob, index) => (
            <div
              key={index}
              className={`absolute h-full inset-0 transition-opacity duration-700 ease-in-out ${
                currentSlideMob === index ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={slidesMob}
                alt={`Slide ${index + 1}`}
                className="block w-full h-full object-fit "
              />
           
            </div>
          ))}
        </div>     
      </div>
    </>
  )
}
