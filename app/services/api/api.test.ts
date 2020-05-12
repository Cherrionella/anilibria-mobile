import { Api } from './api'

jest.setTimeout(20000)

test('Getting api config', async () => {
  const api = new Api()
  api.setup()
  const result = await api.getConfig()
  expect(result.kind).toEqual("ok")
})

test('Fetching anime list', async () => {
  const api = new Api()
  api.setup()
  const result = await api.listAnime(1, 10)
  expect(result.kind).toEqual("ok")
  if (result.kind === "ok") {
    expect(result.data.items.length).toEqual(10)
  }
})

test('Fetching youtube list', async () => {
  const api = new Api()
  api.setup()
  const result = await api.getYoutube(1, 10)
  expect(result.kind).toEqual("ok")
  if (result.kind === "ok") {
    expect(result.data.items.length).toEqual(10)
  }
})
