/**
 * カテゴリごとにBadgeのスタイルを返すヘルパー関数
 */
export const getCategoryStyle = (category: string) => {
  // 可燃ごみ
  if (category === "可燃ごみ") {
    return { variant: "outline" as const, className: "border-red-500" };
  }

  // 破砕ごみ
  if (category === "破砕ごみ") {
    return { variant: "outline" as const, className: "border-blue-500" };
  }

  // ペットボトル
  if (category === "ペットボトル") {
    return {
      variant: "outline" as const,
      className: "border-blue-500",
    };
  }

  // 粗大ごみ指定品目
  if (category === "粗大ごみ指定品目") {
    return {
      variant: "outline" as const,
      className: "border-purple-500",
    };
  }

  // 資源物系
  if (category.startsWith("資源物")) {
    return {
      variant: "outline" as const,
      className: "border-green-600",
    };
  }

  // 市では収集しません・処理しません
  if (category.includes("市では収集") || category.includes("市では") || category.includes("処理しません")) {
    return { variant: "outline" as const, className: "border-gray-400" };
  }

  // デフォルト
  return { variant: "outline" as const, className: "border-gray-500" };
};
