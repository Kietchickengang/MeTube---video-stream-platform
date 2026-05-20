import axios from "axios";

const api_port = import.meta.env.VITE_API_SERVER_PORT;
const host = `http://localhost:${api_port}/metube`;

const apiUpdateDB = async (key, metadata) => {
  try {
    await axios.patch(`${host}/${key}/goPublish`, metadata, {
      withCredentials: true,
    });
  } catch (err) {
    console.error(`Update DB failed: ${err}`);
    throw err;
  }
};

const callWorker = async (videoId, thumbIn4) => {
  try {
    const { timestamp, file } = thumbIn4;

    await axios.post(
      `${host}/${videoId}/wrkJobs`,
      {
        timestamp,
        file,
      },
      {
        withCredentials: true, // 👈 FIX
      },
    );
  } catch (err) {
    console.error(`Worker failed: ${err}`);
    throw err;
  }
};

export const whenSubmit = async (key, metadata) => {
  const { title, description, status, thumbIn4 } = metadata;

  await apiUpdateDB(key, {
    title,
    description,
    status,
  });

  await callWorker(key, thumbIn4);
};
