const TOKEN_KEY = 'auth_token'
const REFRESH_TOKEN_KEY = 'refresh_token'

type Listener = () => void

class AuthStorage {
  private listeners = new Set<Listener>()

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY)
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  }

  setTokens(token: string, refreshToken?: string): void {
    localStorage.setItem(TOKEN_KEY, token)
    if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
    this.notify()
  }

  clear(): void {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    this.notify()
  }

  isAuthenticated(): boolean {
    return !!this.getToken()
  }

  subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener)

    const onStorage = (event: StorageEvent) => {
      if (event.key === TOKEN_KEY || event.key === REFRESH_TOKEN_KEY) {
        listener()
      }
    }

    window.addEventListener('storage', onStorage)

    return () => {
      this.listeners.delete(listener)
      window.removeEventListener('storage', onStorage)
    }
  }

  private notify() {
    this.listeners.forEach((listener) => listener())
  }
}

export const authStorage = new AuthStorage()
