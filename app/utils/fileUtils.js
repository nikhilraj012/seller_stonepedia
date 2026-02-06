
// import toast from "react-hot-toast";
// const MAX_IMAGE = 3;
// const MAX_VIDEO = 1;
// const MAX_PDF_SIZE_MB = 2;
// const MAX_IMAGE_SIZE_MB = 2;
// const MAX_VIDEO_SIZE_MB = 5;
// export const processFiles = (files, mediaArray = []) => {
//     if (!files?.length) return [];
//     const imagesCount = mediaArray.filter((x) =>
//       (x.type || "").startsWith("image/")
//     ).length;
//     const videosCount = mediaArray.filter((x) =>
//       (x.type || "").startsWith("video/")
//     ).length;
//     const imageFiles = files.filter((f) => (f.type || "").startsWith("image/"));
//     const videoFiles = files.filter((f) => (f.type || "").startsWith("video/"));
//     if (imagesCount + imageFiles.length > MAX_IMAGE) {
//       toast.error(`Maximum ${MAX_IMAGE} images allowed`);
//       return [];
//     }
//     if (videosCount + videoFiles.length > MAX_VIDEO) {
//       toast.error(`Maximum ${MAX_VIDEO} videos allowed`);
//       return [];
//     }
//      return validateFiles(files).map((f) => ({
//        file: f,
//        url: URL.createObjectURL(f),
//        type: f.type,
//      }));
//   };

// ;

//   const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];
// const ALLOWED_VIDEO_TYPES = ["video/mp4"];

// export const validateFiles = (files) => {
//   return Array.from(files).filter((file) => {
//     const ext = file.name.split(".").pop()?.toLowerCase();
//     const isImage = ALLOWED_IMAGE_TYPES.includes(file.type) || ALLOWED_IMAGE_TYPES.includes(`image/${ext}`);
//     const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type) || ALLOWED_VIDEO_TYPES.includes(`video/${ext}`);
    
//     if (!isImage && !isVideo) {
//       toast.error("Only JPG, PNG, MP4 allowed");
//       return false;
//     }

//     let maxSizeMB = isImage ? MAX_IMAGE_SIZE_MB : MAX_VIDEO_SIZE_MB;
//     if (file.size > maxSizeMB * 1024 * 1024) {
//       toast.error(`${file.name} exceeds ${maxSizeMB}MB limit`);
//       return false;
//     }

//     return true;
//   });
// };
export const processFiles = (files) => {
  if (!files?.length) return [];

  return validateFiles(files).map((f) => ({
    file: f,
    url: URL.createObjectURL(f),
    type: f.type,
  }));
};

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];
const ALLOWED_VIDEO_TYPES = ["video/mp4"];

export const validateFiles = (files) => {
  return Array.from(files).filter((file) => {
    const ext = file.name.split(".").pop()?.toLowerCase();
    const isImage =
      ALLOWED_IMAGE_TYPES.includes(file.type) ||
      ALLOWED_IMAGE_TYPES.includes(`image/${ext}`);
    const isVideo =
      ALLOWED_VIDEO_TYPES.includes(file.type) ||
      ALLOWED_VIDEO_TYPES.includes(`video/${ext}`);

    if (!isImage) {
      toast.error("Only JPG, JPEG, PNG allowed");
      return false;
    }
if( !isVideo) {
      toast.error("MP4 allowed");
      return false;
    }
   
    return true;
  });
};