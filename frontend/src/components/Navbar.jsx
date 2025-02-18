import { useState } from "react";
import { Link } from "react-router-dom";
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
    <div className="flex flex-col fixed left-0 top-0 bottom-0 h-sfull w-[12%] bg-[#eaf5e4] pt-5 border-r border-[#1d380e]">
      <nav>
        <div className="flex items-center justify-center text-2xl font-bold mx-5 mb-8">
          <img src={feastlyLogo} alt="Feastly" className="w-auto h-auto" />
          <h3>Feastly</h3>
        </div>

        <div className="mx-5 my-1 px-4 py-2 flex items-center border border-[#575757] bg-white rounded-full">
          <input
            type="text"
            placeholder="Search..."
            className="w-[75%] bg-transparent focus:outline-none text-lg"
          />
          <button className="w-[15%] flex justify-center">
            <img src={searchIcon} alt="Search" />
          </button>
        </div>

        <Link
          to="/"
          className="mx-5 my-1 px-4 py-2 flex items-center justify-center border border-[#575757] bg-[#ccdec2] rounded-full text-lg text-gray-900 min-w-[80%] hover:border-l-4 hover:border-r-4 hover:border-[#1d380e]"
        >
          <div className="flex items-center justify-center">
            <img src={homeIcon} alt="Home" className="w-auto h-auto" />
            <h3>Home</h3>
          </div>
        </Link>

        <Link
          to="/discovery"
          className="mx-5 my-1 px-4 py-2 flex items-center justify-center border border-[#575757] bg-[#ccdec2] rounded-full text-lg text-gray-900 min-w-[80%] hover:border-l-4 hover:border-r-4 hover:border-[#1d380e]"
        >
          <div className="flex items-center justify-center">
            <img
              src={discoveryIcon}
              alt="Discovery"
              className="w-auto h-auto"
            />
            <h3>Discovery</h3>
          </div>
        </Link>

        <Link
          to="/about"
          className="mx-5 my-1 px-4 py-2 flex items-center justify-center border border-[#575757] bg-[#ccdec2] rounded-full text-lg text-gray-900 min-w-[80%] hover:border-l-4 hover:border-r-4 hover:border-[#1d380e]"
        >
          <div className="flex items-center justify-center">
            <img src={aboutIcon} alt="About" className="w-auto h-auto" />
            <h3>About</h3>
          </div>
        </Link>

        <button
          onClick={() => setIsCreatePostOpen(true)}
          className="mx-5 my-1 px-4 py-2 flex items-center justify-center border border-[#1d9c3f] bg-[#bbf7a0] rounded-full text-lg font-bold text-[#1d9c3f] min-w-[82%] hover:border-l-4 hover:border-r-4 hover:border-[#1d9c3f]"
        >
          <div className="flex items-center justify-center">
            <h3>Create Post</h3>
          </div>
        </button>

        <button
          onClick={() => setIsSignInOpen(true)}
          className="mx-5 my-1 px-4 py-2 flex items-center justify-center border border-[#ba5719] bg-[#ffcf94] rounded-full text-lg font-bold text-[#ba5719] min-w-[82%] hover:border-l-4 hover:border-r-4 hover:border-[#ba5719]"
        >
          <div className="flex items-center justify-center">
            <h3>Sign In</h3>
          </div>
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
        <CreatePost
          isOpen={isCreatePostOpen}
          onClose={() => setIsCreatePostOpen(false)}
          onSubmit={handleCreatePost}
        />
      </nav>
    </div>
  );
}
