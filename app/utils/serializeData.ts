export const serializeData = (data: Record<string, any> | string) => {
  if (typeof data === "string") {
    return encodeURIComponent(data)
  }
  return Object.keys(data).map(function (keyName) {
    return encodeURIComponent(keyName) + '=' + encodeURIComponent(data[keyName])
  }).join('&')
}
