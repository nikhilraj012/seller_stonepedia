import React, { useRef, useState, useEffect } from "react";
import { RiDeleteBin5Line } from "react-icons/ri";
import { MdOutlineEdit } from "react-icons/md";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { FaPlus } from "react-icons/fa6";
import toast from "react-hot-toast";
import { RxCross2 } from "react-icons/rx";
import { FaPlay } from "react-icons/fa6";

const BlocksFormProducts = ({
  blocksList,
  setBlocksList,
  handleFile,
  isEditMode,
  isSubmitting,
}) => {
  const fileInputRefs = useRef({});
  const imageInputRefs = useRef({});
  const videoInputRefs = useRef({});
  const documentInputRefs = useRef({});
  // Using a single string to track which block is expanded (only one at a time)
  const [expandedBlockId, setExpandedBlockId] = useState(null);
  const videoRefs = useRef([]);

  // Create a cache for object URLs to prevent re-creation on each render
  const urlCache = useRef({});

  // Function to get cached URL or create a new one
  const getObjectURL = (file) => {
    // Use file's lastModified and size as a unique identifier
    const fileId = `${file.name}-${file.lastModified}-${file.size}`;

    if (!urlCache.current[fileId]) {
      urlCache.current[fileId] = URL.createObjectURL(file);
    }

    return urlCache.current[fileId];
  };

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      // Revoke all cached URLs to prevent memory leaks
      Object.values(urlCache.current).forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, []);

  const handleFileChange = (e, blockId) => {
    const file = e.target.files[0];

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error(`Image size should be less than 5MB`);
      return;
    }

    // Update the block with the new image
    setBlocksList((prevBlocks) =>
      prevBlocks.map((block) =>
        block.id === blockId ? { ...block, thumbnail: file } : block,
      ),
    );
  };

  // Trigger file input click when thumbnail div is clicked
  const handleThumbnailClick = (blockId) => {
    if (fileInputRefs.current[blockId]) {
      fileInputRefs.current[blockId].click();
    }
  };

  const formatPrice = (price) => {
    if (!price) return "";

    const numPrice = parseFloat(price); // Convert price to a number
    if (isNaN(numPrice)) return price; // Return original price if it's not a valid number

    if (numPrice >= 10000000) {
      // 1 Crore = 10,000,000
      return (numPrice / 10000000).toFixed(1) + " Cr";
    } else if (numPrice >= 100000) {
      // 1 Lakh = 100,000
      return (numPrice / 100000).toFixed(1) + " L";
    } else if (numPrice >= 1000) {
      // 1 Thousand = 1,000
      return (numPrice / 1000).toFixed(1) + " K";
    } else {
      return numPrice.toString();
    }
  };

  return (
    <div className="space-y-2 lg:space-y-4">
      <h3 className="font-medium text-sm">
        Added Blocks - {blocksList.length}
      </h3>
      <div className="space-y-2 md:space-y-4 xl:space-y-6">
        {blocksList.map((block) => (
          <div
            key={block.id}
            className="shadow-md rounded-lg p-3 bg-white space-y-3"
          >
            <div className="flex justify-between">
              <div className="flex gap-3">
                {/* Hidden file input */}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={(el) => (fileInputRefs.current[block.id] = el)}
                  onChange={(e) => handleFileChange(e, block.id)}
                />

                {/* Thumbnail container */}
                <div
                  className="text-[8px] flex flex-col items-center justify-center bg-[#F6F6F6] rounded-md h-24 w-24 cursor-pointer hover:bg-gray-200 transition-colors"
                  onClick={() => handleThumbnailClick(block.id)}
                >
                  {block.thumbnail ? (
                    <img
                      src={URL.createObjectURL(block.thumbnail)}
                      alt="Thumbnail"
                      className="h-full w-full object-cover rounded-md"
                    />
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
                      <span>Add Thumbnail</span>
                    </>
                  )}
                </div>

                <div className="text-xs space-y-2">
                  <div>
                    <h1 className="font-semibold text-sm capitalize">
                      {block.stoneName}
                    </h1>
                    <p className="text-[#A5A5A5]">{block.stoneCategory}</p>

                    <p>
                      {block.symbolA && block.priceA ? (
                        <>
                          {block.symbolA.label}
                          {formatPrice(block.priceA)}{" "}
                          <span className="text-[#A3A3A3]">(Grade A)</span>
                        </>
                      ) : block.symbolB && block.priceB ? (
                        <>
                          {block.symbolB.label}
                          {formatPrice(block.priceB)}{" "}
                          <span className="text-[#A3A3A3]">(Grade B)</span>
                        </>
                      ) : block.symbolC && block.priceC ? (
                        <>
                          {block.symbolC.label}
                          {formatPrice(block.priceC)}{" "}
                          <span className="text-[#A3A3A3]">(Grade C)</span>
                        </>
                      ) : (
                        "No price available"
                      )}
                    </p>
                  </div>
                  <div className="text-[10px] text-[#636363]">
                    <div className="flex">
                      <p className="font-medium">Minimum Order : &nbsp;</p>
                      <span>{block.minimumOrder}</span>
                    </div>

                    <div className="flex">
                      <p className="font-medium">Quantity Available : &nbsp;</p>
                      <span>{block.quantity}</span>
                    </div>
                  </div>
                </div>
              </div>
              {!isEditMode && (
                <div className="flex gap-2 items-start">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    className="p-1 bg-[#F7F7F7] text-sm lg:text-lg rounded-md cursor-pointer"
                    // onClick={() => {
                    //   // Get the current block data
                    //   const currentBlock = blocksList.find(
                    //     (b) => b.id === block.id,
                    //   );

                    //   // Send the block data to the parent component for editing
                    //   if (typeof window !== "undefined") {
                    //     // Create a custom event with the block data
                    //     const editEvent = new CustomEvent("editBlock", {
                    //       detail: { block: currentBlock },
                    //     });

                    //     // Dispatch the event
                    //     window.dispatchEvent(editEvent);
                    //     window.scrollTo({ top: 0, behavior: "smooth" });

                    //     // Expand this block
                    //     setExpandedBlockId(block.id);
                    //   }
                    // }}
                    onClick={() => {
                      const currentBlock = blocksList.find(
                        (b) => b.id === block.id,
                      );

                      if (typeof window !== "undefined") {
                        const editEvent = new CustomEvent("editBlock", {
                          detail: { block: currentBlock },
                        });

                        window.dispatchEvent(editEvent);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }
                    }}
                  >
                    <MdOutlineEdit />
                  </button>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => {
                      // Remove block from list
                      setBlocksList((prevBlocks) =>
                        prevBlocks.filter((b) => b.id !== block.id),
                      );
                    }}
                    className="text-red-500 hover:text-red-700 p-1 bg-[#F7F7F7] text-sm lg:text-lg rounded-md"
                  >
                    <RiDeleteBin5Line />
                  </button>
                </div>
              )}
            </div>

            {/* Product Details */}
            <button
              type="button"
              onClick={() => {
                // Toggle expanded state - if already expanded, close it, otherwise open this one
                setExpandedBlockId(
                  expandedBlockId === block.id ? null : block.id,
                );
              }}
              className="flex gap-3 items-center text-xs cursor-pointer"
            >
              <p className="">Product Details</p>
              <span className="">
                {expandedBlockId === block.id ? (
                  <IoIosArrowUp />
                ) : (
                  <IoIosArrowDown />
                )}
              </span>
            </button>

            {expandedBlockId === block.id && (
              <div className="space-y-2 text-xs max-h-100 overflow-y-auto px-2">
                <div className="border border-[#E8E8E8] p-2 rounded-md space-y-1">
                  <h2 className="font-medium text-sm">Description</h2>
                  <span className="text-[#3B3B3B]">{block.description}</span>
                </div>

                <div className="border border-[#E8E8E8] p-2 rounded-md space-y-1 flex justify-between font-medium">
                  <div className="space-y-1">
                    <p className="">
                      Origin :{" "}
                      <span className="font-normal text-[#838383]">
                        {block.origin.label}
                      </span>
                    </p>
                    <p>
                      Nearby port :{" "}
                      <span className="font-normal text-[#838383]">
                        {block.portName}
                      </span>
                    </p>
                    <p>
                      Supply capacity :{" "}
                      <span className="font-normal text-[#838383]">
                        {block.supplyCapacity}
                      </span>
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p>
                      Unit :{" "}
                      <span className="font-normal text-[#838383]">
                        {block.units.value}
                      </span>
                    </p>
                    <p>
                      Size : &nbsp;
                      <span className="font-normal text-[#838383]">
                        W: {block.width} | L: {block.length} | H: {block.height}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5 my-4">
                  <h2 className="text-[#414141] font-semibold">
                    Upload block image / video
                  </h2>
                  <div className="flex gap-2 flex-wrap">
                    {/* Hidden file inputs */}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      ref={(el) => (imageInputRefs.current[block.id] = el)}
                      onChange={(e) => handleFile(e, "images", block.id)}
                    />
                    <input
                      type="file"
                      accept="video/*"
                      multiple
                      className="hidden"
                      ref={(el) => (videoInputRefs.current[block.id] = el)}
                      onChange={(e) => handleFile(e, "videos", block.id)}
                    />

                    {/* Add Image Button */}
                    <div
                      className="flex flex-col items-center justify-center cursor-pointer gap-2 h-[100px] w-[100px] border border-dashed border-primary rounded-md"
                      onClick={() => imageInputRefs.current[block.id]?.click()}
                    >
                      <FaPlus />
                      <span>Add Image</span>
                    </div>

                    {/* Add Video Button */}
                    <div
                      className="flex flex-col items-center justify-center cursor-pointer gap-2 h-[100px] w-[100px] border border-dashed border-primary rounded-md"
                      onClick={() => videoInputRefs.current[block.id]?.click()}
                    >
                      <FaPlus />
                      <span>Add Video</span>
                    </div>

                    {/* Add Document Button */}
                    {/* <div
                      className="flex flex-col items-center justify-center cursor-pointer gap-2 h-[100px] w-[100px] border border-dashed border-primary rounded-md"
                      onClick={() =>
                        documentInputRefs.current[block.id]?.click()
                      }
                    >
                      <FaPlus />
                      <span>Add Document</span>
                    </div> */}

                    {block.images.length > 0 &&
                      block.images.map((image, index) => (
                        <div
                          key={`img-${index}`}
                          className="h-[100px] w-[100px] relative group"
                        >
                          <img
                            src={getObjectURL(image)}
                            alt=""
                            className="h-full w-full object-cover rounded-md"
                          />
                          <button
                            type="button"
                            className="absolute text-[10px] cursor-pointer -top-1 -right-2 border border-red-500 bg-white/80 p-0.5 rounded-full text-red-500 hover:bg-white hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                            onClick={() => {
                              setBlocksList((prevBlocks) =>
                                prevBlocks.map((b) =>
                                  b.id === block.id
                                    ? {
                                        ...b,
                                        images: b.images.filter(
                                          (img) => img !== image,
                                        ),
                                      }
                                    : b,
                                ),
                              );
                            }}
                          >
                            <RxCross2 />
                          </button>
                        </div>
                      ))}

                    {block.videos.length > 0 &&
                      block.videos.map((video, index) => (
                        <div
                          key={`vid-${index}`}
                          className="h-[100px] w-[100px] relative group"
                        >
                          <video
                            ref={(el) => {
                              if (el) {
                                // Store reference to this video element
                                videoRefs.current[index] = el;

                                el.addEventListener("play", () => {
                                  // Pause all other videos
                                  videoRefs.current.forEach((video, i) => {
                                    if (video && i !== index) {
                                      video.pause();
                                      // Show play button for paused videos
                                      const playBtn =
                                        video.parentNode.querySelector(
                                          ".play-btn",
                                        );
                                      if (playBtn)
                                        playBtn.style.display = "flex";
                                    }
                                  });

                                  // Hide play button when video is playing
                                  const playBtn =
                                    el.parentNode.querySelector(".play-btn");
                                  if (playBtn) playBtn.style.display = "none";
                                });

                                el.addEventListener("pause", () => {
                                  // Show play button when video is paused
                                  const playBtn =
                                    el.parentNode.querySelector(".play-btn");
                                  if (playBtn) playBtn.style.display = "flex";
                                });

                                el.addEventListener("ended", () => {
                                  // Show play button when video ends
                                  const playBtn =
                                    el.parentNode.querySelector(".play-btn");
                                  if (playBtn) playBtn.style.display = "flex";
                                });
                              }
                            }}
                            src={getObjectURL(video)}
                            preload="metadata"
                            className="h-full w-full rounded-md object-cover"
                          />
                          <button
                            type="button"
                            className="absolute text-[10px] cursor-pointer -top-1 -right-2 border border-red-500 bg-white/80 p-0.5 rounded-full text-red-500 hover:bg-white hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100 z-20"
                            onClick={() => {
                              setBlocksList((prevBlocks) =>
                                prevBlocks.map((b) =>
                                  b.id === block.id
                                    ? {
                                        ...b,
                                        videos: b.videos.filter(
                                          (vid) => vid !== video,
                                        ),
                                      }
                                    : b,
                                ),
                              );
                            }}
                          >
                            <RxCross2 />
                          </button>

                          <button
                            type="button"
                            className="play-btn absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5 bg-white/40 hover:bg-white/70 rounded-full cursor-pointer backdrop-blur-md z-10"
                            onClick={(e) => {
                              const video =
                                e.currentTarget.parentNode.querySelector(
                                  "video",
                                );
                              if (video) {
                                if (video.paused) {
                                  video.play();
                                  e.currentTarget.style.display = "none";
                                } else {
                                  video.pause();
                                  e.currentTarget.style.display = "flex";
                                }
                              }
                            }}
                          >
                            <FaPlay className="ml-0.5 text-white" />
                          </button>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="space-y-1.5 my-4">
                  <h2 className="text-[#414141] font-semibold">
                    Upload block certificate/Lab Testing Report
                    <span className="text-[##C2C2C2] font-normal">
                      {" "}
                      (Approved by NABL)
                    </span>
                  </h2>
                  <div className="space-y-2">
                    {block.documents.length > 0 ? (
                      block.documents.map((doc, index) => (
                        <div
                          key={`doc-${index}`}
                          className="w-full relative group bg-gray-50 rounded-md border border-gray-200 p-2"
                        >
                          <div className="">
                            <p className="text-[10px] text-cente w-full">
                              {/* {doc.name.length > 25
                                ? doc.name.substring(0, 22) + "..."
                                : doc.name} */}
                              {doc.name}
                            </p>
                          </div>

                          <button
                            type="button"
                            className="absolute text-[10px] cursor-pointer top-1/2 right-1 transform -translate-x-1/2 -translate-y-1/2 border border-red-500 bg-white/80 p-0.5 rounded-full text-red-500 hover:bg-white hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100 z-20"
                            onClick={() => {
                              setBlocksList((prevBlocks) =>
                                prevBlocks.map((b) =>
                                  b.id === block.id
                                    ? {
                                        ...b,
                                        documents: b.documents.filter(
                                          (d) => d !== doc,
                                        ),
                                      }
                                    : b,
                                ),
                              );
                            }}
                          >
                            <RxCross2 />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div>
                        <input
                          type="file"
                          accept="application/pdf"
                          multiple
                          className="hidden"
                          ref={(el) =>
                            (documentInputRefs.current[block.id] = el)
                          }
                          onChange={(e) => handleFile(e, "documents", block.id)}
                        />
                        <div
                          className="flex items-center justify-center cursor-pointer gap-2 p-2 border border-dashed border-primary rounded-md"
                          onClick={() =>
                            documentInputRefs.current[block.id]?.click()
                          }
                        >
                          <FaPlus />
                          <span>Add Document</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlocksFormProducts;
