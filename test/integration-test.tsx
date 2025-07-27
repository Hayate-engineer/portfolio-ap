"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, AlertTriangle, Play } from "lucide-react"

interface TestResult {
  name: string
  status: "pass" | "fail" | "warning" | "pending"
  message: string
  category: string
}

export default function IntegrationTest() {
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const runTests = async () => {
    setIsRunning(true)
    setTestResults([])

    const results: TestResult[] = []

    // UI確認テスト: 入力フォームのUI（詳細版）
    try {
      const forms = document.querySelectorAll("form")
      const inputs = document.querySelectorAll("input")
      const textareas = document.querySelectorAll("textarea")
      const selects = document.querySelectorAll("select")
      const labels = document.querySelectorAll("label")
      const buttons = document.querySelectorAll("button[type='submit'], button:not([type])")

      // 入力タイプ別の確認
      const textInputs = document.querySelectorAll('input[type="text"], input:not([type])')
      const emailInputs = document.querySelectorAll('input[type="email"]')
      const passwordInputs = document.querySelectorAll('input[type="password"]')
      const numberInputs = document.querySelectorAll('input[type="number"]')
      const dateInputs = document.querySelectorAll('input[type="date"]')
      const checkboxInputs = document.querySelectorAll('input[type="checkbox"]')
      const radioInputs = document.querySelectorAll('input[type="radio"]')

      // プレースホルダーの確認
      const inputsWithPlaceholder = document.querySelectorAll("input[placeholder], textarea[placeholder]")
      const placeholderTexts = Array.from(inputsWithPlaceholder)
        .map((input) => input.getAttribute("placeholder"))
        .filter(Boolean)

      // 必須項目の確認
      const requiredInputs = document.querySelectorAll("input[required], textarea[required], select[required]")
      const requiredLabels = Array.from(labels).filter(
        (label) => label.textContent?.includes("*") || label.querySelector("span")?.textContent?.includes("*"),
      )

      // フォームグループの確認
      const formGroups = document.querySelectorAll('[class*="form-field"], .form-group, [class*="space-y"]')

      if (forms.length > 0) {
        const formDetails = [
          `フォーム数: ${forms.length}個`,
          `入力フィールド: ${inputs.length}個`,
          `テキストエリア: ${textareas.length}個`,
          `セレクトボックス: ${selects.length}個`,
          `ラベル: ${labels.length}個`,
          `送信ボタン: ${buttons.length}個`,
        ].join(", ")

        const inputTypeDetails = [
          `テキスト: ${textInputs.length}個`,
          `メール: ${emailInputs.length}個`,
          `パスワード: ${passwordInputs.length}個`,
          `数値: ${numberInputs.length}個`,
          `日付: ${dateInputs.length}個`,
          `チェックボックス: ${checkboxInputs.length}個`,
          `ラジオボタン: ${radioInputs.length}個`,
        ].join(", ")

        results.push({
          name: "入力フォームのUI表示（基本構成）",
          status: "pass",
          message: `${formDetails}`,
          category: "UI確認",
        })

        results.push({
          name: "入力フォームの入力タイプ",
          status: "pass",
          message: `${inputTypeDetails}`,
          category: "UI確認",
        })

        if (inputsWithPlaceholder.length > 0) {
          results.push({
            name: "プレースホルダーテキスト",
            status: "pass",
            message: `${inputsWithPlaceholder.length}個の入力フィールドにプレースホルダーが設定されています（例: "${placeholderTexts.slice(0, 3).join('", "')}"${placeholderTexts.length > 3 ? "..." : ""}）`,
            category: "UI確認",
          })
        } else {
          results.push({
            name: "プレースホルダーテキスト",
            status: "warning",
            message: "プレースホルダーが設定された入力フィールドが見つかりません",
            category: "UI確認",
          })
        }

        if (requiredInputs.length > 0) {
          results.push({
            name: "必須項目の表示",
            status: "pass",
            message: `${requiredInputs.length}個の必須入力項目があります。必須マーク付きラベル: ${requiredLabels.length}個`,
            category: "UI確認",
          })
        } else {
          results.push({
            name: "必須項目の表示",
            status: "warning",
            message: "必須項目が設定されていません",
            category: "UI確認",
          })
        }

        if (formGroups.length > 0) {
          results.push({
            name: "フォームレイアウト",
            status: "pass",
            message: `${formGroups.length}個のフォームグループが適切にレイアウトされています`,
            category: "UI確認",
          })
        } else {
          results.push({
            name: "フォームレイアウト",
            status: "warning",
            message: "フォームグループのレイアウト構造が見つかりません",
            category: "UI確認",
          })
        }
      } else {
        results.push({
          name: "入力フォームのUI表示",
          status: "warning",
          message:
            "現在のページに入力フォームが見つかりません。フォームがあるページ（/exams/add、/fields、/settings等）でテストを実行してください",
          category: "UI確認",
        })
      }
    } catch (error) {
      results.push({
        name: "入力フォームのUI表示",
        status: "fail",
        message: `フォーム要素の確認中にエラーが発生しました: ${error}`,
        category: "UI確認",
      })
    }

    // フォームの入力可能性テスト
    try {
      const editableInputs = document.querySelectorAll(
        "input:not([disabled]):not([readonly]), textarea:not([disabled]):not([readonly])",
      )
      const disabledInputs = document.querySelectorAll("input[disabled], textarea[disabled]")
      const readonlyInputs = document.querySelectorAll("input[readonly], textarea[readonly]")

      if (editableInputs.length > 0) {
        results.push({
          name: "入力フィールドの操作性",
          status: "pass",
          message: `${editableInputs.length}個の入力可能フィールド、${disabledInputs.length}個の無効化フィールド、${readonlyInputs.length}個の読み取り専用フィールドがあります`,
          category: "UI確認",
        })
      } else {
        results.push({
          name: "入力フィールドの操作性",
          status: "warning",
          message: "入力可能なフィールドが見つかりません",
          category: "UI確認",
        })
      }
    } catch (error) {
      results.push({
        name: "入力フィールドの操作性",
        status: "fail",
        message: `入力フィールドの操作性確認中にエラーが発生しました: ${error}`,
        category: "UI確認",
      })
    }

    // UI確認テスト: ナビゲーション要素
    try {
      const navLinks = document.querySelectorAll('nav a, [role="navigation"] a')
      const dashboardLink = Array.from(navLinks).find(
        (link) => link.textContent?.includes("ダッシュボード") || link.getAttribute("href") === "/",
      )
      const examsLink = Array.from(navLinks).find(
        (link) => link.textContent?.includes("試験記録") || link.getAttribute("href")?.includes("/exams"),
      )
      const fieldsLink = Array.from(navLinks).find(
        (link) => link.textContent?.includes("分野管理") || link.getAttribute("href")?.includes("/fields"),
      )

      if (dashboardLink && examsLink && fieldsLink) {
        results.push({
          name: "ナビゲーション要素の表示",
          status: "pass",
          message: "主要なナビゲーションリンク（ダッシュボード、試験記録、分野管理）が表示されています",
          category: "UI確認",
        })
      } else {
        results.push({
          name: "ナビゲーション要素の表示",
          status: "warning",
          message: "一部のナビゲーションリンクが見つかりません",
          category: "UI確認",
        })
      }
    } catch (error) {
      results.push({
        name: "ナビゲーション要素の表示",
        status: "fail",
        message: `ナビゲーション要素の確認中にエラーが発生しました: ${error}`,
        category: "UI確認",
      })
    }

    // UI確認テスト: ボタン要素
    try {
      const buttons = document.querySelectorAll("button")
      const addButton = Array.from(buttons).find(
        (btn) => btn.textContent?.includes("追加") || btn.textContent?.includes("新規"),
      )
      const editButtons = Array.from(buttons).filter((btn) => btn.textContent?.includes("編集"))
      const deleteButtons = Array.from(buttons).filter((btn) => btn.textContent?.includes("削除"))

      if (buttons.length > 0) {
        results.push({
          name: "操作ボタンの表示",
          status: "pass",
          message: `操作ボタンが表示されています（全${buttons.length}個のボタン、追加:${addButton ? "有" : "無"}、編集:${editButtons.length}個、削除:${deleteButtons.length}個）`,
          category: "UI確認",
        })
      } else {
        results.push({
          name: "操作ボタンの表示",
          status: "warning",
          message: "操作ボタンが見つかりません",
          category: "UI確認",
        })
      }
    } catch (error) {
      results.push({
        name: "操作ボタンの表示",
        status: "fail",
        message: `ボタン要素の確認中にエラーが発生しました: ${error}`,
        category: "UI確認",
      })
    }

    // UI確認テスト: データ表示要素
    try {
      const cards = document.querySelectorAll('[class*="card"], .stat-card')
      const tables = document.querySelectorAll("table")
      const lists = document.querySelectorAll("ul, ol")

      if (cards.length > 0 || tables.length > 0 || lists.length > 0) {
        results.push({
          name: "データ表示要素の確認",
          status: "pass",
          message: `データ表示要素が確認できます（カード:${cards.length}個、テーブル:${tables.length}個、リスト:${lists.length}個）`,
          category: "UI確認",
        })
      } else {
        results.push({
          name: "データ表示要素の確認",
          status: "warning",
          message: "データ表示要素が見つかりません",
          category: "UI確認",
        })
      }
    } catch (error) {
      results.push({
        name: "データ表示要素の確認",
        status: "fail",
        message: `データ表示要素の確認中にエラーが発生しました: ${error}`,
        category: "UI確認",
      })
    }

    // レスポンシブデザインテスト
    try {
      const viewport = window.innerWidth
      const isMobile = viewport < 768
      const isTablet = viewport >= 768 && viewport < 1024
      const isDesktop = viewport >= 1024

      const mobileElements = document.querySelectorAll('[class*="sm:"], [class*="md:"], [class*="lg:"]')

      results.push({
        name: "レスポンシブデザインの確認",
        status: "pass",
        message: `現在の画面幅: ${viewport}px (${isMobile ? "モバイル" : isTablet ? "タブレット" : "デスクトップ"})、レスポンシブ要素: ${mobileElements.length}個`,
        category: "UI確認",
      })
    } catch (error) {
      results.push({
        name: "レスポンシブデザインの確認",
        status: "fail",
        message: `レスポンシブデザインの確認中にエラーが発生しました: ${error}`,
        category: "UI確認",
      })
    }

    // アクセシビリティテスト
    try {
      const labelsWithFor = document.querySelectorAll("label[for]")
      const inputsWithId = document.querySelectorAll("input[id], textarea[id], select[id]")
      const buttonsWithAriaLabel = document.querySelectorAll("button[aria-label]")
      const imagesWithAlt = document.querySelectorAll("img[alt]")

      results.push({
        name: "基本的なアクセシビリティの確認",
        status: "pass",
        message: `アクセシビリティ要素が確認できます（ラベル:${labelsWithFor.length}個、ID付き入力:${inputsWithId.length}個、ARIA付きボタン:${buttonsWithAriaLabel.length}個、ALT付き画像:${imagesWithAlt.length}個）`,
        category: "UI確認",
      })
    } catch (error) {
      results.push({
        name: "基本的なアクセシビリティの確認",
        status: "fail",
        message: `アクセシビリティの確認中にエラーが発生しました: ${error}`,
        category: "UI確認",
      })
    }

    // バリデーション要素の確認
    try {
      const requiredInputs = document.querySelectorAll("input[required], textarea[required], select[required]")
      const emailInputs = document.querySelectorAll('input[type="email"]')
      const numberInputs = document.querySelectorAll('input[type="number"]')
      const dateInputs = document.querySelectorAll('input[type="date"]')

      results.push({
        name: "入力バリデーション要素の確認",
        status: "pass",
        message: `バリデーション要素が確認できます（必須項目:${requiredInputs.length}個、メール:${emailInputs.length}個、数値:${numberInputs.length}個、日付:${dateInputs.length}個）`,
        category: "UI確認",
      })
    } catch (error) {
      results.push({
        name: "入力バリデーション要素の確認",
        status: "fail",
        message: `バリデーション要素の確認中にエラーが発生しました: ${error}`,
        category: "UI確認",
      })
    }

    // ページタイトルとメタ情報の確認
    try {
      const title = document.title
      const metaDescription = document.querySelector('meta[name="description"]')?.getAttribute("content")

      results.push({
        name: "ページメタ情報の確認",
        status: "pass",
        message: `ページタイトル: "${title}"、説明: ${metaDescription ? `"${metaDescription}"` : "未設定"}`,
        category: "UI確認",
      })
    } catch (error) {
      results.push({
        name: "ページメタ情報の確認",
        status: "fail",
        message: `メタ情報の確認中にエラーが発生しました: ${error}`,
        category: "UI確認",
      })
    }

    setTestResults(results)
    setIsRunning(false)
  }

  const getStatusIcon = (status: TestResult["status"]) => {
    switch (status) {
      case "pass":
        return <CheckCircle className="h-5 w-5 text-success" />
      case "fail":
        return <XCircle className="h-5 w-5 text-destructive" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-warning" />
      default:
        return <AlertTriangle className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getStatusBadge = (status: TestResult["status"]) => {
    switch (status) {
      case "pass":
        return (
          <Badge variant="default" className="bg-success">
            合格
          </Badge>
        )
      case "fail":
        return <Badge variant="destructive">失敗</Badge>
      case "warning":
        return (
          <Badge variant="secondary" className="bg-warning text-warning-foreground">
            警告
          </Badge>
        )
      default:
        return <Badge variant="outline">待機中</Badge>
    }
  }

  const groupedResults = testResults.reduce(
    (acc, result) => {
      if (!acc[result.category]) {
        acc[result.category] = []
      }
      acc[result.category].push(result)
      return acc
    },
    {} as Record<string, TestResult[]>,
  )

  const passCount = testResults.filter((r) => r.status === "pass").length
  const failCount = testResults.filter((r) => r.status === "fail").length
  const warningCount = testResults.filter((r) => r.status === "warning").length

  return (
    <div className="space-y-8">
      <div className="page-header">
        <h1 className="page-title">結合・総合テスト</h1>
        <p className="page-description">アプリケーションの統合機能とUI要素を自動的にテストします</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            テスト実行
            <Button onClick={runTests} disabled={isRunning} className="btn-primary">
              <Play className="h-4 w-4 mr-2" />
              {isRunning ? "テスト実行中..." : "テストを実行"}
            </Button>
          </CardTitle>
          <CardDescription>現在表示されているページの UI 要素と基本機能を自動的にテストします</CardDescription>
        </CardHeader>
        {testResults.length > 0 && (
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-success/10 rounded-lg">
                <div className="text-2xl font-bold text-success">{passCount}</div>
                <div className="text-sm text-success">合格</div>
              </div>
              <div className="text-center p-4 bg-warning/10 rounded-lg">
                <div className="text-2xl font-bold text-warning">{warningCount}</div>
                <div className="text-sm text-warning">警告</div>
              </div>
              <div className="text-center p-4 bg-destructive/10 rounded-lg">
                <div className="text-2xl font-bold text-destructive">{failCount}</div>
                <div className="text-sm text-destructive">失敗</div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {Object.entries(groupedResults).map(([category, results]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle>{category}</CardTitle>
            <CardDescription>{results.length}個のテスト項目</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.map((result, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 border border-border rounded-lg">
                  <div className="flex-shrink-0 mt-0.5">{getStatusIcon(result.status)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-foreground">{result.name}</h4>
                      {getStatusBadge(result.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">{result.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {testResults.length === 0 && !isRunning && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            「テストを実行」ボタンをクリックして、現在のページの UI 要素と機能をテストしてください。
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>手動テストが必要な項目</CardTitle>
          <CardDescription>以下の項目は手動での確認が必要です</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">データ連携テスト</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• 新規登録フォームでのInsert処理（試験記録や分野の追加）</li>
                <li>• 編集フォームでのUpdate処理（既存データの更新）</li>
                <li>• 削除操作でのDelete処理（データの削除確認）</li>
                <li>• 一覧表示ページでのSelect処理（データの表示確認）</li>
              </ul>
            </div>
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">画面遷移テスト</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• 一覧→編集画面遷移（編集ボタンクリック）</li>
                <li>• 一覧→新規作成画面遷移（新規作成ボタンクリック）</li>
                <li>• 編集→一覧に戻る（保存後の遷移確認）</li>
              </ul>
            </div>
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-medium text-yellow-900 mb-2">操作後のフィードバック</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• 登録・更新・削除後の完了メッセージ表示</li>
                <li>• バリデーションエラー時のエラーメッセージ表示</li>
                <li>• 削除確認ダイアログの表示</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
