-- このスクリプトは実際のユーザーIDでサンプルデータを挿入します
-- 注意: 実際のユーザーでログイン後に実行してください

-- 現在のユーザーIDを取得してサンプル分野を挿入
INSERT INTO fields (user_id, name, description) VALUES
  (auth.uid(), 'テクノロジ系', 'コンピュータシステム、技術要素、開発技術'),
  (auth.uid(), 'マネジメント系', 'プロジェクトマネジメント、サービスマネジメント'),
  (auth.uid(), 'ストラテジ系', '企業活動、経営戦略、システム戦略');

-- サンプル試験データを挿入
INSERT INTO exams (user_id, name, exam_date, passed, total_score, max_total_score, notes) VALUES
  (auth.uid(), '基本情報技術者試験', '2024-10-20', true, 75, 100, '初回受験で合格'),
  (auth.uid(), '応用情報技術者試験', '2024-04-21', false, 55, 100, '再挑戦予定');

-- サンプル得点データを挿入（分野IDは動的に取得）
WITH field_ids AS (
  SELECT id, name FROM fields WHERE user_id = auth.uid()
),
exam_ids AS (
  SELECT id, name FROM exams WHERE user_id = auth.uid()
)
INSERT INTO scores (exam_id, field_id, score, max_score)
SELECT 
  e.id,
  f.id,
  CASE 
    WHEN e.name = '基本情報技術者試験' AND f.name = 'テクノロジ系' THEN 18
    WHEN e.name = '基本情報技術者試験' AND f.name = 'マネジメント系' THEN 8
    WHEN e.name = '基本情報技術者試験' AND f.name = 'ストラテジ系' THEN 9
    WHEN e.name = '応用情報技術者試験' AND f.name = 'テクノロジ系' THEN 15
    WHEN e.name = '応用情報技術者試験' AND f.name = 'マネジメント系' THEN 6
    WHEN e.name = '応用情報技術者試験' AND f.name = 'ストラテジ系' THEN 8
  END,
  CASE 
    WHEN f.name = 'テクノロジ系' THEN 25
    WHEN f.name = 'マネジメント系' THEN 10
    WHEN f.name = 'ストラテジ系' THEN 15
  END
FROM exam_ids e
CROSS JOIN field_ids f;
