import React from "react";
import { FaUserCircle } from "react-icons/fa";
import { useAuth } from "./context/AuthContext";

const NavbarProfile = ({ isMobile = false, onLogout }) => {
  const {sellerDetails } = useAuth();

  if (isMobile) {
    return (
      <>
        <div className="flex items-center gap-3 px-2 py-2">
          <FaUserCircle size={40} className="text-[#871b58]" />
          <div className="flex-1">
            <p className="font-semibold text-sm text-gray-800">
              {sellerDetails.fullName}
            </p>
            <p className="text-xs text-gray-500 truncate">{sellerDetails.email}</p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="bg-[#1E1E1E] text-white py-2 rounded cursor-pointer"
        >
          Logout
        </button>
      </>
    );
  }

  return (
    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <FaUserCircle size={40} className="text-[#871b58]" />
          <div className="flex-1">
            <p className="font-semibold text-sm text-gray-800">
              {sellerDetails.fullName}
            </p>
            <p className="text-xs text-gray-500 truncate">{sellerDetails.email}</p>
          </div>
        </div>
      </div>
      <button
        onClick={onLogout}
        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
      >
        Logout
      </button>
    </div>
  );
};

export default NavbarProfile;
