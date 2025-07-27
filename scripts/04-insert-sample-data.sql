-- このスクリプトは実際のユーザーでログイン後に実行してください
-- auth.uid() で現在のユーザーIDを取得します

-- サンプル分野データの挿入
INSERT INTO fields (user_id, name, description, color) VALUES
  (auth.uid(), 'テクノロジ系', 'コンピュータシステム、技術要素、開発技術', '#3B82F6'),
  (auth.uid(), 'マネジメント系', 'プロジェクトマネジメント、サービスマネジメント', '#10B981'),
  (auth.uid(), 'ストラテジ系', '企業活動、経営戦略、システム戦略', '#F59E0B'),
  (auth.uid(), 'セキュリティ', '情報セキュリティ、リスク管理', '#EF4444'),
  (auth.uid(), 'ネットワーク', 'ネットワーク技術、通信プロトコル', '#8B5CF6');

-- サンプル試験データの挿入
INSERT INTO exams (user_id, name, exam_date, passed, total_score, max_total_score, notes) VALUES
  (auth.uid(), '基本情報技術者試験', '2024-10-20', true, 75, 100, '初回受験で合格。午後問題のプログラミングが難しかった。'),
  (auth.uid(), '応用情報技術者試験', '2024-04-21', false, 55, 100, '午後問題で時間が足りなかった。再挑戦予定。'),
  (auth.uid(), '情報セキュリティマネジメント試験', '2024-01-15', true, 82, 100, 'セキュリティ分野を重点学習した成果が出た。'),
  (auth.uid(), 'ITパスポート試験', '2023-11-10', true, 68, 100, '最初の資格試験。基礎固めができた。'),
  (auth.uid(), '基本情報技術者試験（再受験）', '2023-04-16', false, 58, 100, '初回は不合格。アルゴリズムの理解が不足していた。');

-- サンプル得点データの挿入
-- 基本情報技術者試験（合格）の分野別得点
WITH exam_data AS (
  SELECT id as exam_id FROM exams 
  WHERE user_id = auth.uid() AND name = '基本情報技術者試験' AND passed = true
  LIMIT 1
),
field_data AS (
  SELECT id, name FROM fields WHERE user_id = auth.uid()
)
INSERT INTO scores (exam_id, field_id, score, max_score)
SELECT 
  e.exam_id,
  f.id,
  CASE 
    WHEN f.name = 'テクノロジ系' THEN 18
    WHEN f.name = 'マネジメント系' THEN 8
    WHEN f.name = 'ストラテジ系' THEN 9
    ELSE 0
  END,
  CASE 
    WHEN f.name = 'テクノロジ系' THEN 25
    WHEN f.name = 'マネジメント系' THEN 10
    WHEN f.name = 'ストラテジ系' THEN 15
    ELSE 10
  END
FROM exam_data e
CROSS JOIN field_data f
WHERE f.name IN ('テクノロジ系', 'マネジメント系', 'ストラテジ系');

-- 応用情報技術者試験（不合格）の分野別得点
WITH exam_data AS (
  SELECT id as exam_id FROM exams 
  WHERE user_id = auth.uid() AND name = '応用情報技術者試験'
  LIMIT 1
),
field_data AS (
  SELECT id, name FROM fields WHERE user_id = auth.uid()
)
INSERT INTO scores (exam_id, field_id, score, max_score)
SELECT 
  e.exam_id,
  f.id,
  CASE 
    WHEN f.name = 'テクノロジ系' THEN 15
    WHEN f.name = 'マネジメント系' THEN 6
    WHEN f.name = 'ストラテジ系' THEN 8
    ELSE 0
  END,
  CASE 
    WHEN f.name = 'テクノロジ系' THEN 25
    WHEN f.name = 'マネジメント系' THEN 10
    WHEN f.name = 'ストラテジ系' THEN 15
    ELSE 10
  END
FROM exam_data e
CROSS JOIN field_data f
WHERE f.name IN ('テクノロジ系', 'マネジメント系', 'ストラテジ系');

-- 情報セキュリティマネジメント試験の分野別得点
WITH exam_data AS (
  SELECT id as exam_id FROM exams 
  WHERE user_id = auth.uid() AND name = '情報セキュリティマネジメント試験'
  LIMIT 1
),
field_data AS (
  SELECT id, name FROM fields WHERE user_id = auth.uid()
)
INSERT INTO scores (exam_id, field_id, score, max_score)
SELECT 
  e.exam_id,
  f.id,
  CASE 
    WHEN f.name = 'セキュリティ' THEN 22
    WHEN f.name = 'マネジメント系' THEN 9
    WHEN f.name = 'ストラテジ系' THEN 12
    ELSE 0
  END,
  CASE 
    WHEN f.name = 'セキュリティ' THEN 25
    WHEN f.name = 'マネジメント系' THEN 10
    WHEN f.name = 'ストラテジ系' THEN 15
    ELSE 10
  END
FROM exam_data e
CROSS JOIN field_data f
WHERE f.name IN ('セキュリティ', 'マネジメント系', 'ストラテジ系');

-- サンプル学習目標の挿入
INSERT INTO learning_goals (user_id, target_score, study_hours_per_week, target_exam, target_date, notes, is_active) VALUES
  (auth.uid(), 80, 15, '応用情報技術者試験', '2025-04-20', '前回の不合格を踏まえ、午後問題の対策を重点的に行う。特にアルゴリズムとプログラミングを強化。', true),
  (auth.uid(), 85, 10, 'ネットワークスペシャリスト試験', '2025-10-15', 'ネットワーク分野のスペシャリストを目指す。実務経験も活かしたい。', false);

-- プロフィール情報の挿入（オプション）
INSERT INTO profiles (id, email, full_name, bio) VALUES
  (auth.uid(), 
   COALESCE((SELECT email FROM auth.users WHERE id = auth.uid()), 'user@example.com'),
   'サンプルユーザー', 
   'IT系資格取得を目指して学習中です。基本情報技術者試験に合格し、次は応用情報技術者試験にチャレンジします。')
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  bio = EXCLUDED.bio,
  updated_at = NOW();
