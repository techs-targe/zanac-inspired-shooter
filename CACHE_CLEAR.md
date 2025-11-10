# ブラウザキャッシュを完全にクリアする方法

## 🔥 最も確実な方法（推奨）

### 方法1: シークレット/プライベートモードで開く
```
Chrome: Ctrl + Shift + N (Windows) / Cmd + Shift + N (Mac)
Firefox: Ctrl + Shift + P (Windows) / Cmd + Shift + P (Mac)
```
→ 新しいシークレットウィンドウで `http://localhost:8000` を開く

---

## ⚡ 開発者ツールを使う方法

### Chrome / Edge
1. **F12** を押して開発者ツールを開く
2. **開発者ツールを開いたまま** ページを右クリック（または更新ボタンを右クリック）
3. 「**キャッシュの消去とハード再読み込み**」を選択

または：
1. **F12** → **Network** タブ
2. **Disable cache** にチェック ✅
3. **Ctrl + Shift + R** で強制リロード

### Firefox
1. **F12** を押して開発者ツールを開く
2. **Network** タブ
3. 歯車アイコン → **Disable Cache** にチェック ✅
4. **Ctrl + Shift + R** で強制リロード

---

## 🧹 ブラウザキャッシュを完全削除

### Chrome
1. **Ctrl + Shift + Delete**
2. 「**期間**」を「**全期間**」に設定
3. 「**キャッシュされた画像とファイル**」にチェック ✅
4. 「**データを削除**」

### Firefox
1. **Ctrl + Shift + Delete**
2. 「**期間**」を「**すべて**」に設定
3. 「**キャッシュ**」にチェック ✅
4. 「**今すぐ消去**」

---

## 📝 サービスワーカーをクリア（該当する場合）

### Chrome / Edge
1. **F12** → **Application** タブ
2. 左メニューの **Service Workers**
3. **Unregister** をクリック
4. ページをリロード

### Firefox
1. **F12** → **Storage** タブ
2. **Service Workers** を右クリック
3. **Delete All** を選択

---

## 🚀 ローカルサーバの起動方法

```bash
# Python 3 (推奨)
cd /home/takayukigushiken/project/znk
python3 -m http.server 8000

# または Node.js
npx http-server -p 8000
```

ブラウザで開く: `http://localhost:8000`

---

## ✅ 変更が反映されているか確認

1. **F12** → **Network** タブ
2. ページをリロード
3. `bullet.js` をクリック
4. **Query String Parameters** に `t=1731251200` が表示されることを確認
5. **Response** タブで `teardrop` という文字列が含まれることを確認

---

## 🔴 それでも反映されない場合

```bash
# ファイルが正しく更新されているか確認
grep "teardrop" /home/takayukigushiken/project/znk/bullet.js

# 期待される結果:
# // Calculate angle based on velocity for teardrop direction
# // Main body - teardrop shape (水滴型)
# // Highlight on teardrop
```

→ これらが表示されればファイルは正しい
→ 表示されない場合は git pull してファイルを再取得
