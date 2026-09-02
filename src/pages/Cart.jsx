import { useShop } from '../context/ShopContext';
import { Link } from 'react-router-dom';
import { formatYen } from '../utils/currency';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, cartTotal } = useShop();

    if (cartItems.length === 0) {
        return (
            <div className="container text-center" style={{ padding: 'var(--spacing-xl) 0' }}>
                <h1>カートに商品がありません</h1>
                <Link to="/menu" className="btn btn-primary mt-4">メニューを見る</Link>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: 'var(--spacing-lg) 0' }}>
            <h1>カート</h1>
            <div style={{ marginTop: 'var(--spacing-md)' }}>
                {cartItems.map((item) => (
                    <div key={item.id} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: 'var(--spacing-md)',
                        borderBottom: '1px solid var(--color-border)'
                    }}>
                        <div>
                            <h3>{item.name}</h3>
                            <p>{formatYen(item.price)}</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                            <button
                                onClick={() => updateQuantity(item.id, -1)}
                                style={{ padding: '0.25rem 0.5rem', border: '1px solid #ccc' }}
                            >-</button>
                            <span>{item.quantity}</span>
                            <button
                                onClick={() => updateQuantity(item.id, 1)}
                                style={{ padding: '0.25rem 0.5rem', border: '1px solid #ccc' }}
                            >+</button>
                            <button
                                onClick={() => removeFromCart(item.id)}
                                style={{ marginLeft: 'var(--spacing-md)', color: 'red' }}
                            >削除</button>
                        </div>
                    </div>
                ))}
                <div style={{ marginTop: 'var(--spacing-lg)', textAlign: 'right' }}>
                    <h2>合計: {formatYen(cartTotal)}</h2>
                    <Link to="/checkout" className="btn btn-primary mt-4">お支払いへ進む</Link>
                </div>
            </div>
        </div>
    );
};

export default Cart;
