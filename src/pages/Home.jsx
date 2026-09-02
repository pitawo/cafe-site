import { Link } from 'react-router-dom';
import storefront from '../assets/storefront.webp';

// お知らせ・営業時間はすべて架空のデモ用データ。実在の店舗の情報ではない。
const NEWS = [
    { date: '2026-08-25', text: '秋の新作、パンケーキとガトーショコラをメニューに追加しました。' },
    { date: '2026-08-10', text: '店内Wi-Fiを増強し、より快適にご利用いただけるようになりました。' },
    { date: '2026-07-01', text: '土日祝の営業時間を 9:00〜19:00 に変更しました。' },
];

const Home = () => {
    return (
        <div className="home-page">
            <section
                className="hero"
                style={{
                    position: 'relative',
                    color: 'white',
                    padding: 'calc(var(--spacing-xl) * 1.5) var(--spacing-md)',
                    textAlign: 'center',
                    backgroundImage: `url(${storefront})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center 60%',
                }}
            >
                {/* 写真の上に文字を置くため、暗い膜を挟んで読めるようにする */}
                <div
                    aria-hidden="true"
                    style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to bottom, rgba(30,57,50,0.72), rgba(30,57,50,0.45))',
                    }}
                />
                <div style={{ position: 'relative' }}>
                    <h1 style={{ fontSize: 'var(--font-size-3xl)', marginBottom: 'var(--spacing-md)' }}>
                        カフェサイトへようこそ
                    </h1>
                    <p style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--spacing-lg)' }}>
                        厳選豆のコーヒーと自家製スイーツを、画面の向こうからお届けします。
                    </p>
                    <Link
                        to="/menu"
                        className="btn btn-primary"
                        style={{ backgroundColor: 'white', color: 'var(--color-brand-primary)' }}
                    >
                        メニューを見る
                    </Link>
                </div>
            </section>

            <div className="container" style={{ padding: 'var(--spacing-lg) 0' }}>
                <p className="notice" style={{ marginBottom: 'var(--spacing-lg)' }}>
                    このサイトはポートフォリオ用のデモです。実在のカフェ・店舗ではありません。
                    以下のお知らせ・営業時間もすべて架空の内容です。
                </p>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: 'var(--spacing-lg)',
                }}>
                    <section>
                        <h2 style={{ fontSize: 'var(--font-size-xl)', marginBottom: 'var(--spacing-md)' }}>
                            お知らせ
                        </h2>
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                            {NEWS.map((item) => (
                                <li key={item.date} style={{
                                    padding: 'var(--spacing-sm) 0',
                                    borderBottom: '1px solid var(--color-border)',
                                }}>
                                    <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginRight: 'var(--spacing-sm)' }}>
                                        {item.date}
                                    </span>
                                    {item.text}
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section>
                        <h2 style={{ fontSize: 'var(--font-size-xl)', marginBottom: 'var(--spacing-md)' }}>
                            営業時間
                        </h2>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <tbody>
                                <tr>
                                    <td style={{ padding: 'var(--spacing-sm) 0', borderBottom: '1px solid var(--color-border)' }}>平日（月〜金）</td>
                                    <td style={{ padding: 'var(--spacing-sm) 0', borderBottom: '1px solid var(--color-border)', textAlign: 'right' }}>8:00〜20:00</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: 'var(--spacing-sm) 0', borderBottom: '1px solid var(--color-border)' }}>土日祝</td>
                                    <td style={{ padding: 'var(--spacing-sm) 0', borderBottom: '1px solid var(--color-border)', textAlign: 'right' }}>9:00〜19:00</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: 'var(--spacing-sm) 0' }}>定休日</td>
                                    <td style={{ padding: 'var(--spacing-sm) 0', textAlign: 'right' }}>毎週水曜日</td>
                                </tr>
                            </tbody>
                        </table>
                        <p style={{ marginTop: 'var(--spacing-md)', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                            ※ デモ表示用の架空の営業時間です。
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Home;
