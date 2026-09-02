// デモ用の受付番号を発行する。外部との通信はせず、日付＋乱数のみで組み立てる。
export const generateOrderNumber = () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    const rand = Math.floor(Math.random() * 9000) + 1000; // 4桁
    return `DEMO-${y}${m}${d}-${rand}`;
};
