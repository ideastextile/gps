import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  country: string
  city: string
  role: 'buyer' | 'seller' | 'admin'
  isApproved?: boolean
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (userData: Omit<User, 'id'> & { password: string }) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on app start
    const savedUser = localStorage.getItem('currentUser')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    
    // Create admin user if doesn't exist
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const adminExists = users.find((u: User) => u.role === 'admin')
    
    if (!adminExists) {
      const adminUser: User = {
        id: 'admin-001',
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@guestpost.com',
        phone: '+1234567890',
        country: 'United States',
        city: 'New York',
        role: 'admin',
        isApproved: true
      }
      
      const updatedUsers = [...users, adminUser]
      localStorage.setItem('users', JSON.stringify(updatedUsers))
      
      // Also save admin password
      const passwords = JSON.parse(localStorage.getItem('passwords') || '{}')
      passwords['admin@guestpost.com'] = 'admin123'
      localStorage.setItem('passwords', JSON.stringify(passwords))
    }
    
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const passwords = JSON.parse(localStorage.getItem('passwords') || '{}')
      
      const foundUser = users.find((u: User) => u.email === email)
      
      if (foundUser && passwords[email] === password) {
        // Check if seller is approved
        if (foundUser.role === 'seller' && !foundUser.isApproved) {
          alert('Your seller account is pending approval. Please wait for admin approval.')
          return false
        }
        
        setUser(foundUser)
        localStorage.setItem('currentUser', JSON.stringify(foundUser))
        return true
      }
      
      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const register = async (userData: Omit<User, 'id'> & { password: string }): Promise<boolean> => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const passwords = JSON.parse(localStorage.getItem('passwords') || '{}')
      
      // Check if email already exists
      if (users.find((u: User) => u.email === userData.email)) {
        return false
      }
      
      const newUser: User = {
        id: Date.now().toString(),
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone,
        country: userData.country,
        city: userData.city,
        role: userData.role,
        isApproved: userData.role === 'buyer' // Buyers are auto-approved, sellers need admin approval
      }
      
      const updatedUsers = [...users, newUser]
      localStorage.setItem('users', JSON.stringify(updatedUsers))
      
      // Save password separately
      passwords[userData.email] = userData.password
      localStorage.setItem('passwords', JSON.stringify(passwords))
      
      // Auto-login buyers, sellers need approval
      if (userData.role === 'buyer') {
        setUser(newUser)
        localStorage.setItem('currentUser', JSON.stringify(newUser))
      }
      
      return true
    } catch (error) {
      console.error('Registration error:', error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('currentUser')
  }

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    isLoading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}