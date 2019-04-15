export const base64encode = string => btoa(string)

export const base64decode = string => atob(string)

export const isValidJSONString = string => {
  try {
    JSON.parse(string)
  } catch (e) {
    return false
  }
  return true
}
