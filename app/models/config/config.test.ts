import { ConfigModel, Config } from "./config"

test("can be created", () => {
  const instance: Config = ConfigModel.create({})

  expect(instance).toBeTruthy()
})
