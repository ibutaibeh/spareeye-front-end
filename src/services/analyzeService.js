// src/services/analyzeService.js
import axios from "axios";
const BASE_URL =`${import.meta.env.VITE_BACK_END_SERVER_URL}/requests`

const buildAnalyzeForm = (userText = "", files = []) => {
  const form = new FormData();
  form.append("userText", userText);
  (files || []).forEach((f) => form.append("images", f));
  return form;
}

const analyzeRequest = async ({ userText = "", files = [] } = {}) => {
  const form = buildAnalyzeForm(userText, files);

  const { data } = await axios.post(`${BASE_URL}/analyze`, form, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 60_000,
    onUploadProgress: (evt) => {
    },
  });

  return data;
}

export { analyzeRequest }