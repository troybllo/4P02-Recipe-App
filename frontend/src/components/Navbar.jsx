// src/components/Navbar.jsx
import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "./AuthContext"; // Import useAuth hook
import CreatePost from "./CreatePost";
import feastlyLogo from "../images/feastly_black.png";
import discoveryIcon from "../images/discovery.png";
import profileIcon from "../images/profileIcon.png";
import homePic from "../images/homePic.png"
import createPostIcon from "../images/createPostIcon.png";
import Popup from "./Popup";
import SearchBar from "./SearchBar";

export default function Navbar() {
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("success");
  const [showSearch, setShowSearch] = useState(false);

  const triggerPopup = (message, type) => {
    setPopupMessage(message);
    setPopupType(type);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2500);
  };

  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profilePicUrl, setProfilePicUrl] = useState(profileIcon);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  // Use auth context for login state
  const { currentUser, logout } = useAuth();
  const isLoggedIn = !!currentUser;

  useEffect(() => {
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

  const handleSignOut = () => {
    logout();
    navigate("/landing");
    triggerPopup(`Logged Out Successfully!`, `success`);
  };

  const handleCreatePost = (postData) => {
    console.log("New post data:", postData);
    setIsCreatePostOpen(false);
  };

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.2 },
    },
    tap: { scale: 0.95 },
  };

  // New variant for Sign In button to add extra motion
  const signInVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
    hover: { scale: 1.1, rotate: 1 },
    tap: { scale: 0.95, rotate: -1 },
  };

  const location = useLocation();

  const isActive = (path) => {
    // For dynamic routes such as profile, check if pathname starts with the path.
    return location.pathname === path || location.pathname.startsWith(path);
  };

  return (
    <>
      <Popup show={showPopup} message={popupMessage} type={popupType} className="z-[9999]"/>
      <motion.div
        className={`fixed top-0 left-0 right-0 h-16 z-[99999] transition-all duration-300 ${
          isScrolled ? "bg-white/90 backdrop-blur-md shadow-md" : "bg-white"
        }`}
        initial="hidden"
        animate="visible"
        variants={navVariants}
      >
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between relative">
          <motion.div className="flex items-center" whileHover={{ scale: 1.02 }}>
            <Link to="/landing" className="flex items-center">
              <motion.img
                src={feastlyLogo}
                alt="Feastly"
                className="w-10 h-10 mr-2 object-contain"
                whileHover={{ rotate: 5 }}
                transition={{ duration: 0.2 }}
              />
              <span className="text-2xl font-bold bg-gradient-to-r from-[#1d380e] to-[#5c9054] bg-clip-text text-transparent">
                Feastly
              </span>
            </Link>
          </motion.div>

          <div className="hidden lg:flex items-center justify-center space-x-1 flex-grow">
            {isLoggedIn ? (
              <>
                <motion.div whileHover="hover" whileTap="tap" variants={buttonVariants}>
                  <Link
                    to="/home"
                    className={`px-4 py-2 flex items-center text-gray-700 rounded-md transition-all duration-300 ${
                      isActive("/home") ? "bg-gray-200" : "hover:bg-gray-100"
                    }`}
                  >
                    <img src={homePic} alt="Home" className="w-5 h-5 mr-2 object-contain" />
                    <span>Home</span>
                  </Link>
                </motion.div>
                <motion.div whileHover="hover" whileTap="tap" variants={buttonVariants}>
                  <Link
                    to="/discovery"
                    className={`px-4 py-2 flex items-center text-gray-700 rounded-md transition-all duration-300 ${
                      isActive("/discovery") ? "bg-gray-200" : "hover:bg-gray-100"
                    }`}
                  >
                    <img src={discoveryIcon} alt="Discovery" className="w-5 h-5 mr-2 object-contain" />
                    <span>Discovery</span>
                  </Link>
                </motion.div>
                <motion.div whileHover="hover" whileTap="tap" variants={buttonVariants}>
                  <Link
                    to={`/profile/${currentUser?.user.username}`}
                    className={`px-4 py-2 flex items-center text-gray-700 rounded-md transition-all duration-300 ${
                      isActive("/profile") ? "bg-gray-200" : "hover:bg-gray-100"
                    }`}
                  >
                    <img src={profileIcon} alt="Profile" className="w-5 h-5 mr-2 object-contain" />
                    <span>Profile</span>
                  </Link>
                </motion.div>
              </>
            ) : (
              <>
                <motion.div whileHover="hover" whileTap="tap" variants={buttonVariants}>
                  <Link
                    to="/discovery"
                    className={`px-4 py-2 flex items-center text-gray-700 rounded-md transition-all duration-300 ${
                      isActive("/discovery") ? "bg-gray-200" : "hover:bg-gray-100"
                    }`}
                  >
                    <img src={discoveryIcon} alt="Discovery" className="w-5 h-5 mr-2 object-contain" />
                    <span>Discovery</span>
                  </Link>
                </motion.div>
              </>
            )}
          </div>

          <div className="relative">
            {
              isLoggedIn?
              <motion.button
              onClick={() => setShowSearch((prev) => !prev)}
              className="text-gray-600 hover:text-gray-800 p-4"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {showSearch ? <X size={24} /> : <span role="img" aria-label="Search">🔍</span>}
            </motion.button>
            :
            <></>

            }
            
            {showSearch && <SearchBar onClose={() => setShowSearch(false)} />}
          </div>


          <div className="hidden lg:flex items-center">
            {!isLoggedIn && (
              <motion.div whileHover="hover" whileTap="tap" variants={buttonVariants}>
                <Link
                  to="/signin"
                  className={`px-4 py-2 flex items-center text-gray-700 rounded-md transition-all duration-300 ${
                    isActive("/signin") ? "bg-gray-200" : "hover:bg-gray-100"
                  }`}
                >
                  <span>Sign In For Full Access</span>
                </Link>
              </motion.div>
            )}
          </div>

          {isLoggedIn && (
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
              <div className="flex items-center">
                <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }} className="relative">
                  <Link to={`/profile/${currentUser?.user.username}`}>
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#1d9c3f] hover:border-[#187832] transition-all duration-300">
                      <img src={profilePicUrl} alt="Profile" className="w-full h-full object-contain" />
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
            </div>
          )}

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
              {isLoggedIn ? (
                <>
                  <motion.div whileHover={{ scale: 1.02, x: 5 }} transition={{ duration: 0.2 }}>
                    <Link
                      to="/home"
                      className={`block px-4 py-2 rounded-md text-gray-900 transition-all duration-300 ${
                        isActive("/home") ? "bg-gray-200" : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      Home
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02, x: 5 }} transition={{ duration: 0.2 }}>
                    <Link
                      to="/discovery"
                      className={`block px-4 py-2 rounded-md text-gray-900 transition-all duration-300 ${
                        isActive("/discovery") ? "bg-gray-200" : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      Discovery
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02, x: 5 }} transition={{ duration: 0.2 }}>
                    <Link
                      to={`/profile/${currentUser?.user.username}`}
                      className={`block px-4 py-2 rounded-md text-gray-900 transition-all duration-300 ${
                        isActive("/profile") ? "bg-gray-200" : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      Profile
                    </Link>
                  </motion.div>
                  <motion.button
                    onClick={() => setIsCreatePostOpen(true)}
                    className="block w-full px-4 py-2.5 rounded-md text-white font-medium transition-all duration-300 shadow-sm bg-[#1d9c3f] hover:bg-[#187832]"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Create Post
                  </motion.button>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center">
                      <img
                        src={profilePicUrl}
                        alt="Profile"
                        className="w-10 h-10 rounded-full border-2 border-[#1d9c3f] object-contain"
                      />
                      <span className="ml-2 font-medium">My Profile</span>
                    </div>
                    <motion.button
                      onClick={handleSignOut}
                      className="px-4 py-2 rounded-md text-gray-700 font-medium bg-gray-100 hover:bg-gray-200 transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      variants={buttonVariants}
                    >
                      Sign Out
                    </motion.button>
                  </div>
                </>
              ) : (
                <>
                  <motion.div whileHover={{ scale: 1.02, x: 5 }} transition={{ duration: 0.2 }}>
                    <Link
                      to="/discovery"
                      className={`block px-4 py-2 rounded-md text-gray-900 transition-all duration-300 ${
                        isActive("/discovery") ? "bg-gray-200" : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      Discovery
                    </Link>
                  </motion.div>
                  <motion.div whileHover="hover" whileTap="tap" variants={buttonVariants}>
                    <Link
                      to="/signin"
                      className={`block px-4 py-2 rounded-md text-gray-900 transition-all duration-300 ${
                        isActive("/signin") ? "bg-gray-200" : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      Sign In For Full Access
                    </Link>
                  </motion.div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isLoggedIn && (
        <CreatePost
          isOpen={isCreatePostOpen}
          onClose={() => setIsCreatePostOpen(false)}
          onSubmit={handleCreatePost}
        />
      )}
    </>
  );
}
