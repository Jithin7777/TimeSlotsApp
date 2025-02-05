"use client";

import React, { useEffect, useState } from "react";
import AvailabilityForm from "@/components/AvailabilityForm";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
export default function AvailabilityPage({ params }) {
  const user_id = React.use(params).user_id;

  const [availability, setAvailability] = useState(null);
  const router = useRouter();
  useEffect(() => {
    const fetchAvailability = async () => {
      const response = await fetch(`/api/saveAvailability/${user_id}`);
      const data = await response.json();
      if (data.error) {
        console.error(data.error);
      } else {
        setAvailability(data.availabilities || {});
      }
    };

    fetchAvailability();
  }, [user_id]);

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <div className=" max-w-4xl p-3 bg-white rounded-lg shadow-md">
        <button
          onClick={() => router.push("/")}
          className="sm:w-auto bg-gray-600 text-white py-2 px-4 rounded-md flex items-center gap-2 hover:bg-gray-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          <FaArrowLeft className="text-white" /> {/* Add the back arrow icon */}
          Back
        </button>
        <h1 className="text-3xl mt-5 font-bold text-center text-blue-600 mb-6">
          Set Your Availability
        </h1>
        {availability === null ? (
          <p>Loading...</p>
        ) : (
          <AvailabilityForm
            userId={user_id}
            initialAvailability={availability}
          />
        )}
      </div>
    </div>
  );
}
