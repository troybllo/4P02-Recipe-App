import { useState } from "react";
import { Link } from "react-router-dom";
import SignIn from "./SignIn";
import SignUp from "./Signup";

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
    <div className="pt-6">
      <nav className="flex flex-row gap-3 justify-evenly">
        <Link>
          <h3>Home</h3>
        </Link>
        <Link>
          <h3>Disc</h3>
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
