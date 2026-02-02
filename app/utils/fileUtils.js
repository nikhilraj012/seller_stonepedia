
import toast from "react-hot-toast";
const MAX_IMAGE = 3;
const MAX_VIDEO = 1;
const MAX_PDF_SIZE_MB = 2;
const MAX_IMAGE_SIZE_MB = 2;
const MAX_VIDEO_SIZE_MB = 5;
export const processFiles = (files, mediaArray = []) => {
    if (!files?.length) return [];
    const imagesCount = mediaArray.filter((x) =>
      (x.type || "").startsWith("image/")
    ).length;
    const videosCount = mediaArray.filter((x) =>
      (x.type || "").startsWith("video/")
    ).length;
    const imageFiles = files.filter((f) => (f.type || "").startsWith("image/"));
    const videoFiles = files.filter((f) => (f.type || "").startsWith("video/"));
    if (imagesCount + imageFiles.length > MAX_IMAGE) {
      toast.error(`Maximum ${MAX_IMAGE} images allowed`);
      return [];
    }
    if (videosCount + videoFiles.length > MAX_VIDEO) {
      toast.error(`Maximum ${MAX_VIDEO} videos allowed`);
      return [];
    }
     return validateFiles(files).map((f) => ({
       file: f,
       url: URL.createObjectURL(f),
       type: f.type,
     }));
  };

;

  export const validateFiles = (files) => {
    return Array.from(files).filter((file) => {
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");
      const isPDF = file.type === "application/pdf";
  
      let maxSizeMB = 0;  
      if (isImage) maxSizeMB = MAX_IMAGE_SIZE_MB;
      else if (isVideo) maxSizeMB = MAX_VIDEO_SIZE_MB;
     else if (isPDF) maxSizeMB = MAX_PDF_SIZE_MB;
      else {
        toast.error("Only Image, Video allowed");
        return false;
      }
  
      if (file.size > maxSizeMB * 1024 * 1024) {
        toast.error(
          `${file.name} exceeds ${maxSizeMB}MB limit`,
          { duration: 1500 }
        );
        return false;
      }
  
      return true;
    });
  };