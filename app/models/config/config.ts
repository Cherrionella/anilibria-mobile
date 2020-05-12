import { Instance, resolveIdentifier, SnapshotOut, types } from "mobx-state-tree"
import { defaultConfig } from "./default"
import { AddressModel } from "../address"
import { flow } from "mobx"
import { withEnvironment } from "../extensions"

/**
 * Model description here for TypeScript hints.
 */
export const ConfigModel = types
  .model("Config")
  .props({
    addresses: types.optional(types.array(AddressModel), defaultConfig.addresses),
    selected: types.optional(types.safeReference(AddressModel), "api1")
  })
  .extend(withEnvironment)
  .views(self => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions(self => ({
    select: (tag: string) => {
      const newAddress = resolveIdentifier(AddressModel, self.addresses, tag) || self.selected
      if (tag !== self.selected.tag) {
        self.environment.api.setup({
          baseURL: newAddress.api
        })
      }
      self.selected = newAddress
    }
  }))
  .actions(self => ({
    loadConfig: flow(function * loadConfig() {
      const result = yield self.environment.api.getConfig()
      if (result.kind === "ok") {
        const selectedAddress = self.selected.tag
        self.addresses.replace(result.data.addresses.map(v => AddressModel.create(v)))
        self.select(selectedAddress)
      }
    })
  })) // eslint-disable-line @typescript-eslint/no-unused-vars
  /**
  * Un-comment the following to omit model attributes from your snapshots (and from async storage).
  * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

  * Note that you'll need to import `omit` from ramda, which is already included in the project!
  *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
  */

type ConfigType = Instance<typeof ConfigModel>
export interface Config extends ConfigType {}
type ConfigSnapshotType = SnapshotOut<typeof ConfigModel>
export interface ConfigSnapshot extends ConfigSnapshotType {}
