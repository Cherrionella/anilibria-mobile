import { Instance, SnapshotOut, types } from "mobx-state-tree"

/**
 * Model description here for TypeScript hints.
 */
export const AddressModel = types
  .model("Address")
  .props({
    tag: types.identifier,
    name: types.string,
    desc: types.maybeNull(types.string),
    widgetsSite: types.string,
    site: types.string,
    baseImages: types.string,
    base: types.string,
    api: types.string,
    ips: types.optional(types.array(types.string), []),
    proxies: types.optional(types.array(types.string), [])
  })
  .views(self => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions(self => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

  /**
  * Un-comment the following to omit model attributes from your snapshots (and from async storage).
  * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

  * Note that you'll need to import `omit` from ramda, which is already included in the project!
  *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
  */

type AddressType = Instance<typeof AddressModel>
export interface Address extends AddressType {}
type AddressSnapshotType = SnapshotOut<typeof AddressModel>
export interface AddressSnapshot extends AddressSnapshotType {}
