-- 既存のテーブルとポリシーをクリーンアップ
DROP POLICY IF EXISTS "Users can delete own scores" ON scores;
DROP POLICY IF EXISTS "Users can update own scores" ON scores;
DROP POLICY IF EXISTS "Users can insert own scores" ON scores;
DROP POLICY IF EXISTS "Users can view own scores" ON scores;
DROP POLICY IF EXISTS "Users can delete own exams" ON exams;
DROP POLICY IF EXISTS "Users can update own exams" ON exams;
DROP POLICY IF EXISTS "Users can insert own exams" ON exams;
DROP POLICY IF EXISTS "Users can view own exams" ON exams;
DROP POLICY IF EXISTS "Users can delete own fields" ON fields;
DROP POLICY IF EXISTS "Users can update own fields" ON fields;
DROP POLICY IF EXISTS "Users can insert own fields" ON fields;
DROP POLICY IF EXISTS "Users can view own fields" ON fields;
DROP POLICY IF EXISTS "Users can delete own goals" ON learning_goals;
DROP POLICY IF EXISTS "Users can update own goals" ON learning_goals;
DROP POLICY IF EXISTS "Users can insert own goals" ON learning_goals;
DROP POLICY IF EXISTS "Users can view own goals" ON learning_goals;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;

DROP TABLE IF EXISTS scores CASCADE;
DROP TABLE IF EXISTS exams CASCADE;
DROP TABLE IF EXISTS fields CASCADE;
DROP TABLE IF EXISTS learning_goals CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- プロフィールテーブル（Supabase Authを拡張）
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 分野マスタテーブル
CREATE TABLE fields (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#3B82F6', -- デフォルトは青色
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, name) -- 同一ユーザー内で分野名の重複を防ぐ
);

-- 試験テーブル
CREATE TABLE exams (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  exam_date DATE NOT NULL,
  passed BOOLEAN DEFAULT FALSE,
  total_score INTEGER,
  max_total_score INTEGER DEFAULT 100,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT valid_scores CHECK (
    (total_score IS NULL AND max_total_score IS NULL) OR
    (total_score >= 0 AND max_total_score > 0 AND total_score <= max_total_score)
  )
);

-- 得点テーブル（分野別の詳細得点）
CREATE TABLE scores (
  id SERIAL PRIMARY KEY,
  exam_id INTEGER REFERENCES exams(id) ON DELETE CASCADE NOT NULL,
  field_id INTEGER REFERENCES fields(id) ON DELETE CASCADE NOT NULL,
  score INTEGER NOT NULL,
  max_score INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(exam_id, field_id), -- 同一試験・同一分野の重複を防ぐ
  CONSTRAINT valid_field_scores CHECK (score >= 0 AND max_score > 0 AND score <= max_score)
);

-- 学習目標テーブル
CREATE TABLE learning_goals (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  target_score INTEGER DEFAULT 80,
  study_hours_per_week INTEGER DEFAULT 10,
  target_exam TEXT,
  target_date DATE,
  notes TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT valid_goals CHECK (
    target_score >= 0 AND target_score <= 100 AND
    study_hours_per_week >= 1 AND study_hours_per_week <= 168
  )
);

-- インデックスの作成（パフォーマンス向上）
CREATE INDEX idx_profiles_user_id ON profiles(id);
CREATE INDEX idx_fields_user_id ON fields(user_id);
CREATE INDEX idx_fields_name ON fields(user_id, name);
CREATE INDEX idx_exams_user_id ON exams(user_id);
CREATE INDEX idx_exams_date ON exams(user_id, exam_date DESC);
CREATE INDEX idx_scores_exam_id ON scores(exam_id);
CREATE INDEX idx_scores_field_id ON scores(field_id);
CREATE INDEX idx_learning_goals_user_id ON learning_goals(user_id);
CREATE INDEX idx_learning_goals_active ON learning_goals(user_id, is_active);

-- 更新日時を自動更新するトリガー関数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 各テーブルに更新日時トリガーを設定
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_fields_updated_at BEFORE UPDATE ON fields FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_exams_updated_at BEFORE UPDATE ON exams FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_scores_updated_at BEFORE UPDATE ON scores FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_learning_goals_updated_at BEFORE UPDATE ON learning_goals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
