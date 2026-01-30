import React, { useRef, useState } from "react";
import { IoLocation } from "react-icons/io5";
import { RiDeleteBin5Line } from "react-icons/ri";
import { MdOutlineEdit } from "react-icons/md";
import toast from "react-hot-toast";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuth } from "@/app/components/context/AuthContext";
import { useUi } from "@/app/components/context/UiContext";
import { db } from "@/app/firebase/config";
import ConfirmDialog from "@/app/components/common/ConfirmDialog";
import { useRouter } from "next/navigation";
const formatDate = (timestamp) => {
  if (!timestamp) return "";

  const date = timestamp.seconds
    ? new Date(timestamp.seconds * 1000) // Firestore Timestamp
    : new Date(timestamp); // normal timestamp

  return date.toLocaleDateString("en-US", {
    month: "long", // December
    day: "2-digit", // 25
    year: "numeric", // 2026
  });
};

const BlocksCard = ({ item, addBlockRoute, setData, onEdit }) => {
  const { uid } = useAuth();
  const router = useRouter();

  const [selectedBlock, setSelectedBlock] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [productImageLoading, setProductImageLoading] = useState({});
  const { navigate } = useUi();
  const fileRef = useRef(null);
  const status = item.status;
  const canEdit = String(status).toLowerCase() === "approved";

  const deleteItem = async (id) => {
    const toastId = toast.loading("Deleting...");
    try {
      console.log(uid);
      await deleteDoc(doc(db, "Users", uid, "SellBlocks", id));
      await deleteDoc(doc(db, "BuyAndSellBlocks", id));

      setData((prev) => prev.filter((i) => i.id !== id));
      toast.success("Deleted successfully", { id: toastId });
    } catch (e) {
      console.log(e);
      toast.error("Delete failed", { id: toastId });
    }
  };

  const deleteProduct = async (item, block) => {
    const toastId = toast.loading("Deleting block...");

    try {
      if (!uid || !item?.id || !block?.id) throw new Error("Invalid data");

      const userRef = doc(db, "Users", uid, "SellBlocks", item.id);
      const mainRef = doc(db, "BuyAndSellBlocks", item.id);

      const snap = await getDoc(userRef);
      if (!snap.exists()) throw new Error("Document not found");

      const latestBlocks = snap.data().blocks || [];

      const updatedBlocks = latestBlocks.filter((b) => b.id !== block.id);

      if (updatedBlocks.length === 0) {
        await deleteDoc(userRef);
        await deleteDoc(mainRef);

        setData((prev) => prev.filter((i) => i.id !== item.id));
        toast.success("block deleted", { id: toastId });
        return;
      }

      await updateDoc(userRef, { blocks: updatedBlocks });
      await updateDoc(mainRef, { blocks: updatedBlocks });

      // Update UI
      setData((prev) =>
        prev.map((i) =>
          i.id === item.id ? { ...i, blocks: updatedBlocks } : i,
        ),
      );

      toast.success("Block deleted", { id: toastId });
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Delete failed", { id: toastId });
    }
  };

  const handleViewDetails = (item, block) => {
    const companySlug = item.quarryDetails?.quarryName
      ?.toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");
    const productSlug = block.stoneName
      ?.toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");
    
    // Store the data in sessionStorage for the details page to retrieve
    sessionStorage.setItem('currentProduct', JSON.stringify({
      docId: item.id,
      blockId: block.id,
      companyData: item.quarryDetails
    }));
    
    router.push(`/dashboard/profile/my-blocks/${companySlug}/${productSlug}`);
  }


  return (
    <div>
      {showConfirm && (
        <ConfirmDialog
          message="Do you want to remove this block?"
          onCancel={() => {
            setShowConfirm(false);
            setSelectedBlock(null);
          }}
          onConfirm={() => {
            deleteProduct(item, selectedBlock);
            setShowConfirm(false);
            setSelectedBlock(null);
          }}
        />
      )}
      <div className={`flex   flex-col md:flex-row md:justify-between`}>
        <div className="flex flex-row gap-4">
          <div className="text-[10px] md:text-[13px] text-[#8A8A8A] lg:text-sm space-y-0.5">
            <h1 className="capitalize font-semibold text-[13px] md:text-[20px] lg:text-[22px] text-[#3B3B3B] wrap-break-word whitespace-normal">
              {item.quarryDetails.quarryName}
            </h1>
            <p className="break-all whitespace-normal">
              {item.quarryDetails.websiteUrl}
            </p>
            <p className="break-all whitespace-normal">
              {item.quarryDetails.emailId}
            </p>

            <div className="flex items-center gap-1   mt-1 ">
              <IoLocation className="text-primary text-[10px] md:text-sm" />
              <span>
                {" "}
                {item.quarryDetails?.quarryCity},{" "}
                {item.quarryDetails?.quarryCountry}
              </span>
            </div>
            <div className="text-[10px] lg:text-[13px] bg-[#F0F0F0]  px-2 py-1 md:py-1.5 rounded-md w-fit text-[#636363] mt-2">
              <div className="flex">
                {" "}
                <p className="pl-1">{formatDate(item.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex mt-2 justify-between  flex-row md:flex-col md:justify-start md:mt-0">
          <div
            className={`flex items-end md:justify-end gap-2 h-[40px] ${
              status !== "approved" && status !== "pending"
                ? "invisible"
                : "visible"
            }`}
          >
            {status === "approved" && (
              <button
                disabled={updating}
                onClick={() => onEdit(item)}
                type="button"
                className={`p-2 cursor-pointer bg-gray-100 text-gray-700 rounded-lg transition 
                 ${
                   updating
                     ? "opacity-50 cursor-not-allowed"
                     : "cursor-pointer hover:text-gray-500"
                 }`}
              >
                <MdOutlineEdit className="text-sm lg:text-xl" />
              </button>
            )}
            {(status === "approved" || status === "pending") && (
              <button
                disabled={updating}
                onClick={() => deleteItem(item.id)}
                className={`p-2 bg-gray-100 text-red-500 rounded-lg transition
                             ${
                               updating
                                 ? "opacity-50 cursor-not-allowed"
                                 : "cursor-pointer hover:text-red-700"
                             }`}
              >
                <RiDeleteBin5Line className="text-sm lg:text-xl" />
              </button>
            )}
          </div>
          <div>
            <div
              className={`hidden  md:flex   mt-17 items-center  capitalize  gap-2 text-[13px] font-medium px-3 py-1.5 rounded-md
                    ${
                      status === "approved"
                        ? "bg-[#F0FFEF] text-[#05A100]"
                        : status === "cancelled"
                          ? "bg-[#FFE7E7] text-red-600"
                          : status === "rejected"
                            ? "bg-gray-100 text-[#6B7280]"
                            : "bg-yellow-50 text-[#FF9D00]"
                    }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  status === "approved"
                    ? "bg-green-500"
                    : status === "cancelled"
                      ? "bg-red-500"
                      : status === "rejected"
                        ? "bg-gray-500"
                        : "bg-yellow-500"
                }`}
              />
              <span className="text-[#282828]">Status:</span>
              {status}
            </div>
          </div>
          <div
            className={` flex md:hidden   capitalize items-center gap-2 text-[10px]  font-medium px-3 py-1 rounded-md
                   ${
                     status === "approved"
                       ? "bg-[#F0FFEF] text-[#05A100]"
                       : status === "cancelled"
                         ? "bg-[#FFE7E7] text-red-600"
                         : status === "rejected"
                           ? "bg-gray-100 text-[#6B7280]"
                           : "bg-yellow-50 text-[#FF9D00]"
                   }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                status === "approved"
                  ? "bg-green-500"
                  : status === "cancelled"
                    ? "bg-red-500"
                    : status === "rejected"
                      ? "bg-gray-500 "
                      : "bg-yellow-500"
              }`}
            />
            <span className="text-[#282828] capitalize"> Status:</span> {status}
          </div>
        </div>
      </div>
      <div className="border-b py-3 border-gray-200" />

      <div className="flex justify-between items-center mt-4">
        <h1 className="text-[#000000] font-medium text-sm lg:text-base">
          Uploaded Blocks
        </h1>

        {/* {status.toLowerCase() === "approved" && (
    <button
      onClick={() =>
        navigate(addBlockRoute, {
          state: { hasApprovedForm: true },
        })
      }
      className="bg-primary text-white px-4 py-1.5 rounded-md text-xs md:text-sm hover:bg-green-700 transition"
    >
      Add Slab
    </button>
  )} */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 mb-4">
        {item.blocks?.map((block, i) => (
          <div
            key={i}
            className="border border-gray-300 rounded-xl p-3 shadow-sm bg-white"
          >
            <div className="relative w-full h-40 mb-3 rounded-lg bg-gray-100">
              {productImageLoading[i] !== false && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
                </div>
              )}

              <img
                src={block.thumbnail || block.images?.[0]}
                alt={block.stoneName}
                onLoad={() =>
                  setProductImageLoading((prev) => ({ ...prev, [i]: false }))
                }
                onError={() =>
                  setProductImageLoading((prev) => ({ ...prev, [i]: false }))
                }
                className={`w-full h-40 object-cover rounded-lg transition ${
                  productImageLoading[i] !== false ? "opacity-0" : "opacity-100"
                }`}
              />
            </div>

            {/* BASIC INFO */}
            <div className="flex justify-between items-center">
              <div>
                <h3 className="capitalize font-semibold text-base md:text-lg xl:text-[22px] text-[#262626]">
                  {block.stoneName}
                </h3>
                <p className="capitalize text-xs md:text-sm text-gray-500">
                  {block.stoneCategory}
                </p>
              </div>

              {/* <span className="text-xs text-gray-400">
                  ✔ {formatDate(block.updated)}
                </span> */}
            </div>

            <div className="mt-2 text-xs md:text-sm text-[#838383] space-y-1">
              <div className="flex  flex-col md:flex-row md:justify-between md:items-center mt-3">
                <h2 className="text-[18px] md:text-lg xl:text-[25px] font-semibold text-[#424242]">
                  {block.symbolA} {block.priceA}
                </h2>

                <span className="text-xs md:text-sm font-medium text-gray-800 ">
                  Location:{" "}
                  <span className="text-[#8F8F8F]">{block.origin}</span>
                </span>
              </div>

              <div className="mt-3">
                <h4 className="text-xs md:text-sm font-medium text-[#000000]">
                  Description
                </h4>
                <p className=" text-[10px] md:text-[13px] text-gray-600 mt-1">
                  {block.description}
                </p>
              </div>
            </div>

            <div className="my-3 border-b border-gray-300" />

            {/* ACTIONS */}
            <div className="flex justify-between">
              <div className="flex gap-2">
                <button
                  onClick={() => handleViewDetails(item, block)}
                  className=" bg-primary/10  font-medium cursor-pointer text-primary text-xs md:text-sm px-2 md:px-4 py-2 rounded-md hover:bg-primary/20 transition"
                >
                  View Details
                </button>
                {/* <button
                  //   onClick={() => onViewDetails(item, block)}
                  onClick={() => {
                    navigate(`/blocks/edit/${item.id}/${block.id}`);
                  }}
                  disabled={updating}
                  className={`p-2 rounded-lg bg-gray-100 text-gray-700 transition
                    ${
                      updating
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer hover:text-gray-500"
                    }`}
                >
                  <MdOutlineEdit className="text-sm lg:text-lg" />
                </button> */}
              </div>

              {(status === "approved" || status === "pending") && (
                <button
                  onClick={() => {
                    setSelectedBlock(block);
                    setShowConfirm(true);
                  }}
                  className="text-xs outline-none md:text-sm px-4 md:px-6 py-2 rounded-md cursor-pointer hover:bg-gray-100 bg-gray-50 text-gray-800 border border-gray-200 "
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlocksCard;
