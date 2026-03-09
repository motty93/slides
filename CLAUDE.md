# CLAUDE.md

## プロジェクト概要

Marp を使った LT スライドのリポジトリ。

## 技術スタック

- Marp CLI（スライド生成）
- Cloudflare Pages（ホスティング）

## コマンド

```bash
# スライドのHTMLビルド（全ディレクトリ一括）
npm run build

# ビルド + Cloudflare Pages にデプロイ
npm run deploy
```

## デプロイ先

- URL: https://slides.motty93.com
- 例: https://slides.motty93.com/20260310/approve-claude-code-by-smart-watch.html

## ディレクトリ構成

- `20YYMMDD/` — 日付ごとのスライドディレクトリ
- 各ディレクトリに `.md`（Marp ソース）と `.html`（ビルド成果物）を配置
