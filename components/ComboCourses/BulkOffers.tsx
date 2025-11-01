'use client';
import React, { useRef, useState } from 'react';
import HeroSection from './HeroSection';
import WhyChooseSection from './WhyChooseSection';
import PricingSection from './PricingSection';

const faqs = [
  {
    question: 'Do I get lifetime access?',
    answer:
      'Yes. Your one-time payment gives you lifetime access, including future updates.',
  },
  {
    question: 'Will I receive a certificate?',
    answer:
      'Yes. Each bundle includes a Certificate of Completion you can share on LinkedIn.',
  },
  {
    question: 'Are there projects and datasets?',
    answer: 'Absolutely. You’ll experience real-world ML, CV, and BI.',
  },
  {
    question: 'Is support available?',
    answer:
      'Yes. Email support is available to all learners; Advanced AI Pack includes priority support. One-on-One doubt session is also available on demand.',
  },
];

function BulkOffers() {
  // ✅ Typed useState — index can be a number or null
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // ✅ Typed refs — they refer to HTMLDivElements
  const whyChooseRef = useRef<HTMLDivElement | null>(null);
  const pricingRef = useRef<HTMLDivElement | null>(null);

  // ✅ Fixed type & null safety
  const scrollToSection = (section: 'why' | 'pricing') => {
    if (section === 'why') {
      whyChooseRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'pricing') {
      pricingRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleDrawer = (index: number) => {
    setOpenIndex(prev => (prev === index ? null : index));
  };

  return (
    <>
      {/* ✅ Hero section with scroll handler */}
      <HeroSection onScrollToSection={scrollToSection} />

      {/* ✅ Why Choose Section */}
      <div ref={whyChooseRef} className="scroll-mt-20">
        <WhyChooseSection />
      </div>

      {/* ✅ Pricing Section */}
      <div ref={pricingRef} className="scroll-mt-20">
        <PricingSection />
      </div>

      {/* ✅ Testimonials Section */}
      <div className="px-6 md:px-16 lg:px-24 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gray-50 py-12 px-6 rounded-2xl">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
              Learners Love Teachercool
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  quote:
                    '“This bundle helped me crack my first DS internship. Clear explanations and solid projects.”',
                  name: 'BCA Student',
                },
                {
                  quote:
                    '“I’d tried other platforms, but the structured path + projects here made me confident.”',
                  name: 'Working Professional',
                },
                {
                  quote:
                    '“Great value for money. Lifetime access means I revisit whenever I need.”',
                  name: 'Data Analyst',
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white shadow-md rounded-xl p-6"
                >
                  <p className="text-gray-600 text-sm">{item.quote}</p>
                  <p className="text-gray-500 text-xs mt-2">- {item.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ✅ FAQ Section */}
      <div className="px-6 md:px-16 lg:px-24 py-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-12 border-l-4 border-blue-500 pl-4">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-lg border shadow-sm transition-all"
              >
                <button
                  onClick={() => toggleDrawer(index)}
                  className="w-full text-left p-5 flex justify-between items-center focus:outline-none"
                >
                  <h3 className="text-base font-medium text-gray-800">
                    {faq.question}
                  </h3>
                  <span className="text-xl text-gray-400 transition-transform duration-200">
                    {openIndex === index ? '-' : '+'}
                  </span>
                </button>

                <div
                  className={`px-5 pb-5 transition-all duration-300 text-gray-700 ${
                    openIndex === index ? 'block' : 'hidden'
                  }`}
                >
                  {faq.answer}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default BulkOffers;
