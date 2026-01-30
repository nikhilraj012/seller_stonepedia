"use client";
import { useState } from "react";
import Pagination from "@/app/components/common/Pagination";

import usePagination from "@/app/hooks/usePagination";
import { useRouter, useSearchParams } from "next/navigation";
import { toSlug } from "@/app/utils/helpers";
import GalleryCard from "../../components/GalleryCard";
import EditCompanyModal from "../../components/EditCompanyModal";
import useGallery from "@/app/hooks/useGallery";
const ITEMS_PER_PAGE = 1;
const page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [editId, setEditId] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  const [editForm, setEditForm] = useState({
    shopName: "",
    email: "",
    gstNumber: "",
  });
  const {
    loading,
    updating,
    data: eGallery,
    deleteItem,
    deleteProduct,
    updateThumbnail,
    updateCompanyDetails,
  } = useGallery("EGallery");

  // const { paginatedData, currentPage, onPageChange } = usePagination({
  //   data: eGallery,
  //   itemsPerPage: ITEMS_PER_PAGE,
  //   searchParams,
  //   setSearchParams,
  // });
  const { paginatedData, currentPage, onPageChange } = usePagination({
    data: eGallery,
    itemsPerPage: ITEMS_PER_PAGE,
  });

  // const handleViewDetails = (item, product) => {
  //   router.push(`/e-gallery/${item.orderId}/${toSlug(product.stoneName)}`, {
  //     state: { item, product },
  //   });
  // };

  const handleViewDetails = (item, product) => {
    const companySlug = toSlug(item.companyDetails.shopName);
    const productSlug = toSlug(product.stoneName);

    router.push(
      `/dashboard/profile/my-e-gallery/${companySlug}/${productSlug}`,
    );
  };
  const openEdit = (item) => {
    setEditId(item.id);
    setEditForm({
      shopName: item.companyDetails.shopName,
      email: item.companyDetails.email,
      gstNumber: item.companyDetails.gstNumber,
    });
    setEditOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    await updateCompanyDetails(editId, editForm);
    setEditOpen(false);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <img src="/logo.png" alt="Loading" className="w-16 animate-pulse" />
      </div>
    );
  }

  if (!loading && eGallery.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-center">
        <h2 className="text-2xl lg:text-5xl font-bold mb-2">
          No E-Gallery Found
        </h2>
        <p className="text-gray-500 mb-4">
          You haven’t added anything to E-Gallery yet.
        </p>
        <button
          onClick={() => router.push("/dashboard/e-gallery-form")}
          className="border border-primary cursor-pointer text-primary px-6 py-3 rounded-xl hover:bg-primary hover:text-white transition"
        >
          Add E-Gallery
        </button>
      </div>
    );
  }
  return (
    <div className="pt-18 md:pt-22 max-lg:px-4 lg:mx-24 xl:mx-32">
      <div className="flex justify-center my-2">
        <h1 className="rounded-full border border-primary px-6 py-2 text-primary font-semibold lg:text-xl text-center">
          My E-Gallery
        </h1>
      </div>
      {eGallery.every((item) => item.status === "rejected") && (
        <div className="flex justify-end ">
          <button
            onClick={() =>
              router.push(
                "/stonepedia-for-business/create-e-gallery/gallery-form",
              )
            }
            className="border border-primary cursor-pointer text-xs md:text-sm  font-medium text-primary px-4 py-2 rounded-xl hover:bg-primary hover:text-white transition"
          >
            Add E-Gallery
          </button>
        </div>
      )}
      {editOpen && (
        <EditCompanyModal
          open={editOpen}
          onClose={() => setEditOpen(false)}
          editForm={editForm}
          setEditForm={setEditForm}
          onSubmit={handleEditSubmit}
        />
      )}
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 ">
          <div className="space-y-4 mt-3">
            {paginatedData.map((item, i) => (
              <GalleryCard
                key={item.id}
                item={item}
                updating={updating}
                addSlabRoute="/stonepedia-for-business/create-e-gallery/gallery-form"
                actions={{
                  updateThumbnail,
                  onEdit: openEdit,
                  onDelete: deleteItem,
                  onProductDelete: deleteProduct,
                  onViewDetails: handleViewDetails,
                }}
              />
            ))}
          </div>
        </div>

        <div className="justify-center py-6">
          <Pagination
            itemsPerPage={ITEMS_PER_PAGE}
            totalItems={eGallery.length}
            currentPage={currentPage}
            onPageChange={onPageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default page;
