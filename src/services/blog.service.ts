import { get, put } from "./axios";
import { ResponseConfig } from "./interfaces";

export const getBlogs = async (): Promise<ResponseConfig> => {
  return await get("/blog/");
};

export const saveBlogs = async (data = {}): Promise<ResponseConfig> => {
  return await put("/blog/", data);
};
