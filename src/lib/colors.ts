export const PREDEFINED_COLORS = [
  { name: "赤", value: "#EF4444", lightBg: "#FEE2E2" },
  { name: "オレンジ", value: "#F97316", lightBg: "#FFEDD5" },
  { name: "緑", value: "#16A34A", lightBg: "#DCFCE7" },
  { name: "青", value: "#3B82F6", lightBg: "#DBEAFE" },
  { name: "紫", value: "#A855F7", lightBg: "#F3E8FF" },
  { name: "グレー", value: "#808080", lightBg: "#F3F4F6" },
  { name: "茶色", value: "#92400E", lightBg: "#FEF3C7" },
] as const;

export type ColorValue = (typeof PREDEFINED_COLORS)[number]["value"];

/**
 * カラーコードから色情報を取得
 */
export function getColorInfo(colorValue: string) {
  return PREDEFINED_COLORS.find((c) => c.value === colorValue);
}

/**
 * カラーコードが定義済みの色かどうかを検証
 */
export function isValidColor(colorValue: string): boolean {
  return PREDEFINED_COLORS.some((c) => c.value === colorValue);
}
