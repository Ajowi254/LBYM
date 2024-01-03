//imageUploadService.js
import axios from 'axios';

export async function uploadImage(userId, file) {
  const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";
  const url = `${BASE_URL}/users/${userId}/profile_pic`;
  const formData = new FormData();
  formData.append('image', file);

  const response = await axios.put(url, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

  return response.data.url;
}
