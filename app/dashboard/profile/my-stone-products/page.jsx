"use client";
import { useState } from "react";
import Pagination from "@/app/components/common/Pagination";
import usePagination from "@/app/hooks/usePagination";
import { useRouter, useSearchParams } from "next/navigation";
import { toSlug } from "@/app/utils/helpers";
import useGallery from "@/app/hooks/useGallery";
import EditCompanyModal from "@/app/components/common/gallery/EditCompanyModal";
import GalleryCard from "@/app/components/common/gallery/GalleryCard";
import ProductCard from "./ProductCard";
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
    data: stoneProduct,
    deleteItem,
    deleteProduct,
    handleCancel,
    updateThumbnail,
    handleProductFeedback,
    updateCompanyDetails,
  } = useGallery("sellStoneProducts");

  const { paginatedData, currentPage, onPageChange } = usePagination({
    data: stoneProduct,
    itemsPerPage: ITEMS_PER_PAGE,
  });

  const handleViewDetails = (item, product) => {
    const companySlug = toSlug(item.companyDetails.shopName);
    const productSlug = toSlug(product.productName);

    router.push(
      `/dashboard/profile/my-stone-products/${companySlug}/${productSlug}`,
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
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-gray-900 mx-auto"></div>
          <p className="mt-6 text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!loading && stoneProduct.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-center">
        <h2 className="text-2xl lg:text-5xl font-bold mb-2">
          No Stone Products Found
        </h2>
        <p className="text-gray-500 mb-4">
          You haven’t added anything to Stone Products yet.
        </p>

        <button
          onClick={() => router.push("/dashboard/stone-products-form")}
          className="border border-primary cursor-pointer text-primary px-6 py-3 rounded-xl hover:bg-primary hover:text-white transition"
        >
          Add Stone Products
        </button>
      </div>
    );
  }
  return (
    <div className="pt-16 px-4 md:px-6 lg:px-24 xl:px-32">
      <div className="flex justify-center my-2">
        <h1 className="rounded-full border border-primary px-6 py-2 text-primary font-semibold lg:text-xl text-center">
          My Stone Products
        </h1>
      </div>
      {stoneProduct.every((item) => item.status === "rejected") && (
        <div className="flex justify-end ">
          <button
            onClick={() => router.push("/dashboard/stone-products-form")}
            className="border border-primary cursor-pointer text-xs md:text-sm  font-medium text-primary px-4 py-2 rounded-xl hover:bg-primary hover:text-white transition"
          >
            Add Stone Product
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
              <ProductCard
                key={item.id}
                item={item}
                updating={updating}
                addSlabRoute="/dashboard/stone-products-form"
                actions={{
                  handleCancel,
                  updateThumbnail,
                  onEdit: openEdit,
                  onDelete: deleteItem,
                  onProductDelete: deleteProduct,
                  handleProductFeedback: handleProductFeedback,
                  onViewDetails: handleViewDetails,
                }}
              />
            ))}
          </div>
        </div>

        <div className="justify-center py-6">
          <Pagination
            itemsPerPage={ITEMS_PER_PAGE}
            totalItems={stoneProduct.length}
            currentPage={currentPage}
            onPageChange={onPageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default page;
