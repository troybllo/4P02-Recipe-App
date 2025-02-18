import React from "react";
import FoodSocialCard from "../components/FoodSocialCard";
import { recipes } from "../utils/sampleData";

const Discovery = () => {
  return (
    <div className="w-full">
      <div className="flex flex-col items-center mb-8">
        <img
          src="/api/placeholder/100/100"
          alt="Discovery Diamond"
          className="w-24 h-24"
        />
        <h1 className="text-2xl font-bold mt-2">Your Discovery</h1>
        <p className="text-gray-600">Discover new recipes here!</p>
      </div>

      <div className="flex justify-center w-full">
        <div className="relative w-full max-w-[30%] mx-5 my-1 p-3 px-12 bg-white border border-gray-500 rounded-full text-lg text-gray-900">
          <input
            type="text"
            placeholder="Search..."
            className="w-full outline-none text-left"
          />
          <button className="absolute right-4 top-1/2 -translate-y-1/2">
            <img
              src="/api/placeholder/25/25"
              alt="Search Icon"
              className="w-6 h-6"
            />
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-20 px-60">
        <div className="flex flex-col">
          <h1 className="font-extralight text-3xl">Featured Picks</h1>
          <div className=" flex flex-row gap-6">
            {recipes.slice(0, 4).map((recipe) => (
              <div key={recipe.id}>
                <FoodSocialCard key={recipe.id} {...recipe} />
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col">
          <h1 className="font-extralight text-3xl">Latest Recipes</h1>
          <div className=" flex flex-row gap-6">
            {recipes.slice(0, 4).map((recipe) => (
              <div key={recipe.id}>
                <FoodSocialCard key={recipe.id} {...recipe} />
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col">
          <h1 className="font-extralight text-3xl">Staffs Picks</h1>
          <div className=" flex flex-row gap-6">
            {recipes.slice(0, 4).map((recipe) => (
              <div key={recipe.id}>
                <FoodSocialCard key={recipe.id} {...recipe} />
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col">
          <h1 className="font-extralight text-3xl">Trending</h1>
          <div className=" flex flex-row gap-6">
            {recipes.slice(0, 4).map((recipe) => (
              <div key={recipe.id} className=" ">
                <FoodSocialCard key={recipe.id} {...recipe} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Discovery;
