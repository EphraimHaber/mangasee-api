# MangaSee API

## Api

every Api should have 3 methods:

- search - use the api to search for the manga
- getDetails - get details for specific manga (use as refresh)
- getSlides - get the slides of specific manga episode

```typescript
interface Api {
  search: (term: string) => Promise<MangaRecord[]>;
  getDetails: (uri: string) => Promise<MangaDetails>;
  getChapterSlides: (canonicalName: string, chapter: number, totalSlides: number) => string[];
}
```
