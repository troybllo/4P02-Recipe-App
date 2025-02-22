// src/components/Navbar.jsx
import React, { useState } from "react";
// Make sure to import X and Menu here:
import { Menu, X, ChevronLeft, ChevronRight } from "lucide-react"; 
import { Link } from "react-router-dom";
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

  // If you want a hamburger on mobile only, keep track of that state:
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
      {/* Fixed top bar */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-[#eaf5e4] border-b border-[#869a7b] shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          {/* Left side: Logo */}
          <div className="flex items-center">
            <Link to="/about" className="flex">
              <img src={feastlyLogo} alt="Feastly" className="w-10 h-10 mr-2" />
              <span className="text-2xl font-bold">Feastly</span>
            </Link>
          </div>

          {/* Middle: Search box (hide on small screens, for example) */}
          <div className="hidden lg:flex items-center px-2 py-1 ml-4">
            <input
              type="text"
              placeholder="Search..."
              className="max-w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
                <div className="hidden lg:flex items-center space-x-4 ml-auto">
                <Link
                  to="/"
                  className="px-3 py-2 flex items-center bg-[#fbfff9] border border-[#869a7b] rounded-full text-gray-900 hover:border-[#1d380e] hover:bg-[#e6f4e0] "
                >
                  <img src={homeIcon} alt="Home" className="w-auto h-auto mr-2" />
                  <span>Home</span>
                </Link>
                <Link
                  to="/discovery"
                  className="px-3 py-2 flex items-center bg-[#fbfff9] border border-[#869a7b] rounded-full text-gray-900 hover:border-[#1d380e] hover:bg-[#e6f4e0] "
                >
                  <img src={discoveryIcon} alt="Discovery" className="w-auto h-auto mr-2" />
                  <span>Discovery</span>
                </Link>
                <Link
                  to="/profile"
                  className="px-3 py-2 flex items-center bg-[#fbfff9] border border-[#869a7b] rounded-full text-gray-900 hover:border-[#1d380e] hover:bg-[#e6f4e0] "
                >
                  <img src={aboutIcon} alt="Profile" className="w-auto h-auto mr-2" />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={() => setIsCreatePostOpen(true)}
                  className="px-3 py-2 flex bg-[#d5f9c5] justify-center items-center border border-[#1d9c3f] rounded-full text-[#1d9c3f] font-bold hover:border-[#187832] hover:text-[#187832] hover:bg-[#81e89d]"
                >
                  <img src={createPostIcon} alt="Profile" className="w-6 h-6 mr-2 object-contain" />
                  <span>Create Post</span>
                </button>
                <button
                  onClick={() => setIsSignInOpen(true)}
                  className="px-3 py-2 flex bg-[#f9dcb8] border border-[#ba5719] rounded-full text-[#ba5719] font-bold hover:border-1 hover:border-[#8c4420] hover:text-[#8c4420] hover:bg-[#ffc784]"
                >
                  <img src={profileIcon} alt="Profile" className="w-auto h-auto mr-2 object-contain" />
                  <span>Sign In</span>
                </button>
                </div>

                {/* Hamburger button for mobile screens */}
          <button
            className="lg:hidden p-2 rounded-full bg-[#ccdec2] border border-[#575757]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu (visible only when isMenuOpen && small screen) */}
      {isMenuOpen && (
        <div className="lg:hidden mt-16 fixed top-0 left-0 right-0 bg-[#eaf5e4] border-b border-[#1d380e] shadow-lg z-40">
          <div className="p-4 space-y-2">
            <Link
              to="/"
              className="block px-3 py-2 bg-[#ccdec2] border border-[#575757] rounded-full text-gray-900"
            >
              Home
            </Link>
            <Link
              to="/discovery"
              className="block px-3 py-2 bg-[#ccdec2] border border-[#575757] rounded-full text-gray-900"
            >
              Discovery
            </Link>
            <Link
              to="/about"
              className="block px-3 py-2 bg-[#ccdec2] border border-[#575757] rounded-full text-gray-900"
            >
              About
            </Link>
            <Link
              to="/profile"
              className="block px-3 py-2 bg-[#ccdec2] border border-[#575757] rounded-full text-gray-900"
            >
              Profile
            </Link>
            <button
              onClick={() => setIsCreatePostOpen(true)}
              className="block w-full px-3 py-2 bg-[#bbf7a0] border border-[#1d9c3f] rounded-full text-[#1d9c3f] font-bold"
            >
              Create Post
            </button>
            <button
              onClick={() => setIsSignInOpen(true)}
              className="block w-full px-3 py-2 bg-[#ffcf94] border border-[#ba5719] rounded-full text-[#ba5719] font-bold"
            >
              Sign In
            </button>
          </div>
        </div>
      )}

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
