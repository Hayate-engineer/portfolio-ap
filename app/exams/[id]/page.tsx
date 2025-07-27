"use client"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useExams } from "@/hooks/use-exams"
import { ArrowLeft, Edit, Trash2, Calendar, Award, BarChart3 } from "lucide-react"

export default function ExamDetailPage() {
  const router = useRouter()
  const params = useParams()

  const paramId = params.id

  useEffect(() => {
    if (paramId === "add") {
      console.log("動的ルートの競合により、/exams/add から /exams/add へリダイレクトしています。")
      router.replace("/exams/add")
    }
  }, [paramId, router])

  // paramId が 'add' でない場合にのみ数値に変換します。
  // これにより、リダイレクトが処理されるまで examId は NaN になります。
  const examId = paramId !== "add" ? Number(paramId) : Number.NaN

  const { getExamById, deleteExam } = useExams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const exam = getExamById(examId)

  const handleDelete = async () => {
    if (!confirm("この試験記録を削除しますか？この操作は取り消せません。")) {
      return
    }

    try {
      setLoading(true)
      setError("")
      await deleteExam(examId)
      router.push("/exams")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = () => {
    router.push(`/exams/${examId}/edit`)
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

  const percentage =
    exam.total_score && exam.max_total_score ? Math.round((exam.total_score / exam.max_total_score) * 100) : null

  return (
    <div className="space-y-8">
      {/* ページヘッダー */}
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              戻る
            </Button>
            <div>
              <h1 className="page-title">{exam.name}</h1>
              <p className="page-description">試験記録の詳細情報</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              編集
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={loading}>
              <Trash2 className="h-4 w-4 mr-2" />
              {loading ? "削除中..." : "削除"}
            </Button>
          </div>
        </div>
      </div>

      {/* 基本情報 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                試験基本情報
                <Badge variant={exam.passed ? "default" : "secondary"}>{exam.passed ? "合格" : "不合格"}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">試験名</h4>
                  <p className="text-lg font-medium">{exam.name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">試験日</h4>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p className="text-lg">{exam.exam_date}</p>
                  </div>
                </div>
              </div>

              {exam.total_score !== null && exam.total_score !== undefined && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">取得点数</h4>
                    <p className="text-3xl font-bold text-primary">{exam.total_score}</p>
                    <p className="text-sm text-muted-foreground">/ {exam.max_total_score}点</p>
                  </div>
                  <div className="text-center">
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">得点率</h4>
                    <p className="text-3xl font-bold text-primary">{percentage}%</p>
                    <div className="w-full bg-secondary rounded-full h-2 mt-2">
                      <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${percentage}%` }} />
                    </div>
                  </div>
                  <div className="text-center">
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">結果</h4>
                    <div className="flex items-center justify-center space-x-2">
                      <Award className={`h-6 w-6 ${exam.passed ? "text-success" : "text-muted-foreground"}`} />
                      <p className={`text-lg font-medium ${exam.passed ? "text-success" : "text-muted-foreground"}`}>
                        {exam.passed ? "合格" : "不合格"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {exam.notes && (
            <Card>
              <CardHeader>
                <CardTitle>メモ・感想</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-foreground">{exam.notes}</p>
              </CardContent>
            </Card>
          )}

          {exam.scores && exam.scores.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>分野別得点</span>
                </CardTitle>
                <CardDescription>各分野の詳細な得点状況</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {exam.scores.map((score) => {
                    const scorePercentage = Math.round((score.score / score.max_score) * 100)
                    return (
                      <div key={score.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">{score.field?.name || `分野${score.field_id}`}</h4>
                          <div className="text-sm text-muted-foreground">
                            {score.score} / {score.max_score} ({scorePercentage}%)
                          </div>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              scorePercentage >= 70
                                ? "bg-success"
                                : scorePercentage >= 50
                                  ? "bg-warning"
                                  : "bg-destructive"
                            }`}
                            style={{ width: `${scorePercentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* サイドバー */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>記録情報</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <h4 className="font-medium text-muted-foreground mb-1">作成日時</h4>
                <p>{new Date(exam.created_at).toLocaleString("ja-JP")}</p>
              </div>
              <div>
                <h4 className="font-medium text-muted-foreground mb-1">更新日時</h4>
                <p>{new Date(exam.updated_at).toLocaleString("ja-JP")}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>操作</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" onClick={handleEdit} className="w-full bg-transparent">
                <Edit className="h-4 w-4 mr-2" />
                この記録を編集
              </Button>
              <Button variant="outline" onClick={() => router.push("/exams/add")} className="w-full">
                新しい試験を追加
              </Button>
              <Button variant="destructive" onClick={handleDelete} disabled={loading} className="w-full">
                <Trash2 className="h-4 w-4 mr-2" />
                {loading ? "削除中..." : "この記録を削除"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {error && (
        <Alert className="border-destructive/50 text-destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
