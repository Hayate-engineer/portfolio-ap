-- まず既存のテーブルとポリシーをクリーンアップ
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
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;

DROP TABLE IF EXISTS scores CASCADE;
DROP TABLE IF EXISTS exams CASCADE;
DROP TABLE IF EXISTS fields CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- ユーザーテーブル（Supabase Authを使用するため、追加のプロファイル情報のみ）
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 分野マスタテーブル
CREATE TABLE fields (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 試験テーブル
CREATE TABLE exams (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  exam_date DATE NOT NULL,
  passed BOOLEAN DEFAULT FALSE,
  total_score INTEGER,
  max_total_score INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 得点テーブル
CREATE TABLE scores (
  id SERIAL PRIMARY KEY,
  exam_id INTEGER REFERENCES exams(id) ON DELETE CASCADE,
  field_id INTEGER REFERENCES fields(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  max_score INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックスの作成
CREATE INDEX idx_fields_user_id ON fields(user_id);
CREATE INDEX idx_exams_user_id ON exams(user_id);
CREATE INDEX idx_scores_exam_id ON scores(exam_id);
CREATE INDEX idx_scores_field_id ON scores(field_id);

-- RLS（Row Level Security）の設定
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;

-- プロファイルのポリシー
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 分野のポリシー
CREATE POLICY "Users can view own fields" ON fields
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own fields" ON fields
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own fields" ON fields
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own fields" ON fields
  FOR DELETE USING (auth.uid() = user_id);

-- 試験のポリシー
CREATE POLICY "Users can view own exams" ON exams
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own exams" ON exams
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own exams" ON exams
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own exams" ON exams
  FOR DELETE USING (auth.uid() = user_id);

-- 得点のポリシー
CREATE POLICY "Users can view own scores" ON scores
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM exams 
      WHERE exams.id = scores.exam_id 
      AND exams.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own scores" ON scores
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM exams 
      WHERE exams.id = scores.exam_id 
      AND exams.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own scores" ON scores
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM exams 
      WHERE exams.id = scores.exam_id 
      AND exams.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own scores" ON scores
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM exams 
      WHERE exams.id = scores.exam_id 
      AND exams.user_id = auth.uid()
    )
  );
