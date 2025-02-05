import React from "react";
import FoodSocialCard from "../components/FoodSocialCard";

const Home = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Food Social Feed</h1>
      <div className="space-y-6">
        <FoodSocialCard />

        <FoodSocialCard
          title="Homemade Pizza"
          author="PizzaPro"
          date="February 4, 2025"
          description="Classic Neapolitan-style pizza with a perfectly crispy crust."
          cookingTime="1.5 hrs"
          difficulty="Easy"
          servings="2"
        />
      </div>
    </div>
  );
};

export default Home;
