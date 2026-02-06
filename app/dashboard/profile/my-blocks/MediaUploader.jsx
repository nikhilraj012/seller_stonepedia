import { FaPlus, FaPlay, FaPause } from "react-icons/fa";
import { TiDeleteOutline } from "react-icons/ti";
import { useRef, useState } from "react";
import useMediaPlayer from "@/app/hooks/useMediaPlayer";
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

  const blobCache = useRef(new Map());

  // Stable URL getter
  const getUrl = (file) => {
    if (typeof file === "string") return file;
    if (file?.url) return file.url;
    if (!(file instanceof File)) return "";
    if (!blobCache.current.has(file)) {
      blobCache.current.set(file, URL.createObjectURL(file));
    }
    return blobCache.current.get(file);
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setProduct((prev) => {
      const images = [...(prev.images || [])];
      const videos = [...(prev.videos || [])];

      files.forEach((file) => {
        if (file.type.startsWith("image/")) images.push(file);
        if (file.type.startsWith("video/")) videos.push(file);
      });

      return { ...prev, images, videos };
    });

    e.target.value = "";
  };

  const removeImage = (i) => {
    setProduct((prev) => {
      const removed = prev.images[i];
      if (removed instanceof File) {
        const url = blobCache.current.get(removed);
        if (url) URL.revokeObjectURL(url);
        blobCache.current.delete(removed);
      }
      return { ...prev, images: prev.images.filter((_, idx) => idx !== i) };
    });
  };

  const removeVideo = (i) => {
    setProduct((prev) => {
      const removed = prev.videos[i];
      if (removed instanceof File) {
        const url = blobCache.current.get(removed);
        if (url) URL.revokeObjectURL(url);
        blobCache.current.delete(removed);
      }
      return { ...prev, videos: prev.videos.filter((_, idx) => idx !== i) };
    });
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {/* Upload */}
      <label className="cursor-pointer">
        <input
          type="file"
          multiple
          accept="image/jpeg,image/jpg,image/png,video/mp4"
          hidden
          onChange={handleFileUpload}
        />
        <div className="flex flex-col items-center justify-center h-24 border border-dashed rounded-md">
          <FaPlus size={20} />
          <span className="text-xs">Upload</span>
        </div>
      </label>

      {/* Images */}
      {(product.images || []).map((img, i) => (
        <div
          key={`img-${i}`}
          className="relative h-24 group rounded overflow-hidden"
        >
          <img src={getUrl(img)} className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => removeImage(i)}
            className="cursor-pointer absolute -top-0.5 -right-0 bg-white text-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
          >
            <TiDeleteOutline size={20} />
          </button>
        </div>
      ))}

      {/* Videos */}
      {(product.videos || []).map((vid, i) => {
        // Stable key per video
        const key = vid.url || vid.name || `vid-${i}`;
        return (
          <div
            key={key}
            className="relative h-24 group rounded overflow-hidden"
          >
            <video
              ref={(el) => (VideoRef.current[key] = el)}
              src={getUrl(vid)}
              className="w-full h-full object-cover rounded"
              // preload="auto"
              muted
              playsInline
              preload="metadata"
              onClick={() => {
                setShowControls((p) => ({ ...p, [key]: true }));
                setTimeout(
                  () => setShowControls((p) => ({ ...p, [key]: false })),
                  5000,
                );
              }}
              onTimeUpdate={() => {
                const video = VideoRef.current[key];
                setVideoProgress((prev) => ({
                  ...prev,
                  [key]: video ? (video.currentTime / video.duration) * 100 : 0,
                }));
              }}
              onPause={() =>
                setPlayingVideos((prev) => ({ ...prev, [key]: false }))
              }
              onEnded={() =>
                setPlayingVideos((prev) => ({ ...prev, [key]: false }))
              }
            />

            {/* Play Button */}
            {!playingVideos[key] && (
              // <div className="absolute inset-0 flex items-center justify-center">
              //   <div className="w-7 cursor-pointer h-7 bg-white/50 rounded-full flex items-center justify-center">
              //     <FaPlay size={14} onClick={() => handleTogglePlay(key)} />
              //   </div>
              // </div>
              <div className="absolute top-1/2 left-1/2 transform w-7 h-7 bg-white/45 rounded-full -translate-x-1/2 -translate-y-1/2 text-white text-xl cursor-pointer">
                <FaPlay
                  className="absolute top-1/2 ml-0.5 left-1/2 transform -translate-x-1/2 -translate-y-1/2 "
                  size={14}
                  onClick={() => handleTogglePlay(key)}
                />
              </div>
            )}

            {/* Pause Button */}
            {playingVideos[key] && showControls[key] && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-7 h-7 cursor-pointer text-white bg-white/50 rounded-full flex items-center justify-center">
                  <FaPause size={14} onClick={() => handleTogglePlay(key)} />
                </div>
              </div>
            )}

            {/* Progress Bar */}
            <div
              className="absolute bottom-1 left-1 right-1 h-1 bg-white/60 rounded cursor-pointer"
              onClick={(e) => {
                const video = VideoRef.current[key];
                if (!video) return;
                const rect = e.currentTarget.getBoundingClientRect();
                const clickPos = (e.clientX - rect.left) / rect.width;
                video.currentTime = clickPos * video.duration;
                setVideoProgress((prev) => ({
                  ...prev,
                  [key]: clickPos * 100,
                }));
              }}
            >
              <div
                className="h-full bg-gray-400 rounded"
                style={{ width: `${videoProgress[key] || 0}%` }}
              />
            </div>

            <button
              type="button"
              onClick={() => removeVideo(i)}
              className="cursor-pointer absolute -top-0.5 -right-0 bg-white text-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
            >
              <TiDeleteOutline size={20} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default MediaUploader;
