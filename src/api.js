import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const api = axios.create({
  baseURL: process.env.API_BASE_URL,
  timeout: 10000,
});

export const getRecentMonth = async () => {
  const { data } = await api.get("/loteria/ultimo-mes");
  return data;
};

export const getByDrawId = async (drawId) => {
  try {
    const { data } = await api.get(`/loteria/draw/${drawId}`);
    return data;
  } catch (err) {
    if (err.response?.status === 404) return null;
    throw err;
  }
};
