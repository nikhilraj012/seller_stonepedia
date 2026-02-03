import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/firebase/config";
import { useAuth } from "@/app/components/context/AuthContext";

const businessCategories = [
  // {
  //   id: 1,
  //   title: "Block",
  //   description:
  //     "A block seller trades large quantities of assets, influencing market prices significantly.",
  //   image: "/images/dashboard/block.webp",
  //   route: "/dashboard/blocks-form",
  // },
  {
    id: 2,
    title: "E-processing unit",
    description:
      "List electronic processing units here to reach the right buyers faster.",
    image: "/images/dashboard/processing-unit.webp",
    route: "/dashboard/e-processing-unit-form",
  },
  {
    id: 3,
    title: "E-Gallery",
    description:
      "An E-gallery empowers sellers to showcase and sell their art to a global audience.",
    image: "/images/dashboard/gallery.webp",
    route: "/dashboard/e-gallery-form",
  },
  // {
  //   id: 4,
  //   title: "Stone Product",
  //   description:
  //     "A stone product allows sellers to present unique creations to customers worldwide.",
  //   image: "/images/dashboard/stone-product.webp",
  //   route: "/dashboard/stone-products-form",
  // },
];

const Dashboard = () => {
  const router = useRouter();
  const { uid } = useAuth();
  const [blocksStatus, setBlocksStatus] = useState(null);
  const [eProcessingStatus, setEProcessingStatus] = useState(null);
  const [eGalleryStatus, setEGalleryStatus] = useState(null);
  const [eProcessingGalleryId, setEProcessingGalleryId] = useState(null);
  const [eGalleryId, setEGalleryId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkRegistrations = async () => {
      if (!uid) {
        setLoading(false);
        return;
      }

      try {
        // Check Blocks status
        // const blocksRef = collection(db, "SellerDetails", uid, "SellBlocks");
        // const blocksSnapshot = await getDocs(blocksRef);
        
        // if (!blocksSnapshot.empty) {
        //   const docs = blocksSnapshot.docs.map(doc => doc.data());
        //   const hasApproved = docs.some(doc => doc.status === "approved");
        //   const hasPending = docs.some(doc => doc.status === "pending");
        //   const allRejectedOrCancelled = docs.every(doc => 
        //     doc.status === "rejected" || doc.status === "cancelled"
        //   );
          
        //   if (hasApproved) {
        //     setBlocksStatus("approved");
        //   } else if (hasPending) {
        //     setBlocksStatus("pending");
        //   } else if (allRejectedOrCancelled) {
        //     setBlocksStatus("rejected");
        //   }
        // }

        // Check E-Processing Unit status
        const eProcessingRef = collection(db, "SellerDetails", uid, "EGalleryForProcessingUnit");
        const eProcessingSnapshot = await getDocs(eProcessingRef);
        
        if (!eProcessingSnapshot.empty) {
          const docs = eProcessingSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
          const hasApproved = docs.some(doc => doc.status === "approved");
          const hasPending = docs.some(doc => doc.status === "pending");
          const allRejectedOrCancelled = docs.every(doc => 
            doc.status === "rejected" || doc.status === "cancelled"
          );
          
          if (hasApproved) {
            setEProcessingStatus("approved");
            // Find the first approved gallery ID
            const approvedGallery = docs.find(doc => doc.status === "approved");
            setEProcessingGalleryId(approvedGallery?.id || null);
          } else if (hasPending) {
            setEProcessingStatus("pending");
          } else if (allRejectedOrCancelled) {
            setEProcessingStatus("rejected");
          }
        }

        // Check E-Gallery status
        const eGalleryRef = collection(db, "SellerDetails", uid, "EGallery");
        const eGallerySnapshot = await getDocs(eGalleryRef);
        
        if (!eGallerySnapshot.empty) {
          const docs = eGallerySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
          const hasApproved = docs.some(doc => doc.status === "approved");
          const hasPending = docs.some(doc => doc.status === "pending");
          const allRejectedOrCancelled = docs.every(doc => 
            doc.status === "rejected" || doc.status === "cancelled"
          );
          
          if (hasApproved) {
            setEGalleryStatus("approved");
            // Find the first approved gallery ID
            const approvedGallery = docs.find(doc => doc.status === "approved");
            setEGalleryId(approvedGallery?.id || null);
          } else if (hasPending) {
            setEGalleryStatus("pending");
          } else if (allRejectedOrCancelled) {
            setEGalleryStatus("rejected");
          }
        }
      } catch (error) {
        console.error("Error checking registrations:", error);
      } finally {
        setLoading(false);
      }
    };

    checkRegistrations();
  }, [uid]);

  const getButtonText = (categoryId) => {
    if (categoryId === 1) { // Blocks
      if (blocksStatus === "approved") return "Add Block";
      if (blocksStatus === "pending") return "My Blocks";
      return "Register";
    }
    if (categoryId === 2) { // E-processing unit
      if (eProcessingStatus === "approved" ) return "Add Product";
      if (eProcessingStatus === "pending") return "My E-Processing Unit";
      return "Register";
    }
    if (categoryId === 3) { // E-Gallery
      if (eGalleryStatus === "approved") return "Add Product";
      if (eGalleryStatus === "pending") return "My E-Gallery";
      return "Register";
    }
    return "Register";
  };

  const getButtonRoute = (category) => {
    if (category.id === 1) { // Blocks
      if (blocksStatus === "approved") return "/dashboard/profile/my-blocks";
      if (blocksStatus === "pending") return "/dashboard/profile/my-blocks";
      return category.route;
    }
    if (category.id === 2) { // E-processing unit
      if (eProcessingStatus === "approved" && eProcessingGalleryId) {
        return `/dashboard/e-processing-unit-form/${eProcessingGalleryId}/add-product`;
      }
      if (eProcessingStatus === "pending") return "/dashboard/profile/my-e-processing-unit";
      return category.route;
    }
    if (category.id === 3) { // E-Gallery
      if (eGalleryStatus === "approved" && eGalleryId) {
        return `/dashboard/e-gallery-form/${eGalleryId}/add-product`;
      }
      if (eGalleryStatus === "pending") return "/dashboard/profile/my-e-gallery";
      return category.route;
    }
    return category.route;
  };

  return (
    <div className="pt-14 px-4 md:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center text-center mb-8 md:mb-12">
          <div className="bg-[#f6f6f6] px-5 py-2 rounded-full m-4">
            <p className="text-base text-black font-medium">categories</p>
          </div>
          <h1 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold text-[#141219] mb-2 lg:mb-4 xl:mb-6">
            Explore Product Categories
          </h1>
          <p className="text-xs md:text-sm lg:text-base text-black max-w-xl">
            List your stone slabs, blocks and all stone related products in
            separate categories to reach the right buyers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
          {businessCategories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-[20px] shadow-[0px_4px_60px_0px_rgba(0,0,0,0.12)] p-3 flex flex-col"
            >
              <div className="relative w-full h-[190px] rounded-[10px] overflow-hidden mb-3">
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex flex-col flex-1">
                <div className="flex flex-col gap-4 mb-6">
                  <h2 className="text-2xl font-medium text-[#141219] text-center">
                    {category.title}
                  </h2>
                  <p className="text-sm text-[#141219] text-center">
                    {category.description}
                  </p>
                </div>

                <button
                  onClick={() => router.push(getButtonRoute(category))}
                  className="w-full border border-[#141219]/20 rounded-[40px] px-8 py-4 text-base font-medium text-[#141219] hover:bg-gray-50 transition-colors mt-auto cursor-pointer"
                >
                  {getButtonText(category.id)}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
