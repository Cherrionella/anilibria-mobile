import { Anime, Day, ListAnimeData, RawAnime, Season, StatusCode } from "./api.types"

const convertIntsWithUpperLimit = (str: string, max: number) => {
  const num = parseInt(str)
  if (num > max || num <= 0) {
    return -1
  }
  return num
}

export const convertAnime = (raw: RawAnime): Anime => ({
  id: raw.id,
  code: raw.code,
  names: {
    ru: raw.names.length > 1 ? raw.names[0] : '',
    jp: raw.names.length > 1 ? raw.names[1] : raw.names[0]
  },
  series: raw.series,
  poster: raw.poster,
  last: parseInt(raw.last),
  moon: raw.moon,
  status: raw.status,
  statusCode: convertIntsWithUpperLimit(raw.statusCode, 4) as StatusCode,
  type: raw.type,
  genres: raw.genres,
  voices: raw.voices,
  year: parseInt(raw.year),
  season: convertIntsWithUpperLimit(raw.season, 4) as Season,
  day: convertIntsWithUpperLimit(raw.day, 7) as Day,
  description: raw.description, // TODO: strip html tags
  blockedInfo: raw.blockedInfo,
  playlist: raw.playlist,
  torrents: raw.torrents,
  favorite: raw.favorite
})

export const convertAnimeList = ({ items, pagination }): ListAnimeData => {
  return {
    items: items.map(convertAnime),
    pagination
  }
}
