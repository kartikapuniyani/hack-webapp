import { get } from "./apiClient";

export const getData = async (city = "gurgaon") => {
  const result = await get(`api/potholes/city/${city.toLowerCase()}`);
  return result;
};
