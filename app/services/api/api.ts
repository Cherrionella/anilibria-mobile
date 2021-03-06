import { ApisauceInstance, create, ApiResponse, ApisauceConfig } from "apisauce"
import { detectApiProblem } from "./api-problem"
import { ApiConfig, DEFAULT_API_CONFIG } from "./api-config"
import * as Types from "./api.types"
import { serializeData } from "../../utils/serializeData"
import { flatten, mergeAll } from "ramda"
import { convertAnimeList } from "./api.convert"
const { APP_ID, APP_VERSION, PER_PAGE } = require("../../config/env")

/**
 * Manages all requests to the API.
 */
export class Api {
  /**
   * The underlying apisauce instance which performs the requests.
   */
  apisauce: ApisauceInstance

  /**
   * Configurable options.
   */
  config: ApiConfig

  /**
   * Creates the api.
   *
   * @param config The configuration to use.
   */
  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config
  }

  /**
   * Sets up the API.  This will be called during the bootup
   * sequence and will happen before the first React component
   * is mounted.
   *
   * Be as quick as possible in here.
   */
  setup(overrideConfig: Partial<ApisauceConfig> = {}) {
    const baseConfig = {
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        "App-Id": APP_ID,
        "Store-Published": "true",
        "App-Ver-Name": "CUSTOM",
        "App-Ver-Code": APP_VERSION
      },
    }
    const config = mergeAll(flatten([baseConfig, overrideConfig])) as ApisauceConfig
    // construct the apisauce instance
    this.apisauce = create(config)
  }

  async getConfig(): Promise<Types.GetConfigResult> {
    // make the api call
    const response: ApiResponse<any> = await this.apisauce.post('/index.php', serializeData({ query: 'config' }))

    const problem = detectApiProblem(response)
    if (problem) return problem

    return { kind: "ok", data: response.data }
  }

  async listAnime(page = 1, perPage: number = PER_PAGE): Promise<Types.GetListAnimeResult> {
    const req = { query: 'list', perPage, page }
    // make the api call
    const response: ApiResponse<any> = await this.apisauce.post('/index.php', serializeData(req))

    const problem = detectApiProblem(response)
    if (problem) return problem

    try {
      const rawAnimeList = response.data.data
      const resultAnime = convertAnimeList(rawAnimeList)
      return { kind: "ok", data: resultAnime }
    } catch {
      return { kind: "bad-data" }
    }
  }

  async getYoutube(page = 1, perPage: number = PER_PAGE): Promise<Types.GetYoutubeResult> {
    const req = { query: 'youtube' }
    // make the api call
    const response: ApiResponse<any> = await this.apisauce.post('/index.php', serializeData(req))

    const problem = detectApiProblem(response)
    if (problem) return problem

    return { kind: "ok", data: response.data.data }
  }
}
