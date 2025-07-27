"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Edit, Trash2, Target } from "lucide-react"

// サンプルデータ
const sampleFields = [
  {
    id: 1,
    name: "テクノロジ系",
    description: "コンピュータシステム、技術要素、開発技術",
    examCount: 2,
    averageScore: 68,
  },
  {
    id: 2,
    name: "マネジメント系",
    description: "プロジェクトマネジメント、サービスマネジメント",
    examCount: 2,
    averageScore: 75,
  },
  {
    id: 3,
    name: "ストラテジ系",
    description: "企業活動、経営戦略、システム戦略",
    examCount: 2,
    averageScore: 58,
  },
]

export default function FieldsPage() {
  const [fields, setFields] = useState(sampleFields)
  const [isAddingField, setIsAddingField] = useState(false)
  const [newField, setNewField] = useState({ name: "", description: "" })

  const handleAddField = () => {
    if (newField.name.trim()) {
      const field = {
        id: Date.now(),
        name: newField.name,
        description: newField.description,
        examCount: 0,
        averageScore: 0,
      }
      setFields([...fields, field])
      setNewField({ name: "", description: "" })
      setIsAddingField(false)
    }
  }

  const handleDeleteField = (id: number) => {
    setFields(fields.filter((field) => field.id !== id))
  }

  return (
    <div className="space-y-8">
      {/* ページヘッダー */}
      <div className="page-header">
        <h1 className="page-title">分野管理</h1>
        <p className="page-description">試験の分野を管理し、各分野の成績を確認できます</p>
      </div>

      {/* 新規追加フォーム */}
      {isAddingField && (
        <Card>
          <CardHeader>
            <CardTitle>新しい分野を追加</CardTitle>
            <CardDescription>試験で評価する分野を追加します</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="form-field">
              <Label htmlFor="field-name" className="form-label">
                分野名
              </Label>
              <Input
                id="field-name"
                value={newField.name}
                onChange={(e) => setNewField({ ...newField, name: e.target.value })}
                placeholder="例: テクノロジ系"
                className="form-input"
              />
            </div>
            <div className="form-field">
              <Label htmlFor="field-description" className="form-label">
                説明
              </Label>
              <Textarea
                id="field-description"
                value={newField.description}
                onChange={(e) => setNewField({ ...newField, description: e.target.value })}
                placeholder="この分野に含まれる内容を説明してください"
                className="form-input"
                rows={3}
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleAddField} className="btn-primary">
                追加
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddingField(false)
                  setNewField({ name: "", description: "" })
                }}
              >
                キャンセル
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 追加ボタン */}
      {!isAddingField && (
        <Card>
          <CardContent className="pt-6">
            <Button onClick={() => setIsAddingField(true)} className="btn-primary">
              <Plus className="h-4 w-4 mr-2" />
              新しい分野を追加
            </Button>
          </CardContent>
        </Card>
      )}

      {/* 分野一覧 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fields.map((field) => (
          <Card key={field.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-primary" />
                    <span>{field.name}</span>
                  </CardTitle>
                  <CardDescription>{field.description}</CardDescription>
                </div>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteField(field.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{field.examCount}</div>
                    <div className="text-sm text-muted-foreground">試験数</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{field.averageScore}%</div>
                    <div className="text-sm text-muted-foreground">平均得点率</div>
                  </div>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      field.averageScore >= 70
                        ? "bg-success"
                        : field.averageScore >= 50
                          ? "bg-warning"
                          : "bg-destructive"
                    }`}
                    style={{ width: `${field.averageScore}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {fields.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">分野が登録されていません</h3>
            <p className="text-muted-foreground mb-4">試験で評価する分野を追加してみましょう</p>
            <Button onClick={() => setIsAddingField(true)} className="btn-primary">
              <Plus className="h-4 w-4 mr-2" />
              最初の分野を追加
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
