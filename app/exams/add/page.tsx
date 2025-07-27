"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { useExams } from "@/hooks/use-exams"
import { isDemo } from "@/lib/supabase"
import { Plus, Calendar, FileText, CheckCircle, XCircle, ArrowLeft } from "lucide-react"

export default function AddExamPage() {
  console.log("AddExamPage is being rendered!") // この行を追加

  const router = useRouter()
  const { addExam } = useExams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [examData, setExamData] = useState({
    name: "",
    examDate: "",
    passed: false,
    totalScore: "",
    maxTotalScore: "100",
    notes: "",
  })

  // よく使われる試験名の候補
  const examSuggestions = [
    "基本情報技術者試験",
    "応用情報技術者試験",
    "情報セキュリティマネジメント試験",
    "ITパスポート試験",
    "ネットワークスペシャリスト試験",
    "データベーススペシャリスト試験",
    "情報処理安全確保支援士試験",
    "システムアーキテクト試験",
    "プロジェクトマネージャ試験",
    "ITサービスマネージャ試験",
  ]

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

      const submitData = {
        name: examData.name.trim(),
        exam_date: examData.examDate, // データベースのカラム名に合わせる
        passed: examData.passed,
        total_score: examData.totalScore ? Number.parseInt(examData.totalScore) : undefined,
        max_total_score: examData.maxTotalScore ? Number.parseInt(examData.maxTotalScore) : 100,
        notes: examData.notes.trim() || undefined,
      }

      if (isDemo) {
        setSuccess("試験記録を追加しました（デモモード）")
        setTimeout(() => {
          router.push("/exams")
        }, 1500)
        return
      }

      await addExam(submitData)
      setSuccess("試験記録を追加しました")
      setTimeout(() => {
        router.push("/exams")
      }, 1500)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setExamData({ ...examData, name: suggestion })
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
            <h1 className="page-title">試験記録の追加</h1>
            <p className="page-description">新しい試験結果を記録します</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* メインフォーム */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="h-5 w-5" />
                <span>試験情報</span>
              </CardTitle>
              <CardDescription>試験の基本情報と結果を入力してください</CardDescription>
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
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="examDate"
                      type="date"
                      value={examData.examDate}
                      onChange={(e) => setExamData({ ...examData, examDate: e.target.value })}
                      className="form-input pl-10"
                      required
                    />
                  </div>
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
                    <Plus className="h-4 w-4 mr-2" />
                    {loading ? "追加中..." : "試験記録を追加"}
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
          {/* 試験名候補 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>よく使われる試験名</span>
              </CardTitle>
              <CardDescription>クリックして試験名を自動入力</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {examSuggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full justify-start text-left h-auto py-2 px-3"
                  >
                    <span className="text-sm">{suggestion}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* ヒント */}
          <Card>
            <CardHeader>
              <CardTitle>記録のヒント</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-1">詳細な記録を</h4>
                <p className="text-blue-700">メモ欄に試験の感想や反省点を記録すると、後で振り返る際に役立ちます。</p>
              </div>
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-900 mb-1">分野別得点も</h4>
                <p className="text-green-700">後で分野管理ページから、各分野の詳細な得点を追加できます。</p>
              </div>
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-medium text-yellow-900 mb-1">継続が大切</h4>
                <p className="text-yellow-700">定期的に記録することで、学習の進捗を可視化できます。</p>
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

      {isDemo && (
        <Alert>
          <AlertDescription>
            <Badge variant="secondary" className="mr-2">
              デモモード
            </Badge>
            現在デモモードで動作しています。実際のデータは保存されません。
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
