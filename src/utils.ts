import { mangaCoverBaseUrl } from "./constants"

const getCoverImageUrl = (canonicalName: string): string => {
    return `${mangaCoverBaseUrl}${canonicalName}`
}