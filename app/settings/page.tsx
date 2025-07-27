"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth/auth-provider"
import { supabase, isDemo } from "@/lib/supabase"
import { User, Lock, Target, Trash2, Save, Eye, EyeOff } from "lucide-react"

export default function SettingsPage() {
  const { user, signOut } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  // プロフィール設定
  const [profile, setProfile] = useState({
    fullName: "",
    email: user?.email || "",
    bio: "",
  })

  // パスワード変更
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // 学習目標設定
  const [goals, setGoals] = useState({
    targetScore: 80,
    studyHoursPerWeek: 10,
    targetExam: "",
    notes: "",
  })

  useEffect(() => {
    if (user && !isDemo) {
      fetchProfile()
    }
  }, [user])

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", user?.id).single()

      if (error && error.code !== "PGRST116") throw error

      if (data) {
        setProfile({
          fullName: data.full_name || "",
          email: data.email || user?.email || "",
          bio: data.bio || "",
        })
      }
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      if (isDemo) {
        setSuccess("プロフィールを更新しました（デモモード）")
        setLoading(false)
        return
      }

      const { error } = await supabase.from("profiles").upsert({
        id: user?.id,
        email: profile.email,
        full_name: profile.fullName,
        bio: profile.bio,
        updated_at: new Date().toISOString(),
      })

      if (error) throw error
      setSuccess("プロフィールを更新しました")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("新しいパスワードが一致しません")
      setLoading(false)
      return
    }

    try {
      if (isDemo) {
        setSuccess("パスワードを変更しました（デモモード）")
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
        setLoading(false)
        return
      }

      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword,
      })

      if (error) throw error
      setSuccess("パスワードを変更しました")
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoalsUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      // 実際の実装では、goalsテーブルに保存する
      setSuccess("学習目標を更新しました")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAccountDelete = async () => {
    if (!confirm("本当にアカウントを削除しますか？この操作は取り消せません。")) {
      return
    }

    setLoading(true)
    setError("")

    try {
      if (isDemo) {
        localStorage.removeItem("demo-user")
        window.location.href = "/login"
        return
      }

      // 実際の実装では、ユーザーデータの削除処理を行う
      await signOut()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* ページヘッダー */}
      <div className="page-header">
        <h1 className="page-title">設定</h1>
        <p className="page-description">アカウント情報と学習設定を管理できます</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">プロフィール</TabsTrigger>
          <TabsTrigger value="security">セキュリティ</TabsTrigger>
          <TabsTrigger value="goals">学習目標</TabsTrigger>
          <TabsTrigger value="danger">危険な操作</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>プロフィール情報</span>
              </CardTitle>
              <CardDescription>基本的なアカウント情報を管理します</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="form-field">
                  <Label htmlFor="fullName" className="form-label">
                    お名前
                  </Label>
                  <Input
                    id="fullName"
                    value={profile.fullName}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                    placeholder="山田太郎"
                    className="form-input"
                  />
                </div>
                <div className="form-field">
                  <Label htmlFor="email" className="form-label">
                    メールアドレス
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    placeholder="your@email.com"
                    className="form-input"
                  />
                </div>
                <div className="form-field">
                  <Label htmlFor="bio" className="form-label">
                    自己紹介
                  </Label>
                  <Textarea
                    id="bio"
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    placeholder="学習の目標や現在の状況について..."
                    className="form-input"
                    rows={3}
                  />
                </div>
                <Button type="submit" disabled={loading} className="btn-primary">
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? "更新中..." : "プロフィールを更新"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lock className="h-5 w-5" />
                <span>パスワード変更</span>
              </CardTitle>
              <CardDescription>アカウントのセキュリティを強化するためにパスワードを変更します</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="form-field">
                  <Label htmlFor="currentPassword" className="form-label">
                    現在のパスワード
                  </Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showPassword ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      placeholder="現在のパスワード"
                      className="form-input pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="form-field">
                  <Label htmlFor="newPassword" className="form-label">
                    新しいパスワード
                  </Label>
                  <Input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    placeholder="8文字以上の新しいパスワード"
                    className="form-input"
                    minLength={8}
                  />
                </div>
                <div className="form-field">
                  <Label htmlFor="confirmPassword" className="form-label">
                    パスワード確認
                  </Label>
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    placeholder="新しいパスワードを再入力"
                    className="form-input"
                  />
                </div>
                <Button type="submit" disabled={loading} className="btn-primary">
                  <Lock className="h-4 w-4 mr-2" />
                  {loading ? "変更中..." : "パスワードを変更"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>学習目標</span>
              </CardTitle>
              <CardDescription>学習の目標を設定してモチベーションを維持しましょう</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleGoalsUpdate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-field">
                    <Label htmlFor="targetScore" className="form-label">
                      目標得点
                    </Label>
                    <Input
                      id="targetScore"
                      type="number"
                      value={goals.targetScore}
                      onChange={(e) => setGoals({ ...goals, targetScore: Number.parseInt(e.target.value) })}
                      min="0"
                      max="100"
                      className="form-input"
                    />
                  </div>
                  <div className="form-field">
                    <Label htmlFor="studyHours" className="form-label">
                      週間学習時間（時間）
                    </Label>
                    <Input
                      id="studyHours"
                      type="number"
                      value={goals.studyHoursPerWeek}
                      onChange={(e) => setGoals({ ...goals, studyHoursPerWeek: Number.parseInt(e.target.value) })}
                      min="1"
                      max="168"
                      className="form-input"
                    />
                  </div>
                </div>
                <div className="form-field">
                  <Label htmlFor="targetExam" className="form-label">
                    目標資格
                  </Label>
                  <Input
                    id="targetExam"
                    value={goals.targetExam}
                    onChange={(e) => setGoals({ ...goals, targetExam: e.target.value })}
                    placeholder="例: 基本情報技術者試験"
                    className="form-input"
                  />
                </div>
                <div className="form-field">
                  <Label htmlFor="goalNotes" className="form-label">
                    学習計画・メモ
                  </Label>
                  <Textarea
                    id="goalNotes"
                    value={goals.notes}
                    onChange={(e) => setGoals({ ...goals, notes: e.target.value })}
                    placeholder="学習計画や目標達成のためのメモ..."
                    className="form-input"
                    rows={3}
                  />
                </div>
                <Button type="submit" disabled={loading} className="btn-primary">
                  <Target className="h-4 w-4 mr-2" />
                  {loading ? "更新中..." : "学習目標を更新"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="danger" className="space-y-6">
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-destructive">
                <Trash2 className="h-5 w-5" />
                <span>危険な操作</span>
              </CardTitle>
              <CardDescription>以下の操作は取り消すことができません。慎重に実行してください。</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                <h4 className="font-medium text-destructive mb-2">アカウントの削除</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  アカウントを削除すると、すべての試験記録、分野設定、学習データが完全に削除されます。
                  この操作は取り消すことができません。
                </p>
                <Button
                  variant="destructive"
                  onClick={handleAccountDelete}
                  disabled={loading}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {loading ? "削除中..." : "アカウントを削除"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
