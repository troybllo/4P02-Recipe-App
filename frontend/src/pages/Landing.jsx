import React from "react";
import landingVideo from "../assets/landingpagevideo.mp4";
import { motion, AnimatePresence } from "framer-motion";
import exploreFill from "../assets/explore-fill.png";
import discoverFill from "../assets/discover-fill.png";
import shareFill from "../assets/share-fill.png";
import feastFill from "../assets/feast-fill.png";
import bgFill from "../assets/bgFill.png";
import { useAuth } from "../components/AuthContext";
import CreatePost from "../components/CreatePost";
import { createContext, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";


export default function Landing() {

  const { currentUser, logout } = useAuth();
  const isLoggedIn = !!currentUser;
  const currentUserName = "";
  const heroText = `Welcome back ${currentUserName}`;
  const descriptionText = "Feastly isn’t just about food — it’s about community. Whether you're a passionate home cook, a student learning to meal prep, or a pro chef sharing your creations, Feastly brings everyone to the table.";



  return (
    <div className="min-h-screen flex flex-col w-full mt-16]">
      <div className="flex flex-col justify-between">
        <section className="relative h-[1000px] overflow-hidden">
          <video
            className="absolute top-0 left-0 w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src={landingVideo} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="relative z-10 flex flex-col items-center justify-center h-full">
            <motion.h1
              className="text-white text-5xl md:text-7xl pb-4 font-extrabold text-center mb-6 drop-shadow-[0_5px_8px_rgba(0,0,0,0.4)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {isLoggedIn
                ? `Welcome to Feastly`
                : "Welcome to Feastly!"}
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl text-center max-w-3xl mx-auto text-white mb-8 leading-relaxed tracking-wide drop-shadow-[0_3px_6px_rgba(0,0,0,0.3)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {isLoggedIn
                ? `${descriptionText}`
                : "Join millions of food lovers ranging from home cooks to professional chefs. Discover, share, and create recipes that bring people together!"}
            </motion.p>
            <div className="flex justify-center space-x-4">
              <motion.div
                className="flex justify-center space-x-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <motion.button
                  className="px-6 py-3 bg-[#1d9c3f] text-white rounded-full font-medium hover:bg-[#187832] transition-colors shadow-lg drop-shadow-2xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => (window.location.href = "/discovery")}
                >
                  Explore Recipes
                </motion.button>
                {isLoggedIn ? (
                  <>
                    <motion.button
                      className="px-6 py-3 bg-[#1d9c3f] text-white rounded-full font-medium hover:bg-[#187832] transition-colors shadow-lg drop-shadow-2xl"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        if (isLoggedIn) {
                          window.location.href = "/profile"
                        } else {
                          document
                            .getElementById("recipe-section")
                            .scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                    >
                      Go to Profile
                    </motion.button>
                  </>
                ) : (
                  <motion.button
                    className="px-6 py-3 bg-[#1d9c3f] text-white rounded-full font-medium hover:bg-[#187832] transition-colors shadow-lg drop-shadow-2xl"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      window.location.href = "/signin";
                    }}
                  >
                    Sign In To Access Full Website
                  </motion.button>
                )}
              </motion.div>
            </div>
          </div>
        </section>
      </div>
      


        {!isLoggedIn && (
          <motion.div
          className="py-16 bg-gradient-to-r from-[#187832] to-[#336633] text-white"
        >
          <div className="max-w-5xl mx-auto px-6 text-center">
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Join our culinary community
            </motion.h2>
            <motion.p
              className="text-lg text-gray-200 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Share your recipes, discover new ones, connect with fellow food
              enthusiasts
            </motion.p>
            <motion.button
              className="px-8 py-3 bg-white text-[#187832] rounded-full font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)",
              }}
              onClick={() => (window.location.href = "/signup")}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Create Account
            </motion.button>
          </div>
        </motion.div>

        )}
    </div>
  );
}
