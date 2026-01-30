import { FaPlay, FaPause } from "react-icons/fa6";

const MediaGrid = ({ media = [], mediaPlayer, prefix = "m" }) => {
  const {
    VideoRef,
    isVideoItem,
    videoProgress,
    playingVideos,
    showControls,
    setVideoProgress,
    setPlayingVideos,
    setShowControls,
    handleTogglePlay,
  } = mediaPlayer;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {media.map((item, i) => {
        const url = typeof item === "string" ? item : item.url || "";
        const key = `${prefix}-${i}`;

        if (!isVideoItem(item)) {
          return (
            <img
              key={key}
              src={url}
              className="w-full h-28 sm:h-32 md:h-36 object-cover rounded-xl rounded-t-xl border border-gray-300"
              alt=""
            />
          );
        }

        return (
          <div key={key} className="relative w-full h-28 sm:h-32 md:h-36">
            <video
              ref={(el) => (VideoRef.current[key] = el)}
              src={url}
              onClick={() => {
                setShowControls((pre) => ({ ...pre, [key]: true }));
                setTimeout(() => {
                  setShowControls((pre) => ({ ...pre, [key]: false }));
                }, 5000);
              }}
              onTimeUpdate={() => {
                const video = VideoRef.current[key];
                setVideoProgress((prev) => ({
                  ...prev,
                  [key]:
                    video && video.duration
                      ? (video.currentTime / video.duration) * 100
                      : 0,
                }));
              }}
              onPause={() =>
                setPlayingVideos((prev) => ({ ...prev, [key]: false }))
              }
              onEnded={() =>
                setPlayingVideos((prev) => ({ ...prev, [key]: false }))
              }
              preload="auto"
              className="w-full h-full object-cover border border-gray-100 rounded-xl rounded-t-xl"
            />
            {!playingVideos[key] && (
              <div className="absolute top-1/2 left-1/2 transform w-7 h-7 bg-white/45 rounded-full -translate-x-1/2 -translate-y-1/2 text-white text-xl cursor-pointer">
                <FaPlay
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  size={15}
                  onClick={() => handleTogglePlay(key)}
                />
              </div>
            )}
            {playingVideos[key] && showControls[key] && (
              <div className="absolute top-1/2 left-1/2 transform w-7 h-7 bg-white/45 rounded-full -translate-x-1/2 -translate-y-1/2 text-white text-xl cursor-pointer">
                <FaPause
                  size={15}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  onClick={() => handleTogglePlay(key)}
                />
              </div>
            )}

            <div
              className="absolute bottom-2 left-2 right-2 h-1 bg-gray-50 rounded cursor-pointer"
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
                className="h-full bg-gray-300 rounded cursor-pointer"
                style={{
                  width: `${videoProgress[key] || 0}%`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MediaGrid;
