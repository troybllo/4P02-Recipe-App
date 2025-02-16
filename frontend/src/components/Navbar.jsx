import { useState } from "react";
import { Link } from "react-router-dom";
import SignIn from "./SignIn";
import SignUp from "./Signup";
import "./Navbar.css";
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
    <div className="navbardiv">
      <nav className="nav">
        <div className="nav-title">
          <img src={feastlyPic} className="logo" />
          <h3>Feastly</h3>
        </div>
        <div className="nav-search">
          <input
            type="text"
            placeholder="Search..."
            className="nav-search-input"
          />
          <button className="nav-search-button">
            <img src={searchIcon} />
          </button>
        </div>
        <Link to="/">
          <div className="navlink_div">
            <img src={homePic} className="pic_home"/>
            <h3>Home</h3>
          </div>
        </Link>
        <Link to="/discovery">
          <div className="navlink_div">
            <img src={discPic} className="pic_home"/>
            <h3>Discovery</h3>
          </div>
        </Link>
        <Link to="/about">
          <div className="navlink_div">
            <img src={abtPic} className="pic_home"/>
            <h3>About</h3>
          </div>
        </Link>
        <button onClick={() => setIsSignInOpen(true)} className='signin_nav'>Sign In</button>

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
