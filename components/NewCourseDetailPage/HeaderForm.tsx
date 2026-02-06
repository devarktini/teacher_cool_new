"use client";

export default function HeaderForm() {
  return (
    <section className="w-full bg-[#0f1f4a] text-white py-12 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        
        {/* LEFT CONTENT */}
        <div>
          <p className="text-sm mb-2">India’s #1 Award Winning Institute</p>

          <h1 className="text-4xl font-bold leading-tight">
            <span className="text-yellow-400">ONLINE DIGITAL MARKETING</span>
            <br />
            COURSE
          </h1>

          <p className="mt-4 text-sm text-gray-200 max-w-xl">
            Enhance Your Digital Skills, Join PIDM’s{" "}
            <span className="font-semibold">
              Advanced Online Digital Marketing Course
            </span>{" "}
            With Placements At Affordable Fees.
          </p>

          {/* FEATURES */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6 text-sm">
            {[
              "2 Months Duration",
              "Installment Options",
              "15+ Certification",
              "Placement Support",
              "100% Practical",
              "Startup Guidance",
              "50+ Modules",
              "Freelancing",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-yellow-400">✔</span>
                <span>{item}</span>
              </div>
            ))}
          </div>

          {/* RATING */}
          <div className="flex items-center gap-2 mt-5">
            <span className="text-sm">Rating 4.9/5 By 21,562 Students</span>
            <span className="text-yellow-400">★★★★★</span>
          </div>

          {/* BUTTON */}
          <button className="mt-6 bg-yellow-400 text-black font-semibold px-6 py-3 rounded-md hover:bg-yellow-500 transition">
            ⬇ Download Syllabus
          </button>

          {/* CERTIFICATION */}
          <p className="mt-6 text-sm">
            Certification In Alignment With
          </p>
          <div className="flex gap-4 mt-2 text-lg font-semibold">
            <span className="text-blue-400">Google</span>
            <span className="text-white">HubSpot</span>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="bg-white text-black rounded-lg shadow-lg p-6 max-w-md mx-auto w-full">
          <h3 className="text-xl font-bold text-center">
            REGISTER FOR DEMO
          </h3>
          <p className="text-xs text-center text-gray-500 mb-4">
            Demo Lecture For Online & Classroom | Hurry Up
          </p>

          <form className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />

            <input
              type="email"
              placeholder="Email"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />

            <input
              type="tel"
              placeholder="Phone"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />

            <button
              type="submit"
              className="w-full bg-yellow-400 text-black font-semibold py-2 rounded hover:bg-yellow-500 transition"
            >
              Send
            </button>
          </form>
        </div>
      </div>

      {/* STATS BAR */}
      <div className="bg-yellow-400 text-black mt-12">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 py-6 text-center font-semibold">
          <div>
            <p className="text-xl">58,813+</p>
            <p className="text-xs">Students Trained</p>
          </div>
          <div>
            <p className="text-xl">600+</p>
            <p className="text-xs">Hiring Companies</p>
          </div>
          <div>
            <p className="text-xl">51,682+</p>
            <p className="text-xs">Placements</p>
          </div>
          <div>
            <p className="text-xl">11+</p>
            <p className="text-xs">Years Of Experience</p>
          </div>
          <div>
            <p className="text-xl">2470+</p>
            <p className="text-xs">Started Freelancing</p>
          </div>
          <div>
            <p className="text-xl">635+</p>
            <p className="text-xs">Started Startup</p>
          </div>
        </div>
      </div>
    </section>
  );
}
