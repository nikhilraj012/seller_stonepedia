"use client";

import { useParams, useRouter } from "next/navigation";
import {
  deleteDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { RiDeleteBin5Line } from "react-icons/ri";
import { TiDeleteOutline } from "react-icons/ti";
import { MdOutlineEdit } from "react-icons/md";
import toast from "react-hot-toast";

import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import useMediaPlayer from "@/app/hooks/useMediaPlayer";

import { useAuth } from "@/app/components/context/AuthContext";
import MediaGrid from "@/app/components/common/MediaGrid";
import { db, storage } from "@/app/firebase/config";
import { toSlug } from "@/app/utils/helpers";

const GalleryDetails = ({ mode }) => {
  const router = useRouter();

  const { isAuthenticated, uid } = useAuth();
  const fileRef = useRef(null);
  const mediaPlayer = useMediaPlayer();

  const [isUpdating, setIsUpdating] = useState(false);
  const { companySlug, productSlug } = useParams();
  const [item, setItem] = useState(null);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  // const mode = "gallery";
  const MODE_CONFIG = {
    gallery: {
      collectionName: "EGallery",
      basePath: "my-e-gallery",
    },
    processing: {
      collectionName: "EGalleryForProcessingUnit",
      basePath: "my-e-processing-unit",
    },
    chemicals: {
      collectionName: "chemicals",
      basePath: "my-chemicals",
    },
  };
  const config = MODE_CONFIG[mode];
  const { collectionName, basePath } = config;

  const status = item?.status?.toLowerCase();
  const canEdit = status === "pending";

  useEffect(() => {
    if (!uid) return;

    const fetchData = async () => {
      setLoading(true);

      try {
        const qSnap = await getDocs(
          collection(db, "SellerDetails", uid, config.collectionName),
        );

        qSnap.forEach((docSnap) => {
          const data = docSnap.data();

          if (toSlug(data.companyDetails.shopName) === companySlug) {
            const prod = data.products.find(
              (p) => toSlug(p.stoneName) === productSlug,
            );

            if (prod) {
              setItem({ id: docSnap.id, ...data });
              setProduct(prod);
            }
          }
        });
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [uid, companySlug, productSlug]); // make sure latest slug is used

  const handleThumbnailChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUpdating(true);
    const toastId = toast.loading("Updating thumbnail...");
    try {
      const uploadFiles = async (files, path) => {
        if (!files) return [];
        const fileArray = Array.isArray(files) ? files : [files];
        return Promise.all(
          fileArray.map(async (f) => {
            const file = f.file || f;
            const name = file.name || `file_${Date.now()}`;
            const fileRef = ref(
              storage,
              `${collectionName}/${uid}/${path}/${name}`,
            );

            await uploadBytes(fileRef, file);
            const url = await getDownloadURL(fileRef);

            return { url, type: file.type, name };
          }),
        );
      };

      const uploaded = await uploadFiles([file], `products/${product.id}`);

      const newThumbnail = uploaded[0];
      setProduct((prev) => ({
        ...prev,
        thumbnail: newThumbnail,
      }));
      setItem((prev) => ({
        ...prev,
        products: prev.products.map((p) =>
          p.id === product.id ? { ...p, thumbnail: newThumbnail } : p,
        ),
      }));

      if (!isAuthenticated) return;
      console.log(item.id);
      const gRef = doc(db, collectionName, item.id);
      const uRef = doc(db, "SellerDetails", uid, collectionName, item.id);

      const updateProductThumbnail = (products) =>
        products.map((p) =>
          p.id === product.id ? { ...p, thumbnail: newThumbnail } : p,
        );

      const snap = await getDoc(gRef);
      if (!snap.exists()) return;

      const updatedProducts = updateProductThumbnail(snap.data().products);
      console.log(updatedProducts);
      await updateDoc(gRef, { products: updatedProducts });
      await updateDoc(uRef, { products: updatedProducts });

      toast.success("Thumbnail updated successfully!", { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error("Thumbnail update failed", { id: toastId });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleThumbnailRemove = async (productId) => {
    setIsUpdating(true);
    const toastId = toast.loading("Removing thumbnail...");

    try {
      if (!isAuthenticated || !item) return;

      const updateProducts = (products) =>
        products.map((p) =>
          p.id === productId ? { ...p, thumbnail: null } : p,
        );

      const userRef = doc(db, "SellerDetails", uid, collectionName, item.id);
      const globalRef = doc(db, collectionName, item.id);

      const snap = await getDoc(globalRef);
      if (!snap.exists()) return;

      const updatedProducts = updateProducts(snap.data().products);

      await updateDoc(userRef, { products: updatedProducts });
      await updateDoc(globalRef, { products: updatedProducts });
      setItem((prev) => ({
        ...prev,
        products: updateProducts(prev.products),
      }));

      setProduct((prev) => ({
        ...prev,
        thumbnail: null,
      }));
      toast.success("Thumbnail removed", { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove thumbnail", { id: toastId });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteProduct = async () => {
    setIsUpdating(true);
    const toastId = toast.loading("Deleting...");

    try {
      if (!isAuthenticated || !item || !product) return;

      const userRef = doc(db, "SellerDetails", uid, collectionName, item.id);
      const globalRef = doc(db, collectionName, item.id);

      if (item.products.length === 1) {
        await deleteDoc(userRef);
        await deleteDoc(globalRef);

        toast.success("deleted successfully", { id: toastId });
        router.back();
        return;
      }

      const updatedProducts = item.products.filter((p) => p.id !== product.id);

      await updateDoc(userRef, { products: updatedProducts });
      await updateDoc(globalRef, { products: updatedProducts });

      toast.success("Product deleted successfully", { id: toastId });
      router.back();
    } catch (error) {
      console.error(error);
      toast.error("Delete failed", { id: toastId });
    } finally {
      setIsUpdating(false);
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

  if (!item) {
    return <p className="text-center mt-20">No Data Found</p>;
  }

  return (
    <div className="pt-16 md:pt-19  max-lg:px-4 lg:mx-24 xl:mx-32">
      <h1 className="text-center mb-3   inline-block text-base md:text-2xl font-medium text-primary">
        Product Details
      </h1>
      <div className="px-4 bg-white rounded-xl shadow-sm border border-gray-300">
        <div className="py-3 sm:py-4 border-b border-gray-300 relative">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
            <div className="flex flex-row gap-3 sm:gap-4">
              <input
                ref={fileRef}
                id="thumbnail"
                type="file"
                disabled={isUpdating}
                accept="image/jpeg,image/jpg,image/png"
                className="hidden"
                onChange={handleThumbnailChange}
              />

              <div
                className={`text-[8px] group flex flex-col items-center justify-center bg-[#F6F6F6] rounded-md h-20 w-20 sm:h-28 sm:w-28  hover:bg-gray-200 transition-colors relative
                  ${canEdit ? "cursor-pointer" : "cursor-not-allowed"}
                `}
                onClick={() => {
                  if (canEdit && !isUpdating) {
                    fileRef.current?.click();
                  }
                }}
              >
                {product.thumbnail?.url ? (
                  <>
                    <img
                      src={product.thumbnail.url}
                      alt="Thumbnail"
                      className="h-full w-full  rounded-md"
                    />
                    {canEdit && (
                      <button
                        type="button"
                        onClick={(ev) => {
                          ev.stopPropagation();
                          handleThumbnailRemove(product.id);
                        }}
                        className="absolute  bg-white text-red-600   rounded-full  -top-0.5 right-0 cursor-pointer  opacity-0 group-hover:opacity-100  "
                      >
                        <TiDeleteOutline className="w-3 h-3 md:w-5 md:h-5" />
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <div className="cursor-pointer h-5 w-5">
                      <svg
                        viewBox="0 0 33 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M16.5016 8.80156C16.5016 10.7111 15.743 12.5425 14.3927 13.8927C13.0425 15.243 11.2111 16.0016 9.30156 16.0016C7.392 16.0016 5.56066 15.243 4.21039 13.8927C2.86013 12.5425 2.10156 10.7111 2.10156 8.80156C2.10156 6.892 2.86013 5.06066 4.21039 3.71039C5.56066 2.36013 7.392 1.60156 9.30156 1.60156C11.2111 1.60156 13.0425 2.36013 14.3927 3.71039C15.743 5.06066 16.5016 6.892 16.5016 8.80156ZM10.1016 5.60156C10.1016 5.38939 10.0173 5.18591 9.86725 5.03588C9.71722 4.88585 9.51374 4.80156 9.30156 4.80156C9.08939 4.80156 8.88591 4.88585 8.73588 5.03588C8.58585 5.18591 8.50156 5.38939 8.50156 5.60156V8.00156H6.10156C5.88939 8.00156 5.68591 8.08585 5.53588 8.23588C5.38585 8.38591 5.30156 8.58939 5.30156 8.80156C5.30156 9.01374 5.38585 9.21722 5.53588 9.36725C5.68591 9.51728 5.88939 9.60156 6.10156 9.60156H8.50156V12.0016C8.50156 12.2137 8.58585 12.4172 8.73588 12.5672C8.88591 12.7173 9.08939 12.8016 9.30156 12.8016C9.51374 12.8016 9.71722 12.7173 9.86725 12.5672C10.0173 12.4172 10.1016 12.2137 10.1016 12.0016V9.60156H12.5016C12.7137 9.60156 12.9172 9.51728 13.0672 9.36725C13.2173 9.21722 13.3016 9.01374 13.3016 8.80156C13.3016 8.58939 13.2173 8.38591 13.0672 8.23588C12.9172 8.08585 12.7137 8.00156 12.5016 8.00156H10.1016V5.60156ZM22.9016 6.40156H17.7704C17.6135 5.84899 17.4029 5.3131 17.1416 4.80156H22.9016C24.1746 4.80156 25.3955 5.30728 26.2957 6.20745C27.1959 7.10763 27.7016 8.32852 27.7016 9.60156V22.4016C27.7016 23.6746 27.1959 24.8955 26.2957 25.7957C25.3955 26.6959 24.1746 27.2016 22.9016 27.2016H10.1016C8.82852 27.2016 7.60763 26.6959 6.70745 25.7957C5.80728 24.8955 5.30156 23.6746 5.30156 22.4016V16.6416C5.8093 16.9018 6.34263 17.1114 6.90156 17.2704V22.4016C6.90156 22.9984 7.06476 23.5568 7.34956 24.0336L14.82 16.6928C15.2687 16.2521 15.8726 16.0051 16.5016 16.0051C17.1305 16.0051 17.7344 16.2521 18.1832 16.6928L25.6552 24.0336C25.9477 23.5395 26.1019 22.9758 26.1016 22.4016V9.60156C26.1016 8.75287 25.7644 7.93894 25.1643 7.33882C24.5642 6.7387 23.7503 6.40156 22.9016 6.40156ZM22.9016 12.0016C22.9016 12.3167 22.8395 12.6288 22.7189 12.92C22.5983 13.2112 22.4215 13.4758 22.1986 13.6986C21.9758 13.9215 21.7112 14.0983 21.42 14.2189C21.1288 14.3395 20.8167 14.4016 20.5016 14.4016C20.1864 14.4016 19.8743 14.3395 19.5831 14.2189C19.2919 14.0983 19.0274 13.9215 18.8045 13.6986C18.5816 13.4758 18.4049 13.2112 18.2843 12.92C18.1636 12.6288 18.1016 12.3167 18.1016 12.0016C18.1016 11.365 18.3544 10.7546 18.8045 10.3045C19.2546 9.85442 19.865 9.60156 20.5016 9.60156C21.1381 9.60156 21.7485 9.85442 22.1986 10.3045C22.6487 10.7546 22.9016 11.365 22.9016 12.0016ZM21.3016 12.0016C21.3016 11.7894 21.2173 11.5859 21.0672 11.4359C20.9172 11.2858 20.7137 11.2016 20.5016 11.2016C20.2894 11.2016 20.0859 11.2858 19.9359 11.4359C19.7858 11.5859 19.7016 11.7894 19.7016 12.0016C19.7016 12.2137 19.7858 12.4172 19.9359 12.5672C20.0859 12.7173 20.2894 12.8016 20.5016 12.8016C20.7137 12.8016 20.9172 12.7173 21.0672 12.5672C21.2173 12.4172 21.3016 12.2137 21.3016 12.0016ZM8.48236 25.1632C8.97351 25.4507 9.53245 25.602 10.1016 25.6016H22.9016C23.4936 25.6016 24.0456 25.4416 24.5208 25.1632L17.0616 17.8352C16.912 17.6886 16.711 17.6065 16.5016 17.6065C16.2922 17.6065 16.0911 17.6886 15.9416 17.8352L8.48236 25.1632Z"
                          fill="#3B3B3B"
                        />
                      </svg>
                    </div>
                    <span> {canEdit ? "Add Thumbnail" : "No Thumbnail"}</span>
                  </>
                )}
                {isUpdating && (
                  <div className="absolute inset-0 bg-white/60 rounded-md flex items-center justify-center cursor-not-allowed z-10"></div>
                )}
              </div>
              <div className="text-xs capitalize sm:text-[15px] space-y-0.5">
                <h1 className="text-sm sm:text-xl lg:text-[27px] font-semibold text-[#262626] wrap-break-word">
                  {product.stoneName}
                </h1>

                <p className="text-xs  sm:text-[15px] text-[#7F7F7F] font-medium">
                  {product.stoneCategory}
                </p>

                <p className="text-xs lg:mt-3  sm:text-[15px] text-[#8F8F8F] font-medium">
                  <span className="text-[#414141]">Location:</span>{" "}
                  {item.companyDetails.city}, {item.companyDetails.country}
                </p>
              </div>
            </div>
            <div className="flex justify-end">
              <div className="flex gap-2  sm:items-start items-center sm:self-auto self-start">
                {status === "pending" && (
                  <button
                    type="button"
                    disabled={isUpdating}
                    className={`p-2 rounded-lg bg-gray-100 text-gray-700 transition
                    ${
                      isUpdating
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer hover:text-gray-500"
                    }`}
     
                    onClick={() => {
                      const newSlug = toSlug(product.stoneName);
                      router.replace(
                        `/dashboard/profile/${basePath}/${companySlug}/${newSlug}/edit`,
                      );
                    }}
                  >
                    <MdOutlineEdit className="text-sm lg:text-lg" />
                  </button>
                )}
                {/* {(status === "approved" || status === "pending") && (
                  <button
                    onClick={handleDeleteProduct}
                    type="button"
                    disabled={isUpdating}
                    className={`p-2 bg-gray-100 hover:text-red-700 text-red-500 cursor-pointer   rounded-lg transition  ${
                      isUpdating
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                  >
                    <RiDeleteBin5Line className="text-sm lg:text-lg" />
                  </button>
                )} */}
              </div>
            </div>
          </div>
        </div>
        <div className="py-2 sm:py-2 border-b border-gray-300">
          <h3 className="mt-2 text-[13px] md:text-sm font-medium text-[#000000] mb-1">
            Description
          </h3>
          <p className="text-[10px] sm:text-[14px]  text-[#3B3B3B] leading-relaxed">
            {product.description ||
              "Discover our innovative item block, designed to enhance functionality and aesthetics. Perfect for modern spaces, it combines style with practicality for everyday use. Discover our innovative item block, designed to enhance functionality and aesthetics. Perfect for modern spaces, it combines style with practicality for everyday use."}
          </p>
        </div>

        <div className=" py-3 sm:py-4 border-b border-gray-300">
          <h3 className="text-xs sm:text-sm font-medium underline text-[#040404] mb-2 sm:mb-3">
            Details
          </h3>

          <div className="grid capitalize grid-cols-1 sm:grid-cols-2  text-[#838383] md:grid-cols-3 lg:grid-cols-4 text-xs sm:text-sm  gap-y-2 gap-x-10">
            <p>
              <span className="font-medium text-[#000000]">Finish:</span>{" "}
              {product.finish.join(", ")}
            </p>
            <p>
              <span className="font-medium text-[#000000]">Thickness:</span>{" "}
              {product.thickness.join(", ")}
            </p>
            <p>
              <span className="font-medium text-[#000000]">Unit:</span>{" "}
              {product.units}
            </p>
            <p>
              <span className="font-medium text-[#000000]">Sizes:</span> H:{" "}
              {product.size.height.join(", ")} | W:{" "}
              {product.size.height.join(", ")}
            </p>
          </div>
        </div>

        <div className=" max-h-[380px] scrollbar-hide overflow-y-auto  py-3 border-b border-gray-300">
          <h3 className="text-xs sm:text-sm font-medium text-[#000000] mb-2 sm:mb-3">
            Stone Image's / Videos
          </h3>
          {product.media.length ? (
            <MediaGrid
              media={product.media}
              mediaPlayer={mediaPlayer}
              prefix="e"
            />
          ) : (
            <p>No Media Provided</p>
          )}
        </div>
      </div>
    </div>
  );
};
export default GalleryDetails;
