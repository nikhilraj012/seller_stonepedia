// "use client";
// import { useEffect, useState } from "react";

// import {
//   doc,
//   getDoc,
//   updateDoc,
//   query,
//   collection,
//   where,
//   getDocs,
// } from "firebase/firestore";
// import { RxCross2 } from "react-icons/rx";
// import toast from "react-hot-toast";
// import { Country } from "country-state-city";
// import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
// import { useParams } from "next/navigation";
// import BlockFields from "@/app/components/BlockFields";
// import { useUi } from "@/app/components/context/UiContext";

// import MediaUploader from "@/app/components/common/gallery/MediaUploader";
// import { db, storage } from "@/app/firebase/config";
// import { useAuth } from "@/app/components/context/AuthContext";
// const countryOptions = Country.getAllCountries().map((c) => ({
//   label: c.name,
//   value: c.isoCode,
// }));
// const page = () => {
//   const { companySlug, productSlug } = useParams();
//   const { uid } = useAuth();
//   const { isSubmitting, setIsSubmitting } = useUi();

//   const [docId, setDocId] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [block, setBlock] = useState(null);

//   useEffect(() => {
//     if (!uid || !companySlug || !productSlug) return;

//     const loadBlock = async () => {
//       setLoading(true);
//       try {
//         // const q = query(
//         //   collection(db, "SellerDetails", uid, "SellBlocks"),
//         //   where("companySlug", "==", companySlug),
//         // );

//         // const snap = await getDocs(q);

//         // let found = null;
//         // let foundDocId = null;

//         // snap.forEach((d) => {
//         //   const data = d.data();
//         //   const blk = data.blocks?.find((b) => b.id === productSlug);

//         //   if (blk) {
//         //     found = blk;
//         //     foundDocId = d.id;
//         //   }
//         // });
//         const qSnap = await getDocs(
//                   collection(db, "SellerDetails", uid, collectionName),
//                 );

//                 qSnap.forEach((docSnap) => {
//                   const data = docSnap.data();

//                   if (
//                     data?.companyDetails?.shopName &&
//                     toSlug(data.companyDetails.companyName) === companySlug
//                   ) {
//                     if (!Array.isArray(data.products)) return;

//                     const slab = data.products.find(
//                       (p) => toSlug(p.stoneName) === productSlug,
//                     );

//                     if (slab) {
//                       setGallery({
//                         id: docSnap.id,
//                         ...data,
//                       });

//         if (!found) {
//           toast.error("Block not found");
//           return;
//         }

//         setDocId(foundDocId);

//         const countryOptions = Country.getAllCountries().map((c) => ({
//           label: c.name,
//           value: c.isoCode,
//         }));

//         const originObj =
//           countryOptions.find((c) => c.label === found.origin) || null;

//         setBlock({
//           ...found,
//           origin: originObj,
//           documents: Array.isArray(found.documents) ? found.documents : [],
//           units:
//             typeof found.units === "string"
//               ? { label: found.units, value: found.units }
//               : found.units,
//           symbolA:
//             typeof found.symbolA === "string"
//               ? { label: found.symbolA, value: found.symbolA }
//               : found.symbolA,

//           symbolB:
//             typeof found.symbolB === "string"
//               ? { label: found.symbolB, value: found.symbolB }
//               : found.symbolB,

//           symbolC:
//             typeof found.symbolC === "string"
//               ? { label: found.symbolC, value: found.symbolC }
//               : found.symbolC,
//         });
//       } catch (error) {
//         console.error("Load block error:", error);
//         toast.error("Failed to load block");
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadBlock();
//   }, [uid, companySlug, productSlug]);

//   const handleFile = (e, type) => {
//     const files = Array.from(e.target.files || []);
//     if (files.length === 0) return;

//     setBlock((prev) => ({
//       ...prev,
//       [type]: type === "documents" ? files : [...(prev[type] || []), ...files],
//     }));

//     e.target.value = "";
//   };

//   const handleIncrement = () => {
//     setBlock((prev) => ({
//       ...prev,
//       minimumOrder: Number(prev.minimumOrder || 0) + 1,
//     }));
//   };

//   const handleDecrement = () => {
//     setBlock((prev) => ({
//       ...prev,
//       minimumOrder: Math.max(1, Number(prev.minimumOrder || 1) - 1),
//     }));
//   };

//   const handleSaveBlock = async () => {
//     if (!block) return;

//     try {
//       setIsSubmitting(true);

//       const requiredFields = [
//         "stoneCategory",
//         "stoneName",
//         "origin",
//         "portName",
//         "units",
//         "height",
//         "width",
//         "length",
//         "supplyCapacity",
//         "quantity",
//         "minimumOrder",
//         "description",
//       ];

//       for (const key of requiredFields) {
//         const value = block[key];
//         if (!value?.toString().trim()) {
//           toast.error(`Please enter the ${key}`, { duration: 1000 });
//           return;
//         }
//       }

//       const hasValidPriceA = block.symbolA && block.priceA;
//       const hasValidPriceB = block.symbolB && block.priceB;
//       const hasValidPriceC = block.symbolC && block.priceC;

//       if (!hasValidPriceA && !hasValidPriceB && !hasValidPriceC) {
//         toast.error("Enter at least one grade price", { duration: 2000 });
//         return;
//       }

//       // Check images
//       if (!block.images || block.images.length === 0) {
//         toast.error("Please upload at least 1 image", { duration: 1000 });
//         return;
//       }

//       // Helper function for uploading files
//       const uploadFiles = async (files, folder) => {
//         if (!files || files.length === 0) return [];

