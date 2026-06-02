import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { fetchUser } from '../utils/api.js'

const STORAGE_KEY = 'sportsgauge_user'
const TOKEN_KEY = 'sportsgauge_token'

const AppContext = createContext()

export const useApp = () => useContext(AppContext)

function loadStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AppProvider({ children }) {
  const [profile, setProfile] = useState({
    name: '', age: '', education: '',
    sport: '', position: '', achievement: '',
    bio: '', documents: []
  })
  const [user, setUserState] = useState(() => loadStoredUser())
  const [token, setTokenState] = useState(() => localStorage.getItem(TOKEN_KEY) || '')

  const setUser = useCallback((next, accessToken) => {
    setUserState(next)
    if (next?.id) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      if (accessToken) {
        localStorage.setItem(TOKEN_KEY, accessToken)
        setTokenState(accessToken)
      }
    } else {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem(TOKEN_KEY)
      setTokenState('')
    }
  }, [])

  const refreshUser = useCallback(async (userId) => {
    const id = userId || user?.id
    if (!id) return null
    const data = await fetchUser(id)
    setUser(data)
    return data
  }, [user?.id, setUser])

  useEffect(() => {
    if (user?.id && !user.email) {
      refreshUser(user.id).catch(() => {})
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AppContext.Provider value={{ profile, setProfile, user, setUser, refreshUser, token, setToken: setTokenState }}>
      {children}
    </AppContext.Provider>
  )
}
