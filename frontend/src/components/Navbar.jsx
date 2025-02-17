import { useState } from "react";
import { Link } from "react-router-dom";
import SignIn from "./SignIn";
import SignUp from "./Signup";
import "../styles/Navbar.css";
import homePic from "../images/homePic.png";
import discPic from "../images/discovery.png";
import abtPic from "../images/about.png";
import searchIcon from "../images/search.png";
import feastlyPic from "../images/feastly_black.png";

export default function Navbar() {
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  const handleSignInSuccess = (token) => {
    console.log("Signed in with token:", token);
    setIsSignInOpen(false);
  };

  const handleSignUpSuccess = (data) => {
    console.log("Signed up successfully:", data);
    setIsSignUpOpen(false);
    setIsSignInOpen(true);
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
    <div className="flex flex-col relative left-0 top-0 h-screen w-[12%] bg-[#eaf5e4] pt-5 border-r border-[#1d380e]">
      <nav>
        <div className="flex items-center justify-center text-2xl font-bold mx-5 mb-8">
          <img
            src="/images/feastly_black.png"
            alt="Feastly Logo"
            className="w-auto h-auto"
          />
          <h3>Feastly</h3>
        </div>

        <div className="mx-5 my-1 px-4 py-2 flex items-center border border-[#575757] bg-white rounded-full">
          <input
            type="text"
            placeholder="Search..."
            className="w-[75%] bg-transparent focus:outline-none"
          />
          <button className="w-[15%] flex justify-center">
            <img src="/images/search.png" alt="Search" />
          </button>
        </div>

        <Link
          to="/"
          className="mx-5 my-1 px-4 py-2 flex items-center justify-center border border-[#575757] bg-[#ccdec2] rounded-full text-lg text-gray-900 hover:border-l-4 hover:border-r-4 hover:border-[#1d380e]"
        >
          <div className="flex items-center justify-center">
            <img
              src="/images/homePic.png"
              alt="Home"
              className="w-auto h-auto"
            />
            <h3>Home</h3>
          </div>
        </Link>

        <Link
          to="/discovery"
          className="mx-5 my-1 px-4 py-2 flex items-center justify-center border border-[#575757] bg-[#ccdec2] rounded-full text-lg text-gray-900 hover:border-l-4 hover:border-r-4 hover:border-[#1d380e]"
        >
          <div className="flex items-center justify-center">
            <img
              src="/images/discovery.png"
              alt="Discovery"
              className="w-auto h-auto"
            />
            <h3>Discovery</h3>
          </div>
        </Link>

        <Link
          to="/about"
          className="mx-5 my-1 px-4 py-2 flex items-center justify-center border border-[#575757] bg-[#ccdec2] rounded-full text-lg text-gray-900 hover:border-l-4 hover:border-r-4 hover:border-[#1d380e]"
        >
          <div className="flex items-center justify-center">
            <img
              src="/images/about.png"
              alt="About"
              className="w-auto h-auto"
            />
            <h3>About</h3>
          </div>
        </Link>

        <button
          onClick={() => setIsSignInOpen(true)}
          className="mx-5 my-1 px-4 py-2 w-[82%] text-lg font-bold text-[#ba5719] border border-[#ba5719] bg-[#ffcf94] rounded-full hover:border-l-4 hover:border-r-4 hover:border-[#ba5719]"
        >
          Sign In
        </button>

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
      </nav>
    </div>
  );
}
