"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth/auth-provider"
import { BookOpen, BarChart3, Plus, User, Menu, X, Home, FileText, Target, Settings } from "lucide-react"

const navigation = [
  { name: "ダッシュボード", href: "/", icon: Home },
  { name: "試験記録", href: "/exams", icon: FileText },
  { name: "分野管理", href: "/fields", icon: Target },
  { name: "分析", href: "/analytics", icon: BarChart3 },
  { name: "設定", href: "/settings", icon: Settings },
]

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (!user) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-green-50">
      {/* サイドバー（モバイル） */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? "block" : "hidden"}`}>
        <div className="fixed inset-0 bg-black/20" onClick={() => setSidebarOpen(false)} />
        <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-xl">
          <div className="flex h-16 items-center justify-between px-4 border-b">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-primary" />
              <span className="text-lg font-bold">試験トラッカー</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="mt-8 px-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`nav-link ${isActive ? "nav-link-active" : "nav-link-inactive"}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* サイドバー（デスクトップ） */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-border shadow-sm">
          <div className="flex h-16 items-center px-4 border-b">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-primary" />
              <span className="text-lg font-bold">試験トラッカー</span>
            </div>
          </div>
          <nav className="mt-8 flex-1 px-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`nav-link ${isActive ? "nav-link-active" : "nav-link-inactive"}`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>
          <div className="p-4 border-t">
            <div className="flex items-center space-x-3 mb-3">
              <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{user?.email || "ユーザー"}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={signOut} className="w-full bg-transparent">
              ログアウト
            </Button>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="lg:pl-64">
        {/* トップバー */}
        <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-border">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex-1" />
            <div className="flex items-center space-x-4">
              <Link href="/exams/add">
                <Button size="sm" className="btn-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  試験を追加
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* ページコンテンツ */}
        <main className="py-8">
          <div className="app-container">{children}</div>
        </main>

        {/* フッター */}
        <footer className="bg-white border-t border-border mt-16">
          <div className="app-container py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <BookOpen className="h-6 w-6 text-primary" />
                  <span className="text-lg font-bold">資格試験トラッカー</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  IT系資格取得を目指す学習者のための成績管理・可視化ツール
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-4">機能</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>試験結果の記録・管理</li>
                  <li>分野別成績の可視化</li>
                  <li>学習進捗の分析</li>
                  <li>弱点分野の特定</li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-4">対応資格</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>基本情報技術者試験</li>
                  <li>応用情報技術者試験</li>
                  <li>情報セキュリティマネジメント</li>
                  <li>その他IT系資格</li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-border text-center">
              <p className="text-sm text-muted-foreground">© 2024 資格試験トラッカー. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
