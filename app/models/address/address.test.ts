import { AddressModel, Address } from "./address"
import { defaultConfig } from "../config/default"

test("can be created", () => {
  const instance: Address = AddressModel.create(defaultConfig.addresses[0])

  expect(instance).toBeTruthy()
})