//         return Promise.all(
//           files.map(async (file, index) => {
//             if (typeof file === "string") return file;
//             if (file?.url) return file.url;
//             const storageRef = ref(
//               storage,
//               `blocks/${uid}/${folder}/${Date.now()}_${index}_${file.name}`,
//             );

//             await uploadBytes(storageRef, file);
//             return getDownloadURL(storageRef);
//           }),
//         );
//       };

//       const videoUrls = await uploadFiles(block.videos, "videos");
//       const imageUrls = await uploadFiles(block.images, "images");

//       const finalBlock = {
//         ...block,
//         videos: videoUrls,
//         images: imageUrls,
//         origin: block.origin?.label || "",
//         units: block.units?.value || "",
//         symbolA: block.symbolA?.value || "",
//         symbolB: block.symbolB?.value || "",
//         symbolC: block.symbolC?.value || "",
//         documents: block.documents.map((d) => (d.url ? d : { name: d.name })),
//       };

//       // Update user collection
//       const refDoc = doc(db, "SellerDetails", uid, "SellBlocks", docId);
//       const snap = await getDoc(refDoc);

//       if (!snap.exists()) return;

//       const data = snap.data();

//       const updatedBlocks = data.blocks.map((b) =>
//         b.id === productSlug ? finalBlock : b,
//       );
//       ``;

//       await updateDoc(refDoc, {
//         blocks: updatedBlocks,
//         updatedAt: new Date(),
//       });

//       // Update main collection
//       const mainRef = doc(db, "BuyAndSellBlocks", docId);
//       const mainSnap = await getDoc(mainRef);

//       if (mainSnap.exists()) {
//         const mainData = mainSnap.data();
//         const updatedMainBlocks = mainData.blocks.map((b) =>
//           b.id === blockId ? finalBlock : b,
//         );
//         await updateDoc(mainRef, {
//           blocks: updatedMainBlocks,
//           updatedAt: new Date(),
//         });
//       }

//       toast.success("Block updated successfully");
//       navigate(-1);
//     } catch (err) {
//       console.error("Save block error:", err);
//       toast.error("Save failed");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex h-screen items-center justify-center bg-white">
//         <img src="/logo.png" alt="Loading" className="w-16 animate-pulse" />
//       </div>
//     );
//   }

//   if (!block) {
//     return;
//   }
//   return (
//     <div className="pt-18 md:pt-22 max-lg:px-4 lg:mx-24 xl:mx-32">
//       <div className="md:justify-center md:flex gap-5 ">
//         <div className="md:w-3/5">
//           <span className=" ml-1 inline-block text-base md:text-2xl font-medium text-[#871B58] ">
//             Edit Block
//           </span>
//           <div className="bg-white border  border-gray-300 rounded-xl shadow-sm p-4  w-full max-w-full">
//             <BlockFields
//               block={block}
//               setBlock={setBlock}
//               countryOptions={countryOptions}
//               handleFile={handleFile}
//               handleIncrement={handleIncrement}
//               handleDecrement={handleDecrement}
//             />
//           </div>
//         </div>
//         <div className="md:w-2/5">
//           <div className="space-y-2 my-4">
//             <h2 className="text-xs font-medium">Upload Block image/video</h2>

//             <MediaUploader product={block} setProduct={setBlock} />
//           </div>
//           {block.documents.length > 0 &&
//             block.documents.map((docItem, index) => (
//               <div
//                 key={index}
//                 className="w-full relative group bg-gray-50 rounded-md border border-gray-200 p-2 mb-2"
//               >
//                 <p className="text-[10px] w-full">
//                   {docItem.name || "Document"}
//                 </p>

//                 <button
//                   type="button"
//                   className="absolute text-[10px] cursor-pointer top-1/2 right-2 transform -translate-y-1/2 border border-red-500 bg-white/80 p-0.5 rounded-full text-red-500 hover:bg-white hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100 z-20"
//                   onClick={() => {
//                     setBlock((prev) => ({
//                       ...prev,
//                       documents: prev.documents.filter((_, i) => i !== index),
//                     }));
//                   }}
//                 >
//                   <RxCross2 />
//                 </button>
//               </div>
//             ))}
//           <div className="mt-6 gap-3 flex justify-end">
//             <button
//               type="button"
//               onClick={() => navigate(-1)}
//               className="px-4 py-2 md:px-8 border border-gray-300 rounded-md text-gray-700 text-xs cursor-pointer hover:bg-gray-50"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleSaveBlock}
//               className="bg-[#871B58] hover:bg-[#6a1545] px-4 py-2 md:px-5 lg:px-10 xl:px-12 rounded-md text-white text-xs cursor-pointer"
//               disabled={isSubmitting}
//             >
//               {isSubmitting ? (
//                 <div className="flex items-center justify-center">
//                   <svg
//                     className="animate-spin h-5 w-5 text-white mr-1"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                   >
//                     <circle
//                       className="opacity-25"
//                       cx="12"
//                       cy="12"
//                       r="10"
//                       stroke="currentColor"
//                       strokeWidth="4"
//                     ></circle>
//                     <path
//                       className="opacity-75"
//                       fill="currentColor"
//                       d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                     ></path>
//                   </svg>
//                   <span>Saving...</span>
//                 </div>
//               ) : (
//                 "Save Changes"
//               )}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default page;
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
      <div className="flex h-screen items-center justify-center bg-white">
        <img src="/logo.png" alt="Loading" className="w-16 animate-pulse" />
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
                  className="absolute text-[10px] cursor-pointer top-1/2 right-2 transform -translate-y-1/2 border border-red-500 bg-white/80 p-0.5 rounded-full text-red-500 hover:bg-white hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100 z-20"
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
