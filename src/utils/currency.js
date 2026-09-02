// 表示用の円フォーマット。小数は出さない（このデモの価格はすべて円の整数値）。
export const formatYen = (amount) => `¥${Math.round(amount).toLocaleString('ja-JP')}`;
