import axios from "axios";

const api_port = import.meta.env.VITE_API_SERVER_PORT;
const secret_key = import.meta.env.VITE_AES_SECRET_KEY;
const host = `http://localhost:${api_port}/metube`;

export const uploadImgS3 = async (file, Mykey) => {
  if (!file) throw new Error("Empty file");

  try {
    const { name, type, size } = file;

    // 1> Request for presigned URL
    const s3Rep = await axios.post(
      `${host}/upFile/presigned-URL`,
      {
        fileName: name,
        folderName: Mykey,
        contentType: type,
        fileSize: size,
      },
      {
        withCredentials: true,
      },
    );

    const { url, key, fields } = s3Rep.data;

    // Build form data
    const formData = new FormData();

    Object.entries(fields).forEach(([k, v]) => {
      formData.append(k, v);
    });

    formData.append("file", file);

    // 2> Upload user file to Vietnix using presigned URL
    await axios.post(url, formData);

    // Return key(videoId) for next step
    return key;
  } catch (err) {
    console.error("Error uploading image to S3: ", err);
    throw err;
  }
};
