import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { LuUserRound } from "react-icons/lu";
import toast from "react-hot-toast";

import { LuFactory } from "react-icons/lu";
import { CiMobile3 } from "react-icons/ci";

import { FiUpload } from "react-icons/fi";
import { LocationSelector } from "@/app/components/LocationSelector";

const MAX_SIZE = 2 * 1024 * 1024;

const CompanyDetails = forwardRef(({ resetForm }, ref) => {
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
    about: "",
    brochure: null,
    image: null,
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (resetForm) {
      setFormData(initialFormData);
    }
  }, [resetForm]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let val = value;
    if (name === "pincode") val = value.replace(/\D/g, "").slice(0, 6);
    setFormData((prev) => ({
      ...prev,
      [name]: val,
    }));
  };

  // const handleUpload = (e, type) => {
  //   const file = e.target.files[0];
  //   if (!file) return;

  //   // if (file.size > MAX_SIZE) {
  //   //   toast.error(`${file.name} exceeds 2MB limit`);
  //   //   e.target.value = "";
  //   //   return;
  //   // }

  //   setFormData((prev) => ({
  //     ...prev,
  //     [type]: {
  //       file,
  //       url: URL.createObjectURL(file),
  //       type: file.type,
  //       name: file.name,
  //     },
  //   }));
  // };
  const handleUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const isPDF =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    const isImage =
      file.type === "image/jpeg" ||
      file.type === "image/jpg" ||
      file.type === "image/png";

    if (type === "brochure" && !isPDF) {
      toast.error("Only PDF file allowed for brochure");
      e.target.value = "";
      return;
    }

    if (type === "image" && !isImage) {
      toast.error("Only JPG, JPEG, PNG image allowed");
      e.target.value = "";
      return;
    }

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
  useImperativeHandle(ref, () => ({
    getData: () => formData,

    reset: () => {
      setFormData(initialFormData);
    },
  }));

  return (
    <div className="">
      <h2 className="text-xs font-medium mb-1">Gallery Details</h2>
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
                    className="flex-1 bg-transparent outline-none border-0 p-3 text-xs w-full"
                    style={{ WebkitAppearance: "none" }}
                  />
                  <label htmlFor="name" className="pr-3 text-gray-600">
                    <LuUserRound size={16} />
                  </label>
                </div>
              </div>
            </div>
            <div className="w-full flex flex-col">
              <label htmlFor="shopName" className="mb-0.5 text-xs font-medium ">
                Gallery Name
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
            {/* <div className="w-full flex flex-col">
              <label htmlFor="gstNumber" className="mb-0.5 text-xs font-medium">
                GST Number
              </label>
              <div className="rounded-lg p-px transition bg-transparent focus-within:bg-linear-to-t focus-within:from-[#d6c9ea] focus-within:to-primary">
                <div className="flex items-center gap-2 rounded-lg bg-white border border-[#D7D7D7] transition focus-within:border-transparent">
                  <input
                    id="gstNumber"
                    type="text"
                    name="gstNumber"
                    required
                    maxLength={15}
                    pattern=".{15}"
                    onInvalid={(e) =>
                      e.target.setCustomValidity(
                        "GST number must follow these rules:\n1. Must be 15 characters\n2. Example: 22AAAAA0000A1Z5",
                      )
                    }
                    onInput={(e) => e.target.setCustomValidity("")}
                    placeholder="GST Number"
                    value={formData.gstNumber}
                    onChange={handleInputChange}
                    className="flex-1 bg-transparent outline-none border-0 p-3 text-xs appearance-none w-full"
                    style={{ WebkitAppearance: "none" }}
                  />
                </div>
              </div>
            </div> */}
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
          <div className="">
            <label
              htmlFor="description"
              className="mb-0.5 text-xs font-medium "
            >
              About Gallery
            </label>
            <textarea
              id="about"
              placeholder="Write here"
              rows={4}
              required
              value={formData.about}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md p-2 text-xs outline-none"
              name="about"
            ></textarea>
          </div>
          <div className="w-full">
            <label htmlFor="brochure" className="mb-0.5 text-xs font-medium">
              Upload Brochure <span className="text-[#BCBCBC]">(Optional)</span>
            </label>
            <div className="border border-dashed  border-primary rounded-lg p-6 text-center text-gray-600 relative bg-white transition min-h-[100px] flex flex-col justify-center items-center">
              <input
                id="brochure"
                type="file"
                className="absolute inset-0 opacity-0"
                accept=".pdf,application/pdf"
                name="brochure"
                onChange={(e) => handleUpload(e, "brochure")}
              />
              <FiUpload size={20} className="mb-2 text-gray-900" />
              <p className="text-[#2C2C2C] text-[10px] md:text-xs font-medium tracking-wide pointer-events-none mb-1">
                Choose a file
              </p>
              <span className="text-[8px] product mb-2 text-gray-500 tracking-wide leading-relaxed pointer-events-none">
                PDF Only
              </span>
              <div className="h-6">
                {formData.brochure ? (
                  <p className="text-[#2C2C2C] text-[10px] font-medium">
                    {" "}
                    {`${formData.brochure.name}`}
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={() => document.getElementById("brochure").click()}
                    className="border font-medium text-sm px-6 py-1 rounded-xl hover:border-primary cursor-pointer hover:shadow-md transition-colors pointer-events-auto relative z-10"
                  >
                    Browse
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="w-full">
            <label htmlFor="image" className="mb-0.5 text-xs ">
              <div className="flex flex-col gap-0.5">
                <span className="font-medium mb-0.5">Upload Shop Image</span>
                {/* <span className="text-[11px] mb-2 text-[#8F8F8F] font-normal">
                  <span className="text-red-500 ml-0.5">*</span> For shop
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
                accept="image/jpeg,image/jpg,image/png"
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
                  className="bg-gray-100 hover:shadow text-gray-700 text-[10px] md:text-xs px-2 md:px-4 py-1.5 rounded-md  hover:bg-gray-200 font-medium"
                >
                  Choose Photo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default CompanyDetails;
