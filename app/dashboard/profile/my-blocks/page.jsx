"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import toast from "react-hot-toast";
import Pagination from "@/app/components/common/Pagination";
import BlocksCard from "./BlocksCard";
import { auth, db } from "@/app/firebase/config";
import { useAuth } from "@/app/components/context/AuthContext";
import { useUi } from "@/app/components/context/UiContext";
import usePagination from "@/app/hooks/usePagination";

const ITEMS_PER_PAGE = 1;

const Page = () => {
  const { navigate } = useUi();
  const { isAuthenticated, uid } = useAuth();
  const router = useRouter();
  const [editId, setEditId] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  const [editForm, setEditForm] = useState({
    quarryName: "",
    emailId: "",
    websiteUrl: "",
  });
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // ================= FETCH =================
  useEffect(() => {
    const fetchBlocks = async () => {
      const user = auth.currentUser;
      if (!user) return setLoading(false);

      try {
        const refCol = collection(db, "SellerDetails", user.uid, "SellBlocks");
        const q = query(refCol, orderBy("createdAt", "desc"));
        const snap = await getDocs(q);

        setData(
          snap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          })),
        );
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchBlocks();
  }, []);

  const openEdit = (item) => {
    setEditId(item.id);
    setEditForm({
      quarryName: item.quarryDetails.quarryName,
      emailId: item.quarryDetails.emailId,
      websiteUrl: item.quarryDetails.websiteUrl,
    });
    setEditOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated || !uid || !editId) return;

    const toastId = toast.loading("Updating...");

    try {
      const payload = {
        "quarryDetails.quarryName": editForm.quarryName,
        "quarryDetails.emailId": editForm.emailId,
        "quarryDetails.websiteUrl": editForm.websiteUrl,
      };

      await Promise.all([
        updateDoc(doc(db, "SellerDetails", uid, "SellBlocks", editId), payload),
        updateDoc(doc(db, "BuyAndSellBlocks", editId), payload),
      ]);

      setData((prev) =>
        prev.map((item) =>
          item.id === editId
            ? {
                ...item,
                quarryDetails: {
                  ...item.quarryDetails,
                  quarryName: editForm.quarryName,
                  emailId: editForm.emailId,
                  websiteUrl: editForm.websiteUrl,
                },
              }
            : item,
        ),
      );

      toast.success("Updated successfully", { id: toastId });
      setEditOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Update failed", { id: toastId });
    }
  };

  const { paginatedData, currentPage, onPageChange } = usePagination({
    data,
    itemsPerPage: ITEMS_PER_PAGE,
  });

  // ================= UI =================
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <img src="/logo.png" className="w-16 animate-pulse" />
      </div>
    );
  }
  if (!loading && data.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-center">
        <h2 className="text-2xl lg:text-5xl font-bold mb-2">No Blocks Found</h2>
        <p className="text-gray-500 mb-4">
          You haven’t added anything to Blocks yet.
        </p>
        <button
          onClick={() => router.push("/dashboard/blocks-form")}
          className="border border-[#871B58] cursor-pointer text-[#871B58] px-6 py-3 rounded-xl hover:bg-[#871B58] hover:text-white transition"
        >
          Create Block
        </button>
      </div>
    );
  }

  return (
    <div className="pt-18 md:pt-22 max-lg:px-4 lg:mx-24 xl:mx-32">
      <div className="flex justify-center my-2">
        <h1 className="rounded-full border border-primary px-6 py-2 text-primary font-semibold lg:text-xl text-center">
          My Blocks
        </h1>
      </div>
      {data.every((item) => item.status === "rejected") && (
        <div className="flex justify-end ">
          <button
            onClick={() => router.push("/dashboard/blocks-form")}
            className="border border-[#871B58] cursor-pointer text-[#871B58] px-6 py-3 rounded-xl hover:bg-[#871B58] hover:text-white transition"
          >
            Add Blocks
          </button>
        </div>
      )}
      {editOpen && (
        <div className="fixed inset-0  bg-black/20 z-30 flex items-center justify-center">
          <form
            onSubmit={handleEditSubmit}
            className="bg-white w-full max-w-sm sm:max-w-md rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 max-h-[90vh] "
          >
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-1">
              Edit Quarry Details
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-5">
              Update your business information carefully
            </p>

            <div className="space-y-3 sm:space-y-4">
              <div>
                <label
                  htmlFor="quarryName"
                  className="block text-xs md:text-sm font-medium text-black mb-1"
                >
                  Company Name/QuarryName
                </label>
                <input
                  id="quarryName"
                  type="text"
                  required
                  placeholder="Enter here"
                  value={editForm.quarryName}
                  onChange={(e) =>
                    setEditForm({ ...editForm, quarryName: e.target.value })
                  }
                  className=" w-full rounded-lg border border-gray-200 px-3 sm:px-4 py-2 text-xs md:text-sm focus:ring-2 focus:ring-primary/40 outline-none  "
                />
              </div>

              <div>
                <label
                  htmlFor="emailId"
                  className="block text-xs md:text-sm font-medium text-black mb-1"
                >
                  Email
                </label>
                <input
                  id="emailId"
                  type="emailId"
                  required
                  placeholder="Enter emailId address"
                  value={editForm.emailId}
                  onChange={(e) =>
                    setEditForm({ ...editForm, emailId: e.target.value })
                  }
                  className=" w-full rounded-lg border border-gray-200 px-3 sm:px-4 py-2 text-xs md:text-sm focus:ring-2 focus:ring-primary/40 outline-none  "
                />
              </div>

              <div>
                <label
                  htmlFor="websiteUrl"
                  className="block text-xs md:text-sm font-medium text-black mb-1"
                >
                  Website Url
                </label>
                <input
                  id="websiteUrl"
                  type="url"
                  required
                  placeholder="https://stonepedia.in/"
                  value={editForm.websiteUrl}
                  onChange={(e) =>
                    setEditForm({ ...editForm, websiteUrl: e.target.value })
                  }
                  onInput={(e) => e.target.setCustomValidity("")}
                  className=" w-full rounded-lg border border-gray-200 px-3 sm:px-4 py-2 text-xs md:text-sm focus:ring-2 focus:ring-primary/40 outline-none  "
                />
              </div>
            </div>
            <div className="flex flex-row justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setEditOpen(false)}
                className="  cursor-pointer text-xs md:text-sm px-4 py-2 rounded-lg border  text-gray-600 hover:bg-gray-100 transition  "
              >
                Cancel
              </button>

              <button
                type="submit"
                className="cursor-pointer  text-xs md:text-sm px-4 py-2 rounded-lg bg-primary text-white  hover:bg-[#6d1546] transition shadow-md   "
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4 mt-4">
        {paginatedData.map((item) => (
          <BlocksCard
            key={item.id}
            setData={setData}
            item={{ ...item, blocks: item.blocks }}
            updating={updating}
            onEdit={openEdit}
          />
        ))}
      </div>

      <Pagination
        itemsPerPage={ITEMS_PER_PAGE}
        totalItems={data.length}
        currentPage={currentPage}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default Page;
