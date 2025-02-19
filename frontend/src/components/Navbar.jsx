// src/components/Navbar.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ChevronLeft, ChevronRight } from "lucide-react";
import SignIn from "./SignIn";
import SignUp from "./Signup";
import CreatePost from "./CreatePost";
import feastlyLogo from "../images/feastly_black.png";
import searchIcon from "../images/search.png";
import homeIcon from "../images/homePic.png";
import discoveryIcon from "../images/discovery.png";
import aboutIcon from "../images/about.png";

export default function Navbar() {
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const handleSignInSuccess = (token) => {
    console.log("Signed in with token:", token);
    setIsSignInOpen(false);
  };

  const handleSignUpSuccess = (data) => {
    console.log("Signed up successfully:", data);
    setIsSignUpOpen(false);
    setIsSignInOpen(true);
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

  return (
    <>
      {/* Hamburger Button - visible only on small screens */}
      <button
        className="fixed top-4 left-4 z-50 p-2 rounded-full bg-[#ccdec2] border border-[#575757] hover:border-2 hover:border-[#1d380e] focus:outline-none md:hidden"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? (
          <X size={24} className="text-gray-900" />
        ) : (
          <Menu size={24} className="text-gray-900" />
        )}
      </button>

      {/* Sidebar */}
      <div
        className={`
          fixed left-0 top-0 bottom-0 bg-[#eaf5e4] pt-5 border-r border-[#1d380e] 
          shadow-lg transition-all duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 /* <-- Ensure sidebar is visible on md+ screens */
          ${isExpanded ? "w-64" : "w-20"}
        `}
      >
        <nav className="flex flex-col h-full relative">
          {/* Header with logo and expand/collapse toggle */}
          <div className="flex items-center justify-between mx-5 mb-8">
            <div className="flex items-center">
              <img src={feastlyLogo} alt="Feastly" className="w-12 h-12 mr-2" />
              {isExpanded && <h3 className="text-2xl font-bold">Feastly</h3>}
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 rounded-full hover:bg-gray-300 focus:outline-none"
            >
              {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>
          </div>

          {/* Search - only visible when expanded */}
          {isExpanded && (
            <div className="mx-5 my-1 px-4 py-2 flex items-center border border-[#575757] bg-white rounded-full">
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-transparent focus:outline-none text-lg"
              />
              <button className="flex justify-center">
                <img src={searchIcon} alt="Search" className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Navigation Links with tooltips on hover when collapsed */}
          <Link
            to="/"
            className="group relative mx-5 my-1 px-4 py-2 flex items-center justify-center border border-[#575757] bg-[#ccdec2] rounded-full text-lg text-gray-900 min-w-[80%] hover:border-2 hover:border-[#1d380e]"
          >
            <div className="flex items-center justify-center">
              <img src={homeIcon} alt="Home" className="w-5 h-5" />
              {isExpanded && <span className="ml-1">Home</span>}
            </div>
            {!isExpanded && (
              <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
                Home
              </span>
            )}
          </Link>

          <Link
            to="/discovery"
            className="group relative mx-5 my-1 px-4 py-2 flex items-center justify-center border border-[#575757] bg-[#ccdec2] rounded-full text-lg text-gray-900 min-w-[80%] hover:border-2 hover:border-[#1d380e]"
          >
            <div className="flex items-center justify-center">
              <img src={discoveryIcon} alt="Discovery" className="w-5 h-5" />
              {isExpanded && <span className="ml-1">Discovery</span>}
            </div>
            {!isExpanded && (
              <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
                Discovery
              </span>
            )}
          </Link>

          <Link
            to="/about"
            className="group relative mx-5 my-1 px-4 py-2 flex items-center justify-center border border-[#575757] bg-[#ccdec2] rounded-full text-lg text-gray-900 min-w-[80%] hover:border-2 hover:border-[#1d380e]"
          >
            <div className="flex items-center justify-center">
              <img src={aboutIcon} alt="About" className="w-5 h-5" />
              {isExpanded && <span className="ml-1">About</span>}
            </div>
            {!isExpanded && (
              <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
                About
              </span>
            )}
          </Link>

          <Link
            to="/profile"
            className="group relative mx-5 my-1 px-4 py-2 flex items-center justify-center border border-[#575757] bg-[#ccdec2] rounded-full text-lg text-gray-900 min-w-[80%] hover:border-2 hover:border-[#1d380e]"
          >
            <div className="flex items-center justify-center">
              <img src={aboutIcon} alt="Profile" className="w-5 h-5" />
              {isExpanded && <span className="ml-1">Profile</span>}
            </div>
            {!isExpanded && (
              <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
                Profile
              </span>
            )}
          </Link>

          <button
            onClick={() => setIsCreatePostOpen(true)}
            className="group relative mx-5 my-1 px-4 py-2 flex items-center justify-center border border-[#1d9c3f] bg-[#bbf7a0] rounded-full text-lg font-bold text-[#1d9c3f] min-w-[82%] hover:border-2 hover:border-[#1d9c3f]"
          >
            <div className="flex items-center justify-center">
              {isExpanded && <span>Create Post</span>}
              {!isExpanded && (
                <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  Create Post
                </span>
              )}
            </div>
          </button>

          <button
            onClick={() => setIsSignInOpen(true)}
            className="group relative mx-5 my-1 px-4 py-2 flex items-center justify-center border border-[#ba5719] bg-[#ffcf94] rounded-full text-lg font-bold text-[#ba5719] min-w-[82%] hover:border-2 hover:border-[#ba5719]"
          >
            <div className="flex items-center justify-center">
              {isExpanded && <span>Sign In</span>}
              {!isExpanded && (
                <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  Sign In
                </span>
              )}
            </div>
          </button>

          {/* Spacer for modals */}
          <div className="mt-auto mx-5 mb-4">
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
          </div>
        </nav>
      </div>
    </>
  );
}
