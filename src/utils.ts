import axios from 'axios';
import { parseString } from 'xml2js';
import { mangaCoverBaseUrl, mangaReadOnlineBaseUrl, rssBaseUrl } from './constants';
import { XMLParser } from 'fast-xml-parser';

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
  const parser = new XMLParser();
  let jObj = parser.parse(res);
  console.log(jObj);
  console.log(jObj.rss.channel.image);
};
