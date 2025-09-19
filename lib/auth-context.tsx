"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { auth, db } from "./firebase"
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth"
import { doc, getDoc, setDoc } from "firebase/firestore"

interface Business {
  id: string
  name: string
  email: string
  contactPerson?: string
  phone?: string
  address?: string
  registrationNumber?: string
  taxId?: string
  status: "active" | "inactive"
  createdAt: any
  updatedAt: any
}

interface RegisterData {
  name: string
  email: string
  password: string
  contactPerson?: string
  phone?: string
  address?: string
  registrationNumber?: string
  taxId?: string
}

interface AuthContextType {
  user: User | null
  business: Business | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [business, setBusiness] = useState<Business | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)

      if (firebaseUser) {
        try {
          const businessDoc = await getDoc(doc(db, "businesses", firebaseUser.uid))
          if (businessDoc.exists()) {
            setBusiness({ id: businessDoc.id, ...businessDoc.data() } as Business)
          }
        } catch (error) {
          console.error("Error fetching business data:", error)
          // Check if it's a Firebase configuration error
          if (error instanceof Error && error.message.includes("Firebase")) {
            console.error("Firebase configuration error. Please check your environment variables.")
          }
        }
      } else {
        setBusiness(null)
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const businessDoc = await getDoc(doc(db, "businesses", userCredential.user.uid))

      if (businessDoc.exists()) {
        const businessData = { id: businessDoc.id, ...businessDoc.data() } as Business

        if (businessData.status !== "active") {
          await signOut(auth)
          return { success: false, error: "Business account is not active" }
        }

        setBusiness(businessData)
        return { success: true }
      } else {
        await signOut(auth)
        return { success: false, error: "Business profile not found" }
      }
    } catch (error: any) {
      let errorMessage = "Login failed"
      switch (error.code) {
        case "auth/user-not-found":
        case "auth/wrong-password":
          errorMessage = "Invalid email or password"
          break
        case "auth/invalid-email":
          errorMessage = "Invalid email address"
          break
        case "auth/user-disabled":
          errorMessage = "Account has been disabled"
          break
        default:
          errorMessage = error.message || "Login failed"
      }
      return { success: false, error: errorMessage }
    }
  }

  const register = async (registerData: RegisterData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, registerData.email, registerData.password)

      const businessData = {
        name: registerData.name,
        email: registerData.email,
        contactPerson: registerData.contactPerson,
        phone: registerData.phone,
        address: registerData.address,
        registrationNumber: registerData.registrationNumber,
        taxId: registerData.taxId,
        status: "active" as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      await setDoc(doc(db, "businesses", userCredential.user.uid), businessData)

      return { success: true }
    } catch (error: any) {
      let errorMessage = "Registration failed"
      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "Email address is already registered"
          break
        case "auth/invalid-email":
          errorMessage = "Invalid email address"
          break
        case "auth/weak-password":
          errorMessage = "Password should be at least 6 characters"
          break
        default:
          errorMessage = error.message || "Registration failed"
      }
      return { success: false, error: errorMessage }
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      setBusiness(null)
      setUser(null)
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, business, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
