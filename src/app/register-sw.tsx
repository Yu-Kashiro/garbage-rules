"use client";

import { useEffect } from "react";

// サービスワーカーを登録するコンポーネント
export function RegisterServiceWorker() {
  useEffect(() => {
    // ブラウザがサービスワーカーに対応しているか確認
    if ("serviceWorker" in navigator) {
      // ページが完全に読み込まれた後に登録
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log(
              "✅ サービスワーカーの登録に成功しました:",
              registration
            );
          })
          .catch((error) => {
            console.log("❌ サービスワーカーの登録に失敗しました:", error);
          });
      });
    } else {
      console.log("このブラウザはサービスワーカーに対応していません");
    }
  }, []);

  // このコンポーネントは何も表示しません
  return null;
}
