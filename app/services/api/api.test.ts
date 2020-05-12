import { Api } from './api'

jest.setTimeout(20000)

test('Getting api config', async () => {
  const api = new Api()
  api.setup()
  const result = await api.getConfig()
  expect(result.kind).toEqual("ok")
})
