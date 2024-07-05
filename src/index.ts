import axios from 'axios';
import { mangaSeeSearch } from './constants';
import {
  getCoverImageUrl,
  getExtraDetails,
  getFirstChapterUrl,
  getRssDetails,
  getSlideUrl,
  toRealChapter,
} from './utils';
import { EpisodeDetails, HttpHandlerMode, MangaApi, MangaDetails, MangaRecord, RawMangaRecord } from './types/types';
const Fuse = require('fuse.js');
import { doGet } from './http-handler';

class MangaSeeApi implements MangaApi {
  private httpHandlerMode!: HttpHandlerMode;
  private initializationPromise: Promise<void>;
  public mangaRecords: MangaRecord[] = [];

  constructor(httpHandlerMode?: HttpHandlerMode) {
    this.httpHandlerMode = httpHandlerMode || 'axios';
    this.initializationPromise = this.initialize();
  }

  private async initialize(): Promise<void> {
    await this.getMangaList();
  }

  async waitUntilInitialized(): Promise<void> {
    await this.initializationPromise;
  }

  private async getMangaList() {
    const res: RawMangaRecord[] = await doGet(this.httpHandlerMode, mangaSeeSearch, true);
    res.forEach(rawMangaRecord => {
      this.mangaRecords.push({
        canonicalName: rawMangaRecord.i,
        fullName: rawMangaRecord.s,
        nicknames: [...rawMangaRecord.a],
        coverUrl: getCoverImageUrl(rawMangaRecord.i),
      });
    });
  }

  search(term: string) {
    const fuse = new Fuse(this.mangaRecords, {
      keys: ['nicknames', 'fullName'],
      threshold: 0.3,
      // includeScore: true,
      isCaseSensitive: false,
      shouldSort: true,
    });
    const fuzzyResults = fuse.search(term);
    const ret: MangaRecord[] = [];
    for (const result of fuzzyResults) {
      ret.push(result.item);
    }
    return ret;
  }

  async getDetails(canonicalName: string): Promise<MangaDetails> {
    const firstChapterUrl = getFirstChapterUrl(canonicalName);
    const res: string = await doGet(this.httpHandlerMode, firstChapterUrl);
    const chapterDetailsPattern = /vm\.CHAPTERS = (.*);/;

    // TODO separate getting the chapters with regex, check for missing episode and add episode to separate functions.
    const chaptersGroups = chapterDetailsPattern.exec(res);
    const { coverUrl, fullName } = await getRssDetails(canonicalName, this.httpHandlerMode);
    const extraDetails = await getExtraDetails(canonicalName, this.httpHandlerMode);
    if (!chaptersGroups) {
      throw new Error('Unable To Retrieve Manga Details');
    }
    const rawChapters: any[] = JSON.parse(chaptersGroups[1]);
    const chapters: EpisodeDetails[] = [];
    const missingChapters: number[] = [];
    rawChapters.forEach((element, i) => {
      const currentChapter: number = toRealChapter(element['Chapter']);
      if (i === 0) {
        if (currentChapter !== 1) {
          missingChapters.push(i + 1);
        }
      }
      if (i !== 0) {
        if (currentChapter - 1 != chapters[i - 1].chapter) {
          missingChapters.push(currentChapter);
        }
      }
      chapters.push({
        paddedChapter: element['Chapter'],
        totalSlides: Number(element['Page']),
        chapter: currentChapter,
      });
    });
    return {
      chapters: chapters,
      coverUrl: coverUrl,
      episodeCount: chapters.length,
      missingChapters: missingChapters,
      fullName: fullName,
      canonicalName: canonicalName,
      'Author(s)': extraDetails['Author(s)'],
      'Genre(s)': extraDetails['Genre(s)'],
      Description: extraDetails.Description,
      Released: extraDetails.Released,
      Status: extraDetails.Status,
      Type: extraDetails.Type,
    };
  }

  getChapterSlides(canonicalName: string, chapter: number, totalSlides: number) {
    const chapterSlidesUrls: string[] = [];
    for (let i = 1; i <= totalSlides; i++) {
      chapterSlidesUrls.push(getSlideUrl(canonicalName, chapter, i));
    }
    return chapterSlidesUrls;
  }
}
export const initializeMangaSeeApi = async (mode?: HttpHandlerMode) => {
  const api = new MangaSeeApi(mode);
  await api.waitUntilInitialized();
  return api;
};

export * from './types/types';
