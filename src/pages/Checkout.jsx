import { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { formatYen } from '../utils/currency';
import { generateOrderNumber } from '../utils/orderNumber';

// 決済フォームに最初から入れておくダミー。
// 訪問者が実在のカード番号を打ち込む余地をなくすため、入力欄は読み取り専用にする。
const DEMO_CARD = {
    number: '4242 4242 4242 4242',
    holder: 'CAFE SITE DEMO',
    expiry: '12 / 30',
    cvc: '123',
};

const Checkout = () => {
    const { cartItems, cartTotal, clearCart } = useShop();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: user?.name && user.name !== 'ゲスト' ? user.name : '',
        method: 'pickup',
        note: '',
    });
    const [processing, setProcessing] = useState(false);

    if (cartItems.length === 0) {
        return (
            <div className="container" style={{ maxWidth: '640px', padding: 'var(--spacing-lg) 0' }}>
                <h1>お支払い</h1>
                <p>カートに商品がありません。</p>
                <Link to="/menu" className="btn btn-primary">メニューを見る</Link>
            </div>
        );
    }

    // 消費税は円未満を切り捨て（一般的な税額計算の端数処理に合わせる）
    const tax = Math.floor(cartTotal * 0.1);
    const shipping = form.method === 'delivery' ? 300 : 0;
    const total = cartTotal + tax + shipping;

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);
        const orderNumber = generateOrderNumber();
        // 決済にかかる待ち時間を再現する。外部への通信はしていない
        setTimeout(() => {
            clearCart();
            navigate('/success', {
                state: { name: form.name, method: form.method, total, orderNumber },
            });
        }, 1400);
    };

    const row = { display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0' };
    const field = { display: 'flex', flexDirection: 'column', gap: '0.35rem' };
    const input = { padding: '0.75rem', width: '100%', boxSizing: 'border-box' };
    const readonly = { ...input, backgroundColor: 'var(--color-bg-secondary)', color: 'var(--color-text-secondary)' };
    const card = {
        border: '1px solid var(--color-border)',
        borderRadius: '8px',
        padding: 'var(--spacing-md)',
        marginBottom: 'var(--spacing-md)',
    };

    return (
        <div className="container" style={{ maxWidth: '640px', padding: 'var(--spacing-lg) 0' }}>
            <h1>お支払い</h1>

            <p className="notice">
                <strong>これはデモです。実際の決済は行われません。</strong>
                カード情報はデモ用の値が入力済みで、変更できないようにしてあります。
                入力した内容がブラウザの外に送られることはありません。
            </p>

            <section style={card}>
                <h2 style={{ fontSize: '1rem', marginTop: 0 }}>ご注文内容</h2>
                {cartItems.map((item) => (
                    <div key={item.id} style={row}>
                        <span>{item.name} × {item.quantity}</span>
                        <span>{formatYen(item.price * item.quantity)}</span>
                    </div>
                ))}
                <hr style={{ border: 0, borderTop: '1px solid var(--color-border)', margin: '0.6rem 0' }} />
                <div style={row}><span>小計</span><span>{formatYen(cartTotal)}</span></div>
                <div style={row}><span>消費税（10%）</span><span>{formatYen(tax)}</span></div>
                <div style={row}>
                    <span>配送料</span>
                    <span>{shipping === 0 ? '無料（店頭受け取り）' : formatYen(shipping)}</span>
                </div>
                <hr style={{ border: 0, borderTop: '1px solid var(--color-border)', margin: '0.6rem 0' }} />
                <div style={{ ...row, fontWeight: 700, fontSize: '1.05rem' }}>
                    <span>合計</span><span>{formatYen(total)}</span>
                </div>
            </section>

            <form onSubmit={handleSubmit}>
                <section style={card}>
                    <h2 style={{ fontSize: '1rem', marginTop: 0 }}>お受け取り</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                        <label style={field}>
                            お名前
                            <input
                                type="text"
                                required
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                style={input}
                            />
                        </label>
                        <label style={field}>
                            受け取り方法
                            <select
                                value={form.method}
                                onChange={(e) => setForm({ ...form, method: e.target.value })}
                                style={input}
                            >
                                <option value="pickup">店頭で受け取る（配送料無料）</option>
                                <option value="delivery">配達してもらう（+¥300）</option>
                            </select>
                        </label>
                        <label style={field}>
                            ご要望（任意）
                            <textarea
                                rows={2}
                                value={form.note}
                                onChange={(e) => setForm({ ...form, note: e.target.value })}
                                style={input}
                            />
                        </label>
                    </div>
                </section>

                <section style={card}>
                    <h2 style={{ fontSize: '1rem', marginTop: 0 }}>お支払い方法</h2>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: 0 }}>
                        デモ用のカード情報が入力済みです（編集できません）
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                        <label style={field}>
                            カード番号
                            <input type="text" value={DEMO_CARD.number} readOnly aria-readonly="true" style={readonly} />
                        </label>
                        <label style={field}>
                            カード名義
                            <input type="text" value={DEMO_CARD.holder} readOnly aria-readonly="true" style={readonly} />
                        </label>
                        <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                            <label style={{ ...field, flex: 1 }}>
                                有効期限
                                <input type="text" value={DEMO_CARD.expiry} readOnly aria-readonly="true" style={readonly} />
                            </label>
                            <label style={{ ...field, flex: 1 }}>
                                セキュリティコード
                                <input type="text" value={DEMO_CARD.cvc} readOnly aria-readonly="true" style={readonly} />
                            </label>
                        </div>
                    </div>
                </section>

                <button type="submit" className="btn btn-primary" disabled={processing} style={{ width: '100%' }}>
                    {processing ? '決済処理中…' : `${formatYen(total)} を支払う`}
                </button>
            </form>
        </div>
    );
};

export default Checkout;
