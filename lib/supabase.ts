import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Next.js のプレビューや Storybook など、環境変数を注入できないケースを考慮
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "%c[Supabase] NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY が未設定です。" +
      " プレースホルダーでクライアントを生成します。実運用時は .env.local に設定してください。",
    "color:orange;",
  )
}

// 環境変数が無い場合はダミー文字列で生成してビルドを通す
const fallbackUrl = supabaseUrl || "https://placeholder.supabase.co"
const fallbackKey = supabaseAnonKey || "PLACEHOLDER_ANON_KEY"

export const supabase = createClient(fallbackUrl, fallbackKey)

// データベースの型定義
export interface Profile {
  id: string
  email: string
  full_name: string
  created_at: string
  updated_at: string
}

export interface Field {
  id: number
  user_id: string
  name: string
  description?: string
  created_at: string
  updated_at: string
  color?: string // colorプロパティを追加
}

export interface Exam {
  id: number
  user_id: string
  name: string
  exam_date: string
  passed: boolean
  total_score?: number
  max_total_score?: number
  notes?: string
  created_at: string
  updated_at: string
}

export interface Score {
  id: number
  exam_id: number
  field_id: number
  score: number
  max_score: number
  created_at: string
  updated_at: string
}

// 試験データと得点データを結合した型
export interface ExamWithScores extends Exam {
  scores?: (Score & { field?: Field })[] // fieldはオプショナルにする
}

// Demo 判定：環境変数が無い or PLACEHOLDER の場合
export const isDemo =
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === "PLACEHOLDER_ANON_KEY"
// || true // 強制的にデモモードを有効化する行を削除
// この行を削除することで、環境変数が設定されていればデモモードではなくなる
