import { useState } from "react";
import { Link } from "react-router-dom";
import SignIn from "./SignIn";
import SignUp from "./Signup";
import "./Navbar.css";

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
          <img src="/src/images/feastly_black.png" className="logo" />
          <h3>Feastly</h3>
        </div>
        <Link>
          <div className="navlink_div">
            <img src="/src/images/homePic.png" className="pic_home"/>
            <h3>Home</h3>
          </div>
        </Link>
        <Link>
          <h3>Discovery</h3>
        </Link>
        <Link>
          <h3>About</h3>
        </Link>
        <button onClick={() => setIsSignInOpen(true)}>Sign In</button>

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
