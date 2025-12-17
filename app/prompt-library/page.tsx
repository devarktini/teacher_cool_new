import React from 'react';
import { Check, Star, Download, ShieldCheck, Zap, BookOpen, Code, Database, Megaphone, LifeBuoy, Search, Briefcase, Mail, Share2, Clock } from 'lucide-react';

// --- Data Types & Mock Data ---
interface Category {
  title: string;
  description: string;
  count: number;
  icon: React.ElementType;
  emoji: string;
}

const categories: Category[] = [
  {
    title: "Content Creation",
    description: "Blog posts, articles, tutorials, case studies, listicles, guides",
    count: 50,
    icon: BookOpen,
    emoji: "📝"
  },
  {
    title: "Code Generation",
    description: "Python, React, APIs, databases, testing, automation, DevOps",
    count: 75,
    icon: Code,
    emoji: "💻"
  },
  {
    title: "Data Analysis",
    description: "EDA, visualizations, trend analysis, statistical tests, reporting",
    count: 50,
    icon: Database,
    emoji: "📊"
  },
  {
    title: "Marketing & Sales",
    description: "Ad copy, landing pages, email campaigns, SEO, social media",
    count: 75,
    icon: Megaphone,
    emoji: "📢"
  },
  {
    title: "Customer Service",
    description: "Support responses, FAQs, chatbots, knowledge base articles",
    count: 50,
    icon: LifeBuoy,
    emoji: "💬"
  },
  {
    title: "Research & Learning",
    description: "Summaries, literature reviews, study guides, concept explanations",
    count: 50,
    icon: Search,
    emoji: "🔍"
  },
  {
    title: "Business Strategy",
    description: "SWOT analysis, competitive research, OKRs, decision-making",
    count: 50,
    icon: Briefcase,
    emoji: "📈"
  },
  {
    title: "Email Writing",
    description: "Cold outreach, follow-ups, proposals, internal communication",
    count: 50,
    icon: Mail,
    emoji: "✉️"
  },
  {
    title: "Social Media",
    description: "LinkedIn posts, Twitter threads, Instagram captions, engagement",
    count: 50,
    icon: Share2,
    emoji: "📱"
  },
  {
    title: "Personal Productivity",
    description: "Task planning, meeting agendas, summaries, organization",
    count: 50,
    icon: Clock,
    emoji: "⚡"
  }
];

const testimonials = [
  {
    quote: "This library saved me 5 hours in the first day. The marketing prompts alone are worth 10X what I'd pay for this.",
    author: "Sarah K., Content Marketer"
  },
  {
    quote: "Finally, prompts that actually work! I've tried dozens of 'ultimate prompt guides' and this is the only one I keep coming back to.",
    author: "Mike R., Software Developer"
  },
  {
    quote: "The code generation prompts transformed my workflow. What took me 2 hours now takes 15 minutes.",
    author: "Priya M., Data Scientist"
  },
  {
    quote: "I was skeptical at first, but these prompts are incredibly well-structured. You can tell they've been tested extensively.",
    author: "James L., AI Consultant"
  }
];

const faqs = [
  {
    question: "Which AI tools does this work with?",
    answer: "These prompts are optimized for ChatGPT (GPT-4, GPT-4o), Claude (Sonnet 4, Opus 4), and Gemini. They work with all major AI tools."
  },
  {
    question: "Is this really free?",
    answer: "Yes, completely free. No credit card required. No hidden fees. I'm building my community and want to provide massive value upfront."
  },
  {
    question: "How is this delivered?",
    answer: "Instant access via email. You'll receive a link to the library in multiple formats (Google Doc, Notion, PDF) so you can use whatever works best for you."
  },
  {
    question: "Do I need to know prompt engineering already?",
    answer: "Nope! Each prompt includes instructions on how to use it. Plus you get the best practices guide that teaches you the fundamentals."
  },
  {
    question: "How often is this updated?",
    answer: "I update the library quarterly as new AI models are released and best practices evolve. You get all updates automatically, forever."
  },
  {
    question: "Can I share this with my team?",
    answer: "Absolutely! Share it with your team, colleagues, or anyone you think would benefit. The more people using AI effectively, the better."
  },
  {
    question: "What makes these prompts better than what I find on Twitter?",
    answer: "These aren't random prompts cobbled together. Each one has been tested extensively across multiple AI models and refined based on actual results. Plus they're organized by use case so you can find what you need instantly."
  }
];

