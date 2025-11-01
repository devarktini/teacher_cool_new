// PricingSection.jsx
import React from "react";
import { useRouter } from "next/navigation";

const plans = [
  {
    name: "Starter Pack",
    details: "Python • Statistics • Power BI Basics",
    price: "₹1,999",
    features: ["Beginner friendly", "Lifetime access"],
    button: "Get Starter Pack",
    highlight: false,

  },
  {
    name: "Professional Pack",
    details: "Python • ML • Statistics • Power BI • NLP",

    price: "₹3,999",
    features: ["Projects & case studies", "Certificate of completion", "Lifetime updates"],
    button: "Get Professional",
    highlight: false,

  },
  {
    name: "Advanced AI Pack",
    details: "Python • ML • CV • Power BI Advanced • Tableau • NLP",
  
    price: "₹5,999",
    features: ["Advanced CV project"],
    button: "Get Advanced AI",
    highlight: true, // best value

  },
  {
    name: "All-in-One Master Bundle",
    details: "Full DS Certificate • Python • Stats • ML • CV • Power BI",
   
    price: "₹7,999",
    features: ["Everything in one place", "All projects + extras", "Certificate included"],
    button: "Get Master Bundle",
    highlight: false,

  },
];

const PricingSection = () => {
  const router = useRouter();
  return (
    <div className="px-6 md:px-16 lg:px-24 py-16">
      <div className="max-w-7xl mx-auto text-center">
        {/* Title */}
        <h2 className="text-2xl lg:text-start md:text-3xl font-bold text-gray-900">
          Choose Your Bundle
        </h2>

        <div className="lg:flex items-center justify-between">
          <p className="text-gray-600 mt-2 mb-6 ">
            Simple one-time pricing. Instant, lifetime access. No hidden fees.
          </p>

          {/* Tags */}
          <div className="flex justify-center gap-3 mb-10 flex-wrap">
            <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm">
              Limited-time launch offer
            </span>
            <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm">
              Certificate included
            </span>
          </div>

        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl shadow-md p-6 flex flex-col border ${plan.highlight
                  ? "border-blue-600 relative"
                  : "border-gray-200"
                }`}
            >
              {/* Best Value Badge */}
              {plan.highlight && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Best Value
                </span>
              )}

              <h3 className="text-lg font-semibold">{plan.name}</h3>
              <p className="text-gray-600 text-sm mt-1">{plan.details}</p>

              <p className="text-2xl font-bold mt-4">{plan.price}</p>

              <ul className="mt-3 text-gray-600 text-sm flex-1 space-y-1">
                {plan.features.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>

              <button className="mt-6 bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition"
                //   onClick={() => navigate(`/bulk-offers/${plan.button}`)}
                onClick={() => router.push(`/online-courses-combo/${plan?.button?.toLowerCase()?.replace(/\s+/g, "-")}`)}
              >
                {plan.button}
              </button>
            </div>
          ))}
        </div>

        {/* Note */}
        <p className="text-xs text-gray-500 mt-6">
          *Prices shown in INR. Equivalents in USD can be offered during checkout.
        </p>
      </div>
    </div>
  );
};

export default PricingSection;
