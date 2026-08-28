import { useShop } from '../context/ShopContext';
import { Link } from 'react-router-dom';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, cartTotal } = useShop();

    if (cartItems.length === 0) {
        return (
            <div className="container text-center" style={{ padding: 'var(--spacing-xl) 0' }}>
                <h1>Your Cart is Empty</h1>
                <Link to="/menu" className="btn btn-primary mt-4">Browse Menu</Link>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: 'var(--spacing-lg) 0' }}>
            <h1>Your Cart</h1>
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
                            <p>${item.price.toFixed(2)}</p>
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
                            >Remove</button>
                        </div>
                    </div>
                ))}
                <div style={{ marginTop: 'var(--spacing-lg)', textAlign: 'right' }}>
                    <h2>Total: ${cartTotal.toFixed(2)}</h2>
                    <Link to="/checkout" className="btn btn-primary mt-4">Proceed to Checkout</Link>
                </div>
            </div>
        </div>
    );
};

export default Cart;
