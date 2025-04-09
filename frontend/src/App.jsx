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

function App() {
  return (
    <AuthProvider> {/* Wrap your app with AuthProvider */}
      <div className="app-container">
        <Navbar />
        <div className="main-content">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/discovery" element={<Discovery />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="/Signin" element={<SignInPage />} />
            <Route path="/Signup" element={<SignUpPage />} />
            <Route path="/recipe/:id" element={<RecipeDetail />} />
            
            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<Profile />} />
              {/* Add any other protected routes here */}
            </Route>
          </Routes>
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;