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

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleRemoveMedia = (mediaIndex) => {
    const key = `u-${mediaIndex}`;

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

    if (VideoRef.current[key]) {
      delete VideoRef.current[key];
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const addedFiles = processFiles(files, product.media || []);

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
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={() => setShowDeleteModal(false)}
        />
      )}

      <div className="space-y-1.5 my-4">
        <h2 className="text-[#414141] text-xs mb-2 lg:text-[13px] font-medium">
          Upload slab image/video
        </h2>

        <div className="grid px-0.5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-2 gap-y-3">
          {/* Upload Button */}
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
              <div className="flex flex-col items-center justify-center gap-2 h-24 border border-dashed border-primary rounded-md">
                <FaPlus />
                <span className="text-[11px]">Upload Media</span>
              </div>
            </label>
          </div>

          {/* Media Items */}
          {(product.media || []).map((file, fileIndex) => {
            const key = `u-${fileIndex}`;

            return (
              <div
                key={key}
                className="relative group h-24 rounded-lg overflow-hidden"
              >
                {file?.type?.startsWith("video/") ? (
                  <div className="relative h-full">
                    <video
                      ref={(el) => (VideoRef.current[key] = el)}
                      src={file.url}
                      className="w-full h-full object-cover rounded-lg"
                      muted
                      playsInline
                      preload="metadata"
                      onClick={() => {
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
                        const video = VideoRef.current[key];
                        setVideoProgress((prev) => ({
                          ...prev,
                          [key]: video
                            ? (video.currentTime / video.duration) * 100
                            : 0,
                        }));
                      }}
                      onPause={() =>
                        setPlayingVideos((prev) => ({
                          ...prev,
                          [key]: false,
                        }))
                      }
                      onEnded={() =>
                        setPlayingVideos((prev) => ({
                          ...prev,
                          [key]: false,
                        }))
                      }
                    />

                    {/* Play */}
                    {!playingVideos[key] && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div
                          className="w-7 h-7 bg-white/50 rounded-full text-white flex items-center justify-center cursor-pointer"
                          onClick={() => handleTogglePlay(key)}
                        >
                          <FaPlay size={14} />
                        </div>
                      </div>
                    )}

                    {/* Pause */}
                    {playingVideos[key] && showControls[key] && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div
                          className="w-7 h-7 text-white bg-white/50 rounded-full flex items-center justify-center cursor-pointer"
                          onClick={() => handleTogglePlay(key)}
                        >
                          <FaPause size={14} />
                        </div>
                      </div>
                    )}

                    {/* Progress Bar */}
                    <div
                      className="absolute bottom-2 left-2 right-2 h-1 bg-gray-100 rounded cursor-pointer"
                      onClick={(e) => {
                        const video = VideoRef.current[key];
                        if (!video) return;
                        const rect = e.currentTarget.getBoundingClientRect();
                        const clickPos = (e.clientX - rect.left) / rect.width;
                        video.currentTime = clickPos * (video.duration || 0);
                        setVideoProgress((prev) => ({
                          ...prev,
                          [key]: clickPos * 100,
                        }));
                      }}
                    >
                      <div
                        className="h-full bg-gray-400 rounded"
                        style={{
                          width: `${videoProgress[key] || 0}%`,
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

                {/* Delete Button */}
                {(file?.type?.startsWith("video/") ||
                  (file?.type?.startsWith("image/") &&
                    (product.media || []).filter((f) =>
                      f?.type?.startsWith("image/"),
                    ).length > 1)) && (
                  <button
                    type="button"
                    onClick={() => handleRemoveMedia(fileIndex)}
                    className="absolute -top-1 -right-1 bg-white text-red-600 rounded-full"
                  >
                    <TiDeleteOutline className="w-6 h-6" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default MediaUploader;
