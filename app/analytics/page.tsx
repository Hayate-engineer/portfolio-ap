"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, TrendingUp, TrendingDown, Target } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

// サンプルデータ
const progressData = [
  { date: "2024-01", score: 45, exam: "情報セキュリティ" },
  { date: "2024-04", score: 55, exam: "応用情報" },
  { date: "2024-10", score: 75, exam: "基本情報" },
]

const fieldComparisonData = [
  { field: "テクノロジ系", current: 72, target: 80, previous: 60 },
  { field: "マネジメント系", current: 80, target: 75, previous: 60 },
  { field: "ストラテジ系", current: 60, target: 70, previous: 53 },
]

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      {/* ページヘッダー */}
      <div className="page-header">
        <h1 className="page-title">分析</h1>
        <p className="page-description">学習の進捗状況と成績の推移を詳しく分析できます</p>
      </div>

      {/* 成績推移 */}
      <Card>
        <CardHeader>
          <CardTitle>成績推移</CardTitle>
          <CardDescription>時系列での得点の変化を確認できます</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 分野別比較 */}
        <Card>
          <CardHeader>
            <CardTitle>分野別成績比較</CardTitle>
            <CardDescription>各分野の現在の成績と目標値の比較</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={fieldComparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="field" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                    }}
                  />
                  <Bar dataKey="current" fill="hsl(var(--primary))" name="現在" />
                  <Bar dataKey="target" fill="hsl(var(--success))" name="目標" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 学習アドバイス */}
        <Card>
          <CardHeader>
            <CardTitle>学習アドバイス</CardTitle>
            <CardDescription>データに基づく具体的な改善提案</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {fieldComparisonData.map((field) => {
              const improvement = field.current - field.previous
              const isImproving = improvement > 0
              const reachedTarget = field.current >= field.target

              return (
                <div key={field.field} className="p-4 border border-border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{field.field}</h4>
                    <div className="flex items-center space-x-2">
                      {reachedTarget ? (
                        <Badge variant="default">目標達成</Badge>
                      ) : (
                        <Badge variant="secondary">要改善</Badge>
                      )}
                      {isImproving ? (
                        <TrendingUp className="h-4 w-4 text-success" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-destructive" />
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    現在: {field.current}% | 目標: {field.target}% | 前回比: {improvement > 0 ? "+" : ""}
                    {improvement}%
                  </div>
                  <div className="text-sm">
                    {reachedTarget ? (
                      <span className="text-success">目標を達成しています。この調子で維持しましょう。</span>
                    ) : (
                      <span className="text-foreground">
                        目標まであと{field.target - field.current}%です。
                        {field.field === "ストラテジ系" && "経営戦略や企業活動の学習を強化しましょう。"}
                        {field.field === "テクノロジ系" && "プログラミングやシステム設計の理解を深めましょう。"}
                        {field.field === "マネジメント系" && "プロジェクト管理の知識を補強しましょう。"}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      {/* 統計サマリー */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="stat-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">総合改善率</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">+15%</div>
            <p className="text-xs text-muted-foreground">過去6ヶ月間</p>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">目標達成分野</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">1/3</div>
            <p className="text-xs text-muted-foreground">マネジメント系が達成</p>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">学習効率</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">良好</div>
            <p className="text-xs text-muted-foreground">継続的な改善を確認</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
