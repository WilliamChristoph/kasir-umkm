export const get = (key) => {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  } catch (e) {
    return null
  }
}

export const set = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data))
    return true
  } catch (e) {
    return false
  }
}

export const remove = (key) => {
  try {
    localStorage.removeItem(key)
    return true
  } catch (e) {
    return false
  }
}

export const clear = () => {
  localStorage.clear()
  return true
}