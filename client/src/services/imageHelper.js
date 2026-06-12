// Handles both Cloudinary full URLs and local /uploads/ filenames
export const imgUrl = (image) => {
  if (!image) return null;
  // Already a full URL (Cloudinary)
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  // Local filename
  return `/uploads/${image}`;
};
