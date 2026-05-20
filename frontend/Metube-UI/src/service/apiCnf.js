import axios from "axios";

const api_port = import.meta.env.VITE_API_SERVER_PORT;
const host = `http://localhost:${api_port}/metube`;

const apiCnf = async (key) => {
  try {
    const apiRes = await axios.post(
      `${host}/${key}/cnf`,
      {},
      {
        withCredentials: true,
      },
    );

    return apiRes.data.status;
  } catch (err) {
    console.error(`Upload status confirmation failed: ${err}`);
    throw err;
  }
};

export const uploadCnf = async (key) => {
  return await apiCnf(key);
};
