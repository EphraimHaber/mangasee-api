export interface MangaApi {
  search: (term: string) => MangaRecord[];
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

export type GetRequest<ResponseType = any> = (...args: any[]) => Promise<ResponseType>;
