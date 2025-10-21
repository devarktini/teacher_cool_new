'use client';

import React, { ReactNode, useEffect, useRef, useState, useCallback } from "react";
import { FaStar } from "react-icons/fa";
import { getCompleteUrl } from "@/lib/getCompleteUrl";
import logo from '@/public/images/Logo.png';

interface Testimonial {
  id?: string | number;
  title: string;
  comment: string;
  image?: string;
  rating: number;
  username: string;
}

interface TestimonialSliderProps {
  testimonialData: Testimonial[];
}

const TestimonialCard: React.FC<Testimonial> = ({ title, image, comment, rating, username }) => {
  const renderRating = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar key={i} size={16} color={i <= rating ? "#FBBF24" : "#E5E7EB"} className={i <= rating ? "text-yellow-400" : "text-gray-300"} />
      );
    }
    return stars;
  };

  return (
    <div className="p-8 border border-gray-200 rounded-lg shadow-md text-center bg-white hover:shadow-lg transition-shadow duration-300 mx-3 transform hover:-translate-y-1 transition-transform h-full">
      <img
        src={image ? getCompleteUrl(image) : logo.src}
        alt={title}
        className="w-24 h-24 mx-auto rounded-full object-cover border-4 border-white shadow-md"
      />
      <h4 className="mt-4 text-xl font-semibold text-gray-800">{title}</h4>
      <p className="mt-2 text-sm text-gray-500">@{username}</p>
      <div className="mt-3 flex justify-center space-x-1">
        {renderRating(rating)}
      </div>
      <p className="mt-4 text-gray-600 italic">{comment}</p>
    </div>
  );
};

interface CarouselProps {
  children: ReactNode[];
  slidesToShow?: number;
  slidesToScroll?: number;
  autoplay?: boolean;
  autoplaySpeed?: number;
  infinite?: boolean;
  dots?: boolean;
  responsive?: {
    breakpoint: number;
    settings: {
      slidesToShow: number;
      slidesToScroll?: number;
    };
  }[];
}

