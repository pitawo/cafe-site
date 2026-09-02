import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useShop } from '../context/ShopContext';

// カートに1点以上入っているときだけ、画面右下に固定で出す丸いボタン。
// スクロールしても位置が動かないよう position: fixed を使う。
const FloatingCartButton = () => {
    const { cartCount } = useShop();
    const { pathname } = useLocation();

    if (cartCount <= 0) return null;
    if (pathname === '/cart') return null; // カート画面では出す意味がないので隠す

    return (
        <Link
            to="/cart"
            aria-label={`カートを見る（${cartCount}点）`}
            style={{
                position: 'fixed',
                right: '1.5rem',
                bottom: '1.5rem',
                zIndex: 200,
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-brand-primary)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-lg)',
            }}
        >
            <ShoppingBag size={26} aria-hidden="true" />
            <span
                style={{
                    position: 'absolute',
                    top: -4,
                    right: -4,
                    backgroundColor: 'var(--color-brand-accent)',
                    color: 'white',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    borderRadius: '50%',
                    minWidth: '20px',
                    height: '20px',
                    padding: '0 4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {cartCount}
            </span>
        </Link>
    );
};

export default FloatingCartButton;
