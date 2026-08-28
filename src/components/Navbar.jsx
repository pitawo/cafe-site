import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import { ShoppingBag, User, Coffee } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cartCount } = useShop();

    return (
        <nav style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem 2rem',
            backgroundColor: 'white',
            boxShadow: 'var(--shadow-sm)',
            position: 'sticky',
            top: 0,
            zIndex: 100
        }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-brand-primary)' }}>
                <Coffee size={24} />
                <span>Cafe Site</span>
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                    <Link to="/" style={{ fontWeight: 500 }}>Home</Link>
                    <Link to="/menu" style={{ fontWeight: 500 }}>Menu</Link>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link to="/cart" aria-label={`カート${cartCount > 0 ? `（${cartCount}点）` : ''}`} style={{ position: 'relative' }}>
                        <ShoppingBag size={24} aria-hidden="true" />
                        {cartCount > 0 && (
                            <span style={{
                                position: 'absolute',
                                top: -8,
                                right: -8,
                                backgroundColor: 'var(--color-brand-accent)',
                                color: 'white',
                                fontSize: '0.75rem',
                                borderRadius: '50%',
                                width: '18px',
                                height: '18px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {user ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <User size={24} />
                            <span style={{ fontSize: '0.875rem' }}>{user.name}</span>
                            <button onClick={logout} className="btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
                            Sign In
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
