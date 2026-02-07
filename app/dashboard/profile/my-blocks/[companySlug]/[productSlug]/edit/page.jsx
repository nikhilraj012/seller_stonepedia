"use client";
import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import { RxCross2 } from "react-icons/rx";
import toast from "react-hot-toast";
import { Country } from "country-state-city";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useParams, useRouter } from "next/navigation";

import BlockFields from "@/app/components/BlockFields";

import { useUi } from "@/app/components/context/UiContext";
import { useAuth } from "@/app/components/context/AuthContext";
import { db, storage } from "@/app/firebase/config";
import MediaUploader from "../../../MediaUploader";

const countryOptions = Country.getAllCountries().map((c) => ({
  label: c.name,
  value: c.isoCode,
}));

const Page = () => {
  const { companySlug, productSlug } = useParams();
  const router = useRouter();
  const { uid } = useAuth();
  const { isSubmitting, setIsSubmitting } = useUi();

  const [docId, setDocId] = useState(null);
  const [block, setBlock] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper function to convert name to slug
  const toSlug = (str) =>
    str
      ?.toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");

  useEffect(() => {
    if (!uid || !companySlug || !productSlug) return;

    const fetchBlock = async () => {
      setLoading(true);
      try {
        const sellerBlocksSnap = await getDocs(
          collection(db, "SellerDetails", uid, "SellBlocks"),
        );

        let foundBlock = null;
        let foundDocId = null;

        sellerBlocksSnap.forEach((docSnap) => {
          const data = docSnap.data();
          if (!Array.isArray(data.blocks)) return;

          data.blocks.forEach((p) => {
            if (toSlug(p.stoneName) === productSlug) {
              foundBlock = p;
              foundDocId = docSnap.id;
            }
          });
        });

        if (!foundBlock) {
          console.log("No matching block found");
          toast.error("Block not found");
          setLoading(false);
          return;
        }

        const originObj =
          countryOptions.find((c) => c.label === foundBlock.origin) || null;

        const docs = Array.isArray(foundBlock.documents)
          ? foundBlock.documents.map((d) =>
              typeof d === "string"
                ? { name: d.split("/").pop(), url: d } // filename from URL
                : { name: d.name || "Document", url: d.url || "" },
            )
          : [];
        setBlock({
          ...foundBlock,
          documents: docs,
          origin: originObj,
          documents: Array.isArray(foundBlock.documents)
            ? foundBlock.documents
            : [],
          units:
            typeof foundBlock.units === "string"
              ? { label: foundBlock.units, value: foundBlock.units }
              : foundBlock.units,
          symbolA:
            typeof foundBlock.symbolA === "string"
              ? { label: foundBlock.symbolA, value: foundBlock.symbolA }
              : foundBlock.symbolA,
          symbolB:
            typeof foundBlock.symbolB === "string"
              ? { label: foundBlock.symbolB, value: foundBlock.symbolB }
              : foundBlock.symbolB,
          symbolC:
            typeof foundBlock.symbolC === "string"
              ? { label: foundBlock.symbolC, value: foundBlock.symbolC }
              : foundBlock.symbolC,
        });
        setDocId(foundDocId);
      } catch (err) {
        console.error("Error fetching block:", err);
        toast.error("Failed to load block");
      } finally {
        setLoading(false);
      }
    };

    fetchBlock();
  }, [uid, companySlug, productSlug]);
  // File upload handler
  const handleFile = (e, type) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setBlock((prev) => ({
      ...prev,
      [type]: type === "documents" ? files : [...(prev[type] || []), ...files],
    }));

    e.target.value = "";
  };

  // Increment/decrement minimum order
  const handleIncrement = () => {
    setBlock((prev) => ({
      ...prev,
      minimumOrder: Number(prev.minimumOrder || 0) + 1,
    }));
  };
  const handleDecrement = () => {
    setBlock((prev) => ({
      ...prev,
      minimumOrder: Math.max(1, Number(prev.minimumOrder || 1) - 1),
    }));
  };

  // Save block
  const handleSaveBlock = async () => {
    if (!block || !docId) return;

    try {
      setIsSubmitting(true);

      // Validate required fields
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
        if (!block[key]?.toString().trim()) {
          toast.error(`Please enter the ${key}`);
          return;
        }
      }

      // Validate at least one price
      const hasPrice =
        (block.symbolA && block.priceA) ||
        (block.symbolB && block.priceB) ||
        (block.symbolC && block.priceC);

      if (!hasPrice) {
        toast.error("Enter at least one grade price");
        return;
      }

      if (!block.images || block.images.length === 0) {
        toast.error("Please upload at least 1 image");
        return;
      }

      // Upload files helper
      const uploadFiles = async (files, folder) => {
        if (!files?.length) return [];

        return Promise.all(
          files.map(async (file, index) => {
            if (typeof file === "string") return file;
            if (file?.url) return file.url;

            const storageRef = ref(
              storage,
              `blocks/${uid}/${folder}/${Date.now()}_${index}_${file.name}`,
            );
            await uploadBytes(storageRef, file);
            return getDownloadURL(storageRef);
          }),
        );
      };

      const videos = await uploadFiles(block.videos, "videos");
      const images = await uploadFiles(block.images, "images");

      const finalBlock = {
        ...block,
        videos,
        images,
        origin: block.origin?.label || "",
        units: block.units?.value || "",
        symbolA: block.symbolA?.value || "",
        symbolB: block.symbolB?.value || "",
        symbolC: block.symbolC?.value || "",
        documents: block.documents.map((d) => (d.url ? d : { name: d.name })),
      };

      // Update user collection
      const blockRef = doc(db, "SellerDetails", uid, "SellBlocks", docId);
      const blockSnap = await getDoc(blockRef);

      if (!blockSnap.exists()) return;

      const updatedBlocks = blockSnap
        .data()
        .blocks.map((p) =>
          toSlug(p.stoneName) === productSlug ? finalBlock : p,
        );
      await updateDoc(blockRef, {
        blocks: updatedBlocks,
      });
      const mainBlockRef = doc(db, "Blocks", docId);

      await updateDoc(mainBlockRef, {
        blocks: updatedBlocks,
      });
      toast.success("Block updated successfully");
      sessionStorage.setItem(
        "currentProduct",
        JSON.stringify({
          docId,
          blockId: finalBlock.id,
        }),
      );

      router.replace(
        `/dashboard/profile/my-blocks/${companySlug}/${toSlug(block.stoneName)}`,
      );
    } catch (err) {
      console.error("Save block error:", err);
      toast.error("Save failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-gray-900 mx-auto"></div>
          <p className="mt-6 text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!block) return null;

  return (
    <div className="pt-18 md:pt-22 max-lg:px-4 lg:mx-24 xl:mx-32">
      <div className="md:justify-center md:flex gap-5">
        <div className="md:w-3/5">
          <span className="ml-1 inline-block text-base md:text-2xl font-medium text-[#871B58]">
            Edit Block
          </span>
          <div className="bg-white border border-gray-300 rounded-xl shadow-sm p-4 w-full max-w-full">
            <BlockFields
              block={block}
              setBlock={setBlock}
              countryOptions={countryOptions}
              handleFile={handleFile}
              handleIncrement={handleIncrement}
              handleDecrement={handleDecrement}
            />
          </div>
        </div>
        <div className="md:w-2/5">
          <div className="space-y-2 my-4">
            <h2 className="text-xs font-medium">Upload Block image/video</h2>
            <MediaUploader product={block} setProduct={setBlock} />
          </div>
          {block.documents.length > 0 &&
            block.documents.map((docItem, index) => (
              <div
                key={index}
                className="w-full relative group bg-gray-50 rounded-md border border-gray-200 p-2 mb-2"
              >
                <p className="text-[10px] w-full">
                  {docItem.name || "Document"}
                </p>
                <button
                  type="button"
                  className="absolute text-[10px] cursor-pointer top-1/2 right-2 transform -translate-y-1/2 border border-red-500 bg-white/80 p-0.5 rounded-full text-red-500 hover:bg-white hover:text-red-600 transition-colors  z-20"
                  onClick={() =>
                    setBlock((prev) => ({
                      ...prev,
                      documents: prev.documents.filter((_, i) => i !== index),
                    }))
                  }
                >
                  <RxCross2 />
                </button>
              </div>
            ))}
          <div className="mt-6 gap-3 flex justify-end">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 md:px-8 border border-gray-300 rounded-md text-gray-700 text-xs cursor-pointer hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveBlock}
              className="bg-[#871B58] hover:bg-[#6a1545] px-4 py-2 md:px-5 lg:px-10 xl:px-12 rounded-md text-white text-xs cursor-pointer"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
