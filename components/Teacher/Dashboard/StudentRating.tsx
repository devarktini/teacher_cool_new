'use client'
import { useState, useEffect } from 'react';

const StudentRating = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [reviews] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      rating: 4.9,
      comment: "This course transformed my understanding of the subject. The instructors are amazing!",
      image: "https://randomuser.me/api/portraits/women/1.jpg"
    },
    {
      id: 2,
      name: "Michael Chen",
      rating: 4.8,
      comment: "Excellent content and well-structured curriculum. Highly recommended for beginners!",
      image: "https://randomuser.me/api/portraits/men/1.jpg"
    },
    {
      id: 3,
      name: "Emma Wilson",
      rating: 4.7,
      comment: "The practical examples helped me implement concepts in real-world projects.",
      image: "https://randomuser.me/api/portraits/women/2.jpg"
    }
  ]);

  useEffect(() => {
    const autoAdvance = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(autoAdvance);
  }, [reviews.length]);

  const goToSlide = (index:number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % reviews.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const renderStars = (rating:number) => {
    return [...Array(5)].map((_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-[#ffb400]' : 'text-gray-300'} fill-current`}
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
      </svg>
    ));
  };

  return (
    <div className="border-4 border-logoPrimary lg:h-[250px] lg:w-[500px] bg-white shadow-lg rounded-xl overflow-hidden relative group">
      <div className="flex h-full transition-transform duration-500 ease-in-out"
           style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
        {reviews.map((review) => (
          <div key={review.id} className="min-w-full p-6 flex flex-col justify-between">
            <div>
              <h4 className="font-Roboto text-lg font-semibold text-[#1E1E1E] mb-4">
                Student Feedback
              </h4>
              <div className="flex items-start gap-4">
                <img 
                  src={review.image} 
                  alt={review.name} 
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-lg">{review.rating}</span>
                    <div className="flex">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    "{review.comment}"
                  </p>
                </div>
              </div>
            </div>
            <div className="text-right text-sm text-gray-500">- {review.name}</div>
          </div>
        ))}
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {reviews.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              currentSlide === index ? 'bg-[#2dabdb]' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={prevSlide}
        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-all"
      >
        <svg className="w-6 h-6 text-[#2dabdb]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button 
        onClick={nextSlide}
        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-all"
      >
        <svg className="w-6 h-6 text-[#2dabdb]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default StudentRating;




