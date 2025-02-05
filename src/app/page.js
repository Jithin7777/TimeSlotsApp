"use client";

import { useRouter } from "next/navigation";
import React from "react";

const Page = () => {
  const user_id = "122";
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white shadow-lg rounded-lg p-8 text-center w-96">
        <h1 className="text-2xl font-semibold text-blue-600 mb-4">
          Welcome to the User Availability Page
        </h1>
        <p className="text-gray-600 mb-6">
          Click the button below to explore availability{" "}
        </p>
        <button
          onClick={() => router.push(`/user/availability/${user_id}`)}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Explore Availability
        </button>
      </div>
    </div>
  );
};

export default Page;
