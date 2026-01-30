import React from "react";
import { MdDeleteForever } from "react-icons/md";

const ConfirmDialog = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      {/* Card */}
      <div
        className="
          bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.25)]
          w-full max-w-md
          px-5 sm:px-8 md:px-10
          py-5 sm:py-6
          animate-scaleIn
        "
      >
        {/* Icon */}
        <div className="flex justify-center mb-3 sm:mb-4">
          <MdDeleteForever className="text-red-600 text-4xl sm:text-5xl" />
        </div>

        {/* Message */}
        <p className="text-gray-900 text-base sm:text-lg md:text-xl font-semibold text-center mb-6 sm:mb-8">
          {message}
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-5">
          <button
            onClick={onCancel}
            className="
              w-full sm:w-32 py-2
              cursor-pointer rounded-xl
              border border-gray-300 bg-white text-gray-700 font-medium
              hover:bg-gray-100 active:scale-95 transition
            "
          >
            No
          </button>

          <button
            onClick={onConfirm}
            className="
              w-full sm:w-32 py-2
              cursor-pointer rounded-xl
              bg-red-600 text-white font-semibold shadow-md
              hover:bg-red-700 active:scale-95 transition
            "
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
