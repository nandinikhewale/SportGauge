import { createContext, useContext, useState, useCallback } from 'react';

const STORAGE_KEY = 'sportsgauge_coach';
const TOKEN_KEY = 'sportsgauge_coach_token';
const CoachContext = createContext();

export const useCoach = () => useContext(CoachContext);

function loadCoach() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function CoachProvider({ children }) {
  const [coach, setCoachState] = useState(() => loadCoach());
  const [token, setTokenState] = useState(() => localStorage.getItem(TOKEN_KEY) || '');

  const setCoach = useCallback((next) => {
    setCoachState(next);
    if (next?.coach_id) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      if (next?.access_token) {
        localStorage.setItem(TOKEN_KEY, next.access_token);
        setTokenState(next.access_token);
      }
    } else {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(TOKEN_KEY);
      setTokenState('');
    }
  }, []);

  const logoutCoach = useCallback(() => setCoach(null), [setCoach]);

  return (
    <CoachContext.Provider value={{ coach, setCoach, logoutCoach, token, setToken: setTokenState }}>
      {children}
    </CoachContext.Provider>
  );
}
