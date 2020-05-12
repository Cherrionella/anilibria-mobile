import { GeneralApiProblem } from "./api-problem"

export interface User {
  id: number
  name: string
}

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

export type GetConfigResult = { kind: "ok"; data: SiteConfig } | GeneralApiProblem
export type GetUsersResult = { kind: "ok"; users: User[] } | GeneralApiProblem
export type GetUserResult = { kind: "ok"; user: User } | GeneralApiProblem
