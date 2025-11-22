// 都市名に関する設定値を一元管理します。
// 公開して問題ない表示用値なので NEXT_PUBLIC_ プレフィックスの環境変数を利用します。
// .env.local などに NEXT_PUBLIC_CITY_NAME="あなたの市名" を設定してください。
export const CITY_NAME = process.env.NEXT_PUBLIC_CITY_NAME || "〇〇市";

export const CITY_TITLE = `${CITY_NAME}のごみ分別方法`;
export const CITY_OFFICE_NAME = `${CITY_NAME}役所`;
export const CITY_DESCRIPTION = `${CITY_NAME}のごみ分別方法を掲載しています。`;
