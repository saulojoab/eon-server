import axios, { AxiosRequestConfig } from "axios";

export const getImage = async (
  url: string,
  options: AxiosRequestConfig
): Promise<string> => {
  const data = await axios
    .get(url, {
      responseType: "arraybuffer",
      ...options,
    })
    .catch((err) => {
      return { data: err.response.data };
    });
  return data.data;
};
