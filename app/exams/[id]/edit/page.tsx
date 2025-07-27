"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useExams } from "@/hooks/use-exams"
import { ArrowLeft, Save, CheckCircle, XCircle } from "lucide-react"

export default function EditExamPage() {
  const router = useRouter()
  const params = useParams()
  const { getExamById, updateExam } = useExams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const examId = Number(params.id)
  const exam = getExamById(examId)

  const [examData, setExamData] = useState({
    name: "",
    examDate: "",
    passed: false,
    totalScore: "",
    maxTotalScore: "",
    notes: "",
  })

  useEffect(() => {
    if (exam) {
      setExamData({
        name: exam.name,
        examDate: exam.exam_date,
        passed: exam.passed,
        totalScore: exam.total_score?.toString() || "",
        maxTotalScore: exam.max_total_score?.toString() || "",
        notes: exam.notes || "",
      })
    }
  }, [exam])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      if (!examData.name.trim()) {
        throw new Error("試験名を入力してください")
      }
      if (!examData.examDate) {
        throw new Error("試験日を選択してください")
      }

      const updates = {
        name: examData.name.trim(),
        exam_date: examData.examDate,
        passed: examData.passed,
        total_score: examData.totalScore ? Number.parseInt(examData.totalScore) : undefined,
        max_total_score: examData.maxTotalScore ? Number.parseInt(examData.maxTotalScore) : undefined,
        notes: examData.notes.trim() || undefined,
      }

      await updateExam(examId, updates)
      setSuccess("試験記録を更新しました")
      setTimeout(() => {
        router.push(`/exams/${examId}`)
      }, 1500)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!exam) {
    return (
      <div className="space-y-8">
        <div className="page-header">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              戻る
            </Button>
            <div>
              <h1 className="page-title">試験記録が見つかりません</h1>
            </div>
          </div>
        </div>
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">指定された試験記録が見つかりません。</p>
            <Button onClick={() => router.push("/exams")} className="mt-4">
              試験記録一覧に戻る
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* ページヘッダー */}
      <div className="page-header">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            戻る
          </Button>
          <div>
            <h1 className="page-title">試験記録の編集</h1>
            <p className="page-description">{exam.name} の情報を編集します</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* メインフォーム */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Save className="h-5 w-5" />
                <span>試験情報の編集</span>
              </CardTitle>
              <CardDescription>試験の基本情報と結果を編集してください</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="form-field">
                  <Label htmlFor="examName" className="form-label">
                    試験名 <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="examName"
                    value={examData.name}
                    onChange={(e) => setExamData({ ...examData, name: e.target.value })}
                    placeholder="例: 基本情報技術者試験"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-field">
                  <Label htmlFor="examDate" className="form-label">
                    試験日 <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="examDate"
                    type="date"
                    value={examData.examDate}
                    onChange={(e) => setExamData({ ...examData, examDate: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-field">
                  <Label className="form-label">合否結果</Label>
                  <div className="flex space-x-4">
                    <Button
                      type="button"
                      variant={examData.passed ? "default" : "outline"}
                      onClick={() => setExamData({ ...examData, passed: true })}
                      className="flex items-center space-x-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>合格</span>
                    </Button>
                    <Button
                      type="button"
                      variant={!examData.passed ? "default" : "outline"}
                      onClick={() => setExamData({ ...examData, passed: false })}
                      className="flex items-center space-x-2"
                    >
                      <XCircle className="h-4 w-4" />
                      <span>不合格</span>
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-field">
                    <Label htmlFor="totalScore" className="form-label">
                      取得点数
                    </Label>
                    <Input
                      id="totalScore"
                      type="number"
                      value={examData.totalScore}
                      onChange={(e) => setExamData({ ...examData, totalScore: e.target.value })}
                      placeholder="75"
                      className="form-input"
                      min="0"
                    />
                  </div>
                  <div className="form-field">
                    <Label htmlFor="maxTotalScore" className="form-label">
                      満点
                    </Label>
                    <Input
                      id="maxTotalScore"
                      type="number"
                      value={examData.maxTotalScore}
                      onChange={(e) => setExamData({ ...examData, maxTotalScore: e.target.value })}
                      placeholder="100"
                      className="form-input"
                      min="1"
                    />
                  </div>
                </div>

                <div className="form-field">
                  <Label htmlFor="notes" className="form-label">
                    メモ・感想
                  </Label>
                  <Textarea
                    id="notes"
                    value={examData.notes}
                    onChange={(e) => setExamData({ ...examData, notes: e.target.value })}
                    placeholder="試験の感想、反省点、次回への課題など..."
                    className="form-input"
                    rows={4}
                  />
                </div>

                <div className="flex space-x-4">
                  <Button type="submit" disabled={loading} className="btn-primary flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? "更新中..." : "変更を保存"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => router.back()}>
                    キャンセル
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* サイドバー */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>編集のヒント</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-1">正確な情報を</h4>
                <p className="text-blue-700">試験日や得点は正確に入力してください。後の分析に影響します。</p>
              </div>
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-900 mb-1">詳細なメモを</h4>
                <p className="text-green-700">試験の感想や反省点を詳しく記録すると、次回の対策に役立ちます。</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>元の記録</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">作成日時:</span>
                <p>{new Date(exam.created_at).toLocaleString("ja-JP")}</p>
              </div>
              <div>
                <span className="text-muted-foreground">最終更新:</span>
                <p>{new Date(exam.updated_at).toLocaleString("ja-JP")}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {error && (
        <Alert className="border-destructive/50 text-destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-success/50 text-success">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
