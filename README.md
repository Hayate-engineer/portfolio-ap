## アプリ概要
Next.jsとSupabaseを用いて開発した試験学習記録アプリです。  
日々の学習進捗を記録し、自己管理を効率化できます。

## サイトイメージ
![アプリ画面](<img width="875" height="620" alt="main-page" src="https://github.com/user-attachments/assets/60c187dc-b66c-4ccf-b44f-17ce34e0abea" />)

## サイトURL  
https://v0-v0-dev-hazel.vercel.app/

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
[アプリの改善案_Googleスプレッドシート](https://docs.google.com/spreadsheets/d/1pu-ioKnU7iqVvmAw0wooKJghK40I3tKga2lH2qP9ptc/edit?usp=sharing)

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
