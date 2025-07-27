"use client"

import { supabase, isDemo } from "./supabase"

// API クライアントクラス
export class ApiClient {
  // 汎用的なエラーハンドリング
  private handleError(error: any, operation: string) {
    console.error(`${operation}エラー:`, error)
    throw new Error(error.message || `${operation}に失敗しました`)
  }

  // バッチ操作：複数の得点を一度に挿入
  async batchInsertScores(
    scores: Array<{
      exam_id: number
      field_id: number
      score: number
      max_score: number
    }>,
  ) {
    try {
      if (isDemo) {
        return scores.map((score) => ({
          id: Date.now() + Math.random(),
          ...score,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }))
      }

      const { data, error } = await supabase.from("scores").insert(scores).select()

      if (error) throw error
      return data
    } catch (error) {
      this.handleError(error, "得点の一括挿入")
    }
  }

  // 統計データの取得
  async getStatistics(userId: string) {
    try {
      if (isDemo) {
        return {
          totalExams: 3,
          passedExams: 2,
          passRate: 67,
          averageScore: 66,
        }
      }

      const { data, error } = await supabase.rpc("get_user_stats", { user_uuid: userId })

      if (error) throw error
      return data
    } catch (error) {
      this.handleError(error, "統計データの取得")
    }
  }

  // 分野別統計の取得
  async getFieldStatistics(userId: string) {
    try {
      if (isDemo) {
        return [
          { field_name: "テクノロジ系", average_percentage: 72, exam_count: 2 },
          { field_name: "マネジメント系", average_percentage: 80, exam_count: 2 },
          { field_name: "ストラテジ系", average_percentage: 60, exam_count: 2 },
        ]
      }

      const { data, error } = await supabase.rpc("get_field_stats", { user_uuid: userId })

      if (error) throw error
      return data
    } catch (error) {
      this.handleError(error, "分野別統計の取得")
    }
  }

  // 成績推移データの取得
  async getScoreProgress(userId: string) {
    try {
      if (isDemo) {
        return [
          { exam_date: "2024-01-15", total_score: 68, exam_name: "ITパスポート" },
          { exam_date: "2024-04-21", total_score: 55, exam_name: "応用情報" },
          { exam_date: "2024-10-20", total_score: 75, exam_name: "基本情報" },
        ]
      }

      const { data, error } = await supabase.rpc("get_score_progress", { user_uuid: userId })

      if (error) throw error
      return data
    } catch (error) {
      this.handleError(error, "成績推移データの取得")
    }
  }

  // データのエクスポート
  async exportUserData(userId: string) {
    try {
      if (isDemo) {
        return {
          exams: [],
          fields: [],
          scores: [],
          profile: null,
        }
      }

      const [examsResult, fieldsResult, profileResult] = await Promise.all([
        supabase.from("exams").select("*").eq("user_id", userId),
        supabase.from("fields").select("*").eq("user_id", userId),
        supabase.from("profiles").select("*").eq("id", userId).single(),
      ])

      if (examsResult.error) throw examsResult.error
      if (fieldsResult.error) throw fieldsResult.error
      if (profileResult.error && profileResult.error.code !== "PGRST116") {
        throw profileResult.error
      }

      // 得点データも取得
      const examIds = examsResult.data?.map((exam) => exam.id) || []
      const scoresResult =
        examIds.length > 0
          ? await supabase.from("scores").select("*").in("exam_id", examIds)
          : { data: [], error: null }

      if (scoresResult.error) throw scoresResult.error

      return {
        exams: examsResult.data || [],
        fields: fieldsResult.data || [],
        scores: scoresResult.data || [],
        profile: profileResult.data,
        exportedAt: new Date().toISOString(),
      }
    } catch (error) {
      this.handleError(error, "データのエクスポート")
    }
  }

  // データの検索
  async searchExams(userId: string, query: string) {
    try {
      if (isDemo) {
        return []
      }

      const { data, error } = await supabase
        .from("exams")
        .select("*")
        .eq("user_id", userId)
        .or(`name.ilike.%${query}%,notes.ilike.%${query}%`)
        .order("exam_date", { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      this.handleError(error, "試験の検索")
    }
  }
}

// シングルトンインスタンス
export const apiClient = new ApiClient()
