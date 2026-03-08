const USERS_KEY    = 'codecity_users'
const SESSION_KEY  = 'codecity_session'

export const getUsers = () => {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]') }
  catch { return [] }
}

export const saveUser = (user) => {
  const users = getUsers()
  const idx = users.findIndex(u => u.email === user.email)
  if (idx >= 0) users[idx] = user
  else users.push(user)
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export const getUserByEmail = (email) =>
  getUsers().find(u => u.email === email.toLowerCase())

export const setSession = (user) =>
  localStorage.setItem(SESSION_KEY, JSON.stringify(user))

export const getSession = () => {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null') }
  catch { return null }
}

export const clearSession = () =>
  localStorage.removeItem(SESSION_KEY)

export const updateUserGithubData = (email, githubData) => {
  const users = getUsers()
  const idx = users.findIndex(u => u.email === email.toLowerCase())
  if (idx >= 0) {
    users[idx].githubData = githubData
    users[idx].lastSync = new Date().toISOString()
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
    return users[idx]
  }
  return null
}