const bonuses = [
  "Prompt Engineering Best Practices Guide",
  "Model-Specific Optimization Tips (ChatGPT, Claude, Gemini)",
  "15 Advanced Prompt Patterns Explained",
  "Before/After Examples for Each Category",
  "Troubleshooting Common Prompt Issues",
  "Access to Future Updates (Forever)"
];

// --- Components ---
const HeroSection = () => (
  <section className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white py-20">
    <div className="container mx-auto px-4 max-w-4xl text-center">
      <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
        Stop Wasting Hours Crafting the Perfect AI Prompt
      </h1>
      <p className="text-xl md:text-2xl mb-10 opacity-95">
        Get 500 Battle-Tested Prompts That Consistently Produce 10X Better Results
      </p>
      
      <div className="flex flex-col md:flex-row justify-center items-center gap-10 my-10">
        <div className="text-center">
          <div className="text-5xl font-extrabold mb-2">500</div>
          <div className="text-lg opacity-90">Ready-to-Use Prompts</div>
        </div>
        <div className="text-center">
          <div className="text-5xl font-extrabold mb-2">10</div>
          <div className="text-lg opacity-90">Categories</div>
        </div>
        <div className="text-center">
          <div className="text-5xl font-extrabold mb-2">2,347</div>
          <div className="text-lg opacity-90">Downloads</div>
        </div>
      </div>
      
      <a 
        href="#download" 
        className="inline-block bg-green-500 text-white px-12 py-5 rounded-full text-xl font-bold shadow-lg shadow-green-500/40 hover:shadow-green-500/50 hover:-translate-y-1 transition-all duration-300 mb-6"
      >
        GET FREE ACCESS NOW
      </a>
      
      <div className="flex flex-wrap justify-center gap-6 text-sm md:text-base">
        <span className="flex items-center gap-2">
          <Check className="w-4 h-4" /> No credit card required
        </span>
        <span className="flex items-center gap-2">
          <Check className="w-4 h-4" /> Instant access
        </span>
        <span className="flex items-center gap-2">
          <Check className="w-4 h-4" /> Works with ChatGPT, Claude & Gemini
        </span>
      </div>
    </div>
  </section>
);

const ProblemSection = () => (
  <section className="py-16 bg-white">
    <div className="container mx-auto px-4 max-w-3xl">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
        Sound Familiar?
      </h2>
      
      <div className="bg-red-50 border-l-4 border-red-400 p-8 rounded-lg mb-10">
        <ul className="space-y-4">
          <li className="flex items-start gap-3 text-lg">
            <span className="text-red-500 font-bold">❌</span>
            <span>You spend 2-3 hours per day tweaking prompts to get decent results</span>
          </li>
          <li className="flex items-start gap-3 text-lg">
            <span className="text-red-500 font-bold">❌</span>
            <span>AI outputs are generic, vague, or completely miss the mark</span>
          </li>
          <li className="flex items-start gap-3 text-lg">
            <span className="text-red-500 font-bold">❌</span>
            <span>You're copying random prompts from Twitter that rarely work</span>
          </li>
          <li className="flex items-start gap-3 text-lg">
            <span className="text-red-500 font-bold">❌</span>
            <span>You start from scratch every single time</span>
          </li>
          <li className="flex items-start gap-3 text-lg">
            <span className="text-red-500 font-bold">❌</span>
            <span>You wonder why others get amazing results while you struggle</span>
          </li>
        </ul>
      </div>
      
      <p className="text-xl text-center text-gray-800 font-bold">
        Here's the truth: Bad prompts aren't your fault. You just haven't seen what works.
      </p>
    </div>
  </section>
);

const SolutionSection = () => (
  <section className="py-16 bg-gray-50">
    <div className="container mx-auto px-4 max-w-3xl">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8">
        What If You Had a Prompt Library That Actually Works?
      </h2>
      
      <p className="text-xl text-gray-700 text-center mb-6">
        I spent 6 months testing over 10,000 prompts with ChatGPT, Claude, and Gemini.
      </p>
      
      <p className="text-xl text-gray-700 text-center mb-10">
        I kept only the 500 that consistently produce exceptional results.
      </p>
      
      <div className="bg-green-50 border-l-4 border-green-500 p-8 rounded-lg">
        <ul className="space-y-4">
          <li className="flex items-start gap-3 text-lg">
            <span className="text-green-500 font-bold">✅</span>
            <span>Copy-paste ready prompts for 10 different use cases</span>
          </li>
          <li className="flex items-start gap-3 text-lg">
            <span className="text-green-500 font-bold">✅</span>
            <span>Works with ALL major AI tools (ChatGPT, Claude, Gemini)</span>
          </li>
          <li className="flex items-start gap-3 text-lg">
            <span className="text-green-500 font-bold">✅</span>
            <span>Organized by category for instant access</span>
          </li>
          <li className="flex items-start gap-3 text-lg">
            <span className="text-green-500 font-bold">✅</span>
            <span>Includes instructions and best practices</span>
          </li>
          <li className="flex items-start gap-3 text-lg">
            <span className="text-green-500 font-bold">✅</span>
            <span>Saves you 10-15 hours per week</span>
          </li>
          <li className="flex items-start gap-3 text-lg">
            <span className="text-green-500 font-bold">✅</span>
            <span>Tested by 500+ professionals and students</span>
          </li>
        </ul>
      </div>
    </div>
  </section>
);

