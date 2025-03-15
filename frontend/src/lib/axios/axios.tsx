import axios from "axios";

const API_URL = "http://localhost:4000/api";

// create axiosclient with base url
export const axiosClient = axios.create({
  baseURL: API_URL,
});
