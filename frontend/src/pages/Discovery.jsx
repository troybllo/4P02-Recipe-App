import React from "react";

const Discovery = () => {
  return (
    <>
      <div className="flex flex-col items-center">
        <img
          src="/api/placeholder/100/100"
          alt="Discovery Diamond"
          className="w-24 h-24"
        />
        <h1 className="text-2xl font-bold mt-2">Your Discovery</h1>
        <p className="text-gray-600">Discover new recipes here!</p>
      </div>

      <div className="relative max-w-[30%] mx-5 my-1 p-3 px-12 bg-white border border-gray-500 rounded-full text-lg text-gray-900 text-center ">
        <input
          type="text"
          placeholder="Search..."
          className="flex flex-row w-full items-center justify-center outline-none"
        />
        <button className="absolute right-4 top-1/2 -translate-y-1/2">
          <img
            src="/api/placeholder/25/25"
            alt="Search Icon"
            className="w-6 h-6"
          />
        </button>
      </div>
    </>
  );
};

export default Discovery;
