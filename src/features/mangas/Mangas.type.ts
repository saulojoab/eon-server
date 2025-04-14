import { MANGA } from "@consumet/extensions";

export type IProvider = keyof typeof MANGA;

export type IMangaSearchResult = {
  id: string;
  title: string;
  headerForImage: {
    Referer: string;
  };
  image: string;
  description: string;
  status: string;
  provider: string;
};
