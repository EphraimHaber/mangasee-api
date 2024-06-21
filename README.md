# MangaSee API

## Api

every Api should have 3 methods:

- search - use the api to search for the manga
- getDetails - get details for specific manga (use as refresh)
- getChapterSlides - get the slides of specific manga episode

```typescript
(async () => {
  const api = await initializeMangaSeeApi('axios');
  console.log(api.mangaRecords.length);
  const searchRes = api.search('skeleton');
  console.log('Search results', searchRes);
  const selectedManga = searchRes[0];
  console.log('selectedManga', selectedManga);
  const selectedMangaCanonicalName = selectedManga!.canonicalName;
  console.log('selectedMangaCanonicalName', selectedMangaCanonicalName);
  const selectedMangaDetails = await api.getDetails(selectedMangaCanonicalName);
  console.log('selectedMangaDetails', selectedMangaDetails);
  const chapterSlides = api.getChapterSlides(
    selectedMangaDetails.canonicalName,
    selectedMangaDetails.chapters[0].chapter,
    selectedMangaDetails.chapters[0].totalSlides,
  );
  console.log('chapterSlides', chapterSlides);
})();
```
