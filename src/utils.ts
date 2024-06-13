import axios from 'axios';
import { mangaCoverBaseUrl, mangaReadOnlineBaseUrl, rssBaseUrl } from './constants';

export const getCoverImageUrl = (uri: string): string => {
  return `${mangaCoverBaseUrl}${uri}.jpg`;
};

export const getFirstChapterUrl = (uri: string): string => {
  return `${mangaReadOnlineBaseUrl}${uri}-chapter-1.html`;
};

export const getTitleAndCoverUrl = async (canonicalName: string) => {
  const link = `${rssBaseUrl}${canonicalName}.xml`;
  console.log(link);
  const res = (await axios.get(link)).data;
  console.log(res);
};
