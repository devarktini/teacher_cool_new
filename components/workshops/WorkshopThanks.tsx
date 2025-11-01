import React from "react";
import { motion } from "framer-motion";
import { FaInstagram, FaFacebook, FaLinkedin } from "react-icons/fa";

function WorkshopThanks({ onclose }: { onclose: () => void }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-900/80 to-purple-900/80 z-50">
      {/* Animated card */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center relative"
      >
        {/* Close Button */}
        <button
          onClick={() => onclose()}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl"
        >
          ✖
        </button>

        {/* Title */}
        <h2 className="text-3xl font-extrabold text-indigo-700 mb-3">
          🎉 Congratulations!
        </h2>
        <p className="text-lg text-gray-700 font-medium mb-6">
          Your Certificate is Ready! <br />
          We loved having you in the workshop 🚀
        </p>

        {/* Support Line */}
        <div className="bg-indigo-50 p-4 rounded-xl mb-8">
          <p className="text-sm text-indigo-900 leading-relaxed">
            💙 Stay updated with <span className="font-semibold">free workshops</span>,  
            learning content, and <span className="font-semibold">career tips</span>.
          </p>
        </div>

        {/* Social Buttons */}
        <div className="flex justify-center gap-6 mb-8">
          <a
            href="https://www.instagram.com/teachercool_official/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-full bg-gradient-to-tr from-pink-500 to-orange-400 text-white text-2xl shadow-lg hover:scale-110 transition"
          >
            <FaInstagram />
          </a>
          <a
            // href="https://www.facebook.com/people/Teacher-Cool/61556772354177/"
            href="https://www.facebook.com/share/1722px7Njj/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-full bg-blue-600 text-white text-2xl shadow-lg hover:scale-110 transition"
          >
            <FaFacebook />
          </a>
          <a
            href="https://www.linkedin.com/company/teachercoolofficial/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-full bg-sky-600 text-white text-2xl shadow-lg hover:scale-110 transition"
          >
            <FaLinkedin />
          </a>
        </div>

        {/* Tip */}
        <p className="text-sm text-gray-500">
          📢 Tip: Don’t miss out on{" "}
          <span className="font-semibold text-indigo-600">
            internship updates & free resources
          </span>
          .
        </p>
      </motion.div>
    </div>
  );
}

export default WorkshopThanks;
