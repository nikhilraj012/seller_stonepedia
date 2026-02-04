"use client";
import React, { useRef, useEffect, useState } from "react";
import { LuUserRound } from "react-icons/lu";
import { LuFactory } from "react-icons/lu";
import { CiMobile3 } from "react-icons/ci";
import { v4 as uuidv4 } from "uuid";
import { FiUpload } from "react-icons/fi";
import toast from "react-hot-toast";
import { FaPlus } from "react-icons/fa6";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  collection,
  addDoc,
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import SlabDetailsForm from "./SlabDetailsForm";
import ProductView from "./ProductView";

import { useUi } from "@/app/components/context/UiContext";
import { useAuth } from "@/app/components/context/AuthContext";
import { db, storage } from "@/app/firebase/config";
import { LocationSelector } from "@/app/components/LocationSelector";
import { useRouter } from "next/navigation";
import { processFiles } from "@/app/utils/fileUtils";

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
  image: [],
};

const generateNumericId = () => {
  return uuidv4().replace(/\D/g, "").slice(0, 6);
};

const initialProductData = {
  stoneCategory: "",
  stoneName: "",
  finish: null,
  thickness: "",
  units: null,
  size: {
    width: [],
    height: [],
  },
  description: "",
  media: [],
};

const CompanyDetailsForm = () => {
  const router = useRouter();
  const { isSubmitting, setIsSubmitting } = useUi();

  const { uid, authEmail } = useAuth();
  const [formData, setFormData] = useState(initialFormData);
  const [productList, setProductList] = useState([]);

  const [editIndex, setEditIndex] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedFinish, setSelectedFinish] = useState([]);
  const [selectedThickness, setSelectedThickness] = useState([]);
  const [selectedHeight, setSelectedHeight] = useState([]);
  const [selectedWidth, setSelectedWidth] = useState([]);
  const [product, setProduct] = useState(initialProductData);

  const refs = useRef({});

  const MAX_FILE_SIZE_MB = 2;

  const bindRef = (name) => (el) => {
    refs.current[name] = el;
  };
  const finishOptions = [
    "Polish",
    "Mirror Polished",
    "Flamed",
    "Honed",
    "Lapato",
    "Leather",
    "River Polished",
    "Sand Blast",
    "Shot Blast",
  ];

  const thicknessOptions = ["14MM", "16MM", "18MM", "20MM", "25MM"];
  // const heightOptions = ["2-3 ft", "4-5 ft"];
  // const widthOptions = ["5-8 ft", "8-11 ft"];
  const widthOptions =
    product.units?.value === "sqm"
      ? ["5-8 m", "8-11 m"]
      : ["5-8 ft", "8-11 ft"];
  const heightOptions =
    product.units?.value === "sqm" ? ["2-3 m", "4-5 m"] : ["2-3 ft", "4-5 ft"];
  const wrapperMap = {
    finish: () => refs.current.finishWrapper,
    thickness: () => refs.current.thicknessWrapper,
    height: () => refs.current.heightWrapper,
    width: () => refs.current.widthWrapper,
  };

  useEffect(() => {
    const onPointer = (e) => {
      if (!openDropdown) return;
      const wrap = wrapperMap[openDropdown]?.();
      if (wrap && wrap.contains(e.target)) return;
      setOpenDropdown(null);
    };
    const onKey = (e) => e.key === "Escape" && setOpenDropdown(null);
    document.addEventListener("pointerdown", onPointer, true);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer, true);
      document.removeEventListener("keydown", onKey);
    };
  }, [openDropdown]);
  const [customThickness, setCustomThickness] = useState("");
  const toggleOption = (type, value) => {
    const stateMap = {
      finish: [selectedFinish, setSelectedFinish],
      thickness: [selectedThickness, setSelectedThickness],
      height: [selectedHeight, setSelectedHeight],
      width: [selectedWidth, setSelectedWidth],
    };

    const [selected, setSelected] = stateMap[type];

    if (selected.includes(value)) {
      setSelected(selected.filter((item) => item !== value));
    } else {
      setSelected([...selected, value]);
    }
  };
  const addCustomThickness = () => {
    if (!customThickness) return;

    const newThickness = `${customThickness}MM`;
    if (!selectedThickness.includes(newThickness)) {
      setSelectedThickness((prev) => [...prev, newThickness]);
    }
    setCustomThickness("");
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let val = value;
    if (name === "pincode") val = value.replace(/\D/g, "").slice(0, 6);
    setFormData((prev) => ({
      ...prev,
      [name]: val,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // const user = auth.currentUser;
      // if (!isAuthenticated || !uid) {
      //   setShowUserLogin(true);
      //   toast.error("Please sign in before submitting the form");
      //   setIsSubmitting(false);
      //   return;
      // }
      if (!formData.image || formData.image.length === 0) {
        toast.error("Upload at least 1 Processing Unit Image", {
          duration: 1000,
        });
        setIsSubmitting(false);
        return;
      }

      const uploadFiles = async (files, folderName) => {
        const fileArray = Array.isArray(files) ? files : [files];

        return await Promise.all(
          (fileArray || []).map(async (fileObj) => {
            const file = fileObj.file || fileObj;
            const fileName = file.name || `file_${Date.now()}`;
            const fileRef = ref(
              storage,
              `EGalleryForProcessingUnit/${uid}/${folderName}/${fileName}`,
            );
            const metadata = {
              contentType: file.type,
              contentDisposition: `attachment; filename="${file.name}"`,
            };

            await uploadBytes(fileRef, file, metadata);
            const url = await getDownloadURL(fileRef);
            return { url, type: file.type };
          }),
        );
      };
      const brochureUrls = formData.brochure
        ? await uploadFiles([formData.brochure.file], "brochure")
        : [];

      // const brochureUrls = await uploadFiles(formData.brochure, "brochure");
      // const processingImages = await uploadFiles(formData.image, "images");

      const processingImages = await uploadFiles(formData.image, "images");

      const uploadedProducts = await Promise.all(
        productList.map(async (product) => {
          const uploadedMedia = await uploadFiles(
            product.media,
            `products/${product.id}`,
          );
          let uploadedThumbnail = null;
          if (product.thumbnail?.file) {
            const t = await uploadFiles(
              [product.thumbnail.file],
              `products/${product.id}`,
            );
            uploadedThumbnail = t[0];
          } else if (
            product.thumbnail?.url &&
            !String(product.thumbnail.url).startsWith("blob:")
          ) {
            uploadedThumbnail = {
              url: product.thumbnail.url,
              type: product.thumbnail.type,
            };
          }
          const { height, width, ...cleanProduct } = product;

          return {
            ...cleanProduct,
            media: uploadedMedia,
            thumbnail: uploadedThumbnail,
            units: cleanProduct.units.label,
            finish: Array.isArray(cleanProduct.finish)
              ? cleanProduct.finish
              : [],
            thickness: Array.isArray(cleanProduct.thickness)
              ? cleanProduct.thickness
              : [],

            size: {
              width: Array.isArray(cleanProduct.size?.width)
                ? cleanProduct.size.width
                : [],
              height: Array.isArray(cleanProduct.size?.height)
                ? cleanProduct.size.height
                : [],
            },
          };
        }),
      );

      const generateNumericId = () => {
        const uuid = uuidv4().replace(/\D/g, "");
        return uuid.slice(0, 6);
      };

      const orderId = generateNumericId();

      const processingData = {
        userEmail: authEmail,
        userUid: uid,
        orderId,
        companyDetails: {
          name: formData.name,
          shopName: formData.shopName,
          gstNumber: formData.gstNumber,
          email: formData.email,
          phone: formData.phone,
          country: formData.country?.label || "",
          state: formData.state?.label || "",
          city: formData.city?.label || "",
          address: formData.address,
          pincode: formData.pincode,
          about: formData.about,
          brochure: brochureUrls[0] || [],
          image: processingImages[0],
        },
        products: uploadedProducts,
        status: "pending",
        createdAt: serverTimestamp(),
      };
      console.log("processingData", processingData);
      const docRef = await addDoc(
        collection(db, "EGalleryForProcessingUnit"),
        processingData,
      );
      await setDoc(
        doc(db, "SellerDetails", uid, "EGalleryForProcessingUnit", docRef.id),
        processingData,
      );

      toast.success("Form submitted successfully!");
      setFormData(initialFormData);
      setProduct(initialProductData);
      setProductList([]);
      setSelectedFinish([]);
      setSelectedThickness([]);
      setSelectedHeight([]);
      setSelectedWidth([]);
      setEditIndex(null);

      router.push("/dashboard/profile/my-e-processing-unit");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Submit Error:", error);
      toast.error("Something went wrong during submission.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFile = (e) => {
    const files = Array.from(e.target.files);
    const addedFiles = processFiles(files, product.media || []);
    if (addedFiles.length) {
      setProduct((prev) => ({
        ...prev,
        media: [...(prev.media || []), ...addedFiles],
      }));
    }
  };

  const editProduct = (index) => {
    const p = productList[index];
    setProduct(p);
    setEditIndex(index);
    setSelectedFinish(p.finish || []);

    setSelectedThickness(p.thickness || []);
    setSelectedHeight(p.size.height || []);
    setSelectedWidth(p.size.width || []);

    setTimeout(() => {
      refs.current.stoneCategory?.focus();
      refs.current.stoneCategory?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 100);
  };

  const editCancel = () => {
    setProduct(initialProductData);
    setEditIndex(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddproduct = () => {
    const requiredFields = [
      "stoneCategory",
      "stoneName",
      "finish",
      "thickness",
      "units",
      "size",
    ];
    const formatKey = (key) =>
      key
        .replace(/_/g, " ")
        .replace(/([A-Z])/g, " $1")
        .trim()
        .toLowerCase();

    const sizesObj = {
      width: selectedWidth.length > 0 ? [...selectedWidth] : [],
      height: selectedHeight.length > 0 ? [...selectedHeight] : [],
    };

    const tempProduct = {
      ...product,
      id: editIndex !== null ? product.id : generateNumericId(),
      finish: selectedFinish.length > 0 ? [...selectedFinish] : null,
      thickness: selectedThickness.length > 0 ? [...selectedThickness] : null,
      size: sizesObj,
    };

    const focusField = (key) => {
      const dropdownKeys = new Set(["finish", "thickness", "height", "width"]);

      if (dropdownKeys.has(key)) {
        setOpenDropdown(key);
        setTimeout(() => {
          const el = refs.current[key];
          el?.focus?.();
          el?.scrollIntoView?.({ behavior: "smooth", block: "center" });
        }, 100);
      } else if (key === "units") {
        const el = refs.current.units;
        el?.focus?.();
        el?.scrollIntoView?.({ behavior: "smooth", block: "center" });
      } else {
        const el = document.querySelector(`[name="${key}"]`);
        el?.focus?.();
        el?.scrollIntoView?.({ behavior: "smooth", block: "center" });
      }
    };

    for (const key of requiredFields) {
      const value = tempProduct[key];
      const fieldName = formatKey(key);

      const isEmpty =
        value === "" ||
        value === null ||
        (Array.isArray(value) && value.length === 0);

      if (isEmpty) {
        toast.error(`Please Enter The ${fieldName}`, { duration: 1000 });
        focusField(key);
        return;
      }
    }
    if (tempProduct.size?.height?.length === 0) {
      toast.error("Please select height");
      return;
    }
    if (tempProduct.size?.width?.length === 0) {
      toast.error("Please select width");
      return;
    }
    const hasImage = tempProduct.media?.some((m) =>
      m.type?.startsWith("image/"),
    );

    if (!hasImage) {
      toast.error("Please upload at least 1 image");
      return;
    }

    if (editIndex !== null) {
      setProductList((prev) =>
        prev.map((p, i) => (i === editIndex ? tempProduct : p)),
      );
      toast.success("Product updated successfully!");
      setEditIndex(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setProductList((prev) => [...prev, tempProduct]);
      toast.success("Product added successfully!");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    setProduct(initialProductData);
    setSelectedFinish([]);
    setSelectedThickness([]);
    setSelectedHeight([]);
    setSelectedWidth([]);
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

  const handleSingleFileUpload = (e, type) => {
    const file = e?.target?.files?.[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      toast.error(`${file.name} exceeds ${MAX_FILE_SIZE_MB}MB limit`);
      return;
    }

    const fileObj = {
      file,
      url: URL.createObjectURL(file),
      type: file.type,
      name: file.name,
    };

    setFormData((prev) => ({
      ...prev,
      [type]: fileObj,
    }));
  };

  return (
    <div className="relative">
      <form
        onSubmit={handleSubmit}
        className="max-md:space-y-5 md:flex justify-center mt-4 md:mt-7 gap-5 xl:gap-10"
      >
        <div className="shadow-lg md:shadow-2xl p-4 rounded-lg md:w-3/5 space-y-2 md:space-y-4">
          <h2 className="text-xs font-medium mb-1">Processing Unit Details</h2>
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
                    Processing Unit Name
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
                  <label
                    htmlFor="gstNumber"
                    className="mb-0.5 text-xs font-medium"
                  >
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
                  onChange={(data) =>
                    setFormData((prev) => ({ ...prev, ...data }))
                  }
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
                  <label
                    htmlFor="pincode"
                    className="mb-0.5 text-xs font-medium"
                  >
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
                  About Processing Unit
                </label>
                <textarea
                  id="about"
                  placeholder="Write here"
                  required
                  rows={4}
                  value={formData.about}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md p-2 text-xs outline-none"
                  name="about"
                ></textarea>
              </div>
              <div className="w-full">
                <label
                  htmlFor="brochure"
                  className="mb-0.5 text-xs font-medium"
                >
                  Upload Brochure
                </label>
                <div className="border border-dashed  border-primary rounded-lg p-6 text-center text-gray-600 relative bg-white transition min-h-[100px] flex flex-col justify-center items-center">
                  <input
                    id="brochure"
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept=".pdf,application/pdf"
                    name="brochure"
                    onChange={(e) => handleSingleFileUpload(e, "brochure")}
                  />
                  <FiUpload size={20} className="mb-2 text-gray-900" />
                  <p className="text-[#2C2C2C] text-[10px] md:text-xs font-medium tracking-wide pointer-events-none mb-1">
                    Choose a file
                  </p>
                  <span className="text-[8px] product mb-2 text-gray-500 tracking-wide leading-relaxed pointer-events-none">
                    up to 2MB
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
                        onClick={() =>
                          document.getElementById("brochure").click()
                        }
                        className="border font-medium text-sm px-6 py-1 rounded-xl hover:border-primary cursor-pointer hover:shadow-md transition-colors pointer-events-auto relative z-10"
                      >
                        Browse
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div className="w-full mt-5">
                <label htmlFor="image" className="mb-0.5 text-xs ">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium mb-0.5">
                      Upload Processing Unit Image
                    </span>
                    <span className="text-[11px] mb-2 text-[#8F8F8F] font-normal">
                      <span className="text-red-500 ml-0.5">*</span> For
                      Processing Unit profile Image
                    </span>
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
                    accept="image/*"
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
                      className="bg-gray-100 hover:shadow-lg text-gray-700 text-[10px] md:text-xs px-2 md:px-4 py-1.5 rounded-md  hover:bg-gray-200 font-medium"
                    >
                      Choose Photo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {(productList.length < 2 || editIndex !== null) && (
            <div>
              <h2 className="text-xs font-medium mb-1">
                Stone Details
                <span className="text-[#CDCDCD] font-normal">
                  {" "}
                  (Add Multiple Products)
                </span>
              </h2>
              <SlabDetailsForm
                product={product}
                setProduct={setProduct}
                refs={refs}
                bindRef={bindRef}
                openDropdown={openDropdown}
                setOpenDropdown={setOpenDropdown}
                finishOptions={finishOptions}
                thicknessOptions={thicknessOptions}
                heightOptions={heightOptions}
                widthOptions={widthOptions}
                selectedFinish={selectedFinish}
                selectedThickness={selectedThickness}
                selectedHeight={selectedHeight}
                selectedWidth={selectedWidth}
                setSelectedHeight={setSelectedHeight}
                setSelectedWidth={setSelectedWidth}
                toggleOption={toggleOption}
                customThickness={customThickness}
                setCustomThickness={setCustomThickness}
                addCustomThickness={addCustomThickness}
                handleFile={handleFile}
                editIndex={editIndex}
                editCancel={editCancel}
                handleAddproduct={handleAddproduct}
              />
            </div>
          )}
        </div>
        <div className="md:w-2/5">
          {productList.length === 0 && (
            <div
              className="cursor-pointer bg-[#F4F4F4] text-[#3B3B3B] gap-1 text-xs lg:text-sm py-2 rounded-lg flex items-center justify-center"
              onClick={() => {
                if (refs.current.stoneCategory) {
                  refs.current.stoneCategory.focus();
                }
                toast.error("Please fill all fields in product details", {
                  duration: 2000,
                });
              }}
            >
              <span>
                <FaPlus />
              </span>
              Add Product
            </div>
          )}
          <ProductView
            productList={productList}
            setProductList={setProductList}
            editIndex={editIndex}
            editProduct={editProduct}
            formData={formData}
          />
          {productList.length > 0 && editIndex === null && (
            <div className="flex justify-end gap-2 mt-5 text-xs md:text-sm">
              <button
                className={`cursor-pointer px-4 py-1 border border-gray-400 rounded-lg ${
                  isSubmitting ? "cursor-not-allowed opacity-50" : ""
                }`}
                onClick={() => {
                  setFormData(initialFormData);
                  setProductList([]);
                  setProductList(initialProductData);

                  toast.success("Data cleared successfully", {
                    duration: 2000,
                  });
                }}
                disabled={isSubmitting}
              >
                Clear
              </button>
              <button
                type="submit"
                className={`cursor-pointer px-4 py-1 bg-primary hover:bg-[#6a1545] rounded-lg text-white ${
                  isSubmitting ? "cursor-not-allowed opacity-50" : ""
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin h-5 w-5 text-white mr-1"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Submitting...</span>
                  </div>
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default CompanyDetailsForm;
