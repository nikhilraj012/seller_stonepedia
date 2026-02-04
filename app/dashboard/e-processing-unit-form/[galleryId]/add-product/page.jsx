"use client";
import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import { db, storage } from "@/app/firebase/config";
import { processFiles } from "@/app/utils/fileUtils";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { FiUpload } from "react-icons/fi";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { FaPlus } from "react-icons/fa6";
import Select from "react-select";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import ProductView from "../../ProductView";
import { useUi } from "@/app/components/context/UiContext";
import { useAuth } from "@/app/components/context/AuthContext";
import {
  selectCommonStyles,
  selectCommonTheme,
} from "@/app/components/styles/select.config";
import { useRouter, useParams } from "next/navigation";

const AddSlabPage = () => {
  const router = useRouter();
  const params = useParams();
  const galleryId = params.galleryId;
  const generateNumericId = () => {
    return uuidv4().replace(/\D/g, "").slice(0, 6);
  };
  const makeInitialProduct = () => ({
    id: generateNumericId(),
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
  });

  const MAX_IMAGE = 8;
  const MAX_VIDEO = 8;
  const MAX_PDF_SIZE_MB = 2;
  const MAX_IMAGE_SIZE_MB = 2;
  const MAX_VIDEO_SIZE_MB = 5;

  const { isSubmitting, setIsSubmitting } = useUi();

  const { isAuthenticated, uid, authEmail } = useAuth();

  const [product, setProduct] = useState(makeInitialProduct());

  const [productList, setProductList] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const [selectedFinish, setSelectedFinish] = useState([]);
  const [selectedThickness, setSelectedThickness] = useState([]);
  const [selectedHeight, setSelectedHeight] = useState([]);
  const [selectedWidth, setSelectedWidth] = useState([]);

  const [openDropdown, setOpenDropdown] = useState(null);
  const finishRef = useRef(null);
  const finishWrapperRef = useRef(null);
  const thicknessRef = useRef(null);
  const thicknessWrapperRef = useRef(null);
  const heightRef = useRef(null);
  const heightWrapperRef = useRef(null);
  const widthRef = useRef(null);
  const widthWrapperRef = useRef(null);

  const stoneCategoryRef = useRef(null);
  const unitsRef = useRef(null);

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
  const widthOptions =
    product.units?.value === "sqm"
      ? ["5-8 m", "8-11 m"]
      : ["5-8 ft", "8-11 ft"];
  const heightOptions =
    product.units?.value === "sqm" ? ["2-3 m", "4-5 m"] : ["2-3 ft", "4-5 ft"];
  const wrapperMap = {
    finish: finishWrapperRef,
    thickness: thicknessWrapperRef,
    height: heightWrapperRef,
    width: widthWrapperRef,
  };
  useEffect(() => {
    const handlePointerDown = (e) => {
      if (!openDropdown) return;
      const wrapperRef = wrapperMap[openDropdown];
      if (wrapperRef?.current && wrapperRef.current.contains(e.target)) {
        return;
      }
      setOpenDropdown(null);
    };

    const handleKey = (e) => {
      if (e.key === "Escape") setOpenDropdown(null);
    };
    document.addEventListener("pointerdown", handlePointerDown, true);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown, true);
      document.removeEventListener("keydown", handleKey);
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
  const handleProductChange = (e) => {
    const { name, value } = e.target;
    let val = value;
    setProduct((prev) => ({
      ...prev,
      [name]: val,
    }));
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
    setSelectedHeight(p.size && p.size.height ? [...p.size.height] : []);
    setSelectedWidth(p.size && p.size.width ? [...p.size.width] : []);

    setTimeout(() => {
      stoneCategoryRef.current?.focus();
      stoneCategoryRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 100);
  };

  const editCancel = () => {
    setProduct(makeInitialProduct());
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
      // id: product.id || uuidv4(),
      id: product.id || generateNumericId(),
      finish: selectedFinish.length > 0 ? [...selectedFinish] : null,
      thickness: selectedThickness.length > 0 ? [...selectedThickness] : null,
      size: sizesObj,
    };
    for (const key of requiredFields) {
      const value = tempProduct[key];
      const fieldName = formatKey(key);
      if (
        value === "" ||
        value === null ||
        (Array.isArray(value) && value.length === 0) ||
        (typeof value === "object" && Object.keys(value).length === 0)
      ) {
        toast.error(`Please Enter The ${fieldName}`, { duration: 1000 });
        if (key === "finish") {
          setOpenDropdown("finish");
          setTimeout(() => finishRef.current?.focus(), 100);
        }
        if (key === "finish") {
          setOpenDropdown("finish");
          setTimeout(() => finishRef.current?.focus(), 100);
        } else if (key === "thickness") {
          setOpenDropdown("thickness");
          setTimeout(() => thicknessRef.current?.focus(), 100);
        } else if (key === "units") unitsRef.current?.focus?.();
        else if (key === "height") {
          setOpenDropdown("height");
          setTimeout(() => heightRef.current?.focus(), 100);
        } else if (key === "width") {
          setOpenDropdown("width");
          setTimeout(() => widthRef.current?.focus(), 100);
        } else document.querySelector(`[name="${key}"]`)?.focus();
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
    if (!tempProduct.media || tempProduct.media.length === 0) {
      toast.error("Upload at least 1 image or video", { duration: 1000 });
      return;
    }

    if (editIndex !== null) {
      setProductList((prev) =>
        prev.map((p, i) => (i === editIndex ? tempProduct : p)),
      );
      toast.success("Product updated successfully!");
      setEditIndex(null);
    } else {
      setProductList((prev) => [...prev, tempProduct]);

      toast.success("Product added successfully!");
    }

    setProduct(makeInitialProduct());
    setSelectedFinish([]);
    setSelectedThickness([]);
    setSelectedHeight([]);
    setSelectedWidth([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!galleryId) {
      toast.error("Gallery not found!");
      setIsSubmitting(false);
      return;
    }

    if (productList.length === 0) {
      toast.error("Add at least 1 slab");
      return;
    }
    try {
      console.log("productList before upload:", productList);
      const uploadFiles = async (files, folderName) => {
        return await Promise.all(
          (files || []).map(async (fileObj) => {
            const file = fileObj.file || fileObj;
            const fileName = file.name || `file_${Date.now()}`;
            const fileRef = ref(
              storage,
              `EGalleryForProcessingUnit/${uid}/${folderName}/${fileName}`,
            );
            await uploadBytes(fileRef, file);
            const url = await getDownloadURL(fileRef);
            return { url, type: file.type };
          }),
        );
      };
      const newProducts = await Promise.all(
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
            uploadedThumbnail = t[0] || null;
          } else if (
            product.thumbnail?.url &&
            !String(product.thumbnail.url).startsWith("blob:")
          ) {
            uploadedThumbnail = {
              url: product.thumbnail.url,
              type: product.thumbnail.type || "image/*",
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
      const galleryRef = doc(db, "EGalleryForProcessingUnit", galleryId);
      const gallerySnap = await getDoc(galleryRef);
      let oldProducts = [];
      if (gallerySnap.exists()) {
        oldProducts = gallerySnap.data().products || [];
      }
      const mergedProducts = [...oldProducts, ...newProducts];

      await updateDoc(galleryRef, {
        products: mergedProducts,
      });

      const userGalleryRef = doc(
        db,
        "SellerDetails",
        uid,
        "EGalleryForProcessingUnit",
        galleryId,
      );
      const userSnap = await getDoc(userGalleryRef);
      const oldUserProducts = userSnap.exists()
        ? userSnap.data().products || []
        : [];

      await setDoc(
        userGalleryRef,
        {
          products: [...oldUserProducts, ...newProducts],
        },
        { merge: true },
      );

      toast.success("New slabs added successfully!");
      setIsSubmitting(false);
      setProductList([]);
      window.scrollTo({ top: 0, behavior: "smooth" });
      router.push("/dashboard/profile/my-e-processing-unit");
    } catch (err) {
      console.log(err);
      setIsSubmitting(false);
      toast.error("Error while adding slabs!");
    }
  };
  useEffect(() => {
    if (isSubmitting) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isSubmitting]);
  return (
    <div className="py-16 max-lg:px-4 lg:mx-24 xl:mx-32">
      {isSubmitting && (
        <div className="fixed inset-0 bg-black/10 z-50 flex items-center justify-center">
          <img
            src="/images/logo1.png"
            alt="Loading"
            className="w-20 md:w-24 animate-pulse"
          />
        </div>
      )}
      <div className="flex justify-center my-2">
        <h1 className="rounded-full border border-primary px-6 py-2 text-primary font-semibold lg:text-xl text-center">
          Add Product
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-md:space-y-5  md:flex   gap-5 xl:gap-10"
      >
        <div className="p-4 rounded-lg md:w-3/5 space-y-2 md:space-y-4">
          <div className="border border-dashed border-[#000000]/20 rounded-lg p-2 md:p-4 space-y-1 md:space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 w-full">
              <div className="w-full flex flex-col">
                <label
                  htmlFor="stoneCategory"
                  className="mb-0.5 text-xs font-medium"
                >
                  Stone Category
                </label>
                <div className="rounded-lg p-px transition bg-transparent focus-within:bg-linear-to-t focus-within:from-[#d6c9ea] focus-within:to-primary">
                  <div className="flex items-center gap-2 rounded-lg bg-white border border-[#D7D7D7] transition focus-within:border-transparent">
                    <input
                      id="stoneCategory"
                      type="text"
                      ref={stoneCategoryRef}
                      placeholder="Travertine"
                      value={product.stoneCategory}
                      onChange={handleProductChange}
                      className="flex-1 bg-transparent outline-none border-0 p-3 text-xs w-full"
                      name="stoneCategory"
                    />
                  </div>
                </div>
              </div>
              <div className="w-full flex flex-col">
                <label
                  htmlFor="stoneName"
                  className="mb-0.5 text-xs font-medium"
                >
                  Stone Name
                </label>
                <div className="rounded-lg p-px transition bg-transparent focus-within:bg-linear-to-t focus-within:from-[#d6c9ea] focus-within:to-primary">
                  <div className="flex items-center gap-2 rounded-lg bg-white border border-[#D7D7D7] transition focus-within:border-transparent">
                    <input
                      id="stoneName"
                      type="text"
                      placeholder="Stonepedia White Marble"
                      value={product.stoneName}
                      onChange={handleProductChange}
                      className="flex-1 bg-transparent outline-none border-0 p-3 text-xs w-full"
                      name="stoneName"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div ref={finishWrapperRef} className="relative">
              <label className="text-xs font-medium mb-0.5 block">
                Add Stone Finishes
              </label>
              <div className="rounded-lg p-px transition bg-transparent outline-none ">
                <div
                  ref={finishRef}
                  tabIndex={0}
                  className="flex items-center justify-between gap-2 rounded-lg bg-white border border-[#D7D7D7] p-3 text-xs cursor-pointer transition"
                  onClick={() =>
                    setOpenDropdown(openDropdown === "finish" ? null : "finish")
                  }
                >
                  <span
                    className={`truncate ${
                      selectedFinish.length > 0 ? "text-black" : "text-gray-400"
                    }`}
                  >
                    {selectedFinish.length === 0 ? "Select Finish" : "Finish"}
                  </span>
                  {openDropdown === "finish" ? (
                    <IoIosArrowUp className="text-gray-500" />
                  ) : (
                    <IoIosArrowDown className="text-gray-500" />
                  )}
                </div>
              </div>
              {openDropdown === "finish" && (
                <div className="absolute mt-1 w-full border border-gray-300 rounded-md bg-white shadow  z-10">
                  {finishOptions.map((opt) => (
                    <label
                      htmlFor={`finish-${opt}`}
                      key={opt}
                      className="flex items-center gap-2 p-2 text-xs hover:bg-gray-100 cursor-pointer"
                    >
                      <input
                        id={`finish-${opt}`}
                        name="finish"
                        type="checkbox"
                        checked={selectedFinish.includes(opt)}
                        onChange={() => toggleOption("finish", opt)}
                        className="accent-primary cursor-pointer bg-transparent outline-none border-none"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              )}
            </div>
            {selectedFinish.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {selectedFinish.map((item) => (
                  <div
                    key={item}
                    className="relative group px-3 md:px-4 py-[10px] bg-[#F2F2F2] text-[#000000] text-[12px] rounded-md font-normal flex items-center"
                  >
                    {item}

                    <button
                      onClick={() => toggleOption("finish", item)}
                      className="absolute -top-1 -right-1 hidden group-hover:flex items-center cursor-pointer justify-center w-3 h-3 bg-gray-400 text-white text-[10px] rounded-full"
                    >
                      <RxCross2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div ref={thicknessWrapperRef} className="relative">
              <label
                htmlFor="thickness"
                className="text-xs font-medium mb-0.5 block"
              >
                Add Stone Thickness
              </label>
              <div className="rounded-lg p-px transition bg-transparent outline-none">
                <div
                  ref={thicknessRef}
                  tabIndex={0}
                  className="flex items-center justify-between gap-2 rounded-lg bg-white border border-[#D7D7D7] p-3 text-xs cursor-pointer transition"
                  onClick={() =>
                    setOpenDropdown(
                      openDropdown === "thickness" ? null : "thickness",
                    )
                  }
                >
                  <span
                    className={`truncate ${
                      selectedThickness.length > 0
                        ? "text-black"
                        : "text-gray-400"
                    }`}
                  >
                    {selectedThickness.length === 0
                      ? "Select Thickness"
                      : "Thickness"}
                  </span>
                  {openDropdown === "thickness" ? (
                    <IoIosArrowUp className="text-gray-500" />
                  ) : (
                    <IoIosArrowDown className="text-gray-500" />
                  )}
                </div>
              </div>
              {openDropdown === "thickness" && (
                <div className="absolute mt-1 w-full border border-gray-300 rounded-md bg-white shadow max-h-60 overflow-y-auto z-10">
                  {thicknessOptions.map((opt) => (
                    <label
                      htmlFor={`thickness-${opt}`}
                      key={opt}
                      className="flex items-center gap-2 p-2 text-xs hover:bg-gray-100 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        id={`thickness-${opt}`}
                        name="thickness"
                        checked={selectedThickness.includes(opt)}
                        onChange={() => toggleOption("thickness", opt)}
                        className="accent-primary cursor-pointer bg-transparent outline-none border-none"
                      />
                      {opt}
                    </label>
                  ))}
                  <div className="p-2 border-t border-gray-200">
                    <div className="text-sm font-medium mb-1">Custom Size</div>

                    <div className="flex items-center  gap-2 w-full">
                      <input
                        id="custom-thickness"
                        type="number"
                        value={customThickness}
                        onChange={(e) => setCustomThickness(e.target.value)}
                        placeholder="Considered in MM"
                        className="flex-1  h-8 min-w-0 w-full not-even: px-2 py-1 text-[11px] border border-gray-300 rounded-md outline-none"
                      />

                      <button
                        type="button"
                        onClick={() => addCustomThickness()}
                        disabled={!customThickness.trim()}
                        className={`shrink-0 px-4 h-8 text-[11px] rounded-md text-white
                  ${
                    !customThickness.trim()
                      ? "bg-primary/70 cursor-not-allowed"
                      : "bg-primary"
                  }`}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {selectedThickness.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedThickness.map((item) => (
                    <div
                      key={item}
                      className="relative group px-3 md:px-4 py-[10px] bg-[#F2F2F2] text-[#000000] text-[12px] rounded-md font-normal flex items-center"
                    >
                      {item}
                      <button
                        onClick={() => toggleOption("thickness", item)}
                        className="absolute -top-1 -right-1 hidden group-hover:flex items-center cursor-pointer justify-center w-3 h-3 bg-gray-400 text-white text-[10px] rounded-full"
                      >
                        <RxCross2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div className="md:col-span-1">
                <label htmlFor="units" className="mb-0.5 font-medium text-xs">
                  Units
                </label>
                <div className="cols-span-1 gap-3">
                  <Select
                    ref={unitsRef}
                    options={[
                      { label: "SQM", value: "sqm" },
                      { label: "SQFT", value: "sqft" },
                    ]}
                    value={product.units}
                    onChange={(label) => {
                      setProduct((prev) => ({
                        ...prev,
                        units: label,
                        height: null,
                        width: null,
                      }));
                      setSelectedHeight([]);
                      setSelectedWidth([]);
                    }}
                    onMenuOpen={() => setOpenDropdown(null)}
                    placeholder="Units"
                    name="units"
                    id="units"
                    className="text-xs"
                    styles={selectCommonStyles}
                    theme={selectCommonTheme}
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="mb-0.5 font-medium text-xs">
                  Size of Stone (W × H)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div ref={heightWrapperRef} className="relative">
                    <div className="rounded-lg p-px transition bg-transparent outline-none">
                      <div
                        ref={heightRef}
                        tabIndex={0}
                        className="flex items-center justify-between gap-2 rounded-lg bg-white border border-[#D7D7D7] p-3 text-xs cursor-pointer transition"
                        onClick={() =>
                          setOpenDropdown(
                            openDropdown === "height" ? null : "height",
                          )
                        }
                      >
                        <span
                          className={`truncate ${
                            selectedHeight.length > 0
                              ? "text-black"
                              : "text-gray-400"
                          }`}
                        >
                          {selectedHeight.length === 0
                            ? "Select Height"
                            : "Height"}
                        </span>
                        {openDropdown === "height" ? (
                          <IoIosArrowUp className="text-gray-500" />
                        ) : (
                          <IoIosArrowDown className="text-gray-500" />
                        )}
                      </div>
                    </div>
                    {openDropdown === "height" && (
                      <div className="absolute mt-1 w-full border border-gray-300 rounded-md bg-white shadow max-h-40 overflow-y-auto z-10">
                        {heightOptions.map((opt) => (
                          <label
                            htmlFor={`height-${opt}`}
                            key={opt}
                            className="flex items-center gap-2 p-2 text-xs hover:bg-gray-100 cursor-pointer"
                          >
                            <input
                              id={`height-${opt}`}
                              name="height"
                              type="checkbox"
                              checked={selectedHeight.includes(opt)}
                              onChange={() => toggleOption("height", opt)}
                              className="bg-transparent outline-none border-none cursor-pointer accent-primary"
                            />
                            {opt}
                          </label>
                        ))}
                      </div>
                    )}
                    {selectedHeight.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {selectedHeight.map((item) => (
                          <div
                            key={item}
                            className="relative group  px-3   md:px-4 xl:px-6 py-[10px] bg-[#F2F2F2] text-[#000000] text-[12px] rounded-md font-normal flex items-center"
                          >
                            {item}
                            <button
                              onClick={() => toggleOption("height", item)}
                              className="absolute -top-1 -right-1 hidden group-hover:flex items-center cursor-pointer justify-center w-3 h-3 bg-gray-400 text-white text-[10px] rounded-full"
                            >
                              <RxCross2 size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div ref={widthWrapperRef} className="relative">
                    <div className="rounded-lg p-px transition bg-transparent outline-none">
                      <div
                        ref={widthRef}
                        tabIndex={0}
                        className="flex items-center justify-between gap-2 rounded-lg bg-white border border-[#D7D7D7] p-3 text-xs cursor-pointer transition"
                        onClick={() =>
                          setOpenDropdown(
                            openDropdown === "width" ? null : "width",
                          )
                        }
                      >
                        <span
                          className={`truncate ${
                            selectedWidth.length > 0
                              ? "text-black"
                              : "text-gray-400"
                          }`}
                        >
                          {selectedWidth.length === 0
                            ? "Select Width"
                            : "Width"}
                        </span>
                        {openDropdown === "width" ? (
                          <IoIosArrowUp className="text-gray-500" />
                        ) : (
                          <IoIosArrowDown className="text-gray-500" />
                        )}
                      </div>
                    </div>
                    {openDropdown === "width" && (
                      <div className="absolute mt-1 w-full border border-gray-300 rounded-md bg-white shadow max-h-40 overflow-y-auto z-10">
                        {widthOptions.map((opt) => (
                          <label
                            htmlFor={`width-${opt}`}
                            key={opt}
                            className="flex items-center gap-2 p-2 text-xs hover:bg-gray-100 cursor-pointer"
                          >
                            <input
                              id={`width-${opt}`}
                              name="width"
                              type="checkbox"
                              checked={selectedWidth.includes(opt)}
                              onChange={() => toggleOption("width", opt)}
                              className="accent-primary cursor-pointer bg-transparent outline-none border-none"
                            />
                            {opt}
                          </label>
                        ))}
                      </div>
                    )}
                    {selectedWidth.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {selectedWidth.map((item) => (
                          <div
                            key={item}
                            className="relative group px-3 md:px-4 xl:px-6  py-[10px] bg-[#F2F2F2] text-[#000000] text-[12px] rounded-md font-normal flex items-center"
                          >
                            {item}
                            <button
                              onClick={() => toggleOption("width", item)}
                              className="absolute -top-1 -right-1 hidden group-hover:flex items-center cursor-pointer justify-center w-3 h-3 bg-gray-400 text-white text-[10px] rounded-full"
                            >
                              <RxCross2 size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
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
                placeholder="Write Your Description"
                rows={4}
                value={product.description}
                onChange={handleProductChange}
                className="w-full border border-gray-300 rounded-md p-2 text-xs outline-none"
                name="description"
              ></textarea>
            </div>
            <div className="w-full">
              <label htmlFor="media" className="mb-0.5 text-xs font-medium">
                Upload image/Video
              </label>
              <div className="border border-dashed border-primary rounded-lg p-6 text-center text-gray-600 relative bg-white hover:shadow-md transition min-h-[100px] flex flex-col justify-center items-center">
                <input
                  id="media"
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  accept="video/*,image/*"
                  name="media"
                  multiple
                  onChange={handleFile}
                />
                <FiUpload size={20} className="mb-2 text-gray-900" />
                <p className="text-[#2C2C2C] text-[10px] md:text-xs font-medium tracking-wide pointer-events-none mb-1">
                  Choose a Image/Video
                </p>
                <span className="text-[8px] product mb-2 text-gray-500 tracking-wide leading-relaxed pointer-events-none">
                  Image up to 2MB,Video up to 5MB
                </span>
                <div className="h-6">
                  {product.media?.length > 0 ? (
                    <p className="text-[#2C2C2C] text-[10px] font-medium">{`Uploaded ${product.media.length}`}</p>
                  ) : (
                    <button
                      type="button"
                      onClick={() => document.getElementById("media").click()} // <-- media here
                      className="inline-product bg-white border font-medium text-sm px-6 py-1 rounded-xl shadow-sm hover:bg-primary hover:text-white hover:shadow-md transition"
                    >
                      Browse
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              {/* {editIndex != null && (
                <button
                  type="button"
                  onClick={editCancel}
                  disabled={editIndex === null}
                  className="px-4 py-2 md:px-8 border border-gray-300 rounded-md text-gray-700 text-xs cursor-pointer hover:bg-gray-50"
                >
                  Cancel
                </button>
              )} */}
              {(productList.length < 1 || editIndex !== null) && (
                <button
                  type="button"
                  onClick={handleAddproduct}
                  className="bg-primary hover:bg-[#6a1545] px-4 py-2 md:px-8 lg:px-10 xl:px-14 rounded-md text-white text-xs cursor-pointer"
                >
                  {editIndex != null ? "Save Changes" : "Add Product"}
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="md:w-2/5 md:mt-4">
          {productList.length < 1 && (
            <div
              className="cursor-pointer bg-[#F4F4F4] text-[#3B3B3B] gap-1 text-xs lg:text-sm py-2 rounded-lg flex items-center justify-center"
              onClick={() => {
                if (stoneCategoryRef.current) {
                  stoneCategoryRef.current.focus();
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
          />
          {productList.length > 0 && editIndex === null && (
            <div className="flex justify-end gap-2 mt-5 text-xs md:text-sm">
              <button
                className={`cursor-pointer px-4 py-1 border border-gray-400 rounded-lg ${
                  isSubmitting ? "cursor-not-allowed opacity-50" : ""
                }`}
                onClick={() => {
                  setProductList([]);
                  setSelectedFinish([]);
                  setSelectedThickness([]);
                  setSelectedHeight([]);
                  setSelectedWidth([]);
                  setEditIndex(null);

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
                {isSubmitting ? <>Submitting...</> : "Submit"}
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddSlabPage;
