import axios from 'axios';
import { mangaSeeSearch } from './constants';
import { getCoverImageUrl, getFirstChapterUrl, getTitleAndCoverUrl } from './utils';
import { Api, MangaDetails, MangaRecord, RawMangaRecord } from './types/types';
import Fuse from 'fuse.js';

const mangaRecords: MangaRecord[] = [];

const getMangaList = async () => {
  const res: RawMangaRecord[] = (await axios.get(mangaSeeSearch)).data;
  res.forEach(rawMangaRecord => {
    mangaRecords.push({
      uri: rawMangaRecord.i,
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

const getDetails = async (canonicalName: string = 'Skeleton-Double'): Promise<MangaDetails> => {
  const firstChapterUrl = getFirstChapterUrl(canonicalName);
  const res = (await axios.get(firstChapterUrl)).data as string;
  const chapterDetailsPattern = /vm\.CHAPTERS = (.*);/;
  const chaptersGroups = chapterDetailsPattern.exec(res);
  console.log('************************');
  // console.log(getCoverImageUrl(canonicalName));
  getTitleAndCoverUrl(canonicalName);
  // 1: {}
  // 2: {}
  // [{"Chapter":"100010","Type":"Chapter","Page":"73","Directory":"","Date":"2022-09-12 17:54:04","ChapterName":null}]
  if (chaptersGroups) {
    return {
      coverUrl: getCoverImageUrl(canonicalName),
      episodeCount: 0,
      fullName: '',
    };
  }
  throw new Error('Unable To Retrieve Manga Details');
};

(async () => {
  await getMangaList();
  // search("skeleton");
  await getDetails();
  // console.log(await getDetails());
})();

export const mangaSeeApi: Partial<Api> = {
  search,
  // getDetails,
};