const Carousel: React.FC<CarouselProps> = ({
  children,
  slidesToShow = 1,
  slidesToScroll = 1,
  autoplay = false,
  autoplaySpeed = 3000,
  infinite = false,
  dots = true,
  responsive = [],
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);
  const totalSlides = children.length;

  const [actualSlidesToShow, setActualSlidesToShow] = useState(slidesToShow);
  const [actualSlidesToScroll, setActualSlidesToScroll] = useState(slidesToScroll);

  // Update responsive settings
  useEffect(() => {
    const updateResponsive = () => {
      const width = window.innerWidth;
      let newSlidesToShow = slidesToShow;
      let newSlidesToScroll = slidesToScroll;

      // Sort responsive breakpoints from largest to smallest
      const sortedResponsive = [...responsive].sort((a, b) => b.breakpoint - a.breakpoint);
      
      for (const resp of sortedResponsive) {
        if (width <= resp.breakpoint) {
          newSlidesToShow = resp.settings.slidesToShow;
          newSlidesToScroll = resp.settings.slidesToScroll || slidesToScroll;
          break;
        }
      }

      setActualSlidesToShow(newSlidesToShow);
      setActualSlidesToScroll(newSlidesToScroll);
    };

    updateResponsive();
    window.addEventListener("resize", updateResponsive);
    return () => {
      window.removeEventListener("resize", updateResponsive);
    };
  }, [responsive, slidesToShow, slidesToScroll]);

  // Calculate total number of slides and adjust current slide if needed
  useEffect(() => {
    if (!infinite) {
      const maxSlide = Math.max(0, totalSlides - actualSlidesToShow);
      if (currentSlide > maxSlide) {
        setCurrentSlide(maxSlide);
      }
    }
  }, [actualSlidesToShow, totalSlides, infinite, currentSlide]);

  const next = useCallback(() => {
    if (infinite) {
      setCurrentSlide((prev) => (prev + actualSlidesToScroll) % totalSlides);
    } else {
      setCurrentSlide((prev) => {
        const maxSlide = Math.max(0, totalSlides - actualSlidesToShow);
        return Math.min(prev + actualSlidesToScroll, maxSlide);
      });
    }
  }, [infinite, actualSlidesToScroll, totalSlides, actualSlidesToShow]);

  const prev = useCallback(() => {
    if (infinite) {
      setCurrentSlide((prev) => (prev - actualSlidesToScroll + totalSlides) % totalSlides);
    } else {
      setCurrentSlide((prev) => Math.max(prev - actualSlidesToScroll, 0));
    }
  }, [infinite, actualSlidesToScroll, totalSlides]);

  // Go to specific slide
  const goToSlide = (slideIndex: number) => {
    if (infinite) {
      setCurrentSlide(slideIndex % totalSlides);
    } else {
      const maxSlide = Math.max(0, totalSlides - actualSlidesToShow);
      setCurrentSlide(Math.min(Math.max(slideIndex, 0), maxSlide));
    }
  };

  // Autoplay
  useEffect(() => {
    if (autoplay && totalSlides > actualSlidesToShow) {
      timerRef.current = window.setInterval(() => {
        next();
      }, autoplaySpeed);
      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [autoplay, autoplaySpeed, next, totalSlides, actualSlidesToShow]);

  // Calculate translateX - this is the key fix
  const translateX = -((currentSlide * 100) / actualSlidesToShow);

  // Calculate visible slides and dots
  const totalDots = infinite 
    ? totalSlides 
    : Math.max(1, totalSlides - actualSlidesToShow + 1);

  const getActiveDotIndex = () => {
    if (infinite) {
      return currentSlide % totalSlides;
    }
    return currentSlide;
  };

  return (
    <div className="relative overflow-hidden">
      <div 
        className="flex transition-transform duration-500 ease-in-out" 
        ref={containerRef}
        style={{ 
          transform: `translateX(${translateX}%)`,
          width: `${(totalSlides * 100) / actualSlidesToShow}%`
        }}
      >
        {children.map((child, idx) => (
          <div 
            key={idx} 
            className="flex-shrink-0 px-2"
            style={{ width: `${100 / actualSlidesToShow}%` }}
          >
            {child}
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {totalSlides > actualSlidesToShow && (
        <>
          <button 
            onClick={prev}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 shadow-md rounded-full transition-colors z-10"
            aria-label="Previous testimonial"
          >
            ‹
          </button>
          <button 
            onClick={next}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 shadow-md rounded-full transition-colors z-10"
            aria-label="Next testimonial"
          >
            ›
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {dots && totalDots > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: totalDots }).map((_, dotIdx) => (
            <button 
              key={dotIdx}
              onClick={() => goToSlide(dotIdx)}
              className={`h-3 w-3 rounded-full transition-all duration-300 ${
                getActiveDotIndex() === dotIdx ? "bg-blue-600 scale-110" : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to testimonial ${dotIdx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const TestimonialSlider: React.FC<TestimonialSliderProps> = ({ testimonialData }) => {
  return (
    <div className="mx-auto mt-10 px-4 max-w-7xl">
      <h2 className="text-3xl font-semibold mb-8 text-center">Testimonials</h2>
      <Carousel
        slidesToShow={3}
        slidesToScroll={1}
        autoplay={true}
        autoplaySpeed={4000}
        infinite={true}
        dots={true}
        responsive={[
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 2,
            }
          },
          {
            breakpoint: 640,
            settings: {
              slidesToShow: 1,
            }
          }
        ]}
      >
        {testimonialData.map((testimonial) => (
          <div key={testimonial.id} className="h-full">
            <TestimonialCard
              title={testimonial.title}
              comment={testimonial.comment}
              image={testimonial.image}
              rating={testimonial.rating}
              username={testimonial.username}
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default TestimonialSlider;