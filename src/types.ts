export type RawMangaRecord = {
    i: string,  // canonical name
    s: string,  // real name
    a: string[]  // nicknames
}

export type MangaRecord = {
    canonicalName: string,
    coverUrl: string,
    fullName: string,
    nicknames: string[],
}

export type mangaEpisodeSlide = {
    src: string
}

export type mangaEpisode = {
    slides: mangaEpisodeSlide[]
}

export type MangaDetails = {
    coverUrl: string,
    fullName: string,
    episodeCount: number,
    missingEpisodes?: number[]
}