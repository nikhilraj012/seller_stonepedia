"use client";
import React, { useEffect, useState } from "react";
import { LuUserRound } from "react-icons/lu";
import { LuFactory } from "react-icons/lu";
import { CiMobile3 } from "react-icons/ci";

import { LocationSelector } from "@/app/components/LocationSelector";

const CompanyDetails = ({ onDataChange, resetForm }) => {
  const initialFormData = {
    name: "",
    shopName: "",
    gstNumber: "",
    email: "",
    country: null,
    state: null,
    city: null,
    address: "",
    phone: "",
    pincode: "",
    description: "",
    image: null,
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (resetForm) {
      setFormData(initialFormData);
    }
  }, [resetForm]);
  useEffect(() => {
    onDataChange(formData);
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let val = value;
    if (name === "pincode") val = value.replace(/\D/g, "").slice(0, 6);
    setFormData((prev) => ({
      ...prev,
      [name]: val,
    }));
  };

  const handleUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      [type]: {
        file,
        url: URL.createObjectURL(file),
        type: file.type,
        name: file.name,
      },
    }));
  };

  return (
    <div className="">
      <h2 className="text-xs font-medium mb-1">Company Details</h2>
      <div className="border border-dashed border-[#000000]/20 rounded-lg p-2 md:p-4 space-y-1 md:space-y-2">
        <div className="space-y-1 md:space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 w-full">
            <div className="w-full flex flex-col">
              <label htmlFor="name" className="mb-0.5 text-xs font-medium ">
                Full Name
              </label>
              <div className="rounded-lg p-px transition bg-transparent focus-within:bg-linear-to-t focus-within:from-[#d6c9ea] focus-within:to-primary">
                <div className="flex items-center gap-2 rounded-lg bg-white border border-[#D7D7D7] transition focus-within:border-transparent">
                  <input
                    id="name"
                    type="text"
                    required
                    title="Full Name must be first and last name"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="flex-1 bg-transparent outline-none border-0 p-3 text-xs appearance-none w-full"
                    style={{ WebkitAppearance: "none" }}
                  />
                  <label htmlFor="name" className="pr-3 text-gray-600">
                    <LuUserRound size={16} />
                  </label>
                </div>
              </div>
            </div>
            <div className="w-full flex flex-col">
              <label
                htmlFor="shopName"
                className="mb-0.5 text-xs font-medium "
              >
                Shop Name
              </label>
              <div className="rounded-lg p-px transition bg-transparent focus-within:bg-linear-to-t focus-within:from-[#d6c9ea] focus-within:to-primary">
                <div className="flex items-center gap-2 rounded-lg bg-white border border-[#D7D7D7] transition focus-within:border-transparent">
                  <input
                    id="shopName"
                    required
                    type="text"
                    placeholder="Shop Name"
                    value={formData.shopName}
                    onChange={handleInputChange}
                    className="flex-1 bg-transparent outline-none border-0 p-3 text-xs w-full"
                    name="shopName"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 w-full">
            <div className="w-full flex flex-col">
              <label htmlFor="gstNumber" className="mb-0.5 text-xs font-medium">
               GST / Government Id
              </label>
              <div className="rounded-lg p-px transition bg-transparent focus-within:bg-linear-to-t focus-within:from-[#d6c9ea] focus-within:to-primary">
                <div className="flex items-center gap-2 rounded-lg bg-white border border-[#D7D7D7] transition focus-within:border-transparent">
                  <input
                    id="gstNumber"
                    type="text"
                    name="gstNumber"
                    onInput={(e) => e.target.setCustomValidity("")}
                    placeholder="GST Number"
                    value={formData.gstNumber}
                    onChange={handleInputChange}
                    className="flex-1 bg-transparent outline-none border-0 p-3 text-xs appearance-none w-full"
                    style={{ WebkitAppearance: "none" }}
                  />
                </div>
              </div>
            </div>
            <div className="w-full flex flex-col">
              <label htmlFor="email" className="mb-0.5 text-xs font-medium">
                Email Address
              </label>
              <div className="rounded-lg p-px transition bg-transparent focus-within:bg-linear-to-t focus-within:from-[#d6c9ea] focus-within:to-primary">
                <div className="flex items-center gap-2 rounded-lg bg-white border border-[#D7D7D7] transition focus-within:border-transparent">
                  <input
                    id="email"
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="flex-1 bg-transparent outline-none border-0 p-3 text-xs w-full"
                    required
                    name="email"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 w-full">
            <LocationSelector
              country={formData.country}
              state={formData.state}
              city={formData.city}
              onChange={(data) => setFormData((prev) => ({ ...prev, ...data }))}
            />
          </div>
          <div className="w-full flex flex-col">
            <label htmlFor="address" className="mb-0.5 text-xs font-medium">
              Address
            </label>
            <div className="rounded-lg p-px transition bg-transparent focus-within:bg-linear-to-t focus-within:from-[#d6c9ea] focus-within:to-primary">
              <div className="flex items-center gap-2 rounded-lg bg-white border border-[#D7D7D7] transition focus-within:border-transparent">
                <textarea
                  id="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="flex-1 bg-transparent outline-none border-0 p-3 text-xs w-full"
                  required
                  name="address"
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 w-full">
            <div className="w-full flex flex-col">
              <label htmlFor="name" className="mb-0.5 text-xs font-medium">
                Phone Number
              </label>
              <div className="rounded-lg p-px transition bg-transparent focus-within:bg-linear-to-t focus-within:from-[#d6c9ea] focus-within:to-primary">
                <div className="flex items-center gap-2 rounded-lg bg-white border border-[#D7D7D7] transition focus-within:border-transparent ">
                  <div className="flex items-center w-full ">
                    <span className="text-xs text-gray-500 px-2 border-r">
                      +{formData.country?.phonecode || "1"}
                    </span>
                    <input
                      id="phone"
                      type="tel"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={(e) => {
                        const value = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 15);
                        setFormData((prev) => ({
                          ...prev,
                          phone: value,
                        }));
                      }}
                      className="flex-1 bg-transparent outline-none border-0 p-3 text-xs w-full appearance-none"
                      style={{ WebkitAppearance: "none" }}
                      required
                      name="phone"
                    />
                  </div>
                  <label className="pr-3 text-gray-600" htmlFor="phone">
                    <CiMobile3 size={16} />
                  </label>
                </div>
              </div>
            </div>
            <div className="w-full flex flex-col">
              <label htmlFor="pincode" className="mb-0.5 text-xs font-medium">
                Pincode
              </label>
              <div className="rounded-lg p-px transition bg-transparent focus-within:bg-linear-to-t focus-within:from-[#d6c9ea] focus-within:to-primary">
                <div className="flex items-center gap-2 rounded-lg bg-white border border-[#D7D7D7] transition focus-within:border-transparent">
                  <input
                    id="pincode"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    pattern="\d{6}"
                    placeholder="Pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className="flex-1 bg-transparent outline-none border-0 p-3 text-xs w-full"
                    required
                    name="pincode"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="w-full">
            <label htmlFor="image" className="mb-0.5 text-xs ">
              <div className="flex flex-col gap-0.5">
                <span className="font-medium mb-0.5">
                  Upload Company Logo Image
                </span>
                {/* <span className="text-[11px] mb-2 text-[#8F8F8F] font-normal">
                  <span className="text-red-500 ml-0.5">*</span>For Company unit
                  profile Image
                </span> */}
              </div>
            </label>

            <div className="flex items-center justify-between border border-gray-200 rounded-lg bg-white p-3  transition relative">
              <div className="flex items-center gap-2">
                <LuFactory className="w-6 h-6 text-gray-300" />
              </div>
              <input
                id="image"
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer"
               accept="image/jpeg, image/jpg, image/png"
                name="image"
                onChange={(e) => handleUpload(e, "image")}
                required
              />

              <div className="flex  gap-2">
                <div>
                  {formData.image && (
                    <p className="text-[#2C2C2C] mt-1.5 md:mt-2 text-[10px] font-medium">
                      {formData.image.name}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => document.getElementById("image").click()}
                  className="bg-gray-100 text-gray-700 text-[10px] md:text-xs px-2 md:px-4 py-1.5 rounded-md  font-medium"
                >
                  Choose Photo
                </button>
              </div>
            </div>
          </div>
          <div className="">
            <label
              htmlFor="description"
              className="mb-0.5 text-xs font-medium "
            >
              Description
            </label>
            <textarea
              id="description"
              placeholder="Write here"
              rows={4}
              required
              value={formData.description}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md p-2 text-xs outline-none"
              name="description"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;
