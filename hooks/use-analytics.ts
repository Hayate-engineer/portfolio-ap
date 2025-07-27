"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { useExams } from "./use-exams"
import { useFields } from "./use-fields"

interface AnalyticsData {
  totalExams: number
  passedExams: number
  passRate: number
  averageScore: number
  fieldStats: Array<{
    fieldId: number
    fieldName: string
    examCount: number
    averageScore: number
    averagePercentage: number
    improvement: number
  }>
  progressData: Array<{
    date: string
    score: number
    examName: string
    passed: boolean
  }>
  weakestField: string | null
  strongestField: string | null
}

export function useAnalytics() {
  const { user } = useAuth()
  const { exams } = useExams()
  const { fields } = useFields()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const calculateAnalytics = async () => {
    if (!user || exams.length === 0) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      // 基本統計の計算
      const totalExams = exams.length
      const passedExams = exams.filter((exam) => exam.passed).length
      const passRate = totalExams > 0 ? Math.round((passedExams / totalExams) * 100) : 0
      const averageScore =
        totalExams > 0 ? Math.round(exams.reduce((sum, exam) => sum + (exam.total_score || 0), 0) / totalExams) : 0

      // 進捗データの生成
      const progressData = exams
        .filter((exam) => exam.total_score !== null && exam.total_score !== undefined)
        .sort((a, b) => new Date(a.exam_date).getTime() - new Date(b.exam_date).getTime())
        .map((exam) => ({
          date: exam.exam_date,
          score: exam.total_score || 0,
          examName: exam.name,
          passed: exam.passed,
        }))

      // 分野別統計の計算
      const fieldStats = fields.map((field) => {
        const fieldScores = exams.flatMap((exam) => exam.scores?.filter((score) => score.field_id === field.id) || [])

        const examCount = fieldScores.length
        const averageScore =
          examCount > 0 ? Math.round(fieldScores.reduce((sum, score) => sum + score.score, 0) / examCount) : 0
        const averagePercentage =
          examCount > 0
            ? Math.round(fieldScores.reduce((sum, score) => sum + (score.score / score.max_score) * 100, 0) / examCount)
            : 0

        // 改善度の計算（最新と最古の比較）
        const sortedScores = fieldScores.sort(
          (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
        )
        const improvement =
          sortedScores.length >= 2
            ? Math.round(
                (sortedScores[sortedScores.length - 1].score / sortedScores[sortedScores.length - 1].max_score) * 100 -
                  (sortedScores[0].score / sortedScores[0].max_score) * 100,
              )
            : 0

        return {
          fieldId: field.id,
          fieldName: field.name,
          examCount,
          averageScore,
          averagePercentage,
          improvement,
        }
      })

      // 最弱・最強分野の特定
      const fieldsWithScores = fieldStats.filter((stat) => stat.examCount > 0)
      const weakestField =
        fieldsWithScores.length > 0
          ? fieldsWithScores.reduce((min, field) => (field.averagePercentage < min.averagePercentage ? field : min))
              .fieldName
          : null

      const strongestField =
        fieldsWithScores.length > 0
          ? fieldsWithScores.reduce((max, field) => (field.averagePercentage > max.averagePercentage ? field : max))
              .fieldName
          : null

      const analyticsData: AnalyticsData = {
        totalExams,
        passedExams,
        passRate,
        averageScore,
        fieldStats,
        progressData,
        weakestField,
        strongestField,
      }

      setAnalytics(analyticsData)
    } catch (err: any) {
      setError(err.message)
      console.error("分析データ計算エラー:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    calculateAnalytics()
  }, [user, exams, fields])

  const getFieldTrend = (fieldId: number): "improving" | "declining" | "stable" => {
    if (!analytics) return "stable"

    const fieldStat = analytics.fieldStats.find((stat) => stat.fieldId === fieldId)
    if (!fieldStat) return "stable"

    if (fieldStat.improvement > 5) return "improving"
    if (fieldStat.improvement < -5) return "declining"
    return "stable"
  }

  const getRecommendations = (): string[] => {
    if (!analytics) return []

    const recommendations: string[] = []

    // 合格率に基づく推奨
    if (analytics.passRate < 50) {
      recommendations.push("合格率が低めです。基礎知識の復習を重点的に行いましょう。")
    } else if (analytics.passRate >= 80) {
      recommendations.push("高い合格率を維持しています。この調子で学習を続けましょう。")
    }

    // 弱点分野に基づく推奨
    if (analytics.weakestField) {
      recommendations.push(
        `${analytics.weakestField}の得点率が低めです。この分野を重点的に学習することをお勧めします。`,
      )
    }

    // 進捗に基づく推奨
    if (analytics.progressData.length >= 2) {
      const latestScore = analytics.progressData[analytics.progressData.length - 1].score
      const previousScore = analytics.progressData[analytics.progressData.length - 2].score

      if (latestScore > previousScore) {
        recommendations.push("成績が向上しています！この調子で学習を継続しましょう。")
      } else if (latestScore < previousScore) {
        recommendations.push("前回より得点が下がっています。学習方法を見直してみましょう。")
      }
    }

    return recommendations
  }

  return {
    analytics,
    loading,
    error,
    getFieldTrend,
    getRecommendations,
    refetch: calculateAnalytics,
  }
}
