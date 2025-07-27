-- 試験と得点を結合したビュー（よく使用されるクエリを簡素化）
CREATE OR REPLACE VIEW exam_details AS
SELECT 
  e.id,
  e.user_id,
  e.name,
  e.exam_date,
  e.passed,
  e.total_score,
  e.max_total_score,
  e.notes,
  e.created_at,
  e.updated_at,
  CASE 
    WHEN e.total_score IS NOT NULL AND e.max_total_score IS NOT NULL AND e.max_total_score > 0
    THEN ROUND(e.total_score::NUMERIC / e.max_total_score::NUMERIC * 100, 1)
    ELSE NULL
  END as percentage,
  json_agg(
    CASE 
      WHEN s.id IS NOT NULL THEN
        json_build_object(
          'score_id', s.id,
          'field_id', f.id,
          'field_name', f.name,
          'field_color', f.color,
          'score', s.score,
          'max_score', s.max_score,
          'percentage', ROUND(s.score::NUMERIC / s.max_score::NUMERIC * 100, 1)
        )
      ELSE NULL
    END
  ) FILTER (WHERE s.id IS NOT NULL) as field_scores
FROM exams e
LEFT JOIN scores s ON e.id = s.exam_id
LEFT JOIN fields f ON s.field_id = f.id
GROUP BY e.id, e.user_id, e.name, e.exam_date, e.passed, e.total_score, e.max_total_score, e.notes, e.created_at, e.updated_at;

-- 分野別統計ビュー
CREATE OR REPLACE VIEW field_statistics AS
SELECT 
  f.id,
  f.user_id,
  f.name,
  f.description,
  f.color,
  f.created_at,
  f.updated_at,
  COALESCE(stats.exam_count, 0) as exam_count,
  COALESCE(stats.total_score, 0) as total_score,
  COALESCE(stats.total_max_score, 0) as total_max_score,
  COALESCE(stats.average_score, 0) as average_score,
  COALESCE(stats.average_percentage, 0) as average_percentage,
  COALESCE(stats.best_score, 0) as best_score,
  COALESCE(stats.worst_score, 0) as worst_score
FROM fields f
LEFT JOIN (
  SELECT 
    s.field_id,
    COUNT(DISTINCT s.exam_id) as exam_count,
    SUM(s.score) as total_score,
    SUM(s.max_score) as total_max_score,
    ROUND(AVG(s.score), 1) as average_score,
    ROUND(AVG(s.score::NUMERIC / s.max_score::NUMERIC * 100), 1) as average_percentage,
    MAX(ROUND(s.score::NUMERIC / s.max_score::NUMERIC * 100, 1)) as best_score,
    MIN(ROUND(s.score::NUMERIC / s.max_score::NUMERIC * 100, 1)) as worst_score
  FROM scores s
  JOIN exams e ON s.exam_id = e.id
  GROUP BY s.field_id
) stats ON f.id = stats.field_id;
