"use client"

import { useState, useEffect } from "react"
import { supabase, type Profile, isDemo } from "@/lib/supabase"
import { useAuth } from "@/components/auth/auth-provider"

export function useProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = async () => {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      if (isDemo) {
        // デモ用サンプルデータ
        const demoProfile: Profile = {
          id: user.id,
          email: user.email || "demo@example.com",
          full_name: "デモユーザー",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        setProfile(demoProfile)
        return
      }

      const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      if (error && error.code !== "PGRST116") {
        throw error
      }

      if (data) {
        setProfile(data)
      } else {
        // プロフィールが存在しない場合は作成
        await createProfile({
          email: user.email || "",
          full_name: user.user_metadata?.full_name || "",
        })
      }
    } catch (err: any) {
      setError(err.message)
      console.error("プロフィール取得エラー:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [user])

  const createProfile = async (profileData: {
    email: string
    full_name: string
    bio?: string
  }) => {
    if (!user) throw new Error("ユーザーが認証されていません")

    try {
      setError(null)

      if (isDemo) {
        const newProfile: Profile = {
          id: user.id,
          ...profileData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        setProfile(newProfile)
        return newProfile
      }

      const { data, error } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          ...profileData,
        })
        .select()
        .single()

      if (error) throw error
      setProfile(data)
      return data
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) throw new Error("ユーザーが認証されていません")

    try {
      setError(null)

      if (isDemo) {
        setProfile((prev) => (prev ? { ...prev, ...updates, updated_at: new Date().toISOString() } : null))
        return
      }

      const { data, error } = await supabase
        .from("profiles")
        .update({
          email: updates.email,
          full_name: updates.full_name,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)
        .select()
        .single()

      if (error) throw error
      setProfile(data)
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  return {
    profile,
    loading,
    error,
    createProfile,
    updateProfile,
    refetch: fetchProfile,
  }
}
