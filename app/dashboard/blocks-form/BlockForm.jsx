"use client";
import { useState, useEffect, useRef } from "react";
import { CiMail, CiMobile3 } from "react-icons/ci";
import { LuUserRound } from "react-icons/lu";
import { Country, State, City } from "country-state-city";
import Select from "react-select";
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
} from "react-icons/md";

import { FiUpload } from "react-icons/fi";
import { FaPlus } from "react-icons/fa6";
import toast from "react-hot-toast";
// import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import {
//   collection,
//   addDoc,
//   serverTimestamp,
//   setDoc,
//   doc,
// } from "firebase/firestore";
// import { db, auth } from "../../../../firebase/config";

import { v4 as uuidv4 } from "uuid";

import { useUi } from "@/app/components/context/UiContext";
import { useAuth } from "@/app/components/context/AuthContext";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/app/firebase/config";
import BlocksFormProducts from "./BlocksFormProducts";
import { useParams, useRouter, useSearchParams } from "next/navigation";

const BlockForm = () => {
  const router = useRouter();
  const { blockId } = useParams();

  const hasApprovedForm = Boolean(blockId);

  const [isEditMode, setIsEditMode] = useState(false);
  const [editingBlockId, setEditingBlockId] = useState(null);
  const firstInputRef = useRef(null);
  const { isSubmitting, setIsSubmitting } = useUi();
  const { uid, authEmail } = useAuth();

  const [formData, setFormData] = useState({
    quarryName: "",
    quarryPincode: "",
    websiteUrl: "",
    emailId: "",
    quarryCountry: null,
    quarryState: null,
    quarryCity: null,
    address: "",
    phone: "",
  });

  const [block, setBlock] = useState({
    id: uuidv4(),
    stoneCategory: "",
    stoneName: "",
    origin: null,
    portName: "",
    units: null,
    height: "",
    width: "",
    length: "",
    supplyCapacity: "",
    quantity: "",
    minimumOrder: "",
    symbolA: null,
    priceA: "",
    symbolB: null,
    priceB: "",
    symbolC: null,
    priceC: "",
    videos: [],
    images: [],
    documents: [],
    description: "",
    thumbnail: null,
  });

  const [blocksList, setBlocksList] = useState([]);

  // Add event listener for edit block functionality
  useEffect(() => {
    const handleEditBlock = (event) => {
      const { block: editBlock } = event.detail;
      if (editBlock) {
        // Set the form with the block data
        setBlock(editBlock);

        // Enable edit mode and store the block ID
        setIsEditMode(true);
        setEditingBlockId(editBlock.id);

        // Scroll to the form
        window.scrollTo({ top: 0, behavior: "smooth" });

        // Show success message
        toast.success("Block loaded for editing", {
          duration: 2000,
        });

        // Focus on the first input field after a short delay to ensure the form is rendered
        setTimeout(() => {
          if (firstInputRef.current) {
            firstInputRef.current.focus();
          }
        }, 100);
      }
    };

    // Add event listener
    window.addEventListener("editBlock", handleEditBlock);

    // Clean up
    return () => {
      window.removeEventListener("editBlock", handleEditBlock);
    };
  }, []);

  const countryOptions = Country.getAllCountries().map((c) => ({
    label: `${c.name}`,
    value: c.isoCode,
    phonecode: c.phonecode,
    phone: c.phone,
  }));

  // Helper function to get states for a given country
  const getStateOptions = (country) => {
    if (!country) return [];
    return State.getStatesOfCountry(country.value).map((s) => ({
      label: s.name,
      value: s.isoCode,
    }));
  };

  // Helper function to get cities for a given state and country
  const getCityOptions = (country, state) => {
    if (!country || !state) return [];
    return City.getCitiesOfState(country.value, state.value).map((c) => ({
      label: c.name,
      value: c.name,
    }));
  };

  // Options for personal address
  const stateOptions = getStateOptions(formData.quarryCountry);
  const cityOptions = getCityOptions(
    formData.quarryCountry,
    formData.quarryState,
  );

  // Handle increment button click
  const handleIncrement = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Get current value, if empty or NaN, start from 0
    const currentValue = parseInt(formData.minimumOrder) || 0;

    // Increment by 1
    setFormData({
      ...formData,
      minimumOrder: (currentValue + 1).toString(),
    });
  };

  // Handle decrement button click
  const handleDecrement = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Get current value, if empty or NaN, use 0
    const currentValue = parseInt(formData.minimumOrder) || 0;

    // Only decrement if greater than 0
    if (currentValue > 0) {
      setFormData({
        ...formData,
        minimumOrder: (currentValue - 1).toString(),
      });
    }
  };

  const handleFile = (e, type, targetBlockId = null) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const maxSize =
      type === "videos"
        ? 5 * 1024 * 1024
        : type === "images"
          ? 2 * 1024 * 1024
          : 2 * 1024 * 1024;

    const maxFiles = type === "videos" ? 1 : 3; // Limit number of files
    const maxDocuments = 1; // Limit documents to 1 file
    const validFiles = [];
    let hasError = false;

    // Special handling for thumbnail type
    if (type === "thumbnail") {
      // For thumbnail, only allow one file
      if (files.length > 1) {
        toast.error("Only one thumbnail can be uploaded", {
          duration: 1000,
        });
        e.target.value = "";
        return;
      }

      // Check file size for thumbnail (5MB limit)
      if (files[0].size > 2 * 1024 * 1024) {
        toast.error(`${files[0].name} exceeds 2MB limit`, {
          duration: 2000,
        });
        e.target.value = "";
        return;
      }

      // If targetBlockId is provided, update the thumbnail for that specific block
      if (targetBlockId) {
        setBlocksList((prevBlocks) =>
          prevBlocks.map((b) => {
            if (b.id === targetBlockId) {
              return { ...b, thumbnail: files[0] };
            }
            return b;
          }),
        );
        toast.success("Thumbnail uploaded successfully", {
          duration: 1000,
        });
        e.target.value = "";
        return;
      }
    }

    // If targetBlockId is provided, we're updating a block in blocksList
    // Otherwise, we're updating the current block in the form
    if (targetBlockId) {
      // Find the target block in blocksList
      const targetBlock = blocksList.find((b) => b.id === targetBlockId);
      if (!targetBlock) {
        e.target.value = "";
        return;
      }

      // Special handling for documents - only allow one document
      if (type === "documents") {
        // If there's already a document, replace it with the new one
        if (targetBlock.documents && targetBlock.documents.length > 0) {
          // For documents, we'll replace the existing one
          if (files.length > 1) {
            toast.error("Only one document can be uploaded", {
              duration: 1000,
            });
            e.target.value = "";
            return;
          }
        }
      } else {
        // For other file types, check the limits
        if (targetBlock[type]?.length + files.length > maxFiles) {
          toast.error(`Maximum ${maxFiles} ${type} allowed`, {
            duration: 1000,
          });
          e.target.value = "";
          return;
        }
      }
    } else {
      // Check total files won't exceed limit for the current block
      if (type === "documents") {
        // For documents, we'll replace the existing one
        if (block.documents && block.documents.length > 0) {
          if (files.length > 1) {
            toast.error("Only one document can be uploaded", {
              duration: 1000,
            });
            e.target.value = "";
            return;
          }
        }
      } else if (block[type].length + files.length > maxFiles) {
        toast.error(`Maximum ${maxFiles} ${type} allowed`, {
          duration: 1000,
        });
        e.target.value = "";
        return;
      }
    }

    files.forEach((file) => {
      if (file.size > maxSize) {
        toast.error(`${file.name} exceeds ${maxSize / (1024 * 1024)}MB limit`, {
          duration: 2000,
        });
        hasError = true;
        return;
      }
      validFiles.push(file);
    });

    if (hasError || validFiles.length === 0) {
      e.target.value = "";
      return;
    }

    // Update the appropriate state based on whether we're updating a block in blocksList or the current form block
    if (targetBlockId) {
      // Update blocksList
      setBlocksList((prevBlocks) =>
        prevBlocks.map((b) => {
          if (b.id === targetBlockId) {
            // For documents, replace existing ones
            if (type === "documents") {
              return { ...b, [type]: validFiles }; // Replace with new document
            } else {
              // For other files, append to existing ones
              return { ...b, [type]: [...(b[type] || []), ...validFiles] };
            }
          }
          return b;
        }),
      );
    } else {
      // Update current form block
      if (type === "documents") {
        // For documents, replace existing ones
        setBlock({
          ...block,
          [type]: validFiles, // Replace with new document
        });
      } else {
        // For other files, append to existing ones
        setBlock({
          ...block,
          [type]: [...block[type], ...validFiles],
        });
      }
    }

    e.target.value = ""; // Reset input
  };

  const resetBlockFields = () => {
    setBlock({
      id: uuidv4(),
      stoneCategory: "",
      stoneName: "",
      origin: null,
      portName: "",
      units: null,
      height: "",
      width: "",
      length: "",
      supplyCapacity: "",
      quantity: "",
      minimumOrder: "",
      symbolA: null,
      priceA: "",
      symbolB: null,
      priceB: "",
      symbolC: null,
      priceC: "",
      videos: [],
      images: [],
      documents: [],
      description: "",
      thumbnail: null,
    });
  };

  const resetFormFields = () => {
    setFormData({
      quarryName: "",
      quarryPincode: "",
      websiteUrl: "",
      emailId: "",
      quarryCountry: null,
      quarryState: null,
      quarryCity: null,
      address: "",
      phone: "",
    });
  };

  const handleAddBlock = () => {
    // Check required fields except for price/symbol fields
    const requiredFields = [
      "stoneCategory",
      "stoneName",
      "origin",
      "portName",
      "units",
      "height",
      "width",
      "length",
      "supplyCapacity",
      "quantity",
      "minimumOrder",
      "description",
    ];

    for (const key of requiredFields) {
      const value = block[key];
      if (value === "" || value === null) {
        toast.error(`Please enter the ${key}`, {
          duration: 1000,
        });
        return;
      }
    }

    // Check that at least one price field is filled with its corresponding symbol
    const hasValidPriceA = block.symbolA && block.priceA;
    const hasValidPriceB = block.symbolB && block.priceB;
    const hasValidPriceC = block.symbolC && block.priceC;

    if (!hasValidPriceA && !hasValidPriceB && !hasValidPriceC) {
      toast.error("Enter atleast one grade price", {
        duration: 2000,
      });
      return;
    }

    if (!block.images || block.images.length === 0) {
      toast.error("Please upload at least 1 image", {
        duration: 1000,
      });
      return;
    }

    if (isEditMode && editingBlockId) {
      // Update existing block in place
      setBlocksList((prev) => {
        // Find and update the block with matching ID
        const updatedList = prev.map((b) => {
          if (b.id === editingBlockId) {
            return block; // Replace with updated block
          }
          return b;
        });

        // Exit edit mode
        setIsEditMode(false);
        setEditingBlockId(null);

        return updatedList;
      });

      resetBlockFields();
      toast.success("Block updated successfully!", {
        duration: 1000,
      });
    } else {
      // Add new block
      // console.log('Adding new block:', block);
      setBlocksList((prev) => {
        const newList = [...prev, block];
        // console.log("Updated blocksList:", newList);
        return newList;
      });
      resetBlockFields();
      toast.success("Block added successfully!", {
        duration: 1000,
      });
    }

    // Focus on the first input field after adding/updating a block
    setTimeout(() => {
      if (firstInputRef.current) {
        firstInputRef.current.focus();
      }
    }, 100);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const storage = getStorage();

      // COMMON: process blocks (same for both cases)
      const processedBlocks = await Promise.all(
        blocksList.map(async (block) => {
          // Upload videos
          const videoUrls =
            block.videos.length > 0
              ? await Promise.all(
                  block.videos.map(async (file, index) => {
                    const storageRef = ref(
                      storage,
                      `blocks/${uid}/videos/${Date.now()}_${index}_${file.name}`,
                    );
                    await uploadBytes(storageRef, file);
                    return getDownloadURL(storageRef);
                  }),
                )
              : [];

          // Upload images
          const imageUrls =
            block.images.length > 0
              ? await Promise.all(
                  block.images.map(async (file, index) => {
                    const storageRef = ref(
                      storage,
                      `blocks/${uid}/images/${Date.now()}_${index}_${file.name}`,
                    );
                    await uploadBytes(storageRef, file);
                    return getDownloadURL(storageRef);
                  }),
                )
              : [];

          // Upload documents
          const documentFiles =
            block.documents.length > 0
              ? await Promise.all(
                  block.documents.map(async (file, index) => {
                    const storageRef = ref(
                      storage,
                      `blocks/${uid}/documents/${Date.now()}_${index}_${file.name}`,
                    );
                    await uploadBytes(storageRef, file);
                    const url = await getDownloadURL(storageRef);

                    return {
                      name: file.name,
                      url: url,
                    };
                  }),
                )
              : [];

          let thumbnailData = null;

          if (block.thumbnail) {
            const fileName = `${Date.now()}_${block.thumbnail.name}`;
            const thumbnailRef = ref(
              storage,
              `blocks/${uid}/thumbnails/${fileName}`,
            );
            await uploadBytes(thumbnailRef, block.thumbnail);

            const url = await getDownloadURL(thumbnailRef);

            thumbnailData = {
              url,
              name: block.thumbnail.name,
            };
          }

          return {
            ...block,
            videos: videoUrls,
            images: imageUrls,
            documents: documentFiles,
            thumbnail: thumbnailData || null,
            origin: block.origin ? block.origin.label : null,
            units: block.units ? block.units.value : null,
            symbolA: block.symbolA ? block.symbolA.label : null,
            symbolB: block.symbolB ? block.symbolB.label : null,
            symbolC: block.symbolC ? block.symbolC.label : null,
          };
        }),
      );

      // =========================
      // CASE 1: NEW BLOCK FORM
      // =========================
      if (!hasApprovedForm) {
        const blocksData = {
          userId: uid,
          userEmail: authEmail,
          orderId: Math.floor(70000 + Math.random() * 10000),
          quarryDetails: {
            ...formData,
            quarryCountry: formData.quarryCountry
              ? formData.quarryCountry.label
              : null,
            quarryState: formData.quarryState
              ? formData.quarryState.label
              : null,
            quarryCity: formData.quarryCity ? formData.quarryCity.label : null,
          },
          blocks: processedBlocks,
          status: "pending",
          createdAt: serverTimestamp(),
        };

        const docRef = await addDoc(collection(db, "Blocks"), blocksData);

        await setDoc(
          doc(db, "SellerDetails", uid, "SellBlocks", docRef.id),
          blocksData,
        );

        toast.success("Blocks submitted successfully!");
        resetFormFields();
        resetBlockFields();
        setBlocksList([]);
        router.push("/dashboard/profile/my-blocks");
        return;
      }

      // =========================
      // CASE 2: APPROVED FORM
      // =========================

      if (!blockId) {
        toast.error("Block not found");
        return;
      }

      if (!blocksList.length) {
        toast.error("Add at least 1 block");
        return;
      }

      const bRef = doc(db, "Blocks", blockId);
      const uRef = doc(db, "SellerDetails", uid, "SellBlocks", blockId);

      const bSnap = await getDoc(bRef);
      if (!bSnap.exists()) {
        toast.error("Block not found");
        return;
      }

      await updateDoc(bRef, {
        blocks: arrayUnion(...processedBlocks),
      });

      await updateDoc(uRef, {
        blocks: arrayUnion(...processedBlocks),
      });

      toast.success("New blocks added!");
      resetBlockFields();
      setBlocksList([]);
      router.push("/dashboard/profile/my-blocks");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(error.message || "Failed to submit form");
    } finally {
      setIsSubmitting(false);
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
      <div className="space-y-1 lg:space-y-2 my-3 md:my-5">
        {/* <h1 className="text-xl md:text-3xl lg:text-4xl xl:text-5xl font-medium">
          Register your quarry block.
        </h1>
        <p className="text-xs md:text-sm lg:text-base xl:text-lg 2xl:text-xl text-[#BDBDBD]">
          Fill this form to register your block.
        </p> */}
        {!hasApprovedForm ? (
          <>
            <h1 className="text-xl md:text-3xl lg:text-4xl xl:text-5xl font-medium">
              Register Your Block.
            </h1>
            <p className="text-xs md:text-sm lg:text-base xl:text-lg 2xl:text-xl text-[#BDBDBD]">
              Fill this form to register your block.
            </p>
          </>
        ) : (
          <div className="flex justify-center my-2">
            <h1 className="rounded-full border border-primary px-6 py-2 text-primary font-semibold lg:text-xl text-center">
              Add Block
            </h1>
          </div>
        )}
      </div>

      <div>
        <form
          onSubmit={handleSubmit}
          className="max-md:space-y-5  md:flex  items-start gap-5 xl:gap-10"
        >
          <div className="shadow-lg p-4 border border-gray-200  rounded-lg md:w-3/5 space-y-2 md:space-y-4">
            {/* Company / Quarry Details */}
            {!hasApprovedForm && (
              <div>
                <h2 className="text-xs font-semibold mb-1">Company Details</h2>
                <div className="border border-dashed border-[#000000]/20 rounded-lg p-2 md:p-4 space-y-1 md:space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 w-full">
                    <div className="w-full flex flex-col">
                      <label htmlFor="quarryName" className="mb-0.5 text-xs">
                        Company Name
                      </label>
                      <div className="rounded-lg p-px transition bg-transparent focus-within:bg-linear-to-t focus-within:from-[#d6c9ea] focus-within:to-primary">
                        <div className="flex items-center gap-2 rounded-lg bg-white border border-[#D7D7D7] transition focus-within:border-transparent">
                          <input
                            id="quarryName"
                            type="text"
                            required
                            name="quarryName"
                            placeholder="Company Name"
                            value={formData.quarryName}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                quarryName: e.target.value,
                              })
                            }
                            className="flex-1 bg-transparent outline-none border-0 p-3 text-xs appearance-none w-full"
                            style={{ WebkitAppearance: "none" }}
                          />
                          <label
                            htmlFor="quarryName"
                            className="pr-3 text-gray-600"
                          >
                            <LuUserRound size={16} />
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="w-full flex flex-col">
                      <label htmlFor="Quarrypincode" className="mb-0.5 text-xs">
                        Company Pincode
                      </label>
                      <div className="rounded-lg p-px transition bg-transparent focus-within:bg-linear-to-t focus-within:from-[#d6c9ea] focus-within:to-primary">
                        <div className="flex items-center gap-2 rounded-lg bg-white border border-[#D7D7D7] transition focus-within:border-transparent">
                          <input
                            id="Quarrypincode"
                            type="text"
                            maxLength={6}
                            pattern="\d{6}"
                            placeholder="Pincode"
                            value={formData.quarryPincode}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                quarryPincode: e.target.value,
                              }))
                            }
                            className="flex-1 bg-transparent outline-none border-0 p-3 text-xs w-full"
                            required
                            name="quarryPincode"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 w-full">
                    <div className="w-full flex flex-col">
                      <label htmlFor="websiteUrl" className="mb-0.5 text-xs">
                        Website URL
                      </label>
                      <div className="rounded-lg p-px transition bg-transparent focus-within:bg-linear-to-t focus-within:from-[#d6c9ea] focus-within:to-primary">
                        <div className="flex items-center gap-2 rounded-lg bg-white border border-[#D7D7D7] transition focus-within:border-transparent">
                          <input
                            id="websiteUrl"
                            type="text"
                            placeholder="Website URL"
                            value={formData.websiteUrl}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                websiteUrl: e.target.value,
                              })
                            }
                            className="flex-1 bg-transparent outline-none border-0 p-3 text-xs w-full"
                            name="websiteUrl"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="w-full flex flex-col">
                      <label htmlFor="emailId" className="mb-0.5 text-xs">
                        Email Id
                      </label>
                      <div className="rounded-lg p-px transition bg-transparent focus-within:bg-linear-to-t focus-within:from-[#d6c9ea] focus-within:to-primary">
                        <div className="flex items-center gap-2 rounded-lg bg-white border border-[#D7D7D7] transition focus-within:border-transparent">
                          <input
                            id="emailId"
                            type="email"
                            placeholder="Email Id"
                            value={formData.emailId}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                emailId: e.target.value,
                              })
                            }
                            className="flex-1 bg-transparent outline-none border-0 p-3 text-xs w-full"
                            name="emailId"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 w-full">
                    <div className="min-w-0">
                      <label className="mb-0.5 text-xs">Country</label>
                      <Select
                        options={countryOptions}
                        value={formData.quarryCountry}
                        onChange={(value) => {
                          setFormData((prev) => ({
                            ...prev,
                            quarryCountry: value,
                            quarryState: null, // Reset state when country changes
                            quarryCity: null, // Reset city when country changes
                            phone: "", // Reset phone when country changes
                          }));
                        }}
                        placeholder="Country"
                        required
                        name="country"
                        className="text-xs"
                      />
                    </div>

                    <div className="min-w-0">
                      <label className="mb-0.5 text-xs">State</label>
                      <Select
                        options={stateOptions}
                        value={formData.quarryState}
                        onChange={(value) => {
                          setFormData((prev) => ({
                            ...prev,
                            quarryState: value,
                            quarryCity: null, // Reset city when state changes
                          }));
                        }}
                        placeholder="State"
                        isDisabled={!formData.quarryCountry}
                        required
                        name="state"
                        className="text-xs"
                      />
                    </div>

                    <div className="min-w-0">
                      <label className="mb-0.5 text-xs">City</label>
                      <Select
                        options={cityOptions}
                        value={formData.quarryCity}
                        onChange={(value) =>
                          setFormData({ ...formData, quarryCity: value })
                        }
                        placeholder="City"
                        isDisabled={!formData.quarryState}
                        className="text-xs outline-none"
                        required
                        name="city"
                      />
                    </div>
                  </div>

                  <div className="w-full flex flex-col">
                    <label htmlFor="address" className="mb-0.5 text-xs">
                      Address
                    </label>
                    <div className="rounded-lg p-px transition bg-transparent focus-within:bg-linear-to-t focus-within:from-[#d6c9ea] focus-within:to-primary">
                      <div className="flex items-center gap-2 rounded-lg bg-white border border-[#D7D7D7] transition focus-within:border-transparent">
                        <textarea
                          id="address"
                          placeholder="Address"
                          value={formData.address}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              address: e.target.value,
                            }))
                          }
                          className="flex-1 bg-transparent outline-none border-0 p-3 text-xs w-full"
                          required
                          name="address"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 w-full">
                    <div className="w-full flex flex-col">
                      <label htmlFor="name" className="mb-0.5 text-xs">
                        Phone Number
                      </label>
                      <div className="rounded-lg p-px transition bg-transparent focus-within:bg-linear-to-t focus-within:from-[#d6c9ea] focus-within:to-primary">
                        <div className="flex items-center gap-2 rounded-lg bg-white border border-[#D7D7D7] transition focus-within:border-transparent ">
                          <div className="flex items-center w-full ">
                            <span className="text-xs text-gray-500 px-2 border-r">
                              +{formData.quarryCountry?.phonecode || "1"}
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
                  </div>
                </div>
              </div>
            )}
            {/* Blocks Details */}
            {(hasApprovedForm ||
              (!hasApprovedForm && (blocksList.length < 2 || isEditMode))) && (
              <div className="my-3">
                <h2 className="text-xs font-semibold mb-1">Blocks Details</h2>
                <div
                  id="blockDetailsForm"
                  className="border border-dashed border-[#000000]/20 rounded-lg p-2 md:p-4 space-y-1 md:space-y-2"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 w-full">
                    <div className="w-full flex flex-col">
                      <label htmlFor="stoneCategory" className="mb-0.5 text-xs">
                        Block Category
                      </label>
                      <div className="rounded-lg p-px transition bg-transparent focus-within:bg-linear-to-t focus-within:from-[#d6c9ea] focus-within:to-primary">
                        <div className="flex items-center gap-2 rounded-lg bg-white border border-[#D7D7D7] transition focus-within:border-transparent">
                          <input
                            id="stoneCategory"
                            ref={firstInputRef}
                            type="text"
                            placeholder="Marble, Granite ...."
                            value={block.stoneCategory}
                            onChange={(e) =>
                              setBlock({
                                ...block,
                                stoneCategory: e.target.value,
                              })
                            }
                            className="flex-1 bg-transparent outline-none border-0 p-3 text-xs w-full"
                            name="stoneCategory"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="w-full flex flex-col">
                      <label htmlFor="stoneName" className="mb-0.5 text-xs">
                        Block Name
                      </label>
                      <div className="rounded-lg p-px transition bg-transparent focus-within:bg-linear-to-t focus-within:from-[#d6c9ea] focus-within:to-primary">
                        <div className="flex items-center gap-2 rounded-lg bg-white border border-[#D7D7D7] transition focus-within:border-transparent">
                          <input
                            id="stoneName"
                            type="text"
                            placeholder="Stonepedia White Marble"
                            value={block.stoneName}
                            onChange={(e) =>
                              setBlock({
                                ...block,
                                stoneName: e.target.value,
                              })
                            }
                            className="flex-1 bg-transparent outline-none border-0 p-3 text-xs w-full"
                            name="stoneName"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 w-full my-3">
                    <div className="min-w-0">
                      <label className="mb-0.5 text-xs">Origin</label>
                      <Select
                        options={countryOptions}
                        value={block.origin}
                        onChange={(value) => {
                          setBlock((prev) => ({
                            ...prev,
                            origin: value,
                          }));
                        }}
                        placeholder="Origin"
                        name="origin"
                        className="text-xs"
                      />
                    </div>

                    <div className="w-full flex flex-col">
                      <label htmlFor="portName" className="mb-0.5 text-xs">
                        Nearby Port Name
                      </label>
                      <div className="rounded-lg p-px transition bg-transparent focus-within:bg-linear-to-t focus-within:from-[#d6c9ea] focus-within:to-primary">
                        <div className="flex items-center gap-2 rounded-lg bg-white border border-[#D7D7D7] transition focus-within:border-transparent">
                          <input
                            id="portName"
                            type="text"
                            placeholder="Nearby Port"
                            value={block.portName}
                            onChange={(e) =>
                              setBlock({
                                ...block,
                                portName: e.target.value,
                              })
                            }
                            className="flex-1 bg-transparent outline-none border-0 p-3 text-xs w-full"
                            name="portName"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 w-full my-3">
                    <div className="w-full flex flex-col">
                      <label htmlFor="units" className="mb-0.5 text-xs">
                        Units
                      </label>
                      <Select
                        options={[
                          { label: "MM", value: "mm" },
                          { label: "CM", value: "cm" },
                          { label: "Inche", value: "inches" },
                          { label: "Feet", value: "ft" },
                          { label: "Meter", value: "meter" },
                        ]}
                        value={block.units}
                        onChange={(label) => {
                          setBlock((prev) => ({
                            ...prev,
                            units: label,
                          }));
                        }}
                        placeholder="Units"
                        name="units"
                        className="text-xs"
                      />
                    </div>

                    <div className="w-full flex flex-col">
                      <label htmlFor="height" className="mb-0.5 text-xs">
                        Height
                      </label>
                      <div className="rounded-lg p-px transition bg-transparent focus-within:bg-linear-to-t focus-within:from-[#d6c9ea] focus-within:to-primary">
                        <div className="flex items-center gap-2 rounded-lg bg-white border border-[#D7D7D7] transition focus-within:border-transparent">
                          <input
                            id="height"
                            type="text"
                            inputMode="numeric"
                            placeholder="Height"
                            value={block.height}
                            onChange={(e) =>
                              setBlock({
                                ...block,
                                height: e.target.value,
                              })
                            }
                            className="flex-1 bg-transparent outline-none border-0 p-3 text-xs w-full"
                            name="height"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="w-full flex flex-col">
                      <label htmlFor="width" className="mb-0.5 text-xs">
                        Width
                      </label>
                      <div className="rounded-lg p-px transition bg-transparent focus-within:bg-linear-to-t focus-within:from-[#d6c9ea] focus-within:to-primary">
                        <div className="flex items-center gap-2 rounded-lg bg-white border border-[#D7D7D7] transition focus-within:border-transparent">
                          <input
                            id="width"
                            type="text"
                            inputMode="numeric"
                            placeholder="Width"
                            value={block.width}
                            onChange={(e) =>
                              setBlock({
                                ...block,
                                width: e.target.value,
                              })
                            }
                            className="flex-1 bg-transparent outline-none border-0 p-3 text-xs w-full"
                            name="width"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="w-full flex flex-col">
                      <label htmlFor="length" className="mb-0.5 text-xs">
                        Length
                      </label>
                      <div className="rounded-lg p-px transition bg-transparent focus-within:bg-linear-to-t focus-within:from-[#d6c9ea] focus-within:to-primary">
                        <div className="flex items-center gap-2 rounded-lg bg-white border border-[#D7D7D7] transition focus-within:border-transparent">
                          <input
                            id="length"
                            type="text"
                            inputMode="numeric"
                            placeholder="Length"
                            value={block.length}
                            onChange={(e) =>
                              setBlock({
                                ...block,
                                length: e.target.value,
                              })
                            }
                            className="flex-1 bg-transparent outline-none border-0 p-3 text-xs w-full"
                            name="length"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4 w-full my-3">
                    <div className="w-full flex flex-col">
                      <label
                        htmlFor="supplyCapacity"
                        className="mb-0.5 text-xs text-nowrap"
                      >
                        Supply Capacity
                      </label>
                      <div className="rounded-lg p-px transition bg-transparent focus-within:bg-linear-to-t focus-within:from-[#d6c9ea] focus-within:to-primary">
                        <div className="flex items-center gap-2 rounded-lg bg-white border border-[#D7D7D7] transition focus-within:border-transparent">
                          <input
                            id="supplyCapacity"
                            type="text"
                            inputMode="numeric"
                            placeholder="Enter in ton"
                            value={block.supplyCapacity}
                            onChange={(e) =>
                              setBlock({
                                ...block,
                                supplyCapacity: e.target.value,
                              })
                            }
                            className="flex-1 bg-transparent outline-none border-0 p-3 text-xs w-full"
                            name="supplyCapacity"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="w-full flex flex-col">
                      <label
                        htmlFor="quantityAvailable"
                        className="mb-0.5 text-xs text-nowrap"
                      >
                        Available Quantity
                      </label>
                      <div className="rounded-lg p-px transition bg-transparent focus-within:bg-linear-to-t focus-within:from-[#d6c9ea] focus-within:to-primary">
                        <div className="flex items-center gap-2 rounded-lg bg-white border border-[#D7D7D7] transition focus-within:border-transparent">
                          <input
                            id="quantityAvailable"
                            type="text"
                            inputMode="numeric"
                            placeholder="Enter in ton"
                            value={block.quantity}
                            onChange={(e) =>
                              setBlock({
                                ...block,
                                quantity: e.target.value,
                              })
                            }
                            className="flex-1 bg-transparent outline-none border-0 p-3 text-xs w-full"
                            name="quantity"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="w-full flex flex-col">
                      <label htmlFor="minimumOrder" className="mb-0.5 text-xs">
                        Minimum Order
                      </label>
                      <div className="rounded-lg p-px transition bg-transparent focus-within:bg-linear-to-t focus-within:from-[#d6c9ea] focus-within:to-primary">
                        <div className="flex items-center justify-between gap-2 rounded-lg bg-white border border-[#D7D7D7] transition focus-within:border-transparent">
                          <input
                            id="minimumOrder"
                            type="text"
                            inputMode="numeric"
                            placeholder="Enter in ton"
                            value={block.minimumOrder}
                            onChange={(e) =>
                              setBlock({
                                ...block,
                                minimumOrder: e.target.value,
                              })
                            }
                            className="flex-1 w-full bg-transparent outline-none border-0 p-3 text-xs"
                            name="minimumOrder"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-full my-3 lg:grid grid-cols-2 xl:grid-cols-3 gap-3">
                    <div className="">
                      <label htmlFor="symbolA" className="mb-0.5 text-xs">
                        Grade-A Price (Ton)
                      </label>
                      <div className="flex gap-2 rounded-lg bg-white border border-[#D7D7D7] p-1">
                        <Select
                          options={[
                            { label: "₹", value: "rupee" },
                            { label: "$", value: "dollar" },
                          ]}
                          value={block.symbolA}
                          onChange={(value) => {
                            setBlock((prev) => ({
                              ...prev,
                              symbolA: value,
                            }));
                          }}
                          placeholder="price"
                          name="symbolA"
                          className="text-xs lg:w-[80%]"
                        />
                        <div>
                          <input
                            type="text"
                            inputMode="numeric"
                            className="w-full outline-none h-full text-sm"
                            placeholder="Enter Price"
                            value={block.priceA}
                            onChange={(e) => {
                              setBlock((prev) => ({
                                ...prev,
                                priceA: e.target.value,
                              }));
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="">
                      <label htmlFor="symbolB" className="mb-0.5 text-xs">
                        Grade-B Price (Ton)
                      </label>
                      <div className="flex gap-2 rounded-lg bg-white border border-[#D7D7D7] p-1">
                        <Select
                          options={[
                            { label: "₹", value: "rupee" },
                            { label: "$", value: "dollar" },
                          ]}
                          value={block.symbolB}
                          onChange={(value) => {
                            setBlock((prev) => ({
                              ...prev,
                              symbolB: value,
                            }));
                          }}
                          placeholder="price"
                          name="symbolB"
                          className="text-xs lg:w-[80%]"
                        />
                        <div>
                          <input
                            type="text"
                            inputMode="numeric"
                            className="w-full outline-none h-full text-sm"
                            placeholder="Enter Price"
                            value={block.priceB}
                            onChange={(e) => {
                              setBlock((prev) => ({
                                ...prev,
                                priceB: e.target.value,
                              }));
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="">
                      <label htmlFor="symbolC" className="mb-0.5 text-xs">
                        Grade-C Price (Ton)
                      </label>
                      <div className="flex gap-2 rounded-lg bg-white border border-[#D7D7D7] p-1">
                        <Select
                          options={[
                            { label: "₹", value: "rupee" },
                            { label: "$", value: "dollar" },
                          ]}
                          value={block.symbolC}
                          onChange={(value) => {
                            setBlock((prev) => ({
                              ...prev,
                              symbolC: value,
                            }));
                          }}
                          placeholder="price"
                          name="symbolC"
                          className="text-xs lg:w-[80%]"
                        />
                        <div>
                          <input
                            type="text"
                            inputMode="numeric"
                            className="w-full outline-none h-full text-sm"
                            placeholder="Enter Price"
                            value={block.priceC}
                            onChange={(e) => {
                              setBlock((prev) => ({
                                ...prev,
                                priceC: e.target.value,
                              }));
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="md:my-5">
                    <label className="block mb-1 text-xs font-medium">
                      Upload Block Images/Videos
                    </label>
                    <div className="flex gap-4 flex-col md:flex-row">
                      {/* Video upload */}
                      <label className="flex flex-col items-center justify-center w-full md:w-1/2 border border-dashed border-primary rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition">
                        <FiUpload size={20} className="mb-2 text-gray-900" />
                        <span className="text-xs font-medium">
                          Upload Videos
                        </span>
                        <span className="text-[8px] text-gray-500">
                          up to 5 MB
                        </span>
                        <span className="mt-2 text-[8px] text-gray-600 font-semibold">
                          {block.videos.length > 0
                            ? `Uploaded ${block.videos.length}`
                            : ""}
                        </span>
                        <input
                          type="file"
                          accept="video/*"
                          className="hidden"
                          onChange={(e) => handleFile(e, "videos")}
                          multiple
                        />
                      </label>

                      {/* Image upload */}
                      <label className="flex flex-col items-center justify-center w-full md:w-1/2 border border-dashed border-primary bg-primary/10 rounded-lg p-6 text-center cursor-pointer hover:bg-primary/10 transition">
                        <FiUpload size={20} className="mb-2 text-gray-900" />
                        <span className="text-xs font-medium">
                          Upload Images
                        </span>
                        <span className="text-[8px] text-gray-500">
                          up to 2 MB
                        </span>
                        <span className="mt-2 text-[8px] text-gray-600 font-semibold">
                          {block.images.length > 0
                            ? `Uploaded ${block.images.length}`
                            : ""}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFile(e, "images")}
                          multiple
                        />
                      </label>
                    </div>
                  </div>

                  <div className="mt-5">
                    <label className="block mb-1 text-xs font-medium">
                      Upload Block Certificate{" "}
                      <span className="text-[#6D6D6D]">(Approved By NABL)</span>
                    </label>
                    <label className="flex flex-col items-center justify-center w-full border border-dashed border-primary rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition">
                      <FiUpload size={20} className="mb-2 text-gray-900" />
                      <span className="text-xs font-medium">
                        Upload Certificate
                      </span>
                      <span className="mt-2 text-[8px] text-gray-600 font-semibold">
                        {block.documents.length > 0
                          ? `${block.documents[0].name}`
                          : ""}
                      </span>
                      <input
                        type="file"
                        accept="application/pdf"
                        className="hidden"
                        onChange={(e) => handleFile(e, "documents")}
                      />
                    </label>
                  </div>

                  <div className="my-3">
                    <label
                      htmlFor="description"
                      className="mb-0.5 text-xs font-semibold"
                    >
                      Description
                    </label>
                    <textarea
                      id="description"
                      placeholder="Tell me about block"
                      rows={4}
                      value={block.description}
                      onChange={(e) =>
                        setBlock({ ...block, description: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-md p-2 text-xs outline-none"
                      name="description"
                    ></textarea>
                  </div>

                  {(isEditMode ||
                    (!hasApprovedForm && blocksList.length < 2) ||
                    (hasApprovedForm && blocksList.length === 0)) && (
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleAddBlock}
                        className="bg-primary px-4 py-2 md:px-8 lg:px-10 xl:px-14 rounded-md text-white text-xs cursor-pointer"
                      >
                        {isEditMode ? "Save Changes" : "Add Block"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right side column */}
          <div className="md:w-2/5">
            {blocksList.length === 0 && (
              <div
                className="cursor-pointer bg-[#F4F4F4] text-[#3B3B3B] gap-1 text-xs lg:text-sm py-2 rounded-lg flex items-center justify-center"
                onClick={() => {
                  // Focus on the first input field when clicked
                  if (firstInputRef.current) {
                    firstInputRef.current.focus();
                  }
                  toast.error("Please fill all fields in block details", {
                    duration: 2000,
                  });
                }}
              >
                <span>
                  <FaPlus />
                </span>
                Add Block
              </div>
            )}
            {blocksList.length > 0 && (
              <div>
                <BlocksFormProducts
                  blocksList={blocksList}
                  setBlocksList={setBlocksList}
                  handleFile={handleFile}
                  isEditMode={isEditMode}
                  isSubmitting={isSubmitting}
                />
                {/* Submit and cancel buttons */}
                {isEditMode ? null : (
                  <div className="flex justify-end gap-2 mt-5 text-xs md:text-sm">
                    <button
                      className={`cursor-pointer px-4 py-1 border border-gray-400 rounded-lg ${
                        isSubmitting ? "cursor-not-allowed opacity-50" : ""
                      }`}
                      onClick={() => setBlocksList([])}
                      disabled={isSubmitting}
                    >
                      Clear
                    </button>
                    <button
                      type="submit"
                      className={`cursor-pointer px-4 py-1 bg-primary rounded-lg text-white ${
                        isSubmitting ? "cursor-not-allowed opacity-50" : ""
                      }`}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block"
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
                          Submitting...
                        </>
                      ) : (
                        "Submit"
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlockForm;
