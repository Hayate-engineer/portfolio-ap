## アプリ概要
Next.jsとSupabaseを用いて開発した試験学習記録アプリです。  
日々の学習進捗を記録し、自己管理を効率化できます。

## サイトイメージ
メインページの画像を貼れると良いです。

![アプリ画面](https://github.com/aihat9161/PortfolioExample_WorX_ENGINEER-CLASS/blob/f72a921271bddc8d47744118a0838061c302a9d7/docs/%E3%82%A2%E3%83%97%E3%83%AA%E3%81%AE%E3%83%A1%E3%82%A4%E3%83%B3%E3%83%9A%E3%83%BC%E3%82%B8%E7%94%BB%E5%83%8F.jpg?raw=true)

## サイトURL

デプロイした後のアプリのメインページURLを貼りましょう。  
https://v0-v0-dev-hazel.vercel.app/


「画面中部のゲストログインボタンから、メールアドレスとパスワードを入力せずにログインできます。」といった仕様を作れれば、面接官も試しやすいと思います。

## 使用技術
- フロントエンド：Next.js 15.3（App Router / Server Components）
- バックエンド：Next.js APIルート（Node.jsベース）
- データベース：Supabase（PostgreSQL）
- デプロイ：Vercel
- バージョン管理：Git、GitHub
- テスト・デバッグ：Chrome DevTools、ESLint、Prettier
- CI/CD：GitHub Actions

## 設計ドキュメント
[要件定義・基本設計・詳細設計の一覧_Googleスプレッドシート](https://docs.google.com/spreadsheets/d/1mwmu33hrtfvnxyLFrk37dE-uSISoYLtB6_U4iEzf_9A/edit?usp=sharing)

詳細設計時のワイヤーフレーム、ER図、ワークフロー図の画像はdocsディレクトリに格納しています。（[こちらからアクセス](./docs)）

※[]の中に表示文を書き、その後ろで()の中にURLを入れればハイパーリンク化できます。

## 機能一覧
- ユーザー登録、ログイン（メール認証 / Googleアカウント）
- 試験や目標ごとの進捗登録・更新・削除
- カレンダー表示による学習記録の可視化
- ダッシュボードでの学習状況サマリ表示
- ダークモード対応

## テスト・修正の設計及び実施書
[テスト・修正の設計及び実施書_Googleスプレッドシート](https://docs.google.com/spreadsheets/d/1rA0deupNBZrvfnei37PGhPke1pvfvEyvjvC9wUR97AU/edit?usp=sharing)

## アプリの改善案
[アプリの改善案_Googleスプレッドシート](https://docs.google.com/spreadsheets/d/1fgynpBKhx8zaNkMweeYVQl52bP6Z8dJZOmmY8MHXjQM/edit?usp=sharing)

## 備考
[ESLintの実行結果_GitHub Actions](https://github.com/aihat9161/PortfolioExample_Next.js_BlogAppWorX_ENGINEER-CLASS/actions/runs/14956271682/job/42012343864)

- 活用した生成AIとその用途
  - ChatGPT：要件定義、設計、各種リサーチ
  - v0：アプリのモック作成
  - GitHub Copilot Chat：ローカル環境でのコードの修正相談

- リファクタリングの規則
  - 2つ以上のファイルで使う、行数が10以上のUIコンポーネントはcomponentsフォルダに移行
  - 2つ以上のファイルで使う、行数が10以上の関数はlibフォルダに移行
  - 変数名で2つ以上の単語が入る場合は、「isPublished」のように二つ目以降の単語の頭を大文字とする
