"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, Search, Calendar, Edit, Trash2, Eye, BookOpen } from "lucide-react"
import { useExams } from "@/hooks/use-exams"

export default function ExamsPage() {
  const { exams, loading, error, deleteExam } = useExams()
  const [searchTerm, setSearchTerm] = useState("")
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [isDemo, setIsDemo] = useState(false) // デモモードの状態を管理する

  const filteredExams = exams.filter((exam) => exam.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`「${name}」を削除しますか？この操作は取り消せません。`)) {
      return
    }

    try {
      setDeletingId(id)
      await deleteExam(id)
    } catch (err: any) {
      alert(`削除に失敗しました: ${err.message}`)
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="page-header">
          <h1 className="page-title">試験記録</h1>
          <p className="page-description">読み込み中...</p>
        </div>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* ページヘッダー */}
      <div className="page-header">
        <h1 className="page-title">試験記録</h1>
        <p className="page-description">これまでの試験結果を管理・確認できます</p>
      </div>

      {/* 検索・フィルター */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="試験名で検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Link href="/exams/add">
              <Button className="btn-primary">
                <Plus className="h-4 w-4 mr-2" />
                新しい試験を追加
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-destructive/50">
          <CardContent className="pt-6">
            <p className="text-destructive mb-2">エラー: {error}</p>
            <p className="text-sm text-muted-foreground">
              Supabaseのスキーマ設定やRLSポリシーを確認してください。
              {isDemo
                ? "現在、デモモードで動作しています。"
                : "現在、フォールバックデータが表示されている可能性があります。"}
            </p>
          </CardContent>
        </Card>
      )}

      {/* 試験一覧 */}
      <div className="grid gap-6">
        {filteredExams.map((exam) => (
          <Card key={exam.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-xl">{exam.name}</CardTitle>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {exam.exam_date}
                    </div>
                    <Badge variant={exam.passed ? "default" : "secondary"}>{exam.passed ? "合格" : "不合格"}</Badge>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Link href={`/exams/${exam.id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      詳細
                    </Button>
                  </Link>
                  <Link href={`/exams/${exam.id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      編集
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(exam.id, exam.name)}
                    disabled={deletingId === exam.id}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {deletingId === exam.id ? "削除中..." : "削除"}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">総合得点</h4>
                  <div className="text-2xl font-bold text-primary">
                    {exam.total_score !== null && exam.total_score !== undefined ? `${exam.total_score}点` : "未記録"}
                  </div>
                  <div className="text-sm text-muted-foreground">/ {exam.max_total_score || 100}点満点</div>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">得点率</h4>
                  <div className="text-2xl font-bold text-primary">
                    {exam.total_score !== null && exam.total_score !== undefined && exam.max_total_score
                      ? `${Math.round((exam.total_score / exam.max_total_score) * 100)}%`
                      : "未記録"}
                  </div>
                  {exam.total_score !== null && exam.total_score !== undefined && exam.max_total_score && (
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${(exam.total_score / exam.max_total_score) * 100}%` }}
                      />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">メモ</h4>
                  <p className="text-sm text-foreground line-clamp-2">{exam.notes || "メモなし"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredExams.length === 0 && !loading && (
        <Card>
          <CardContent className="text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              {searchTerm ? "検索結果が見つかりません" : "試験記録がありません"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? "別のキーワードで検索してみてください" : "最初の試験記録を追加してみましょう"}
            </p>
            <Link href="/exams/add">
              <Button className="btn-primary">
                <Plus className="h-4 w-4 mr-2" />
                試験を追加
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
