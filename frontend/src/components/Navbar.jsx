import { useState } from "react";
import { Link } from "react-router-dom";
import SignIn from "./SignIn";
import SignUp from "./Signup";

export default function Navbar() {
  const [currentPage, setCurrentPage] = useState("home");
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
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-md px-4 py-4 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex gap-4">
            <button
              onClick={() => setCurrentPage("home")}
              className={`px-3 py-2 rounded-md text-base transition-colors duration-200 hover:bg-gray-100 hover:shadow
                ${currentPage === "home" ? "bg-gray-50 shadow" : ""}`}
            >
              <Link to="/" className="hover:text-gray-700">
                Home
              </Link>
            </button>
            <button
              onClick={() => setCurrentPage("disc")}
              className={`px-3 py-2 rounded-md text-base transition-colors duration-200 hover:bg-gray-100 hover:shadow
                ${currentPage === "disc" ? "bg-gray-50 shadow" : ""}`}
            >
              <Link to="/discovery" className="hover:text-gray-700">
                Discovery
              </Link>
            </button>
            <button
              onClick={() => setCurrentPage("about")}
              className={`px-3 py-2 rounded-md text-base transition-colors duration-200 hover:bg-gray-100 hover:shadow
                ${currentPage === "about" ? "bg-gray-50 shadow" : ""}`}
            >
              <Link to="/about" className="hover:text-gray-700">
                About
              </Link>
            </button>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSignInOpen(true)}
              className="px-3 py-2 rounded-md text-base transition-colors duration-200 hover:bg-gray-100 hover:shadow"
            >
              Sign In
            </button>
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      </nav>
      <div className="h-16"></div>
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
    </>
  );
}
