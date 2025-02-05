"use client";

import { useState, useEffect } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const formatTime = (time) => {
  if (!time) return ""; 
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
  const formattedMinutes = minutes.toString().padStart(2, "0");
  return `${formattedHours}:${formattedMinutes} ${period}`;
};

const AvailabilityForm = ({ userId, initialAvailability }) => {
  const [availability, setAvailability] = useState(initialAvailability);
  const [isValid, setIsValid] = useState(true);

  // Validate availability data 
  const validateAvailability = () => {
    const isValidTimeSlot = (slots) => {
      return slots.every(
        ({ startTime, endTime }) => startTime && endTime && startTime < endTime
      );
    };

    const isValidData = Object.values(availability).every(isValidTimeSlot);
    setIsValid(isValidData);
    return isValidData;
  };

  useEffect(() => {
    validateAvailability();
  }, [availability]);

  const handleChange = (day, index, field, value) => {
    setAvailability((prev) => {
      const newAvailability = { ...prev };
      newAvailability[day] = [...newAvailability[day]];
      newAvailability[day][index] = {
        ...newAvailability[day][index],
        [field]: value,
      };
      return newAvailability;
    });
  };

  // Add a new time slot 
  const handleAddSlot = (day) => {
    setAvailability((prev) => {
      const newAvailability = { ...prev };
      newAvailability[day] = [
        ...newAvailability[day],
        { startTime: "", endTime: "" },
      ];
      return newAvailability;
    });
  };

  // Remove a time slot
  const handleRemoveSlot = (day, index) => {
    setAvailability((prev) => {
      const newAvailability = { ...prev };
      newAvailability[day] = newAvailability[day].filter((_, i) => i !== index);
      return newAvailability;
    });

    toast.success(
      `You have confirmed to save availability and removed the slot from ${
        day.charAt(0).toUpperCase() + day.slice(1)
      }!`
    );
  };

  // Save the availability data
  const saveAvailability = async () => {
    if (!validateAvailability()) {
      toast.error("Invalid availability data"); // Error toast
      return;
    }

    try {
      const response = await fetch(`/api/saveAvailability/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ availabilities: availability }),
      });

      const data = await response.json();
      if (data.error) {
        toast.error("Error saving availability"); // Error toast
      } else {
        toast.success("Availability saved successfully!"); // Success toast
      }
    } catch (error) {
      toast.error("Error saving availability"); // Error toast on catch
    }
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg shadow-md">
      <form>
        {[
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ].map((day) => (
          <div key={day} className="mb-6">
            <h3 className="text-xl font-semibold text-blue-600 mb-2">
              {day.charAt(0).toUpperCase() + day.slice(1)}
            </h3>
            {availability[day].map((slot, index) => (
              <div
                key={index}
                className="flex items-center gap-4 mb-4 flex-wrap"
              >
                <input
                  type="time"
                  value={slot.startTime}
                  onChange={(e) =>
                    handleChange(day, index, "startTime", e.target.value)
                  }
                  required
                  className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-24 sm:w-32"
                />
                <span>{formatTime(slot.startTime).split(" ")[1]}</span>
                <input
                  type="time"
                  value={slot.endTime}
                  onChange={(e) =>
                    handleChange(day, index, "endTime", e.target.value)
                  }
                  required
                  className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-24 sm:w-32"
                />
                <span>{formatTime(slot.endTime).split(" ")[1]}</span>

                <div className="flex gap-2 ml-4">
                  <button
                    type="button"
                    onClick={() => handleAddSlot(day)}
                    className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
                  >
                    <FaPlus />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveSlot(day, index)}
                    className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                  >
                    <FaMinus />
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddSlot(day)}
              className="block p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
            >
              Add Slot
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={saveAvailability}
          disabled={!isValid}
          className={`p-3 mb-10 text-white rounded-md ${
            isValid
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Save Availability
        </button>
      </form>
      <ToastContainer /> 
    </div>
  );
};

export default AvailabilityForm;
