"use client"

import { useState, useEffect } from "react"
import { supabase, type ExamWithScores, type Exam, isDemo } from "@/lib/supabase"
import { useAuth } from "@/components/auth/auth-provider"

export function useExams() {
  const { user } = useAuth()
  const [exams, setExams] = useState<ExamWithScores[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchExams = async () => {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      if (isDemo) {
        // デモ用サンプルデータ
        const demoExams: ExamWithScores[] = [
          {
            id: 1,
            user_id: user.id,
            name: "基本情報技術者試験",
            exam_date: "2024-10-20",
            passed: true,
            total_score: 75,
            max_total_score: 100,
            notes: "初回受験で合格",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            scores: [
              {
                id: 101,
                exam_id: 1,
                field_id: 1,
                score: 18,
                max_score: 25,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                field: {
                  id: 1,
                  user_id: user.id,
                  name: "テクノロジ系",
                  description: "コンピュータシステム、技術要素、開発技術",
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                  color: "#3B82F6",
                },
              },
              {
                id: 102,
                exam_id: 1,
                field_id: 2,
                score: 8,
                max_score: 10,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                field: {
                  id: 2,
                  user_id: user.id,
                  name: "マネジメント系",
                  description: "プロジェクトマネジメント、サービスマネジメント",
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                  color: "#10B981",
                },
              },
            ],
          },
          {
            id: 2,
            user_id: user.id,
            name: "応用情報技術者試験",
            exam_date: "2024-04-21",
            passed: false,
            total_score: 55,
            max_total_score: 100,
            notes: "再挑戦予定",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            scores: [
              {
                id: 201,
                exam_id: 2,
                field_id: 1,
                score: 15,
                max_score: 25,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                field: {
                  id: 1,
                  user_id: user.id,
                  name: "テクノロジ系",
                  description: "コンピュータシステム、技術要素、開発技術",
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                  color: "#3B82F6",
                },
              },
              {
                id: 202,
                exam_id: 2,
                field_id: 3,
                score: 8,
                max_score: 15,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                field: {
                  id: 3,
                  user_id: user.id,
                  name: "ストラテジ系",
                  description: "企業活動、経営戦略、システム戦略",
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                  color: "#F59E0B",
                },
              },
            ],
          },
          {
            id: 3,
            user_id: user.id,
            name: "情報セキュリティマネジメント試験",
            exam_date: "2024-01-15",
            passed: true,
            total_score: 82,
            max_total_score: 100,
            notes: "セキュリティ分野を重点学習",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            scores: [], // この試験にはスコアがないと仮定
          },
        ]

        setExams(demoExams)
        console.log("デモデータを設定しました:", demoExams)
        setLoading(false)
        return
      }

      // 実際のSupabaseからのデータ取得
      // scores!scores_exam_id_fkey(*, field:scores_field_id_fkey(*)) に変更
      const { data, error } = await supabase
        .from("exams")
        .select(
          "*, scores!scores_exam_id_fkey(id, exam_id, field_id, score, max_score, created_at, updated_at, field:scores_field_id_fkey(*))",
        ) // ここを修正
        .eq("user_id", user.id)
        .order("exam_date", { ascending: false })

      if (error) throw error
      setExams(data || [])
    } catch (err: any) {
      console.error("試験データ取得エラー:", err)
      setError(`データベースエラー: ${err.message}`)

      // エラーが発生した場合もデモデータで動作継続
      const fallbackExams: ExamWithScores[] = [
        {
          id: 1,
          user_id: user.id,
          name: "基本情報技術者試験（フォールバック）",
          exam_date: "2024-10-20",
          passed: true,
          total_score: 75,
          max_total_score: 100,
          notes: "データベースエラーのためデモデータで表示",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          scores: [],
        },
      ]
      setExams(fallbackExams)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExams()
  }, [user])

  const addExam = async (examData: {
    name: string
    exam_date: string
    passed: boolean
    total_score?: number
    max_total_score?: number
    notes?: string
  }) => {
    if (!user) throw new Error("ユーザーが認証されていません")

    try {
      setError(null)

      if (isDemo) {
        console.log("試験追加（デモモード）:", examData)
        const newExam: ExamWithScores = {
          id: Date.now(),
          user_id: user.id,
          ...examData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          scores: [],
        }
        setExams((prev) => [newExam, ...prev])
        console.log("試験を追加しました:", newExam)
        return newExam
      }

      const { data, error } = await supabase
        .from("exams")
        .insert({
          user_id: user.id,
          name: examData.name,
          exam_date: examData.exam_date,
          passed: examData.passed,
          total_score: examData.total_score,
          max_total_score: examData.max_total_score,
          notes: examData.notes,
        })
        .select()
        .single()

      if (error) throw error
      await fetchExams() // データ追加後に再フェッチして最新の状態を反映
      return data
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const updateExam = async (id: number, updates: Partial<Exam>) => {
    if (!user) throw new Error("ユーザーが認証されていません")

    try {
      setError(null)

      if (isDemo) {
        console.log("試験更新（デモモード）:", { id, updates })
        setExams((prev) =>
          prev.map((exam) => (exam.id === id ? { ...exam, ...updates, updated_at: new Date().toISOString() } : exam)),
        )
        return
      }

      const { error } = await supabase
        .from("exams")
        .update({
          name: updates.name,
          exam_date: updates.exam_date,
          passed: updates.passed,
          total_score: updates.total_score,
          max_total_score: updates.max_total_score,
          notes: updates.notes,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("user_id", user.id)

      if (error) throw error
      await fetchExams() // データ更新後に再フェッチして最新の状態を反映
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const deleteExam = async (id: number) => {
    if (!user) throw new Error("ユーザーが認証されていません")

    try {
      setError(null)

      if (isDemo) {
        console.log("試験削除（デモモード）:", id)
        setExams((prev) => prev.filter((exam) => exam.id !== id))
        return
      }

      // 実際のSupabaseからの削除処理
      const { error } = await supabase.from("exams").delete().eq("id", id).eq("user_id", user.id)

      if (error) throw error
      await fetchExams() // データ削除後に再フェッチして最新の状態を反映
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const getExamById = (id: number): ExamWithScores | undefined => {
    return exams.find((exam) => exam.id === id)
  }

  return {
    exams,
    loading,
    error,
    addExam,
    updateExam,
    deleteExam,
    getExamById,
    refetch: fetchExams,
  }
}
