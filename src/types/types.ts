import { FuseResult } from 'fuse.js';

export type MangaProvider = 'mangaSee' | 'Asura-scans';

export interface Api {
  // search: (term: string) => FuseResult<MangaRecord>[];
  search: (term: string) => Promise<MangaRecord[]>;
  getDetails: (uri: string) => MangaDetails;
  getSlides: (uri: string, episode: number) => string[];
}

export type RawMangaRecord = {
  i: string; // canonical name
  s: string; // real name
  a: string[]; // nicknames
};

export type MangaRecord = {
  uri: string;
  coverUrl: string;
  fullName: string;
  nicknames?: string[];
};

export type mangaEpisodeSlide = {
  src: string;
};

export type mangaEpisode = {
  slides: mangaEpisodeSlide[];
};

export type MangaDetails = {
  coverUrl: string;
  fullName: string;
  episodeCount: number;
  missingEpisodes?: number[];
};

export type RssDetails = {
  coverUrl: string;
  fullName: string;
};
