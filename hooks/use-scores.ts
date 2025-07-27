"use client"

import { useState, useEffect } from "react"
import { supabase, type Score, isDemo } from "@/lib/supabase"
import { useAuth } from "@/components/auth/auth-provider"

export function useScores(examId?: number) {
  const { user } = useAuth()
  const [scores, setScores] = useState<Score[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchScores = async () => {
    if (!user || !examId) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      if (isDemo) {
        // デモ用サンプルデータ
        const demoScores: Score[] = [
          {
            id: 1,
            exam_id: examId,
            field_id: 1,
            score: 18,
            max_score: 25,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: 2,
            exam_id: examId,
            field_id: 2,
            score: 8,
            max_score: 10,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]
        setScores(demoScores)
        return
      }

      const { data, error } = await supabase
        .from("scores")
        .select("*")
        .eq("exam_id", examId)
        .order("created_at", { ascending: true })

      if (error) throw error
      setScores(data || [])
    } catch (err: any) {
      setError(err.message)
      console.error("得点データ取得エラー:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (examId) {
      fetchScores()
    }
  }, [user, examId])

  const addScore = async (scoreData: {
    exam_id: number
    field_id: number
    score: number
    max_score: number
  }) => {
    if (!user) throw new Error("ユーザーが認証されていません")

    try {
      setError(null)

      if (isDemo) {
        const newScore: Score = {
          id: Date.now(),
          ...scoreData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        setScores((prev) => [...prev, newScore])
        return newScore
      }

      const { data, error } = await supabase.from("scores").insert(scoreData).select().single()

      if (error) throw error
      await fetchScores()
      return data
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const updateScore = async (id: number, updates: Partial<Score>) => {
    if (!user) throw new Error("ユーザーが認証されていません")

    try {
      setError(null)

      if (isDemo) {
        setScores((prev) =>
          prev.map((score) =>
            score.id === id ? { ...score, ...updates, updated_at: new Date().toISOString() } : score,
          ),
        )
        return
      }

      const { error } = await supabase
        .from("scores")
        .update({
          score: updates.score,
          max_score: updates.max_score,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)

      if (error) throw error
      await fetchScores()
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const deleteScore = async (id: number) => {
    if (!user) throw new Error("ユーザーが認証されていません")

    try {
      setError(null)

      if (isDemo) {
        setScores((prev) => prev.filter((score) => score.id !== id))
        return
      }

      const { error } = await supabase.from("scores").delete().eq("id", id)

      if (error) throw error
      await fetchScores()
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const addMultipleScores = async (
    scoresData: Array<{
      exam_id: number
      field_id: number
      score: number
      max_score: number
    }>,
  ) => {
    if (!user) throw new Error("ユーザーが認証されていません")

    try {
      setError(null)

      if (isDemo) {
        const newScores: Score[] = scoresData.map((scoreData) => ({
          id: Date.now() + Math.random(),
          ...scoreData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }))
        setScores((prev) => [...prev, ...newScores])
        return newScores
      }

      const { data, error } = await supabase.from("scores").insert(scoresData).select()

      if (error) throw error
      await fetchScores()
      return data
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  return {
    scores,
    loading,
    error,
    addScore,
    updateScore,
    deleteScore,
    addMultipleScores,
    refetch: fetchScores,
  }
}
