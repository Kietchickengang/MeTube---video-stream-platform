import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8000/metube",
  withCredentials: true, //
});

export default axiosClient;
