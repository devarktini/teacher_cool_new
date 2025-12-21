'use client'
import { Check, Clock } from "lucide-react";
import { useState } from "react";
import HomeApiService from '@/services/homeApi';

const FinalCTASection = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setIsLoading(true);
    try {
        const formData = new FormData()
         formData.append("email", email)
      // Replace with your actual API call
      await HomeApiService.createPLUsers(formData);
      setIsSubmitted(true);
      setTimeout(()=>{
        setEmail("")
        setIsSubmitted(false)
      },5000)
    } catch (error) {
      console.error("Subscription failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="download" className="py-20 bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
      <div className="container mx-auto px-4 max-w-3xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to 10X Your AI Productivity?
        </h2>

        <p className="text-xl mb-8 opacity-90">
          Join 2,347+ professionals who are already using these prompts to save 10-15 hours per week.
        </p>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-8 inline-block">
          <span className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Limited Time: Grab it while it's still free
          </span>
        </div>

        <a
          href="#download"
          className="inline-block bg-white text-indigo-600 px-12 py-5 rounded-full text-xl font-bold shadow-lg mb-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        >
          DOWNLOAD FREE LIBRARY NOW
        </a>

        <div className="flex flex-wrap justify-center gap-4 mb-10 text-sm">
          <span className="flex items-center gap-2">
            <Check className="w-4 h-4" /> Instant access
          </span>
          <span className="flex items-center gap-2">
            <Check className="w-4 h-4" /> No spam ever
          </span>
          <span className="flex items-center gap-2">
            <Check className="w-4 h-4" /> Unsubscribe anytime
          </span>
        </div>

        <div className="max-w-md mx-auto bg-white/10 backdrop-blur-sm p-6 rounded-2xl">
          <p className="text-lg mb-4">Enter your email below to get instant access:</p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={handleChange}
              disabled={isLoading || isSubmitted}
              required
              className="w-full px-4 py-3 rounded-lg text-gray-900 border-2 border-white/50 focus:outline-none focus:border-green-500 focus:border-opacity-100 transition-colors"
            />
            <button
              type="submit"
              disabled={!email || isLoading || isSubmitted}
              className="w-full bg-green-500 text-white py-3 px-6 rounded-lg font-bold text-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-green-500/40 hover:shadow-xl"
            >
              {isLoading 
                ? "Submitting..." 
                : isSubmitted 
                ? "Access Granted! →" 
                : "GET INSTANT ACCESS →"
              }
            </button>
          </form>

          {isSubmitted && (
            <p className="mt-4 text-green-200 text-sm font-medium animate-pulse">
              Check your inbox! Download link sent successfully.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;
