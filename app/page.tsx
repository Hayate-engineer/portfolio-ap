"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, BookOpen, Calendar, Target, Award, TrendingUp } from "lucide-react"
// useRouterをインポート
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
} from "recharts"
import { useExams } from "@/hooks/use-exams"

// サンプルデータ (レーダーチャート用)
const radarData = [
  { field: "テクノロジ系", current: 72, previous: 60 },
  { field: "マネジメント系", current: 80, previous: 60 },
  { field: "ストラテジ系", current: 60, previous: 53 },
]

export default function Dashboard() {
  const { exams, loading, error } = useExams()
  const [chartTab, setChartTab] = useState("radar")
  // Dashboardコンポーネント内でrouterを初期化
  const router = useRouter()

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-lg text-muted-foreground">試験データを読み込み中...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12 text-destructive">
        <p className="text-lg">データの読み込み中にエラーが発生しました: {error}</p>
        <p className="text-sm text-muted-foreground">Supabaseの環境変数設定やRLSポリシーを確認してください。</p>
      </div>
    )
  }

  // 統計データの計算
  const totalExams = exams.length
  const passedExams = exams.filter((exam) => exam.passed).length
  const passRate = totalExams > 0 ? Math.round((passedExams / totalExams) * 100) : 0
  const averageScore =
    totalExams > 0 ? Math.round(exams.reduce((sum, exam) => sum + (exam.total_score || 0), 0) / totalExams) : 0

  // 日付ごとの点数変動データを生成
  const scoreProgressData = exams
    .filter((exam) => exam.total_score !== null && exam.total_score !== undefined)
    .sort((a, b) => new Date(a.exam_date).getTime() - new Date(b.exam_date).getTime())
    .map((exam) => ({
      date: new Date(exam.exam_date).toLocaleDateString("ja-JP", {
        month: "short",
        day: "numeric",
      }),
      fullDate: exam.exam_date,
      score: exam.total_score || 0,
      examName: exam.name,
      passed: exam.passed,
      maxScore: exam.max_total_score || 100,
    }))

  return (
    <div className="space-y-8">
      {/* ページヘッダー */}
      <div className="page-header">
        <h1 className="page-title">ダッシュボード</h1>
        <p className="page-description">学習の進捗状況と試験結果を一目で確認できます</p>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="stat-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">総試験数</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{totalExams}</div>
            <p className="text-xs text-muted-foreground">今月 +1 (サンプル)</p>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">合格率</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{passRate}%</div>
            <p className="text-xs text-muted-foreground">
              {passedExams}/{totalExams} 試験合格
            </p>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">平均得点</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{averageScore}点</div>
            <p className="text-xs text-muted-foreground">前回から +10点 (サンプル)</p>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">弱点分野</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold text-warning">ストラテジ系 (サンプル)</div>
            <p className="text-xs text-muted-foreground">改善が必要 (サンプル)</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 最近の試験記録 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              最近の試験記録
              <Button variant="outline" size="sm" onClick={() => router.push("/exams")}>
                すべて表示
              </Button>
            </CardTitle>
            <CardDescription>直近の試験結果を確認できます</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {exams.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>まだ試験記録がありません。</p>
                <p>新しい試験を追加してみましょう！</p>
              </div>
            ) : (
              exams.slice(0, 3).map((exam) => (
                <div
                  key={exam.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-medium">{exam.name}</h3>
                      <Badge variant={exam.passed ? "default" : "secondary"}>{exam.passed ? "合格" : "不合格"}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {exam.exam_date}
                      </p>
                      <p>総合得点: {exam.total_score}点</p>
                    </div>
                  </div>
                  <Link href={`/exams/${exam.id}`}>
                    <Button variant="ghost" size="sm">
                      詳細
                    </Button>
                  </Link>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* 成績分析（タブ切り替え対応） */}
        <Card>
          <CardHeader>
            <CardTitle>成績分析</CardTitle>
            <CardDescription>分野別成績と点数推移を確認できます</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={chartTab} onValueChange={setChartTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="radar" className="flex items-center space-x-2">
                  <Target className="h-4 w-4" />
                  <span>分野別</span>
                </TabsTrigger>
                <TabsTrigger value="progress" className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>点数推移</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="radar" className="mt-6">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="hsl(var(--border))" />
                      <PolarAngleAxis dataKey="field" className="text-sm fill-muted-foreground" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} className="text-xs fill-muted-foreground" />
                      <Radar
                        name="最新"
                        dataKey="current"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary))"
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                      <Radar
                        name="前回"
                        dataKey="previous"
                        stroke="hsl(var(--success))"
                        fill="hsl(var(--success))"
                        fillOpacity={0.1}
                        strokeWidth={2}
                        strokeDasharray="5 5"
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center space-x-6 mt-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    <span className="text-sm">最新</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-success rounded-full"></div>
                    <span className="text-sm">前回</span>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="progress" className="mt-6">
                {scoreProgressData.length === 0 ? (
                  <div className="h-80 flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>点数データがありません</p>
                      <p className="text-sm">試験記録を追加すると推移が表示されます</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={scoreProgressData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[0, 100]} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "hsl(var(--card))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "6px",
                            }}
                            formatter={(value: any, name: string) => [`${value}点`, "得点"]}
                            labelFormatter={(label: string) => {
                              const data = scoreProgressData.find((d) => d.date === label)
                              return data ? `${data.examName} (${data.fullDate})` : label
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="score"
                            stroke="hsl(var(--primary))"
                            strokeWidth={3}
                            dot={{
                              fill: "hsl(var(--primary))",
                              strokeWidth: 2,
                              r: 6,
                            }}
                            activeDot={{
                              r: 8,
                              fill: "hsl(var(--primary))",
                              stroke: "hsl(var(--background))",
                              strokeWidth: 2,
                            }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">最高得点:</span>
                        <span className="font-medium text-success">
                          {Math.max(...scoreProgressData.map((d) => d.score))}点
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">最低得点:</span>
                        <span className="font-medium text-destructive">
                          {Math.min(...scoreProgressData.map((d) => d.score))}点
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">改善度:</span>
                        <span className="font-medium text-primary">
                          {scoreProgressData.length >= 2
                            ? `${scoreProgressData[scoreProgressData.length - 1].score - scoreProgressData[0].score > 0 ? "+" : ""}${scoreProgressData[scoreProgressData.length - 1].score - scoreProgressData[0].score}点`
                            : "---"}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* 学習のヒント */}
      <Card>
        <CardHeader>
          <CardTitle>学習のヒント</CardTitle>
          <CardDescription>成績データに基づく学習アドバイス</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">強化すべき分野</h4>
              <p className="text-sm text-blue-700">
                {scoreProgressData.length > 0
                  ? `最新の試験「${scoreProgressData[scoreProgressData.length - 1]?.examName}」の結果を参考に、弱点分野を重点的に学習しましょう。`
                  : "ストラテジ系の得点率が60%と低めです。経営戦略や企業活動の分野を重点的に学習しましょう。"}
              </p>
            </div>
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">成績の推移</h4>
              <p className="text-sm text-green-700">
                {scoreProgressData.length >= 2
                  ? scoreProgressData[scoreProgressData.length - 1].score > scoreProgressData[0].score
                    ? "点数が向上しています！この調子で学習を続けましょう。"
                    : "点数に波があります。安定した成績を目指して継続学習を心がけましょう。"
                  : "継続的な学習で成績の向上を目指しましょう。"}
              </p>
            </div>
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-medium text-yellow-900 mb-2">次回の目標</h4>
              <p className="text-sm text-yellow-700">
                {scoreProgressData.length > 0
                  ? `現在の最高得点${Math.max(...scoreProgressData.map((d) => d.score))}点を上回ることを目標に頑張りましょう！`
                  : "全分野で70%以上を目指して、バランスよく学習を進めましょう。"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
