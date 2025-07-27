-- RLS（Row Level Security）の有効化
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_goals ENABLE ROW LEVEL SECURITY;

-- プロフィールのRLSポリシー
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 分野のRLSポリシー
CREATE POLICY "Users can view own fields" ON fields
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own fields" ON fields
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own fields" ON fields
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own fields" ON fields
  FOR DELETE USING (auth.uid() = user_id);

-- 試験のRLSポリシー
CREATE POLICY "Users can view own exams" ON exams
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own exams" ON exams
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own exams" ON exams
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own exams" ON exams
  FOR DELETE USING (auth.uid() = user_id);

-- 得点のRLSポリシー（試験の所有者のみアクセス可能）
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

-- 学習目標のRLSポリシー
CREATE POLICY "Users can view own goals" ON learning_goals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own goals" ON learning_goals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals" ON learning_goals
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own goals" ON learning_goals
  FOR DELETE USING (auth.uid() = user_id);
