"use client";

import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/firebase/config";
import { useAuth } from "@/app/components/context/AuthContext";
import { MdOutlineEdit } from "react-icons/md";
import { RiDeleteBin5Line } from "react-icons/ri";
import { IoLocationOutline } from "react-icons/io5";
import { FaFilePdf } from "react-icons/fa";
import Image from "next/image";

const BlockDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const { uid } = useAuth();
  
  const [blockData, setBlockData] = useState(null);
  const [quarryData, setQuarryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlockDetails = async () => {
      if (!uid) {
        setLoading(false);
        return;
      }

      try {
        // Get data from sessionStorage
        const storedData = sessionStorage.getItem('currentBlock');
        if (!storedData) {
          setError("No block data found");
          setLoading(false);
          return;
        }

        const { docId, blockId } = JSON.parse(storedData);

        const docRef = doc(db, "SellerDetails", uid, "SellBlocks", docId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const block = data.blocks?.find((b) => b.id === blockId);
          
          if (block) {
            setBlockData(block);
            setQuarryData(data.quarryDetails);
          } else {
            setError("Block not found");
          }
        } else {
          setError("Document not found");
        }
      } catch (err) {
        console.error("Error fetching block details:", err);
        setError("Failed to load block details");
      } finally {
        setLoading(false);
      }
    };

    fetchBlockDetails();
  }, [uid]);

  if (loading) {
    return (
      <div className="pt-16 px-4 md:px-6 lg:px-24 xl:px-32">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error || !blockData) {
    return (
      <div className="pt-16 px-4 md:px-6 lg:px-24 xl:px-32">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <p className="text-red-600 text-lg">{error || "Block not found"}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 px-4 md:px-6 lg:px-24 xl:px-32 pb-8">
      <div className="max-w-[1500px] mx-auto">
        {/* Pending Thumbnail Warning */}
        {!blockData.thumbnail && (
          <div className="bg-[#fff3f3] border-2 border-[#cb0000] rounded-t-lg px-6 py-6 mb-0">
            <div className="flex items-center justify-center gap-2">
              <svg
                className="w-5 h-5 text-[#fd3333]"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-[#fd3333] text-lg font-medium">
                Your thumbnail image is still pending.
              </p>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white border border-[#8c8c8c] rounded-b-2xl rounded-t-lg p-6 md:p-8">
          {/* Top Section */}
          <div className="flex flex-col lg:flex-row gap-8 mb-10">
            {/* Thumbnail */}
            <div className="lg:w-[350px] shrink-0">
              <div className="bg-[#f6f6f6] border border-[#e9e9e9] rounded-lg h-[300px] flex items-center justify-center overflow-hidden">
                {blockData.thumbnail ? (
                  <img
                    src={blockData.thumbnail}
                    alt={blockData.stoneName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center text-[#323232]">
                    <svg
                      className="w-8 h-8 mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    <p className="text-xs">Add thumbnail</p>
                  </div>
                )}
              </div>
            </div>

            {/* Block Info */}
            <div className="flex-1">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-3xl md:text-4xl font-semibold text-[#262626] mb-3">
                    {blockData.stoneName}
                  </h1>
                  <p className="text-xl md:text-2xl text-[#595959]">
                    {blockData.stoneCategory} Block
                  </p>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      const storedData = sessionStorage.getItem('currentBlock');
                      if (storedData) {
                        const { docId, blockId } = JSON.parse(storedData);
                        router.push(
                          `/dashboard/profile/my-blocks/${params.companySlug}/${params.productSlug}/edit?docId=${docId}&blockId=${blockId}`
                        );
                      }
                    }}
                    className="p-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition"
                  >
                    <MdOutlineEdit className="text-xl text-gray-700" />
                  </button>
                  <button className="p-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition">
                    <RiDeleteBin5Line className="text-xl text-red-600" />
                  </button>
                </div>
              </div>

              {/* Pricing */}
              <div className="mb-6">
                <p className="text-[#8f8f8f] text-lg font-medium mb-2">
                  Grade A
                </p>
                <p className="text-[#424242] text-3xl font-semibold">
                  {blockData.symbolA} {blockData.priceA}
                </p>
              </div>

              <div className="flex flex-wrap gap-8 text-[#8f8f8f] text-lg font-medium mb-6">
                {blockData.priceB && (
                  <>
                    <p>
                      Grade B : {blockData.symbolB} {blockData.priceB}
                    </p>
                    <div className="w-px h-5 bg-gray-300"></div>
                  </>
                )}
                {blockData.priceC && (
                  <p>
                    Grade C : {blockData.symbolC} {blockData.priceC}
                  </p>
                )}
              </div>

              {/* Location */}
              <div className="flex items-center gap-2 text-[#595959] text-lg font-medium mb-6">
                <IoLocationOutline className="text-xl" />
                <span>{blockData.origin}</span>
              </div>

              {/* Upload Button */}
              <button className="border border-[#ffb200] text-[#ffb200] px-8 py-3 rounded-lg font-medium hover:bg-[#ffb200]/10 transition">
                Upload
              </button>
            </div>
          </div>

          <div className="border-t border-gray-300 my-8"></div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-[#262626] mb-4">
              Description
            </h2>
            <p className="text-[#595959] text-base leading-relaxed">
              {blockData.description ||
                "Discover our innovative product block, designed to enhance functionality and aesthetics. Perfect for modern spaces, it combines style with practicality for everyday use."}
            </p>
          </div>

          {/* Block Details */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-[#262626] mb-6">
              Block details
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              <div>
                <p className="text-black font-medium mb-3">Block/stone name</p>
                <p className="text-[#282828]">{blockData.stoneName}</p>
              </div>
              <div>
                <p className="text-black font-medium mb-3">
                  Height x Width x Length
                </p>
                <p className="text-[#282828]">
                  {blockData.height || "H80"} | {blockData.width || "W80"} |{" "}
                  {blockData.length || "L190"} inch
                </p>
              </div>
              <div>
                <p className="text-black font-medium mb-3">Grade</p>
                <p className="text-[#282828]">
                  {[
                    blockData.priceA && "A",
                    blockData.priceB && "B",
                    blockData.priceC && "C",
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>
              <div>
                <p className="text-black font-medium mb-3">Origin</p>
                <p className="text-[#282828]">{blockData.origin}</p>
              </div>
              <div>
                <p className="text-black font-medium mb-3">Port name</p>
                <p className="text-[#282828]">{blockData.portName || "N/A"}</p>
              </div>
              <div>
                <p className="text-black font-medium mb-3">Stone category</p>
                <p className="text-[#282828]">{blockData.stoneCategory}</p>
              </div>
              <div>
                <p className="text-black font-medium mb-3">
                  Available Quantity
                </p>
                <p className="text-[#3a3a3a]">
                  {blockData.quantityAvailable || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-black font-medium mb-3">Supply Capacity</p>
                <p className="text-[#3a3a3a]">
                  {blockData.supplyCapacity || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-black font-medium mb-3">Minimum order</p>
                <p className="text-[#282828]">
                  {blockData.minimumOrder || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Images Gallery */}
          {blockData.images && blockData.images.length > 0 && (
            <div className="mb-8">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {blockData.images.slice(0, 10).map((image, index) => (
                  <div
                    key={index}
                    className="relative h-[200px] rounded-lg overflow-hidden"
                  >
                    <img
                      src={image}
                      alt={`${blockData.stoneName} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quarry Documents */}
          {blockData.documents && blockData.documents.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-[#414141] mb-4">
                Uploaded Quarry Documents
              </h2>
              <div className="space-y-3">
                {blockData.documents.map((doc, index) => (
                  <div
                    key={index}
                    className="bg-[#f5f5f5] border border-[#8b8b8b] rounded-xl p-4 flex items-center gap-3 max-w-[700px]"
                  >
                    <FaFilePdf className="text-red-600 text-3xl shrink-0" />
                    <p className="text-black text-lg">
                      {doc.name || `Quarry certificate ${index + 1}.PDF`}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlockDetailsPage;
