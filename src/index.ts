import axios from 'axios';
import { mangaSeeSearch } from './constants';
import { getCoverImageUrl, getFirstChapterUrl, getRssDetails, getSlideUrl, toRealChapter } from './utils';
import { EpisodeDetails, MangaApi, MangaDetails, MangaRecord, RawMangaRecord } from './types/types';
import Fuse from 'fuse.js';

const mangaRecords: MangaRecord[] = [];

const getMangaList = async () => {
  const res: RawMangaRecord[] = (await axios.get(mangaSeeSearch)).data;
  res.forEach(rawMangaRecord => {
    mangaRecords.push({
      canonicalName: rawMangaRecord.i,
      fullName: rawMangaRecord.s,
      nicknames: [...rawMangaRecord.a],
      coverUrl: getCoverImageUrl(rawMangaRecord.i),
    });
  });
};

const search = async (term: string) => {
  const fuse = new Fuse(mangaRecords, {
    keys: ['nicknames', 'fullName'],
    threshold: 0.3,
    // includeScore: true,
    isCaseSensitive: false,
    shouldSort: true,
  });
  const fuzzyResults = fuse.search(term);
  const ret: MangaRecord[] = [];
  for (const result of fuzzyResults) {
    ret.push(result.item);
  }
  return ret;
};

const getDetails = async (canonicalName: string): Promise<MangaDetails> => {
  const firstChapterUrl = getFirstChapterUrl(canonicalName);
  const res = (await axios.get(firstChapterUrl)).data as string;
  const chapterDetailsPattern = /vm\.CHAPTERS = (.*);/;

  // TODO separate getting the chapters with regex, check for missing episode and add episode to separate functions.
  const chaptersGroups = chapterDetailsPattern.exec(res);
  const { coverUrl, fullName } = await getRssDetails(canonicalName);
  if (!chaptersGroups) {
    throw new Error('Unable To Retrieve Manga Details');
  }
  const rawChapters: any[] = JSON.parse(chaptersGroups[1]);
  const chapters: EpisodeDetails[] = [];
  const missingChapters: number[] = [];
  rawChapters.forEach((element, i) => {
    const currentChapter: number = toRealChapter(element['Chapter']);
    if (i === 0) {
      if (currentChapter !== 1) {
        missingChapters.push(i + 1);
      }
    }
    if (i !== 0) {
      if (currentChapter - 1 != chapters[i - 1].chapter) {
        missingChapters.push(currentChapter);
      }
    }
    chapters.push({
      paddedChapter: element['Chapter'],
      totalSlides: Number(element['Page']),
      chapter: currentChapter,
    });
  });
  return {
    chapters: chapters,
    coverUrl: coverUrl,
    episodeCount: chapters.length,
    missingChapters: missingChapters,
    fullName: fullName,
    canonicalName: canonicalName,
  };
};

const getChapterSlides = (canonicalName: string, chapter: number, totalSlides: number) => {
  const chapterSlidesUrls: string[] = [];
  for (let i = 1; i <= totalSlides; i++) {
    chapterSlidesUrls.push(getSlideUrl(canonicalName, chapter, i));
  }
  return chapterSlidesUrls;
};

(async () => {
  await getMangaList();
  // const searchRes = await search('skeleton');
  // console.log('Fucking Search results', searchRes);
  // const selectedManga = searchRes[0];
  // console.log('Fucking selectedManga', selectedManga);
  // const selectedMangaCanonicalName = selectedManga.canonicalName;
  // console.log('Fucking selectedMangaCanonicalName', selectedMangaCanonicalName);
  // const selectedMangaDetails = await getDetails(selectedMangaCanonicalName);
  // console.log('Fucking selectedMangaDetails', selectedMangaDetails);

  //get first episodes slides

  // const chapterSlides = getChapterSlides(
  //   selectedMangaDetails.canonicalName,
  //   selectedMangaDetails.chapters[0].chapter,
  //   selectedMangaDetails.chapters[0].totalSlides,
  // );
  // console.log('Fucking chapterSlides', chapterSlides);
})();

export const mangaSeeApi: MangaApi = {
  search,
  getDetails,
  getChapterSlides,
};
