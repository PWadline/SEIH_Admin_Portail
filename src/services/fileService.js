import { seihFetch } from "./seihApi";

export const getFilePreviewUrl = async (fileId) => {
  const response = await seihFetch("/seih/file/preview", {
    method: "POST",
    body: { id: fileId },
  });

  if (!response.ok) {
    throw new Error("Preview failed");
  }

  const blob = await response.blob();
  return URL.createObjectURL(blob);
};