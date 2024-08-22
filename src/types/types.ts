import axios from 'axios';
import { CapacitorHttp, HttpHeaders, HttpResponse } from '@capacitor/core';
import { httpGetHandler } from '../http-handler';

export interface MangaApi {
  search: (term: string) => MangaRecord[];
  getDetails: (uri: string) => Promise<MangaDetails>;
  getChapterSlides: (canonicalName: string, chapter: number, totalSlides: number) => Promise<string[]>;
}

export type RawMangaRecord = {
  i: string; // canonical name
  s: string; // real name
  a: string[]; // nicknames
};

export type MangaRecord = {
  canonicalName: string;
  coverUrl: string;
  fullName: string;
  nicknames?: string[];
};

export type EpisodeDetails = {
  paddedChapter: string;
  chapter: number;
  totalSlides: number;
};

export type MangaDetails = {
  coverUrl: string;
  fullName: string;
  episodeCount: number;
  canonicalName: string;
  chapters: EpisodeDetails[];
  missingChapters?: number[];
} & ExtraMangaDetails;

export type RssDetails = {
  coverUrl: string;
  fullName: string;
  link: string;
};

export type HttpHandlerMode = keyof typeof httpGetHandler;

export type ExtraMangaDetails = {
  'Author(s)': string[];
  'Genre(s)': string[];
  Type: string[];
  Released: string[];
  Status: string[];
  Description: string;
};
