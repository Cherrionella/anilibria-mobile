import { GeneralApiProblem } from "./api-problem"

interface Address {
  tag: string,
  name: string,
  desc?: string,
  widgetsSite: string,
  site: string,
  baseImages: string,
  base: string,
  api: string,
  ips: Array<string>,
  proxies: Array<string>
}

export interface SiteConfig {
  addresses: Array<Address>
}

export interface Pagination {
  page: number,
  perPage: number,
  allPages: number,
  allItems: number
}

export interface BlockedInfo {
  blocked: boolean,
  reason?: string,
  bakanim: boolean
}

export interface PlaylistEntry {
  id: number,
  title: string,
  sd: string,
  hd: string,
  fullhd: string,
  srcSd: string,
  srcHd: string
}

export type StatusCode = 1 | 2 | 3 | 4 | -1

export type Day = 1 | 2 | 3 | 4 | 5 | 6 | 7 | -1

export type Season = 1 | 2 | 3 | 4 | -1

export interface TorrentEntry {
  id: number,
  hash: string,
  leechers: number,
  seeders: number,
  completed: number,
  quality: string,
  series: string,
  size: number,
  url: string,
  ctime: number
}

export interface RawAnime {
  id: number,
  code: string,
  names: Array<string>,
  series: string,
  poster: string,
  last: string,
  moon?: string,
  announce: any,
  status: string,
  statusCode: string,
  type: string,
  genres: Array<string>,
  voices: Array<string>,
  year: string,
  season: string,
  day: string,
  description: string,
  blockedInfo: BlockedInfo,
  playlist: Array<PlaylistEntry>,
  torrents: Array<TorrentEntry>,
  favorite: {
    rating: number,
    added: boolean
  }
}

export interface Anime {
  id: number,
  code: string,
  names: {
    ru: string,
    jp: string
  },
  series: string,
  poster: string,
  last: number,
  moon?: string,
  status: string,
  statusCode: StatusCode,
  type: string,
  genres: Array<string>,
  voices: Array<string>,
  year: number,
  season: Season,
  day: Day,
  description: string,
  blockedInfo: BlockedInfo,
  playlist: Array<PlaylistEntry>,
  torrents: Array<TorrentEntry>,
  favorite: {
    rating: number,
    added: boolean
  }
}

export interface ListAnimeData {
  items: Anime[],
  pagination: Pagination
}

export type GetConfigResult = { kind: "ok"; data: SiteConfig } | GeneralApiProblem
export type GetListAnimeResult = { kind: "ok", data: ListAnimeData } | GeneralApiProblem
