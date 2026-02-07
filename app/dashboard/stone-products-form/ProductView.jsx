
"use client";
import React, { useEffect, useRef, useState } from "react";
import { TiDeleteOutline } from "react-icons/ti";
import { RiDeleteBin5Line } from "react-icons/ri";
import { MdOutlineEdit } from "react-icons/md";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { FaPlus } from "react-icons/fa6";
import { FaPlay } from "react-icons/fa6";
import { FaPause } from "react-icons/fa";
import toast from "react-hot-toast";
import useMediaPlayer from "@/app/hooks/useMediaPlayer";
import ConfirmDialog from "@/app/components/common/ConfirmDialog";
import { processFiles } from "@/app/utils/fileUtils";

const ProductView = ({
  productList,
  setProductList,
  editIndex,
  onEdit,

}) => {
  const {
    VideoRef,
    playingVideos,
    videoProgress,
    showControls,
    setVideoProgress,
    setPlayingVideos,
    setShowControls,
    handleTogglePlay,
    isVideoItem,
  } = useMediaPlayer();
  const [expandedIndex, setExpandedIndex] = useState(null);

  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const displayArray = (arr) => (arr && arr.length > 0 ? arr.join(", ") : "-");

  const handleDelete = (index) => {
  setProductList((prev) => prev.filter((_, i) => i !== index));
  toast("Product deleted successfully!", {
    style: {
      backgroundColor: "#ffe6e6",
      color: "#d32f2f",
      fontWeight: "500",
    },
  });
};


  const handleFileUpload = (e, index) => {
    const files = Array.from(e.target.files);
    const product = productList[index];
    const addedFiles = processFiles(files, product.media || []);
    addedFiles.forEach((file) => console.log(file.url, file.type));
    if (addedFiles.length) {
      setProductList((prev) =>
        prev.map((p, i) =>
          i === index
            ? { ...p, media: [...(p.media || []), ...addedFiles] }
            : p,
        ),
      );
    }
  };

  const handleRemoveMedia = (productIndex, type, mediaIndex = null) => {
    setProductList((prevList) =>
      prevList.map((product, i) => {
        if (i !== productIndex) return product;

        if (type === "thumbnail" && product.thumbnail?.url) {
          try {
            URL.revokeObjectURL(product.thumbnail.url);
          } catch (err) {}
          return { ...product, thumbnail: null };
        }

        if (type === "media" && mediaIndex !== null) {
          const removed = product.media?.[mediaIndex];
          if (removed?.url) {
            try {
              URL.revokeObjectURL(removed.url);
            } catch (err) {}
          }
          return {
            ...product,
            media: (product.media || []).filter((_, ii) => ii !== mediaIndex),
          };
        }

        return product;
      }),
    );

    // Video refs cleanup for media
    if (type === "media" && mediaIndex !== null) {
      const key = `${productIndex}-${mediaIndex}`;
      if (VideoRef.current[key]) delete VideoRef.current[key];
    }
  };

  const handleThumbnailChange = (e, index) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);

    setProductList((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, thumbnail: { file, url } } : item,
      ),
    );
  };

  return (
    <>
      {showConfirm && (
        <ConfirmDialog
          message="Do you want to remove this product?"
          onCancel={() => {
            setShowConfirm(false);
            setDeleteIndex(null);
          }}
          onConfirm={() => {
            handleDelete(deleteIndex);
            setShowConfirm(false);
            setDeleteIndex(null);
          }}
        />
      )}
      <div className="space-y-2 lg:space-y-4 mb-2">
        {productList.map((p, i) => (
          <div
            key={i}
            className="relative rounded-2xl p-4 space-y-3 border transition-all duration-300 bg-white border-gray-100 shadow-sm"
          >
            <div className={`flex justify-between`}>
              <div className="flex gap-3">
                <input
                  id={`thumbnail-${i}`}
                  name={`thumbnail-${i}`}
                  type="file"
                  accept="image/jpeg, image/jpg, image/png"
                  className="hidden"
                  onChange={(e) => handleThumbnailChange(e, i)}
                />
                <div
                  className="text-[8px] group flex flex-col items-center justify-center bg-[#F6F6F6] rounded-md h-24 w-24 cursor-pointer hover:bg-gray-200 transition-colors relative"
                  onClick={() =>
                    document.getElementById(`thumbnail-${i}`).click()
                  }
                >
                  {p.thumbnail?.url ? (
                    <>
                      <img
                        src={p.thumbnail.url}
                        alt="Thumbnail"
                        className="h-full w-full object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={(ev) => {
                          ev.stopPropagation();
                          handleRemoveMedia(i, "thumbnail");
                        }}
                        className="absolute -top-2 -right-2 cursor-pointer  opacity-0 group-hover:opacity-100 text-red-500 "
                      >
                        <TiDeleteOutline size={14} />
                      </button>
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
                      <span>Add Thumbnail</span>
                    </>
                  )}
                </div>

                <div className="text-xs md:text-sm space-y-0.5">
                  <h1 className="font-semibold capitalize text-[#2E2E2E]">
                    {p.productName}
                  </h1>
                  <p className="text-[#8B8B8B] capitalize">{p.category}</p>
                </div>
                <div></div>
              </div>

              {editIndex === null && (
                <div className="flex gap-2 items-start">
                  <button
                    type="button"
                    className="p-2 cursor-pointer bg-gray-100 text-gray-700 rounded-lg transition"
                    onClick={() => onEdit(i)}
                  >
                    <MdOutlineEdit size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDeleteIndex(i);
                      setShowConfirm(true);
                    }}
                    className="p-2 bg-gray-100 hover:text-red-700 text-red-500 cursor-pointer   rounded-lg transition"
                  >
                    <RiDeleteBin5Line size={18} />
                  </button>
                </div>
              )}
            </div>
            <div className="border p-3 rounded-lg border-gray-300 bg-white">
              <div className="text-[10px] md:text-xs text-[#636363] space-y-1.5">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <div>
                      <span className="font-semibold text-black">
                        Category :
                      </span>
                      <span> {p.category || "-"}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-black">Size: </span>
                      <span className="text-right leading-4">
                        H -{p.size.height}
                        {" | "}W -{p.size?.width}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-black">
                        Min Order :
                      </span>
                      <span>
                        {" "}
                        {p.minimumOrder ? `${p.minimumOrder} pcs` : "-"}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div>
                      <span className="font-semibold text-black">Weight :</span>
                      <span> {p.weight ? `${p.weight} kg` : "-"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setExpandedIndex(expandedIndex === i ? null : i);
              }}
              className="flex gap-3 items-center text-xs cursor-pointer"
            >
              <p className=" border-none   outline-none font-medium">
                Product Details
              </p>
              <span className="">
                {expandedIndex === i ? <IoIosArrowUp /> : <IoIosArrowDown />}
              </span>
            </button>
            {expandedIndex === i && (
              <div className="space-y-2  text-xs max-h-100 overflow-y-auto overflow-x-hidden">
                <div className="border p-2 rounded-md space-y-1 border-gray-300 ">
                  <h2 className="font-medium text-sm">Description</h2>
                  <span className="text-[#3B3B3B]">{p.description}</span>
                </div>
                <div className="space-y-1.5 my-4">
                  <h2 className="text-[#414141] font-semibold">
                    Upload Block Image / Video
                  </h2>
                  <div className="grid px-0.5 grid-cols-2 w-full sm:grid-cols-3 md:grid-cols-4  gap-x-2 gap-y-3">
                    <div>
                      <input
                        id={`product-file-video-${i}`}
                        type="file"
                      accept="image/jpeg,image/jpg,image/png,video/mp4"
                        multiple
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, i)}
                      />
                      <label
                        htmlFor={`product-file-video-${i}`}
                        className="cursor-pointer"
                      >
                        <div className="flex flex-col items-center justify-center gap-2 md:h-25 h-24 border border-dashed border-primary rounded-md">
                          <FaPlus />
                          <span className="text-[11px]">Upload Media</span>
                        </div>
                      </label>
                    </div>
                    {(p.media || []).map((file, fileIndex) => (
                      <div
                        key={fileIndex}
                        className="group relative md:h-25 h-24   "
                      >
                        {file?.type?.startsWith("video/") ? (
                          <div className="relative md:h-25 h-24   ">
                            <video
                              ref={(el) =>
                                (VideoRef.current[`${i}-${fileIndex}`] = el)
                              }
                              src={file.url}
                              onClick={() => {
                                const key = `${i}-${fileIndex}`;
                                setShowControls((pre) => ({
                                  ...pre,
                                  [key]: true,
                                }));
                                setTimeout(() => {
                                  setShowControls((pre) => ({
                                    ...pre,
                                    [key]: false,
                                  }));
                                }, 5000);
                              }}
                              onTimeUpdate={() => {
                                const video =
                                  VideoRef.current[`${i}-${fileIndex}`];
                                setVideoProgress((prev) => ({
                                  ...prev,
                                  [`${i}-${fileIndex}`]: video
                                    ? (video.currentTime / video.duration) * 100
                                    : 0,
                                }));
                              }}
                              className="w-full h-full object-cover rounded-lg"
                              onPause={() =>
                                setPlayingVideos((prev) => ({
                                  ...prev,
                                  [`${i}-${fileIndex}`]: false,
                                }))
                              }
                              onEnded={() =>
                                setPlayingVideos((prev) => ({
                                  ...prev,
                                  [`${i}-${fileIndex}`]: false,
                                }))
                              }
                              preload="auto"
                            />
                            {!playingVideos[`${i}-${fileIndex}`] && (
                              <div className="absolute top-1/2 left-1/2 transform w-7 h-7 bg-white/45 rounded-full -translate-x-1/2 -translate-y-1/2 text-white text-xl cursor-pointer">
                                <FaPlay
                                  className="absolute top-1/2 ml-0.5 left-1/2 transform -translate-x-1/2 -translate-y-1/2 "
                                  size={15}
                                  onClick={() =>
                                    handleTogglePlay(`${i}-${fileIndex}`)
                                  }
                                />
                              </div>
                            )}
                            {playingVideos[`${i}-${fileIndex}`] &&
                              showControls[`${i}-${fileIndex}`] && (
                                <div className="absolute top-1/2 left-1/2 transform w-7 h-7 bg-white/45 rounded-full -translate-x-1/2 -translate-y-1/2 text-white text-xl cursor-pointer">
                                  <FaPause
                                    size={15}
                                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 "
                                    onClick={() =>
                                      handleTogglePlay(`${i}-${fileIndex}`)
                                    }
                                  />
                                </div>
                              )}
                            <div
                              className="absolute bottom-2 left-2 right-2 h-1 bg-gray-50 rounded cursor-pointer"
                              onClick={(e) => {
                                const video =
                                  VideoRef.current[`${i}-${fileIndex}`];
                                if (!video) return;
                                const rect =
                                  e.currentTarget.getBoundingClientRect();
                                const clickPos =
                                  (e.clientX - rect.left) / rect.width;
                                video.currentTime = clickPos * video.duration;
                                setVideoProgress((prev) => ({
                                  ...prev,
                                  [`${i}-${fileIndex}`]: clickPos * 100,
                                }));
                              }}
                            >
                              <div
                                className="h-full bg-gray-300 rounded cursor-pointer"
                                style={{
                                  width: `${
                                    videoProgress[`${i}-${fileIndex}`] || 0
                                  }%`,
                                }}
                              />
                            </div>
                          </div>
                        ) : (
                          <img
                            src={file.url}
                            alt=""
                            className="w-full h-full rounded-lg object-cover"
                          />
                        )}
                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveMedia(i, "media", fileIndex)
                          }
                          className="cursor-pointer absolute -top-2.5 -right-2 bg-white text-red-600 rounded-full flex items-center justify-center transition"
                        >
                          <TiDeleteOutline className="w-6 h-6" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};
export default ProductView;
