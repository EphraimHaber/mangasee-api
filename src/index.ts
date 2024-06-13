import axios from 'axios';
import { mangaSeeSearch } from './constants';
import { getCoverImageUrl, getFirstChapterUrl } from './utils';
import { MangaRecord, RawMangaRecord } from './types/types';
import Fuse from 'fuse.js';

const mangaRecords: MangaRecord[] = [];

export const getMangaList = async () => {
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

export const search = (term: string) => {
  const fuse = new Fuse(mangaRecords, {
    keys: ['nicknames', 'fullName'],
    threshold: 0.3,
    includeScore: true,
    isCaseSensitive: false,
    shouldSort: true,
  });
  const res = fuse.search(term);
  return res;
};

export const getMangaDetails = async (canonicalName: string = 'Skeleton-Double') => {
  const firstChapterUrl = getFirstChapterUrl(canonicalName);
  const res = (await axios.get(firstChapterUrl)).data as string;
  const chapterDetailsPattern = /vm\.CHAPTERS = (.*);/;
  const chaptersGroups = chapterDetailsPattern.exec(res);
  console.log('************************');
  // 1: {}
  // 2: {}
  // [{"Chapter":"100010","Type":"Chapter","Page":"73","Directory":"","Date":"2022-09-12 17:54:04","ChapterName":null}]
  if (chaptersGroups) {
    console.log(chaptersGroups[1]);
  }
};

(async () => {
  await getMangaList();
})();
