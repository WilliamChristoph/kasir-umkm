import { createContext, useContext, useState, useEffect } from 'react'
import { get, set, remove } from '../utils/storage'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(() => {
    const stored = get('session')
    return stored || { isLoggedIn: false, role: null, userId: null }
  })

  useEffect(() => {
    set('session', session)
  }, [session])

  const login = (role, userId) => {
    setSession({ isLoggedIn: true, role, userId })
  }

  const logout = () => {
    setSession({ isLoggedIn: false, role: null, userId: null })
    remove('session')
  }

  const loginAsAdmin = (code) => {
    if (code === 'admin123') {
      setSession({ isLoggedIn: true, role: 'admin', userId: 'ADMIN001' })
      return { success: true }
    }
    return { success: false, error: 'Kode admin salah' }
  }

  const registerMitra = (mitraData) => {
    const users = get('users') || []
    
    // Check if user already exists
    const exists = users.some(
      u => u.email === mitraData.email || u.phone === mitraData.phone || u.uniqueCode === mitraData.uniqueCode
    )
    
    if (exists) {
      return { success: false, error: 'Email, nomor handphone, atau kode unik sudah terdaftar' }
    }
    
    const newUser = {
      id: `MITRA${users.length + 1}`,
      storeName: mitraData.storeName,
      ownerName: mitraData.ownerName,
      email: mitraData.email,
      phone: mitraData.phone,
      password: mitraData.password,
      uniqueCode: mitraData.uniqueCode,
      status: 'active',
      bannedUntil: null,
      suspended: false,
      initialCapital: 5000000,
      products: [],
      transactions: [],
      expenses: []
    }
    
    users.push(newUser)
    set('users', users)
    
    login('mitra', newUser.id)
    return { success: true, user: newUser }
  }

  const loginMitra = (identifier, password, useCodeOnly = false) => {
    const users = get('users') || []
    
    let user
    if (useCodeOnly) {
      user = users.find(u => u.uniqueCode === identifier)
    } else {
      user = users.find(
        u => (u.email === identifier || u.phone === identifier) && u.password === password
      )
    }
    
    if (!user) {
      return { success: false, error: 'Akun tidak ditemukan atau password salah' }
    }
    
    // Check if suspended
    if (user.suspended) {
      return { success: false, error: 'Akun Anda telah di-suspend. Tidak dapat login.' }
    }
    
    // Check if banned
    if (user.bannedUntil) {
      const now = new Date()
      const bannedUntil = new Date(user.bannedUntil)
      if (now < bannedUntil) {
        const remaining = new Date(bannedUntil - now)
        return { 
          success: false, 
          error: `Akun Anda sedang diblokir sementara. Ban berakhir pada: ${remaining.toLocaleDateString()} ${remaining.toLocaleTimeString()}`
        }
      } else {
        // Ban expired, reset
        user.status = 'active'
        user.bannedUntil = null
        const updatedUsers = users.map(u => u.id === user.id ? user : u)
        set('users', updatedUsers)
      }
    }
    
    login('mitra', user.id)
    return { success: true, user }
  }

  return (
    <AuthContext.Provider value={{
      session,
      login,
      logout,
      loginAsAdmin,
      registerMitra,
      loginMitra
    }}>
      {children}
    </AuthContext.Provider>
  )
}