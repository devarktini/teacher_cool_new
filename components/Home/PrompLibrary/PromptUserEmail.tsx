'use client'
import { useState } from "react";
import HomeApiService from '@/services/homeApi';

const PromptUserEmail = () => {
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
    <section id="download" className="py-20 transparent">
      <div className="container mx-auto px-4 max-w-3xl text-center">
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
            <p className="mt-4 text-green-900 text-sm font-medium animate-pulse">
              Check your inbox! Download link sent successfully.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default PromptUserEmail
