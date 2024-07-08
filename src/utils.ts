import {
  mangaCoverBaseUrl,
  mangaReadOnlineBaseUrl,
  mangaSlideBaseUrl,
  chapterWithPaddingLength,
  rssBaseUrl,
  slideWithPaddingLength,
  mangaMetadataBaseUrl,
} from './constants';
import { XMLParser } from 'fast-xml-parser';
import { ExtraMangaDetails, HttpHandlerMode, RssDetails } from './types/types';
import { doGet } from './http-handler';
import { parseHTML } from 'linkedom';

export const getCoverImageUrl = (uri: string): string => {
  return `${mangaCoverBaseUrl}${uri}.jpg`;
};

export const getMangeDetailsUrl = (canonicalName: string) => {
  return `${mangaMetadataBaseUrl}${canonicalName}`;
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

export const getRssDetails = async (canonicalName: string, mode: HttpHandlerMode): Promise<RssDetails> => {
  const link = `${rssBaseUrl}${canonicalName}.xml`;
  const res = await doGet(mode, link);
  const parser = new XMLParser();
  const mangaRssJsonDetails = parser.parse(res);
  return {
    fullName: mangaRssJsonDetails.rss.channel.title,
    coverUrl: mangaRssJsonDetails.rss.channel.image.url,
    link: mangaRssJsonDetails.rss.channel.link,
  };
};

const getNextAnchorSiblings = (elem: Element) => {
  const anchorSiblings: HTMLAnchorElement[] = [];
  let nextElem = elem.nextElementSibling;

  while (nextElem) {
    if (nextElem.tagName.toLowerCase() !== 'a') break;
    anchorSiblings.push(nextElem as HTMLAnchorElement);
    nextElem = nextElem.nextElementSibling;
  }
  return anchorSiblings;
};

export const getExtraDetails = async (canonicalName: string, mode: HttpHandlerMode) => {
  const detailsUrl = getMangeDetailsUrl(canonicalName);
  const res: string = await doGet(mode, detailsUrl);
  const extraDetails = extractDetails(res);
  return extraDetails;
};

const getBetterHtml = (htmlString: string) => {
  const { window, document, customElements, HTMLElement, Event, CustomEvent } = parseHTML(htmlString);
  const listItems: HTMLLIElement[] = Array.from(document.querySelectorAll('li.list-group-item>span.mlabel'));
  let resStr: string = '';
  for (const listItem of listItems) {
    resStr += listItem.parentElement?.innerHTML;
    resStr += '\n';
  }
  return resStr;
};

export const extractDetails = (htmlString: string) => {
  const { window, document, customElements, HTMLElement, Event, CustomEvent } = parseHTML(getBetterHtml(htmlString));
  const betterDoc = document;

  const keysElem = Array.from(betterDoc.querySelectorAll('.mlabel'));
  const keys = keysElem.map(v => v.textContent?.replace(':', ''));

  const res: Record<string, string | string[]> = {};

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i] as string;
    if (key == 'RSS') continue;
    if (key in res) continue;
    if (key == 'Description') {
      res[key] = betterDoc.querySelector('.top-5')?.textContent as string;
    } else {
      res[key] = getNextAnchorSiblings(keysElem[i]).map(v => v.textContent) as string[];
    }
  }
  return res as ExtraMangaDetails;
};