const CategoriesSection = () => (
  <section className="py-16 bg-white">
    <div className="container mx-auto px-4 max-w-6xl">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
        What's Inside the Library
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {categories.map((category, index) => (
          <div 
            key={index} 
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100"
          >
            <div className="text-4xl mb-3">{category.emoji}</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{category.title}</h3>
            <p className="text-gray-600 text-sm mb-3">{category.description}</p>
            <div className="text-indigo-600 font-semibold">
              {category.count} prompts
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const TestimonialsSection = () => (
  <section className="py-16 bg-white">
    <div className="container mx-auto px-4 max-w-4xl">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
        What People Are Saying
      </h2>
      
      <div className="space-y-6">
        {testimonials.map((testimonial, index) => (
          <div 
            key={index} 
            className="bg-gray-50 p-8 rounded-xl border-l-4 border-indigo-500"
          >
            <p className="text-xl italic text-gray-700 mb-4">
              "{testimonial.quote}"
            </p>
            <p className="text-indigo-600 font-semibold">{testimonial.author}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const BonusSection = () => (
  <section className="py-16 bg-gradient-to-br from-yellow-100 to-yellow-50">
    <div className="container mx-auto px-4 max-w-4xl">
      <div className="text-center mb-10">
        <h3 className="text-3xl md:text-4xl font-bold text-yellow-800 mb-6">
          🎁 BONUS: You Also Get...
        </h3>
      </div>
      
      <ul className="space-y-4 max-w-2xl mx-auto">
        {bonuses.map((bonus, index) => (
          <li key={index} className="flex items-start gap-4 text-lg text-yellow-900">
            <span className="text-2xl">🎁</span>
            <span>{bonus}</span>
          </li>
        ))}
      </ul>
      
      <div className="text-center mt-12">
        <p className="text-xl text-yellow-900 mb-2">
          <strong>Total Value: $497</strong>
        </p>
        <p className="text-3xl md:text-4xl font-bold text-red-600">
          Your Price: FREE
        </p>
      </div>
    </div>
  </section>
);

const FAQSection = () => (
  <section className="py-16 bg-white">
    <div className="container mx-auto px-4 max-w-3xl">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
        Frequently Asked Questions
      </h2>
      
      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              {faq.question}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const FinalCTASection = () => (
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
        href="#" 
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
        
        <form className="space-y-4">
          <input 
            type="email" 
            placeholder="Enter your email address"
            className="w-full px-4 py-3 rounded-lg text-gray-900 border-2 border-white focus:outline-none focus:border-green-500"
          />
          <button 
            type="submit"
            className="w-full bg-green-500 text-white py-3 px-6 rounded-lg font-bold text-lg hover:bg-green-600 transition-colors duration-300 shadow-lg shadow-green-500/40"
          >
            GET INSTANT ACCESS →
          </button>
        </form>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="py-12 bg-gray-50 text-center">
    <div className="container mx-auto px-4 max-w-2xl">
      <p className="text-gray-700 text-lg mb-4">
        <strong>Created by [Teachercool]</strong><br />
        Data Science, Machine Learning & Agentic AI Trainer<br />
        Helping 500+ professionals master AI
      </p>
      
      <p className="text-gray-600 mb-8">
        Questions? Email me at [info@teachercool.com]<br />
        Connect on LinkedIn: [ <a
                    href="https://www.linkedin.com/company/teachercoolofficial/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-500 "
                  >
                  Teachercool
                  </a> ]
      </p>
      
      <p className="text-gray-500 text-sm">
        © 2024 [Your Name]. All rights reserved.<br />
        Privacy Policy | Terms of Service
      </p>
    </div>
  </footer>
);

export default function Page() {
  return (
    <main className="min-h-screen bg-gray-50 font-sans">
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <CategoriesSection />
      <TestimonialsSection />
      <BonusSection />
      <FAQSection />
      <FinalCTASection />
      <Footer />
    </main>
  );
}