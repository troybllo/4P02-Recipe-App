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
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";


export default function Landing() {

  const { currentUser, logout } = useAuth();
  const isLoggedIn = !!currentUser;
  const currentUserName = "";
  const heroText = `Welcome back ${currentUserName}`;
  const descriptionText = "Glad to see you again! Hungry for some food? Looking for some inspiration? You're in the right place (name). Feel free to explore around as much as you'd like!";

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
              className="text-5xl md:text-7xl pb-4 font-bold text-center mb-6 bg-gradient-to-r from-[#8bc34a] via-[#e6f4e0] to-[#a5d6a7] bg-clip-text text-transparent drop-shadow-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {isLoggedIn
                ? `${heroText}`
                : "Welcome to Feastly!"}
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl text-center max-w-3xl mx-auto text-gray-200 mb-8 drop-shadow-2xl"
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
            className="text-3xl font-bold mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            Introducing Our Features
          </motion.h2>
          <motion.p
            className="text-lg text-gray-700 px-10 mx-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            There are many features that make Feastly a hub for all people who love food. It doesn't matter if you are a home cook, or a student, or a professional cook, or just someone looking for some inspiration, Feastly caters to everyone.
          </motion.p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 mx-40 my-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: 0 }}
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
              style={{
                color: "#fff",
                textShadow: "2px 2px 4px rgba(0,0,0,0.7)"
              }}
            >
              Discover
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: 0 }}
            whileHover={{ scale: 1.02 }}
            className="relative w-full aspect-square text-black text-center bg-gradient-to-br from-white to-gray-100 text-4xl font-extrabold shadow-md hover:shadow-2xl flex items-center justify-center rounded-lg border-2 border-transparent hover:border-[#1d9c3f] transition-shadow duration-300 transform"
          >
            <img
              src={discoverFill}
              alt="Discover Icon"
              className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
            />
            <div
              className="relative z-10 font-black"
              style={{
                color: "#fff",
                textShadow: "2px 2px 4px rgba(0,0,0,0.7)"
              }}
            >
              Filter
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: 0 }}
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
              style={{
                color: "#fff",
                textShadow: "2px 2px 4px rgba(0,0,0,0.7)"
              }}
            >
              Share
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: 0 }}
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
              style={{
                color: "#fff",
                textShadow: "2px 2px 4px rgba(0,0,0,0.7)"
              }}
            >
              Feast
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
