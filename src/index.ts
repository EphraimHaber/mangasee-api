import axios from "axios";
import { mangaSeeSearch } from "./constants";
import { MangaRecord, RawMangaRecord } from "./types";
import Fuse from "fuse.js";

export const mangaRecords: MangaRecord[] = [];

const getMangaList = async () => {
  const res: RawMangaRecord[] = (await axios.get(mangaSeeSearch)).data;
  res.forEach((rawMangaRecord) => {
    mangaRecords.push({
      canonicalName: rawMangaRecord.i,
      nicknames: [rawMangaRecord.s, ...rawMangaRecord.a],
    });
  });
};

const search = (term: string) => {
  const fuse = new Fuse(mangaRecords, {
    keys: ["nicknames"],
    threshold: 0.3,
    includeScore: true,
    isCaseSensitive: false,
    shouldSort: true,
  });
  const res = fuse.search(term);
  return res;
};

(async () => {
  await getMangaList();
  console.log("Done Fetching Data");
  const searchRes = search("skeLEton");
  console.log(JSON.stringify(searchRes));
})();

const lol = [
  {
    item: { canonicalName: "Skeleton-Double", nicknames: ["Skeleton Double"] },
    refIndex: 6189,
    score: 0.007568328950209746,
  }
]