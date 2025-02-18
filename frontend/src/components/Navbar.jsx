// src/components/Navbar.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
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
        className={`fixed left-0 top-0 bottom-0 bg-[#eaf5e4] pt-5 border-r border-[#1d380e] shadow-lg transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:w-64 w-64`}
      >
        <nav className="flex flex-col h-full">
          <div className="flex items-center justify-center text-2xl font-bold mx-5 mb-8">
            <img src={feastlyLogo} alt="Feastly" className="w-12 h-12 mr-2" />
            <h3>Feastly</h3>
          </div>

          {/* Search */}
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

          {/* Navigation Links */}
          <Link
            to="/"
            className="mx-5 my-1 px-4 py-2 flex items-center justify-center border border-[#575757] bg-[#ccdec2] rounded-full text-lg text-gray-900 min-w-[80%] hover:border-2 hover:border-[#1d380e]"
          >
            <div className="flex items-center justify-center">
              <img src={homeIcon} alt="Home" className="w-5 h-5 mr-1" />
              <span>Home</span>
            </div>
          </Link>

          <Link
            to="/discovery"
            className="mx-5 my-1 px-4 py-2 flex items-center justify-center border border-[#575757] bg-[#ccdec2] rounded-full text-lg text-gray-900 min-w-[80%] hover:border-2 hover:border-[#1d380e]"
          >
            <div className="flex items-center justify-center">
              <img
                src={discoveryIcon}
                alt="Discovery"
                className="w-5 h-5 mr-1"
              />
              <span>Discovery</span>
            </div>
          </Link>

          <Link
            to="/about"
            className="mx-5 my-1 px-4 py-2 flex items-center justify-center border border-[#575757] bg-[#ccdec2] rounded-full text-lg text-gray-900 min-w-[80%] hover:border-2 hover:border-[#1d380e]"
          >
            <div className="flex items-center justify-center">
              <img src={aboutIcon} alt="About" className="w-5 h-5 mr-1" />
              <span>About</span>
            </div>
          </Link>

          <Link
            to="/profile"
            className="mx-5 my-1 px-4 py-2 flex items-center justify-center border border-[#575757] bg-[#ccdec2] rounded-full text-lg text-gray-900 min-w-[80%] hover:border-2 hover:border-[#1d380e]"
          >
            <div className="flex items-center justify-center">
              <img src={aboutIcon} alt="Profile" className="w-5 h-5 mr-1" />
              <span>Profile</span>
            </div>
          </Link>

          <button
            onClick={() => setIsCreatePostOpen(true)}
            className="mx-5 my-1 px-4 py-2 flex items-center justify-center border border-[#1d9c3f] bg-[#bbf7a0] rounded-full text-lg font-bold text-[#1d9c3f] min-w-[82%] hover:border-2 hover:border-[#1d9c3f]"
          >
            <span>Create Post</span>
          </button>

          <button
            onClick={() => setIsSignInOpen(true)}
            className="mx-5 my-1 px-4 py-2 flex items-center justify-center border border-[#ba5719] bg-[#ffcf94] rounded-full text-lg font-bold text-[#ba5719] min-w-[82%] hover:border-2 hover:border-[#ba5719]"
          >
            <span>Sign In</span>
          </button>

          {/* Spacer to push modals to the bottom */}
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
