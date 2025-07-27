"use client"

import { useState, useEffect } from "react"
import { supabase, type Field, isDemo } from "@/lib/supabase"
import { useAuth } from "@/components/auth/auth-provider"

export function useFields() {
  const { user } = useAuth()
  const [fields, setFields] = useState<Field[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchFields = async () => {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      if (isDemo) {
        // デモ用サンプルデータ
        const demoFields: Field[] = [
          {
            id: 1,
            user_id: user.id,
            name: "テクノロジ系",
            description: "コンピュータシステム、技術要素、開発技術",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: 2,
            user_id: user.id,
            name: "マネジメント系",
            description: "プロジェクトマネジメント、サービスマネジメント",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: 3,
            user_id: user.id,
            name: "ストラテジ系",
            description: "企業活動、経営戦略、システム戦略",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]
        setFields(demoFields)
        return
      }

      const { data, error } = await supabase
        .from("fields")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true })

      if (error) throw error
      setFields(data || [])
    } catch (err: any) {
      setError(err.message)
      console.error("分野取得エラー:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFields()
  }, [user])

  const addField = async (fieldData: {
    name: string
    description?: string
    color?: string
  }) => {
    if (!user) throw new Error("ユーザーが認証されていません")

    try {
      setError(null)

      if (isDemo) {
        const newField: Field = {
          id: Date.now(),
          user_id: user.id,
          name: fieldData.name,
          description: fieldData.description,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        setFields((prev) => [...prev, newField])
        return newField
      }

      const { data, error } = await supabase
        .from("fields")
        .insert({
          user_id: user.id,
          name: fieldData.name,
          description: fieldData.description,
          color: fieldData.color || "#3B82F6",
        })
        .select()
        .single()

      if (error) throw error
      await fetchFields()
      return data
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const updateField = async (id: number, updates: Partial<Field>) => {
    if (!user) throw new Error("ユーザーが認証されていません")

    try {
      setError(null)

      if (isDemo) {
        setFields((prev) =>
          prev.map((field) =>
            field.id === id ? { ...field, ...updates, updated_at: new Date().toISOString() } : field,
          ),
        )
        return
      }

      const { error } = await supabase
        .from("fields")
        .update({
          name: updates.name,
          description: updates.description,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("user_id", user.id)

      if (error) throw error
      await fetchFields()
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const deleteField = async (id: number) => {
    if (!user) throw new Error("ユーザーが認証されていません")

    try {
      setError(null)

      if (isDemo) {
        setFields((prev) => prev.filter((field) => field.id !== id))
        return
      }

      const { error } = await supabase.from("fields").delete().eq("id", id).eq("user_id", user.id)

      if (error) throw error
      await fetchFields()
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  return {
    fields,
    loading,
    error,
    addField,
    updateField,
    deleteField,
    refetch: fetchFields,
  }
}
