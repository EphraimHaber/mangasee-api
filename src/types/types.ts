export type MangaProvider = 'mangaSee' | 'Asura-scans';

export interface Api {
  search: (term: string) => Promise<MangaRecord[]>;
  getDetails: (uri: string) => Promise<MangaDetails>;
  getChapterSlides: (canonicalName: string, chapter: number, totalSlides: number) => string[];
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

export type mangaEpisodeSlide = {
  src: string;
};

export type mangaEpisode = {
  slides: mangaEpisodeSlide[];
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
};

export type RssDetails = {
  coverUrl: string;
  fullName: string;
  link: string;
};
