
// uploadImageToCloudinary.js
export async function uploadImageToCloudinary(file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);

  try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`, {
          method: 'POST',
          body: formData,
      });

      const data = await response.json();
      return data.secure_url; // The URL of the uploaded image
  } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw error;
  }
}

export default uploadImageToCloudinary;
