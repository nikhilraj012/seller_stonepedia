"use client";

import React, { useRef } from "react";
import { IoPersonCircleOutline } from "react-icons/io5";
import { uploadProfilePhoto } from "../../utils/uploadProfilePhoto";
import { useAuth } from "../context/AuthContext";

const ProfileAvatar = ({ size = 40, className = "" }) => {
  const { user, updateAppUser } = useAuth();
  const photoUrl = user?.photoURL;
  const localFileInputRef = useRef(null);

  const handleChangePhotoClick = () => {
    localFileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      await uploadProfilePhoto(file, updateAppUser);
    } catch (error) {
      // Error handling is done in uploadProfilePhoto utility
    } finally {
      e.target.value = "";
    }
  };

  return (
    <>
      <div
        className={`relative group/avatar cursor-pointer rounded-full overflow-hidden w-10 h-10 border border-gray-200`}
        onClick={handleChangePhotoClick}
      >
        {photoUrl ? (
          <img
            src={photoUrl}
            alt="avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <IoPersonCircleOutline size={size} className="text-gray-400" />
        )}
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white opacity-0 group-hover/avatar:opacity-100 transition-opacity">
          <span className="text-[10px] leading-tight text-center">
            Change photo
          </span>
        </div>
      </div>
      <input
        type="file"
        accept="image/*"
        ref={localFileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
    </>
  );
};

export default ProfileAvatar;
