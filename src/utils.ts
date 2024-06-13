import { mangaCoverBaseUrl, mangaReadOnlineBaseUrl } from './constants';

export const getCoverImageUrl = (canonicalName: string): string => {
  return `${mangaCoverBaseUrl}${canonicalName}.jpg`;
};

export const getFirstChapterUrl = (canonicalName: string): string => {
  return `${mangaReadOnlineBaseUrl}${canonicalName}-chapter-1.html`;
};
