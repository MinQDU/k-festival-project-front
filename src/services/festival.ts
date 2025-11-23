import { axios } from "./axios";
import type { FestivalItem } from "../types/festival";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const getFestivalList = async (page: number) => {
  const res = await axios.get(`${API_BASE_URL}/app/festival/list?page=${page}`);
  return res.data; // 20개
};

export const searchFestival = async (keyword: string): Promise<FestivalItem[]> => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/app/festival/${keyword}/search`);
  return res.data;
};
