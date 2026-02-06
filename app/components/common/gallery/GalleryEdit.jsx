"use client";
import React, { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import MediaUploader from "@/app/components/common/gallery/MediaUploader";
import SlabFormFields from "@/app/components/SlabFormFields";
import { db, storage } from "@/app/firebase/config";
import { toSlug } from "@/app/utils/helpers";
import { useAuth } from "@/app/components/context/AuthContext";
import { useUi } from "../../context/UiContext";

const GalleryEdit = ({ mode }) => {
  const refs = useRef({});
  const { isAuthenticated, uid } = useAuth();
  const { isSubmitting, setIsSubmitting } = useUi();
  const { companySlug, productSlug } = useParams();
  const router = useRouter();
  const [gallery, setGallery] = useState(null);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const MODE_CONFIG = {
    gallery: {
      collectionName: "EGallery",
      basePath: "/my-e-gallery",
    },
    processing: {
      collectionName: "EGalleryForProcessingUnit",
      basePath: "/my-e-processing-unit",
    },
  };
  const config = MODE_CONFIG[mode];
  const { collectionName, basePath } = config;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!isAuthenticated) return;

        const qSnap = await getDocs(
          collection(db, "SellerDetails", uid, collectionName),
        );

        qSnap.forEach((docSnap) => {
          const data = docSnap.data();

          if (
            data?.companyDetails?.shopName &&
            toSlug(data.companyDetails.shopName) === companySlug
          ) {
            if (!Array.isArray(data.products)) return;

            const slab = data.products.find(
              (p) => toSlug(p.stoneName) === productSlug,
            );

            if (slab) {
              setGallery({
                id: docSnap.id,
                ...data,
              });

              setProduct({
                ...slab,
                units:
                  typeof slab.units === "string"
                    ? { label: slab.units, value: slab.units }
                    : slab.units,
              });
            }
          }
        });
      } catch (err) {
        console.log(err);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [companySlug, productSlug]);

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
        return { url: await getDownloadURL(fileRef), type: file.type };
      }),
    );
  };

  const handleSaveChanges = async () => {
    try {
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

      const tempProduct = {
        ...product,

        finish: [...product.finish],
        thickness: [...product.thickness],
        units: product.units?.label,
        size: {
          width: [...product.size.width],
          height: [...product.size.height],
        },
      };

      const focusField = (key) => {
        const dropdownKeys = new Set([
          "finish",
          "thickness",
          "height",
          "width",
        ]);
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

      setIsSubmitting(true);

      if (!isAuthenticated) return;
      const newMedia = await uploadFiles(
        product.media.filter((m) => m.file),
        `products/${product.id}`,
      );

      const finalMedia = [...product.media.filter((m) => !m.file), ...newMedia];

      const updatedSlab = {
        ...product,
        units: product.units?.label,
        media: finalMedia,
      };
      const updatedProducts = gallery.products.map((p) =>
        p.id === updatedSlab.id ? updatedSlab : p,
      );

      const uRef = doc(db, "SellerDetails", uid, collectionName, gallery.id);
      const gRef = doc(db, collectionName, gallery.id);

      
      await updateDoc(uRef, { products: updatedProducts });
      await updateDoc(gRef, { products: updatedProducts });

      toast.success("Slab updated successfully");
      // if (toSlug(product.stoneName) !== productSlug) {
         router.replace(
          `/dashboard/profile/${basePath}/${companySlug}/${toSlug(product.stoneName)}`
        );
      // } else {
      //   router.back(); // fallback: just go back
      // }
    } catch (err) {
      console.log(err);
      toast.error("Update failed");
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

  if (!product) return null;

  return (
    <>
      <div className="flex justify-center max-lg:px-4 lg:mx-24 xl:mx-32">
        <div className="pt-19 md:pt-22   md:w-3/5 ">
          {isSubmitting && (
            <div className="fixed inset-0 bg-black/10 z-50 flex items-center justify-center">
              <img
                src="/images/logo1.png"
                alt="Loading"
                className="w-20 md:w-24 animate-pulse"
              />
            </div>
          )}

          <span className="text-center ml-1 inline-block text-base md:text-2xl font-medium text-primary ">
            Edit Slab
          </span>

          <div className="md:flex justify-center">
            <div className="bg-white border border-gray-300 rounded-xl shadow-sm p-4  w-full max-w-full">
              <h2 className="text-xs font-medium mb-1">Stone Slab Details</h2>
              <SlabFormFields
                product={product}
                setProduct={setProduct}
                hideMedia={true}
              />
              <MediaUploader product={product} setProduct={setProduct} />
              <div className="mt-6 gap-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-4 py-2 md:px-8 border border-gray-300 rounded-md text-gray-700 text-xs cursor-pointer hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveChanges}
                  className="bg-primary hover:bg-[#6a1545] px-4 py-2 md:px-5 lg:px-10 xl:px-12 rounded-md text-white text-xs cursor-pointer"
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
                      <span>Saving...</span>
                    </div>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GalleryEdit;
