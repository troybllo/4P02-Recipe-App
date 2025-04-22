import "./App.css";
import { Route, Routes } from "react-router-dom";
import { useState } from "react";
import { AuthProvider } from "./components/AuthContext"; // Import the AuthProvider
import { ProtectedRoute } from "./components/ProtectedRoute"; // Import the ProtectedRoute
import Home from "./pages/Home";
import Discovery from "./pages/Discovery";
import Landing from "./pages/Landing";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Profile from "./pages/Profile";
import RecipeDetail from "./pages/RecipeDetail";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import LandingPage from "./pages/Landing"
import ProfileRedirect from "./components/ProfileRedirect";

function App() {
  return (
    <AuthProvider>
      <div className="app-container">
        <Navbar />
        <div className="main-content">
        <Routes>
  {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<Home />} />
            <Route path="/discovery" element={<Discovery />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/recipes/:postId/:userId" element={<RecipeDetail />} />
            
            {/* Public profile route - for viewing other profiles */}
            <Route path="/profile/:profileUsername" element={<Profile />} />
            
            {/* Protected empty profile route - will redirect to username-based profile */}
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Routes>
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;