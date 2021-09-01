import { get, put, del } from "./axios";
import { ResponseConfig } from "./interfaces";

export const getTags = async (): Promise<ResponseConfig> => {
  return await get("/tag/");
};

export const saveTag = async (
  name: string,
  tagId?: number
): Promise<ResponseConfig> => {
  return await put("/tag/", {
    tagId,
    name,
  });
};

export const deleteTags = async (tagIds: number[]): Promise<ResponseConfig> => {
  return await del("/tag/", { tagIds });
};
