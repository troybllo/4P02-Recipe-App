// src/components/Navbar.jsx
import React, { useState, useEffect } from "react";
import { Menu, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import SignIn from "./SignIn";
import SignUp from "./Signup";
import CreatePost from "./CreatePost";
import feastlyLogo from "../images/feastly_black.png";
import searchIcon from "../images/search.png";
import homeIcon from "../images/homePic.png";
import discoveryIcon from "../images/discovery.png";
import aboutIcon from "../images/about.png";
import savedIcon from "../images/savedIcon.png";
import profileIcon from "../images/profileIcon.png";
import createPostIcon from "../images/createPostIcon.png";

export default function Navbar() {
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profilePicUrl, setProfilePicUrl] = useState(profileIcon);
  const [isScrolled, setIsScrolled] = useState(false);

  // Check if user is logged in when component mounts
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }

    // Add scroll listener
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignInSuccess = (token) => {
    console.log("Signed in with token:", token);
    setIsSignInOpen(false);
    setIsLoggedIn(true);
  };

  const handleSignUpSuccess = (data) => {
    console.log("Signed up successfully:", data);
    setIsSignUpOpen(false);
    setIsSignInOpen(true);
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  const handleCreatePost = (postData) => {
    console.log("New post data:", postData);
    setIsCreatePostOpen(false);
  };

  const switchToSignUp = () => {
    setIsSignInOpen(false);
    setIsSignUpOpen(true);
  };

  const switchToSignIn = () => {
    setIsSignUpOpen(false);
    setIsSignInOpen(true);
  };

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.2 },
    },
    tap: { scale: 0.95 },
  };

  return (
    <>
      <motion.div
        className={`fixed top-0 left-0 right-0 h-16 z-50 transition-all duration-300 ${
          isScrolled ? "bg-white/90 backdrop-blur-md shadow-md" : "bg-white"
        }`}
        initial="hidden"
        animate="visible"
        variants={navVariants}
      >
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <motion.div
            className="flex items-center"
            whileHover={{ scale: 1.02 }}
          >
            <Link to="/about" className="flex items-center">
              <motion.img
                src={feastlyLogo}
                alt="Feastly"
                className="w-10 h-10 mr-2"
                whileHover={{ rotate: 5 }}
                transition={{ duration: 0.2 }}
              />
              <span className="text-2xl font-bold bg-gradient-to-r from-[#1d380e] to-[#5c9054] bg-clip-text text-transparent">
                Feastly
              </span>
            </Link>
          </motion.div>
          <div className="hidden lg:flex items-center space-x-1">
            <motion.div
              whileHover="hover"
              whileTap="tap"
              variants={buttonVariants}
            >
              <Link
                to="/"
                className="px-4 py-2 flex items-center text-gray-700 rounded-md hover:bg-gray-100 transition-all duration-300"
              >
                <img src={homeIcon} alt="Home" className="w-5 h-5 mr-2" />
                <span>Home</span>
              </Link>
            </motion.div>

            <motion.div
              whileHover="hover"
              whileTap="tap"
              variants={buttonVariants}
            >
              <Link
                to="/discovery"
                className="px-4 py-2 flex items-center text-gray-700 rounded-md hover:bg-gray-100 transition-all duration-300"
              >
                <img
                  src={discoveryIcon}
                  alt="Discovery"
                  className="w-5 h-5 mr-2"
                />
                <span>Discovery</span>
              </Link>
            </motion.div>

            <motion.div
              whileHover="hover"
              whileTap="tap"
              variants={buttonVariants}
            >
              <Link
                to="/profile"
                className="px-4 py-2 flex items-center text-gray-700 rounded-md hover:bg-gray-100 transition-all duration-300"
              >
                <img src={aboutIcon} alt="Profile" className="w-5 h-5 mr-2" />
                <span>Profile</span>
              </Link>
            </motion.div>
          </div>
          <div className="hidden lg:flex items-center space-x-3">
            <motion.button
              onClick={() => setIsCreatePostOpen(true)}
              className="px-4 py-2 flex bg-[#1d9c3f] justify-center items-center rounded-md text-white font-medium hover:bg-[#187832] transition-all duration-300 shadow-sm"
              whileHover="hover"
              whileTap="tap"
              variants={buttonVariants}
            >
              <img
                src={createPostIcon}
                alt="Create"
                className="w-5 h-5 mr-2 object-contain brightness-0 invert"
              />
              <span>Create Post</span>
            </motion.button>

            {isLoggedIn ? (
              <div className="flex items-center">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                  className="relative"
                >
                  <Link to="/profile">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#1d9c3f] hover:border-[#187832] transition-all duration-300">
                      <img
                        src={profilePicUrl}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                  </Link>
                </motion.div>
                <motion.button
                  onClick={handleSignOut}
                  className="ml-2 px-3 py-1.5 bg-gray-100 rounded-md text-gray-700 text-sm font-medium hover:bg-gray-200 transition-all duration-300"
                  whileHover="hover"
                  whileTap="tap"
                  variants={buttonVariants}
                >
                  Sign Out
                </motion.button>
              </div>
            ) : (
              <motion.button
                onClick={() => setIsSignInOpen(true)}
                className="px-4 py-2 flex bg-[#f9dcb8] border border-[#ba5719] rounded-md text-[#ba5719] font-medium hover:bg-[#ba5719] hover:text-white transition-all duration-300"
                whileHover="hover"
                whileTap="tap"
                variants={buttonVariants}
              >
                <img
                  src={profileIcon}
                  alt="Profile"
                  className="w-5 h-5 mr-2 object-contain"
                />
                <span>Sign In</span>
              </motion.button>
            )}
          </div>

          <motion.button
            className="lg:hidden p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-all duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
      </motion.div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="lg:hidden mt-16 fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-lg z-40"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-4 space-y-2">
              <motion.div
                whileHover={{ scale: 1.02, x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  to="/"
                  className="block px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-900 transition-all duration-300"
                >
                  Home
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02, x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  to="/discovery"
                  className="block px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-900 transition-all duration-300"
                >
                  Discovery
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02, x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  to="/about"
                  className="block px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-900 transition-all duration-300"
                >
                  About
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02, x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  to="/profile"
                  className="block px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-900 transition-all duration-300"
                >
                  Profile
                </Link>
              </motion.div>

              <motion.button
                onClick={() => setIsCreatePostOpen(true)}
                className="block w-full px-4 py-2.5 bg-[#1d9c3f] rounded-md text-white font-medium hover:bg-[#187832] transition-all duration-300 shadow-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Create Post
              </motion.button>

              {isLoggedIn ? (
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center">
                    <img
                      src={profilePicUrl}
                      alt="Profile"
                      className="w-10 h-10 rounded-full border-2 border-[#1d9c3f] object-cover"
                    />
                    <span className="ml-2 font-medium">My Profile</span>
                  </div>
                  <motion.button
                    onClick={handleSignOut}
                    className="px-4 py-2 bg-gray-100 rounded-md text-gray-700 font-medium hover:bg-gray-200 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Sign Out
                  </motion.button>
                </div>
              ) : (
                <motion.button
                  onClick={() => setIsSignInOpen(true)}
                  className="block w-full px-4 py-2.5 bg-[#f9dcb8] border border-[#ba5719] rounded-md text-[#ba5719] font-medium hover:bg-[#ba5719] hover:text-white transition-all duration-300 mt-4"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Sign In
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals (SignIn, SignUp, CreatePost) */}
      <SignIn
        isOpen={isSignInOpen}
        onClose={() => setIsSignInOpen(false)}
        onSignInSuccess={handleSignInSuccess}
        onSwitchToSignUp={switchToSignUp}
      />
      <SignUp
        isOpen={isSignUpOpen}
        onClose={() => setIsSignUpOpen(false)}
        onSignUpSuccess={handleSignUpSuccess}
        onSwitchToSignIn={switchToSignIn}
      />
      <CreatePost
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
        onSubmit={handleCreatePost}
      />
    </>
  );
}
