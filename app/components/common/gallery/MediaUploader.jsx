import { FaPlus, FaPlay, FaPause } from "react-icons/fa";

import { TiDeleteOutline } from "react-icons/ti";

import { useState } from "react";
import useMediaPlayer from "@/app/hooks/useMediaPlayer";
import ConfirmDialog from "@/app/components/common/ConfirmDialog";
import { processFiles } from "@/app/utils/fileUtils";
const MediaUploader = ({ product, setProduct }) => {
  const {
    VideoRef,
    playingVideos,
    videoProgress,
    showControls,
    setVideoProgress,
    setPlayingVideos,
    setShowControls,
    handleTogglePlay,
  } = useMediaPlayer();
  const handleRemoveMedia = (mediaIndex) => {
    setProduct((prev) => {
      const removed = prev.media?.[mediaIndex];

      if (removed?.url?.startsWith("blob:")) {
        URL.revokeObjectURL(removed.url);
      }

      return {
        ...prev,
        media: prev.media.filter((_, i) => i !== mediaIndex),
      };
    });

    // video ref cleanup
    const key = mediaIndex;
    if (VideoRef.current[key]) {
      delete VideoRef.current[key];
    }
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);

    const addedFiles = processFiles(files, product.media || []);
    addedFiles.forEach((file) => console.log(file.url, file.type));
    if (addedFiles.length) {
      setProduct((prev) => ({
        ...prev,
        media: [...(prev.media || []), ...addedFiles],
      }));
    }
  };

  return (
    <>
      {showDeleteModal && (
        <ConfirmDialog
          message="Delete selected media?"
          onCancel={() => {
            setShowDeleteModal(false);
          }}
          onConfirm={() => {
            handleBulkDelete();
            setShowDeleteModal(false);
          }}
        />
      )}
      <div className="space-y-1.5 my-4">
        <h2 className="text-[#414141] text-xs mb-2   lg:text-[13px] font-medium">
          Upload slab image/video
        </h2>
        <div className="grid px-0.5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-2 gap-y-3 w-full min-w-0">
          <div>
            <input
              id="media-upload"
              type="file"
              multiple
              accept="image/jpeg,image/jpg,image/png,video/mp4"
              className="hidden"
              onChange={handleFileUpload}
            />

            <label htmlFor="media-upload" className="cursor-pointer">
              <div className="flex flex-col items-center justify-center gap-2 md:h-25 h-24 border border-dashed border-primary rounded-md">
                <FaPlus />
                <span className="text-[11px]">Upload Media</span>
              </div>
            </label>
          </div>
          {(product.media || []).map((file, fileIndex) => (
            <div
              key={fileIndex}
              className="relative group cursor-pointer md:h-25 h-24 rounded-lg overflow-hidden"
            >
              {file?.type?.startsWith("video/") ? (
                <div className="relative md:h-25 h-24 ">
                  <video
                    ref={(el) => (VideoRef.current[fileIndex] = el)}
                    src={file.url}
                    onClick={() => {
                      const key = fileIndex;
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
                      const video = VideoRef.current[fileIndex];
                      setVideoProgress((prev) => ({
                        ...prev,
                        [fileIndex]: video
                          ? (video.currentTime / video.duration) * 100
                          : 0,
                      }));
                    }}
                    className="w-full h-full object-cover rounded-lg"
                    onPause={() =>
                      setPlayingVideos((prev) => ({
                        ...prev,
                        [fileIndex]: false,
                      }))
                    }
                    onEnded={() =>
                      setPlayingVideos((prev) => ({
                        ...prev,
                        [fileIndex]: false,
                      }))
                    }
                    muted
                    playsInline
                    preload="metadata"
                    // preload="auto"
                  />
                  {!playingVideos[fileIndex] && (
                    <div className="absolute top-1/2 left-1/2 transform w-7 h-7 bg-white/45 rounded-full -translate-x-1/2 -translate-y-1/2 text-white text-xl cursor-pointer">
                      <FaPlay
                        className="absolute top-1/2 ml-0.5 left-1/2 transform -translate-x-1/2 -translate-y-1/2 "
                        size={15}
                        onClick={() => handleTogglePlay(fileIndex)}
                      />
                    </div>
                  )}
                  {playingVideos[fileIndex] && showControls[fileIndex] && (
                    <div className="absolute top-1/2 left-1/2 transform w-7 h-7 bg-white/45 rounded-full -translate-x-1/2 -translate-y-1/2 text-white text-xl cursor-pointer">
                      <FaPause
                        size={15}
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 "
                        onClick={() => handleTogglePlay(fileIndex)}
                      />
                    </div>
                  )}
                  <div
                    className="absolute bottom-2 left-2 right-2 h-1 bg-gray-50 rounded cursor-pointer"
                    onClick={(e) => {
                      const video = VideoRef.current[fileIndex];
                      if (!video) return;
                      const rect = e.currentTarget.getBoundingClientRect();
                      const clickPos = (e.clientX - rect.left) / rect.width;
                      video.currentTime = clickPos * video.duration;
                      setVideoProgress((prev) => ({
                        ...prev,
                        [fileIndex]: clickPos * 100,
                      }));
                    }}
                  >
                    <div
                      className="h-full bg-gray-300 rounded cursor-pointer"
                      style={{
                        width: `${videoProgress[fileIndex] || 0}%`,
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
              {(file?.type?.startsWith("video/") ||
                (file?.type?.startsWith("image/") &&
                  (product.media || []).filter((f) =>
                    f?.type?.startsWith("image/"),
                  ).length > 1)) && (
                <button
                  type="button"
                  onClick={() => handleRemoveMedia(fileIndex)}
                  className="cursor-pointer absolute -top-0.5 -right-0 bg-white text-red-600 rounded-full flex items-center justify-center  transition"
                >
                  <TiDeleteOutline className="w-6 h-6" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MediaUploader;
