"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useUi } from "../context/UiContext";
import { Country } from "country-state-city";
import toast from "react-hot-toast";

const GetInTouch = () => {
  const { isGetInTouchOpen, closeGetInTouch } = useUi();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    country: "",
    gstNo: "",
    message: "",
  });

  const countries = useMemo(() => Country.getAllCountries(), []);
  const [countrySearch, setCountrySearch] = useState("");
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  const filteredCountries = useMemo(() => {
    if (!countrySearch) return countries;
    const searchLower = countrySearch.toLowerCase();
    return countries.filter((country) =>
      country.name.toLowerCase().startsWith(searchLower),
    );
  }, [countries, countrySearch]);

  const handleCountrySelect = (country) => {
    setFormData((prev) => ({ ...prev, country: country.isoCode }));
    setCountrySearch(country.name);
    setShowCountryDropdown(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    toast.success("Thank you! We will get back to you soon.", {
      duration: 4000,
      position: "top-center",
    });
    closeGetInTouch();
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        showCountryDropdown &&
        !e.target.closest(".country-dropdown-container")
      ) {
        setShowCountryDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showCountryDropdown]);

  if (!isGetInTouchOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 md:p-6"
      onClick={closeGetInTouch}
    >
      <div
        className="bg-white rounded-[12px] md:rounded-[20px] w-full max-w-[90%] md:max-w-[700px] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 md:p-7 lg:p-[28px] flex flex-col gap-4 md:gap-5 lg:gap-[21px]">
          <div className="relative">
            <h2 className="text-[#0a0a0a] font-semibold text-base md:text-lg lg:text-[21px] tracking-[-0.36px]">
              Send us a message
            </h2>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 md:gap-5 lg:gap-[21px]"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 lg:gap-[21px]">
              <div className="flex flex-col gap-1.5 md:gap-[7px]">
                <label className="text-[#364153] font-medium text-[11px] md:text-[12.25px] tracking-[-0.02px]">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Your first name"
                  required
                  className="bg-[#f5f5f5] border border-transparent rounded-[6px] md:rounded-[6.75px] px-2.5 md:px-[10.5px] py-1 md:py-[3.5px] h-[36px] md:h-[31.5px] text-black placeholder-[#717182] text-[11px] md:text-[12.25px] tracking-[-0.02px] focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex flex-col gap-1.5 md:gap-[7px]">
                <label className="text-[#364153] font-medium text-[11px] md:text-[12.25px] tracking-[-0.02px]">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Your last name"
                  required
                  className="bg-[#f5f5f5] border border-transparent rounded-[6px] md:rounded-[6.75px] px-2.5 md:px-[10.5px] py-1 md:py-[3.5px] h-[36px] md:h-[31.5px] text-black placeholder-[#717182] text-[11px] md:text-[12.25px] tracking-[-0.02px] focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 lg:gap-[21px]">
              <div className="flex flex-col gap-1.5 md:gap-[7px]">
                <label className="text-[#364153] font-medium text-[11px] md:text-[12.25px] tracking-[-0.02px]">
                  Company Name*
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Your company name"
                  required
                  className="bg-[#f5f5f5] border border-transparent rounded-[6px] md:rounded-[6.75px] px-2.5 md:px-[10.5px] py-1 md:py-[3.5px] h-[36px] md:h-[31.5px] text-black placeholder-[#717182] text-[11px] md:text-[12.25px] tracking-[-0.02px] focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex flex-col gap-1.5 md:gap-[7px]">
                <label className="text-[#364153] font-medium text-[11px] md:text-[12.25px] tracking-[-0.02px]">
                  Country *
                </label>
                <div className="relative country-dropdown-container">
                  <input
                    type="text"
                    name="countrySearch"
                    value={countrySearch}
                    onChange={(e) => {
                      setCountrySearch(e.target.value);
                      setShowCountryDropdown(true);
                    }}
                    onFocus={() => setShowCountryDropdown(true)}
                    placeholder="Select your country"
                    required={!formData.country}
                    className="bg-[#f5f5f5] border border-transparent rounded-[6px] md:rounded-[6.75px] px-2.5 md:px-[11.5px] py-1 h-[36px] md:h-[31.5px] text-black placeholder-[#717182] text-[11px] md:text-[12.25px] tracking-[-0.02px] focus:outline-none focus:border-primary w-full"
                  />
                  {showCountryDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-[6px] max-h-[200px] overflow-y-auto shadow-lg">
                      {filteredCountries.map((country) => (
                        <div
                          key={country.isoCode}
                          onClick={() => handleCountrySelect(country)}
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-[11px] md:text-[12.25px] flex items-center gap-2"
                        >
                          <span>{country.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 md:gap-[7px]">
              <label className="text-[#364153] font-medium text-[11px] md:text-[12.25px] tracking-[-0.02px]">
                GST No
              </label>
              <input
                type="text"
                name="gstNo"
                value={formData.gstNo}
                onChange={handleChange}
                placeholder="GJDN785940EN"
                className="bg-[#f5f5f5] border border-transparent rounded-[6px] md:rounded-[6.75px] px-2.5 md:px-[10.5px] py-1 md:py-[3.5px] h-[36px] md:h-[31.5px] text-black placeholder-[#717182] text-[11px] md:text-[12.25px] tracking-[-0.02px] focus:outline-none focus:border-primary"
              />
            </div>

            <div className="flex flex-col gap-1.5 md:gap-[7px]">
              <label className="text-[#364153] font-medium text-[11px] md:text-[12.25px] tracking-[-0.02px]">
                Message *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us more about your needs and how we can help you..."
                required
                rows="3"
                className="bg-[#f5f5f5] border border-transparent rounded-[6px] md:rounded-[6.75px] px-2.5 md:px-[10.5px] py-1.5 md:py-[7px] text-black placeholder-[#717182] text-[11px] md:text-[12.25px] leading-[17.5px] tracking-[-0.02px] resize-none focus:outline-none focus:border-primary"
              />
            </div>

            <button
              type="submit"
              className="bg-[#1e1e1e] text-white rounded-[6px] md:rounded-[6.75px] h-[48px] md:h-[52.5px] font-medium text-[14px] md:text-[15.75px] tracking-[-0.29px] hover:bg-[#2e2e2e] transition-colors"
            >
              Send Details
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GetInTouch;
