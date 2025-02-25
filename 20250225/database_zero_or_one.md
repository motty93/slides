---
marp: true
theme: "https://cunhapaulo.github.io/style/freud.css"
header: "DBにおける0と1"
footer: "performed by @motty93"
pagenate: true
---

# DBにおける0と1
### ～ 文字列型フラグのアンチパターンとは？ ～


---

## 自己紹介
<style>
.self-intro {
  display: flex;
  align-items: center;
  gap: 20px;
}

.self-intro img {
  width: 250px;
  border-radius: 50%;
}
</style>

<div class="self-intro">
  <img src="./profile.jpg" alt="profile image">
  <div>
    <ul>
      <li><strong>名前:</strong> sasamoto takumi</li>
      <li><strong>会社:</strong> and roots株式会社</li>
      <li><strong>所属:</strong> GrowthHack 基盤チーム</li>
      <li><strong>職業:</strong> Webエンジニア</li>
      <li><strong>得意分野:</strong> バックエンド開発, インフラ構築</li>
      <li><strong>趣味:</strong> ゲーム, 個人開発, 筋トレ, ギター</li>
      <li><strong>GitHub:</strong> <a href="https://github.com/motty93">motty93</a></li>
    </ul>
  </div>
</div>



---

## 今日の内容

1. 0と1フラグとは？
2. 何が問題なのか？
3. より良い設計方法
4. 発展内容
5. まとめ


---

## 0 or 1 フラグとは？
- **データベースで「はい・いいえ」を表現するためのフラグ**
- よくある例:
    - `is_active`: アカウントが有効かどうか
    - `is_deleted`: 削除されたかどうか
    - `is_admin`: 管理者権限を持っているかどうか

```sql
CREATE TABLE users (
    id INT PRIMARY KEY,
    name VARCHAR(255),
    is_active TINYINT(1) -- 0 = false, 1 = true
);
```

**このフラグを「文字列」で管理すると次の問題が発生**

---

## 何が問題なのか？
### 🚨 1. ストレージ効率が悪い
- `CHAR(1)`（`"0"` / `"1"`）や `VARCHAR(3)` (`"yes"` / `"no"`) でフラグを管理するケースがある
- しかし、 **`TINYINT(1)` or `BOOLEAN` で済むデータより無駄な容量を使う**
- **大量データの検索・処理が遅くなる**

```sql
SELECT * FROM users WHERE is_active = 'yes';
```

**-> `TINYINT(1)` or `BOOLEAN`ならインデックスを使える**


---

## 何が問題なのか？
### 🚨 1. ストレージ効率が悪い

**BigQueryはスキャンしたデータ量で課金されるため、無駄なストレージ消費はコスト増につながるので注意！！！！！**
#### ちなみに…
- MySQL: `TINYINT(1)`型 (8ビット / 1バイト)
- PostgreSQL: `BOOLEAN`型 (1ビット)
- BigQuery: `BOOL`型 (1ビット)

---

## 何が問題なのか？
### 🚨 2. クエリのパフォーマンス低下
- 数値 (`0, 1`) は **比較が速い** が、文字列 (`'yes'`, `'no'`) は **遅い**
- **異なるフォーマット（大文字・小文字）での入力ミスが発生**
  - `"YES"` / `"yes"` / `"Yes"` など **表記揺れの問題**

```sql
SELECT * FROM users WHERE is_active = 'YES';
```

**→ `'YES'` と `'yes'` を区別するかどうかは DB の設定次第でバグのもと！**

---

## 何が問題なのか？
### 🚨 3. データの整合性が崩れる
- `VARCHAR(3)` で `"yes"` / `"no"` を想定していても、誤ったデータが入ることがある
- **例: `"y"`, `"n"`, `"true"`, `"1"` などのバリエーション**
- **DB の整合性を保ちにくい**

```sql
INSERT INTO users (name, is_active) VALUES ('Alice', 'active');
```

**→ `ENUM('yes', 'no')` で制限をかけるか、数値型を使うべき！**

---

## より良い設計の方法
### ① `BOOLEAN` / `TINYINT(1)` を使う
- **最もシンプルでパフォーマンスが良い方法**

```sql
CREATE TABLE users (
    id INT PRIMARY KEY,
    name VARCHAR(255),
    is_active TINYINT(1) NOT NULL DEFAULT 1
);
```

- `0 = false`, `1 = true` のみ許可される
- **ストレージ効率も良く、クエリが最適化される**

---

## より良い設計の方法
### ② `ENUM` を使う
- **文字列を使いたいなら `ENUM` で明示的に管理**

```sql
CREATE TABLE users (
    id INT PRIMARY KEY,
    name VARCHAR(255),
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active'
);
```

- **許容する値を固定し、表記揺れを防ぐ**
- **データの整合性を維持しやすい**

---

## まとめ
✅ **文字列型フラグはストレージ効率・パフォーマンスが悪い**
✅ **`BOOLEAN` / `TINYINT(1)` の方が整合性を保ちやすい**
✅ **どうしても文字列を使うなら `ENUM` を活用**
✅ **DB 設計では、データの型を慎重に選ぼう！**

---

## ご清聴ありがとうございました！
<style>
.center {
display: flex;
justify-content: center;
align-items: center;
height: 48vh;
}

.center img {
width: 600px;
}
</style>

<div class="center">
    <img src="./qr.png" alt="qr code">
</div>
