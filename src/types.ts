export type RawMangaRecord = {
    i: string,  // canonical name
    s: string,  // real name
    a: string[]  // nicknames
}

export type MangaRecord = {
    canonicalName: string,
    nicknames: string[],
}