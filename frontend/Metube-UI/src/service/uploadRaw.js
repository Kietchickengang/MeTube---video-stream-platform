import axios from "axios";
import { encrypting } from "../../../../api_server/src/middleware/AES.js";

const api_port = import.meta.env.VITE_API_SERVER_PORT;
const secret_key = import.meta.env.VITE_AES_SECRET_KEY;
const host = `http://localhost:${api_port}/metube`;

export const uploadS3 = async (file, progress) => {
  if (!file) throw new Error("Empty file");

  try {
    const { name, type, size } = file;

    // 1> presigned URL
    const vietnixRep = await axios.post(
      `${host}/presigned-URL`,
      {
        fileName: name,
        contentType: type,
        fileSize: size,
      },
      {
        withCredentials: true,
      },
    );

    const { url, key, fields } = vietnixRep.data;
    const encryptKey = encrypting(secret_key, key);

    const formData = new FormData();
    Object.entries(fields).forEach(([k, v]) => {
      formData.append(k, v);
    });
    formData.append("file", file);

    // 2> init DB
    await axios.post(
      `${host}/${encryptKey}/initVidDB`,
      {
        videoPath: key,
        videoSize: size,
        mimeType: type,
      },
      {
        withCredentials: true,
      },
    );

    // 3> upload S3 (không cần auth)
    await axios.post(url, formData, {
      onUploadProgress: (e) => {
        const percent = Math.round((e.loaded * 100) / e.total);
        if (progress) progress(percent);
      },
    });

    return encryptKey;
  } catch (err) {
    console.error("Error when uploading video to S3: ", err);
    throw err;
  }
};
