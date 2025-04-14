import { MANGA } from "@consumet/extensions";
import { IMangaSearchResult, IProvider } from "src/features/mangas/Mangas.type";

export const searchManga = async (query: string, providers: IProvider[]) => {
  const allData = providers.map(async (provider) => {
    const providerInstance = new MANGA[provider]();

    const search = await providerInstance.search(query);

    return { provider, search };
  });

  const data = await Promise.all(allData);

  const processedData = data.map((providerData) => {
    return providerData.search.results.map((item) => {
      return {
        ...item,
        provider: providerData.provider,
      } as IMangaSearchResult;
    });
  })[0];

  return processedData;
};

export const getMangaInfo = async (id: string, provider: IProvider) => {
  const providerInstance = new MANGA[provider]();
  const mangaInfo = await providerInstance.fetchMangaInfo(id);

  return mangaInfo;
};

export const getMangaChapters = async (
  chapterId: string,
  mangaId: string,
  provider: IProvider
) => {
  const providerInstance = new MANGA[provider]();
  const mangaChapters = await providerInstance.fetchChapterPages(
    chapterId,
    mangaId
  );

  return mangaChapters;
};
