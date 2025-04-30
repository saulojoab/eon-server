import { IMangaInfo, MANGA } from "@consumet/extensions";
import { IMangaSearchResult, IProvider } from "src/features/mangas/Mangas.type";

export const searchManga = async (query: string, providers: IProvider[]) => {
  try {
    const allData = providers.map(async (provider) => {
      try {
        const providerInstance = new MANGA[provider]();
        const search = await providerInstance.search(query);

        return { provider, search };
      } catch (error) {
        console.error(`Error searching with provider ${provider}:`, error);
        return { provider, search: { results: [] } };
      }
    });

    const data = await Promise.all(allData);

    const processedData = data.flatMap((providerData) => {
      if (!providerData.search || !providerData.search.results) {
        console.warn(`No results found for provider ${providerData.provider}`);
        return [];
      }

      return providerData.search.results.map((item) => {
        return {
          ...item,
          provider: providerData.provider,
        } as IMangaSearchResult;
      });
    });

    return processedData;
  } catch (error) {
    console.error("Error in searchManga function:", error);
    return [];
  }
};

function serializeMangaDescription(manga: IMangaInfo) {
  if (typeof manga?.description === "string") {
    return manga.description;
  }

  if (Array.isArray(manga?.description)) {
    return manga.description[0];
  }

  if (typeof manga?.description === "object") {
    return manga.description["en"];
  }

  return "";
}

export const getMangaInfo = async (id: string, provider: IProvider) => {
  const providerInstance = new MANGA[provider]();
  const mangaInfo = await providerInstance.fetchMangaInfo(id);

  const serializedDescription = serializeMangaDescription(mangaInfo);

  const mangaDetails = {
    ...mangaInfo,
    description: serializedDescription,
  };

  return mangaDetails;
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
