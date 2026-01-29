import { useEffect, useRef, useState } from "react";

const useMediaPlayer = () => {
  const VideoRef = useRef({});

  const [playingVideos, setPlayingVideos] = useState({});
  const [videoProgress, setVideoProgress] = useState({});
  const [showControls, setShowControls] = useState({});
const normalizeKey = (key) =>
  typeof key === "number" ? `video-${key}` : key;

 const isVideoItem = (item) => {
    if (!item) return false;
    const url = typeof item === "string" ? item : item.url || "";
    const typeFlag =
      (item.type && item.type.toString().toLowerCase().startsWith("video")) ||
      false;
    const mimeFlag =
      item?.mimeType?.toString().toLowerCase().startsWith?.("video") || false;
    const extFlag = /\.(mp4|webm|mov|ogg)(\?|#|$)/i.test(url);
    return typeFlag || mimeFlag || extFlag;
  };


const handleTogglePlay = (rawKey) => {
  const key = normalizeKey(rawKey);
    const currentVideo = VideoRef.current[key];
    if (!currentVideo) return;

    Object.entries(VideoRef.current).forEach(([k, v]) => {
  const normalized = normalizeKey(k);
  if (normalized !== key && v && !v.paused) {
    v.pause();
    setPlayingVideos((p) => ({ ...p, [normalized]: false }));
  }
});
    if (currentVideo.paused) {
      currentVideo.play();
      setPlayingVideos((p) => ({ ...p, [key]: true }));
    } else {
      currentVideo.pause();
      setPlayingVideos((p) => ({ ...p, [key]: false }));
    }

    setShowControls((p) => ({ ...p, [key]: true }));
    setTimeout(
      () => setShowControls((p) => ({ ...p, [key]: false })),
      2000
    );
  };

  useEffect(() => {
    const handleVisibility = () => {
      Object.entries(VideoRef.current).forEach(([key, video]) => {
        if (!video) return;
        setPlayingVideos((p) => ({
          ...p,
          [key]: !video.paused && !video.ended,
        }));
      });
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  return {
    VideoRef,
    playingVideos,
    videoProgress,
    showControls,
    setVideoProgress,
     setPlayingVideos,
    setShowControls,
    handleTogglePlay,
    isVideoItem,
  };
};

export default useMediaPlayer;


// import { useEffect, useRef, useState } from "react";

// const useMediaPlayer = () => {
//   const VideoRef = useRef({});

//   const [playingVideos, setPlayingVideos] = useState({});
//   const [videoProgress, setVideoProgress] = useState({});
//   const [showControls, setShowControls] = useState({});

//  const isVideoItem = (item) => {
//     if (!item) return false;
//     const url = typeof item === "string" ? item : item.url || "";
//     const typeFlag =
//       (item.type && item.type.toString().toLowerCase().startsWith("video")) ||
//       false;
//     const mimeFlag =
//       item?.mimeType?.toString().toLowerCase().startsWith?.("video") || false;
//     const extFlag = /\.(mp4|webm|mov|ogg)(\?|#|$)/i.test(url);
//     return typeFlag || mimeFlag || extFlag;
//   };


//   const handleTogglePlay = (key) => {
//     const currentVideo = VideoRef.current[key];
//     if (!currentVideo) return;

//     Object.entries(VideoRef.current).forEach(([k, v]) => {
//       if (v && k !== key && !v.paused) {
//         v.pause();
//         setPlayingVideos((p) => ({ ...p, [k]: false }));
//       }
//     });

//     if (currentVideo.paused) {
//       currentVideo.play();
//       setPlayingVideos((p) => ({ ...p, [key]: true }));
//     } else {
//       currentVideo.pause();
//       setPlayingVideos((p) => ({ ...p, [key]: false }));
//     }

//     setShowControls((p) => ({ ...p, [key]: true }));
//     setTimeout(
//       () => setShowControls((p) => ({ ...p, [key]: false })),
//       2000
//     );
//   };

//   useEffect(() => {
//     const handleVisibility = () => {
//       Object.entries(VideoRef.current).forEach(([key, video]) => {
//         if (!video) return;
//         setPlayingVideos((p) => ({
//           ...p,
//           [key]: !video.paused && !video.ended,
//         }));
//       });
//     };

//     document.addEventListener("visibilitychange", handleVisibility);
//     return () =>
//       document.removeEventListener("visibilitychange", handleVisibility);
//   }, []);

//   return {
//     VideoRef,
//     playingVideos,
//     videoProgress,
//     showControls,
//     setVideoProgress,
//      setPlayingVideos,
//     setShowControls,
//     handleTogglePlay,
//     isVideoItem,
//   };
// };

// export default useMediaPlayer;