import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

//primer sorteo lotería 3062

const api = axios.create({
  baseURL: process.env.API_BASE_URL,
  timeout: 10000,
  headers: {
    "User-Agent": "Mozilla/5.0 (compatible; LoteriaSync/1.0)",
    Accept: "application/json",
  },
});

export const getRecentMonth = async () => {
  const { data } = await api.get("/loterianacional/page");
  return data;
};

export const getByDrawNumber = async (sorteo) => {
  try {
    const { data } = await api.get(`/loterianacional/${sorteo}`);
    return data;
  } catch (err) {
    if (err.response?.status === 404) return null;
    throw err;
  }
};
