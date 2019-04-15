// This approach to using localStorage for
// state persistence is taken from Dan Abramov's
// video series on Redux. For a more automated
// approach, checkout the "redux-persist" library.

// Consider using localForage in the future
// http://localforage.github.io/localForage/

export const loadState = () => {
  try {
    const serializedState = localStorage.getItem('state')
    if (serializedState === null) {
      return undefined
    }
    return JSON.parse(serializedState)
  } catch (err) {
    return undefined
  }
}

export const saveState = state => {
  try {
    const serializedState = JSON.stringify(state)
    localStorage.setItem('state', serializedState)
  } catch (err) {
    console.log(err)
  }
}
