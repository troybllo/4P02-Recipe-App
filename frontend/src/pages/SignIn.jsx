import FoodSocialCard from "../components/FoodSocialCard";
import React, { useState, useEffect } from "react";
import { recipes } from "../data/recipes";
import Masonry from "react-masonry-css";
import EditProfile from "../components/EditProfile";

const breakpointColumnsObj = {
    default: 3,
    1440: 3,
    1920: 3,
    1680: 3,
    1280: 3,
    1080: 2,
    824: 2,
    640: 1,
};



export default function SignIn({
    onSignInSuccess,
    onSwitchToSignUp,
}) {

    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
          ...prev,
          [name]: value,
    }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);
    }

    return(
        <>
            <div className="my-20 flex mb-5 justify-center items-center">
                <div>
                    <h1 className="text-3xl font-bold">Sign In</h1>
                    <p className="text-gray-700 mt-2 text-l">
                        The ultimate hub of all foodies, from students to home chefs to professional chefs.
                    </p>

                    <form action={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                                {error}
                            </div>
                        )}

                        <div className="mt-10">
                            <label 
                            htmlFor="username"
                            className="block text-sm font-medium text-gray-700"
                            >
                                Username
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#869a7b] focus:border-[#869a7b] sm:text-sm"
                                value={formData.username}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mt-10">
                            <label 
                            htmlFor="username"
                            className="block text-sm font-medium text-gray-700"
                            >
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#869a7b] focus:border-[#869a7b] sm:text-sm"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-[white] bg-[#869a7b] hover:bg-[#1d380e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#869a7b]"
                            >
                            {isLoading ? "Signing in..." : "Sign in"}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm">
                        <span className="text-gray-600">Don't have an account?</span>
                        <button
                        onClick={onSwitchToSignUp}
                        className="ml-2 text-[#869a7b] hover:text-[#1d380e] font-medium"
                        >
                        Sign up
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
