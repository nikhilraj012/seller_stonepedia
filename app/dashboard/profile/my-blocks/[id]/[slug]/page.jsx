
"use client";
import React, { useState, useEffect } from "react";
import {useParams } from "next/navigation";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { MdOutlineFavorite, MdFavoriteBorder, MdCancel } from "react-icons/md";
import DetailsAboutBlock from "../../DetailsAboutBlock";
import { db } from "@/app/firebase/config";

const BlocksDetails = () => {
  const { id } = useParams();
  const [block, setBlock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [fullscreenImageIndex, setFullscreenImageIndex] = useState(0);

  useEffect(() => {
    const getBlockDetails = async () => {
  try {
    setLoading(true);

    // Get all blocks collection
    const blockRef = collection(db, "Users", uid, "SellBlocks");
    const querySnapshot = await getDocs(blockRef);

    let foundBlock = null;

    // Loop through all documents
    for (const docSnapshot of querySnapshot.docs) {
      const docData = docSnapshot.data();

      if (docData.blocks && Array.isArray(docData.blocks)) {
        const matchingBlock = docData.blocks.find(
          (block) => block.id === id // ✅ match by block.id
        );

        if (matchingBlock) {
          foundBlock = {
            ...matchingBlock,
            documentId: docSnapshot.id,
            createdAt: docData.createdAt,
            quarryDetails: docData.quarryDetails,
          };
          if (!foundBlock.imageUrls && foundBlock.images) {
            foundBlock.imageUrls = foundBlock.images;
          }
          break;
        }
      }
    }

    if (foundBlock) {
      setBlock(foundBlock);
    } else {
      setError("Block not found");
    }
  } catch (err) {
    console.error(err);
    setError("Failed to load block details");
  } finally {
    setLoading(false);
  }
};
    // const getBlockDetails = async () => {
    //   try {
    //     setLoading(true);
    //     const blockName = id.replace(/-/g, " ");

    //     // Get all blocks and filter manually to handle case insensitivity
    //     const blockRef = collection(db, "BuyAndSellBlocks");
    //     const querySnapshot = await getDocs(blockRef);

    //     let foundBlock = null;

    //     // Loop through all documents
    //     for (const docSnapshot of querySnapshot.docs) {
    //       const docData = docSnapshot.data();

    //       // Check if this document has blocks array
    //       if (docData.blocks && Array.isArray(docData.blocks)) {
    //         // Find the block with matching stoneName in the blocks array
    //         const matchingBlock = docData.blocks.find((block) => {
    //           const blockStoneName = block.stoneName;
    //           return (
    //             blockStoneName &&
    //             blockStoneName.toLowerCase() === blockName.toLowerCase()
    //           );
    //         });

    //         if (matchingBlock) {
    //           // Found the matching block in this document's blocks array
    //           foundBlock = {
    //             ...matchingBlock,
    //             documentId: docSnapshot.id,
    //             createdAt: docData.createdAt,
    //             quarryDetails: docData.quarryDetails,
    //           };

    //           // Make sure we have imageUrls property for consistency
    //           if (!foundBlock.imageUrls && foundBlock.images) {
    //             foundBlock.imageUrls = foundBlock.images;
    //           }

    //           break; // Exit the loop once we found the block
    //         }
    //       }
    //     }

    //     if (foundBlock) {
    //       setBlock(foundBlock);
    //       //   console.log("Found block:", foundBlock);
    //     } else {
    //       setError("Block not found");
    //     }
    //   } catch (err) {
    //     console.error("Error fetching block details:", err);
    //     setError("Failed to load block details");
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    getBlockDetails();
  }, [id]);

  useEffect(() => {
    if (isFullScreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isFullScreen]);

  // Function to handle previous image/video navigation
  const handlePrevImage = () => {
    const totalMedia =
      (block?.imageUrls?.length || 0) + (block?.videos?.length || 0);
    if (totalMedia > 0) {
      setSelectedImage((prev) => (prev === 0 ? totalMedia - 1 : prev - 1));
    }
  };

  // Function to handle next image/video navigation
  const handleNextImage = () => {
    const totalMedia =
      (block?.imageUrls?.length || 0) + (block?.videos?.length || 0);
    if (totalMedia > 0) {
      setSelectedImage((prev) => (prev === totalMedia - 1 ? 0 : prev + 1));
    }
  };

  // Function to toggle fullscreen mode
  const toggleFullScreen = (index) => {
    if (index !== undefined) {
      setFullscreenImageIndex(index);
    }
    setIsFullScreen(!isFullScreen);
  };

  if (loading) {
    return (
      <div className="pt-8 max-lg:px-4 lg:mx-24 xl:mx-32">
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#871B58] mb-4"></div>
          <p className="text-gray-600 font-medium">Loading block details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-8  max-lg:px-4 lg:mx-24 xl:mx-32">
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-red-500 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h2 className="text-xl font-semibold mb-2 text-red-700">{error}</h2>
            <p className="text-gray-700 mb-4">
              Please try again or contact support.
            </p>
            {/* <Link
              to="/stonepedia-for-business/buy-and-sell-blocks"
              className="inline-block bg-[#871B58] text-white px-4 py-2 rounded-md hover:bg-[#6d1647] transition-colors"
            >
              Back to Block Listings
            </Link> */}
          </div>
        </div>
      </div>
    );
  }

  if (!block) {
    return (
      <div className="pt-8 px-4 max-lg:px-4 lg:mx-24 xl:mx-32">
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md w-full text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-yellow-500 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="text-xl font-semibold mb-2 text-gray-800">
              Block not found
            </h2>
            <p className="text-gray-700 mb-4">
              The block you're looking for doesn't exist or has been removed.
            </p>
            {/* <Link
              to="/stonepedia-for-business/buy-or-sell-block"
              className="inline-block bg-[#871B58] text-white px-4 py-2 rounded-md hover:bg-[#6d1647] transition-colors"
            >
              Back to Block Listings
            </Link> */}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-22 max-lg:px-4 lg:mx-24 xl:mx-32">
      <div className="flex justify-center my-2">
        <h1 className="rounded-full border border-[#871B58] px-6 py-2 text-[#871B58] font-semibold lg:text-xl text-center">
          Block Details
        </h1>
      </div>

      {isFullScreen && (
        <div className="fixed inset-0 bg-black/10 z-50 flex items-center justify-center p-4 ">
          <div
            className="relative w-full max-lg:px-4 lg:mx-24 xl:mx-32
           rounded-lg bg-white p-5 "
          >
            <button
              onClick={() => setIsFullScreen(false)}
              className="absolute top-3 right-3 z-10"
              aria-label="Close fullscreen"
            >
              <MdCancel
                size={20}
                className="hover:text-red-500 cursor-pointer"
              />
            </button>

            <div className="md:flex items-center gap-5">
              {/* Check if we're showing a video or an image */}
              {block.videos &&
              fullscreenImageIndex >= (block.imageUrls?.length || 0) ? (
                <div className="h-[220px] lg:h-[400px] xl:h-[500px] w-full md:w-1/2 rounded-lg overflow-hidden">
                  <video
                    src={
                      block.videos[
                        fullscreenImageIndex - (block.imageUrls?.length || 0)
                      ]
                    }
                    className="w-full h-full object-contain"
                    controls
                    autoPlay
                    id="fullscreen-video"
                  />
                </div>
              ) : (
                <img
                  src={block.imageUrls?.[fullscreenImageIndex]}
                  alt={`${block.stoneName} - Image ${fullscreenImageIndex + 1}`}
                  className="h-[220px] lg:h-[400px] xl:h-[500px] w-full md:w-1/2 object-cover rounded-lg"
                  id="fullscreen-image"
                />
              )}
              <div className="w-full md:w-1/2 self-start mt-14 lg:mt-5 xl:mt-12 space-y-5 lg:space-y-8">
                <section className="border border-gray-200 p-3 xl:p-5 rounded-xl text-xs flex justify-between">
                  <div className="space-y-2 xl:space-y-5 w-1/2">
                    <div className="">
                      <h3 className="font-semibold text-xs lg:text-sm xl:text-base">
                        Stone Name
                      </h3>
                      <p className="text-xs lg:text-sm ">{block.stoneName}</p>
                    </div>
                  </div>
                  <div className="space-y-2 xl:space-y-5 w-1/2">
                    <div>
                      <h3 className="font-semibold text-xs lg:text-sm xl:text-base">
                        Stone Category
                      </h3>
                      <p className="text-xs lg:text-sm ">
                        {block.stoneCategory}
                      </p>
                    </div>
                  </div>
                </section>

                <section
                  className="mt-2 grid grid-cols-4 md:grid-cols-5 xl:grid-cols-6 gap-2 max-h-[180px] md:max-h-[200px] xl:max-h-[300px] overflow-y-auto"
                  style={{ scrollbarWidth: "thin" }}
                >
                  {/* Images */}
                  {block.imageUrls &&
                    block.imageUrls.map((image, index) => (
                      <img
                        key={`fs-image-${index}`}
                        src={image}
                        alt={`${block.stoneName} - Image ${index + 1}`}
                        className={`object-cover cursor-pointer rounded-lg h-[90px] md:h-[70px] w-full`}
                        onClick={() => setFullscreenImageIndex(index)}
                      />
                    ))}

                  {/* Videos */}
                  {block.videos &&
                    block.videos.map((videoUrl, index) => {
                      const videoIndex = (block.imageUrls?.length || 0) + index;
                      return (
                        <div
                          key={`fs-video-${index}`}
                          className={`relative rounded-lg overflow-hidden h-[90px] md:h-[70px] w-full`}
                          onClick={() => setFullscreenImageIndex(videoIndex)}
                        >
                          <video
                            src={videoUrl}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center pointer-events-none">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-8 w-8 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                        </div>
                      );
                    })}
                </section>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="md:flex gap-4 mt-4 md:mt-8">
        <div className="md:w-1/2">
          {/* Main Image with Navigation Controls */}
          <div className="relative rounded-lg overflow-hidden bg-gray-100 shadow-md">
            {/* Check if we're showing a video or an image */}
            {block?.videos &&
            selectedImage >= (block?.imageUrls?.length || 0) ? (
              <div className="w-full h-[250px] md:h-[400px] flex items-center justify-center">
                <video
                  src={
                    block.videos[selectedImage - (block.imageUrls?.length || 0)]
                  }
                  className="w-full h-full object-contain"
                  controls
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            ) : (
              <img
                src={block?.imageUrls?.[selectedImage]}
                alt={block?.stoneName}
                className="w-full h-[250px] md:h-[400px] object-cover cursor-pointer"
                onClick={() => toggleFullScreen()}
              />
            )}

            {/* Media Counter */}
            <div className="absolute top-2 right-2 md:top-3 md:right-3 bg-black/50 text-white p-1 md:px-2 md:py-1 rounded-md text-xs">
              {selectedImage + 1} /{" "}
              {(block?.imageUrls?.length || 0) + (block?.videos?.length || 0)}
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-1 md:p-2 shadow-md"
              aria-label="Previous image"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 md:w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-1 md:p-2 shadow-md"
              aria-label="Next image"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 md:w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>
          </div>

          {/* Thumbnail Gallery */}
          <div className="hidden md:grid grid-cols-5 w-full gap-2 mt-3">
            {/* Images */}
            {block?.imageUrls
              ?.slice(0, Math.min(4, block?.imageUrls?.length || 0))
              .map((image, index) => (
                <div
                  key={`thumb-img-${index}`}
                  className={`relative rounded-md overflow-hidden cursor-pointer`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img
                    src={image}
                    alt={`${block?.stoneName} thumbnail ${index + 1}`}
                    className="w-full h-20 xl:h-24 object-cover"
                  />
                </div>
              ))}

            {/* Videos */}
            {block?.videos
              ?.slice(
                0,
                Math.min(
                  4 - (block?.imageUrls?.length || 0),
                  block?.videos?.length || 0,
                ),
              )
              .map((videoUrl, index) => {
                const videoIndex = (block?.imageUrls?.length || 0) + index;
                return (
                  <div
                    key={`thumb-vid-${index}`}
                    className={`relative rounded-md overflow-hidden cursor-pointer`}
                    onClick={() => setSelectedImage(videoIndex)}
                  >
                    <div className="w-full h-20 xl:h-24 bg-gray-200 relative">
                      <video
                        src={videoUrl}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center pointer-events-none">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                );
              })}

            {/* More media indicator */}
            {(block?.imageUrls?.length || 0) + (block?.videos?.length || 0) >
              4 && (
              <div
                className="relative rounded-md overflow-hidden cursor-pointer"
                onClick={() => toggleFullScreen(4)}
              >
                {block?.imageUrls?.[4] ? (
                  <div className="relative">
                    <img
                      src={block.imageUrls[4]}
                      alt={`${block?.stoneName} thumbnail 5`}
                      className="w-full h-20 xl:h-24 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white font-medium">
                        +
                        {(block?.imageUrls?.length || 0) +
                          (block?.videos?.length || 0) -
                          4}
                      </span>
                    </div>
                  </div>
                ) : block?.videos?.[0] ? (
                  <div className="relative">
                    <div className="w-full h-20 xl:h-24 bg-gray-200">
                      <video
                        src={block.videos[0]}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white font-medium">
                        +
                        {(block?.imageUrls?.length || 0) +
                          (block?.videos?.length || 0) -
                          4}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-20 xl:h-24 bg-gray-200 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white font-medium">
                        +
                        {(block?.imageUrls?.length || 0) +
                          (block?.videos?.length || 0) -
                          4}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <DetailsAboutBlock block={block} />
      </div>
    </div>
  );
};

export default BlocksDetails;
