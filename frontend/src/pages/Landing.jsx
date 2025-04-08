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
    <div className="min-h-screen flex flex-col w-full mt-16">
      <div className="flex flex-col justify-between">
        <section className="relative h-[500px] overflow-hidden">
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
              className="text-5xl md:text-7xl pb-4 font-extrabold text-center mb-6 bg-gradient-to-r from-[#ff8c42] via-[#ffe29a] to-[#1d9c3f] bg-clip-text text-transparent drop-shadow-[0_5px_8px_rgba(0,0,0,0.4)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {isLoggedIn
                ? `Hello ${currentUserName}`
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
                    className="px-6 py-3 bg-[#f9dcb8] border border-[#ba5719] rounded-full text-[#ba5719] text-white rounded-full font-medium hover:bg-[#ba5719] transition-colors shadow-lg drop-shadow-2xl"
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
      <motion.div
        className="bg-[#f9fbf8] bg-cover bg-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="py-10 text-center"
        >
          <motion.h2
            className="text-4xl md:text-5xl font-extrabold text-center text-[#1d9c3f] mb-6 tracking-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            Introducing Our Features
          </motion.h2>
          <motion.p
            className="text-lg md:text-xl text-gray-600 px-6 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            Feastly offers tools for every type of food lover — whether you’re a beginner experimenting with flavors, a student meal-prepping, or a seasoned chef sharing gourmet creations. Our platform is built to inspire, connect, and empower your culinary journey.
          </motion.p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 mx-40 my-10">

  {/* Discover */}
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: 0.1 }}
    whileHover={{ scale: 1.02 }}
    className="relative w-full aspect-square text-black text-center bg-gradient-to-br from-white to-gray-100 text-4xl font-extrabold shadow-md hover:shadow-2xl flex items-center justify-center rounded-lg border-2 border-transparent hover:border-[#1d9c3f] transition-shadow duration-300 transform"
  >
    <img
      src={exploreFill}
      alt="Explore Icon"
      className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
    />
    <div
      className="relative z-10 font-black"
      style={{ color: "#fff", textShadow: "2px 2px 4px rgba(0,0,0,0.7)" }}
    >
      Discover
    </div>
  </motion.div>

  {/* Filter */}
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: 0.2 }}
    whileHover={{ scale: 1.02 }}
    className="relative w-full aspect-square text-black text-center bg-gradient-to-br from-white to-gray-100 text-4xl font-extrabold shadow-md hover:shadow-2xl flex items-center justify-center rounded-lg border-2 border-transparent hover:border-[#1d9c3f] transition-shadow duration-300 transform"
  >
    <img
      src={discoverFill}
      alt="Filter Icon"
      className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
    />
    <div
      className="relative z-10 font-black"
      style={{ color: "#fff", textShadow: "2px 2px 4px rgba(0,0,0,0.7)" }}
    >
      Filter
    </div>
  </motion.div>

  {/* Share */}
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: 0.3 }}
    whileHover={{ scale: 1.02 }}
    className="relative w-full aspect-square text-black text-center bg-gradient-to-br from-white to-gray-100 text-4xl font-extrabold shadow-md hover:shadow-2xl flex items-center justify-center rounded-lg border-2 border-transparent hover:border-[#1d9c3f] transition-shadow duration-300 transform"
  >
    <img
      src={shareFill}
      alt="Share Icon"
      className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
    />
    <div
      className="relative z-10 font-black"
      style={{ color: "#fff", textShadow: "2px 2px 4px rgba(0,0,0,0.7)" }}
    >
      Share
    </div>
  </motion.div>

  {/* Feast */}
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: 0.4 }}
    whileHover={{ scale: 1.02 }}
    className="relative w-full aspect-square text-center bg-gradient-to-br from-white to-gray-100 text-4xl font-extrabold shadow-md hover:shadow-2xl flex items-center justify-center rounded-lg border-2 border-transparent hover:border-[#1d9c3f] transition-shadow duration-300 transform"
  >
    <img
      src={feastFill}
      alt="Feast Icon"
      className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
    />
    <div
      className="relative z-10 font-black"
      style={{ color: "#fff", textShadow: "2px 2px 4px rgba(0,0,0,0.7)" }}
    >
      Feast
    </div>
  </motion.div>

</div>
        
        <motion.div
  className="bg-white py-14"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5, delay: 0.3 }}
>
  <div className="max-w-4xl mx-auto px-6 text-center">
    <h2 className="text-3xl font-bold text-[#1d9c3f] mb-10">
      Why Feastly Works
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Card 1 */}
      <div className="group p-6 bg-[#f9f9f9] rounded-lg shadow-lg hover:shadow-xl transition duration-300">
        <h4 className="text-lg font-semibold mb-2"> Personalized Suggestions</h4>
        <p className="text-sm italic text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Discover meals tailored to your cravings, skill level, and ingredients on hand.
        </p>
      </div>

      {/* Card 2 */}
      <div className="group p-6 bg-[#f9f9f9] rounded-lg shadow-lg hover:shadow-xl transition duration-300">
        <h4 className="text-lg font-semibold mb-2"> Real Community</h4>
        <p className="text-sm italic text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          This isn’t just a recipe site — it’s a space to share, support, and grow together as food lovers.
        </p>
      </div>
    </div>
  </div>
</motion.div>


        {!isLoggedIn && (
          <motion.div
          className="py-16 bg-gradient-to-r from-[#1d380e] to-[#336633] text-white"
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
              className="px-8 py-3 bg-white text-[#1d380e] rounded-full font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)",
              }}
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
      </motion.div>
    </div>
  );
}
