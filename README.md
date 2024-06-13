# MangaSee API

## Api

every Api should have 3 methods:

- search - use the api to search for the manga
- getDetails - get details for specific manga (use as refresh)
- getSlides - get the slides of specific manga episode

```typescript
interface Api {
  search: (term: string) => MangaDetails[];
  getDetails: (uri: string) => MangaDetails;
  getSlides: (uri: string, episode: number) => string[];
}

const apiList: Record<MangaProvider, Api> = {};

// how to use in the client:

const searchManga = (term: string): Record<MangaProvider, MangaDetails[]> => {
  const results: Record<MangaProvider, MangaDetails[]> = {};

  for (const api in apiList) {
    results[api] = apiList[api].search(term);
  }

  return results;
};

const getMangaDetails = (provider: MangaProvider, uri: string): MangaDetails => apiList[provider].getDetails(uri);

const getEpisodeSlides = (provider: MangaProvider, uri: string, episode: number): string[] =>
  apiList[provider].getSlides(uri, episode);
```
