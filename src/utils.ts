import {
  mangaCoverBaseUrl,
  mangaReadOnlineBaseUrl,
  mangaSlideBaseUrl,
  chapterWithPaddingLength,
  rssBaseUrl,
  slideWithPaddingLength,
} from './constants';
import { XMLParser } from 'fast-xml-parser';
import { GetRequest, RssDetails } from './types/types';

export const getCoverImageUrl = (uri: string): string => {
  return `${mangaCoverBaseUrl}${uri}.jpg`;
};

export const getFirstChapterUrl = (uri: string): string => {
  return `${mangaReadOnlineBaseUrl}${uri}-chapter-1.html`;
};

export const toPaddedChapter = (chapter: number): string => {
  const chapterString = chapter.toString();
  const padding = '0'.repeat(chapterWithPaddingLength - chapterString.length);
  return `1${padding}${chapterString}0`;
};

export const toRealChapter = (paddedChapter: string): number => {
  const trimmedPaddedChapter = paddedChapter.slice(1, -1);
  return Number(trimmedPaddedChapter);
};

export const getSlideUrl = (canonicalName: string, chapter: number, slideNumber: number): string => {
  const chapterString = chapter.toString();
  const slideString = slideNumber.toString();
  const chapterPadding = '0'.repeat(chapterWithPaddingLength - chapterString.length);
  const slidePadding = '0'.repeat(slideWithPaddingLength - slideString.length);
  return `${mangaSlideBaseUrl}${canonicalName}/${chapterPadding}${chapterString}-${slidePadding}${slideString}.png`;
};

export const getRssDetails = async (
  canonicalName: string,
  getRequest: GetRequest,
  dataField: string,
): Promise<RssDetails> => {
  const link = `${rssBaseUrl}${canonicalName}.xml`;
  const res = (await getRequest(link))[dataField];
  const parser = new XMLParser();
  const mangaRssJsonDetails = parser.parse(res);
  return {
    fullName: mangaRssJsonDetails.rss.channel.title,
    coverUrl: mangaRssJsonDetails.rss.channel.image.url,
    link: mangaRssJsonDetails.rss.channel.link,
  };
};
