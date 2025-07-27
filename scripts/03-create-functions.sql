-- 統計情報を取得する関数
CREATE OR REPLACE FUNCTION get_user_stats(user_uuid UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_exams', (
      SELECT COUNT(*) FROM exams WHERE user_id = user_uuid
    ),
    'passed_exams', (
      SELECT COUNT(*) FROM exams WHERE user_id = user_uuid AND passed = true
    ),
    'pass_rate', (
      CASE 
        WHEN (SELECT COUNT(*) FROM exams WHERE user_id = user_uuid) = 0 THEN 0
        ELSE ROUND(
          (SELECT COUNT(*) FROM exams WHERE user_id = user_uuid AND passed = true)::NUMERIC / 
          (SELECT COUNT(*) FROM exams WHERE user_id = user_uuid)::NUMERIC * 100, 1
        )
      END
    ),
    'average_score', (
      SELECT COALESCE(ROUND(AVG(total_score), 1), 0)
      FROM exams 
      WHERE user_id = user_uuid AND total_score IS NOT NULL
    ),
    'latest_exam', (
      SELECT json_build_object(
        'name', name,
        'exam_date', exam_date,
        'passed', passed,
        'total_score', total_score
      )
      FROM exams 
      WHERE user_id = user_uuid 
      ORDER BY exam_date DESC 
      LIMIT 1
    )
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 分野別統計を取得する関数
CREATE OR REPLACE FUNCTION get_field_stats(user_uuid UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_agg(
    json_build_object(
      'field_id', f.id,
      'field_name', f.name,
      'field_color', f.color,
      'exam_count', COALESCE(stats.exam_count, 0),
      'average_score', COALESCE(stats.average_score, 0),
      'average_percentage', COALESCE(stats.average_percentage, 0)
    )
  )
  FROM fields f
  LEFT JOIN (
    SELECT 
      s.field_id,
      COUNT(DISTINCT s.exam_id) as exam_count,
      ROUND(AVG(s.score), 1) as average_score,
      ROUND(AVG(s.score::NUMERIC / s.max_score::NUMERIC * 100), 1) as average_percentage
    FROM scores s
    JOIN exams e ON s.exam_id = e.id
    WHERE e.user_id = user_uuid
    GROUP BY s.field_id
  ) stats ON f.id = stats.field_id
  WHERE f.user_id = user_uuid
  INTO result;
  
  RETURN COALESCE(result, '[]'::JSON);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 成績推移データを取得する関数
CREATE OR REPLACE FUNCTION get_score_progress(user_uuid UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_agg(
    json_build_object(
      'exam_id', id,
      'exam_name', name,
      'exam_date', exam_date,
      'total_score', total_score,
      'max_total_score', max_total_score,
      'percentage', CASE 
        WHEN total_score IS NOT NULL AND max_total_score IS NOT NULL AND max_total_score > 0
        THEN ROUND(total_score::NUMERIC / max_total_score::NUMERIC * 100, 1)
        ELSE NULL
      END,
      'passed', passed
    )
    ORDER BY exam_date ASC
  )
  FROM exams
  WHERE user_id = user_uuid AND total_score IS NOT NULL
  INTO result;
  
  RETURN COALESCE(result, '[]'::JSON);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
