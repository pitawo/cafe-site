import { useState } from 'react';
import { useShop } from '../context/ShopContext';
import latte from '../assets/menu/latte.webp';
import cappuccino from '../assets/menu/cappuccino.webp';
import macchiato from '../assets/menu/macchiato.webp';
import coldBrew from '../assets/menu/cold-brew.webp';
import matcha from '../assets/menu/matcha.webp';
import icedCoffee from '../assets/menu/iced-coffee.webp';
import shortcake from '../assets/menu/shortcake.svg';
import cheesecake from '../assets/menu/cheesecake.svg';
import pancake from '../assets/menu/pancake.svg';
import croissant from '../assets/menu/croissant.svg';
import muffin from '../assets/menu/muffin.svg';
import chocolateCake from '../assets/menu/chocolate-cake.svg';
import { formatYen } from '../utils/currency';

// ドリンクは S を基準額とし、M は +50円、L は +100円。
const SIZES = ['S', 'M', 'L'];
const SIZE_DELTA = { S: 0, M: 50, L: 100 };

const DRINKS = [
    { id: 1, name: 'カフェラテ', price: 450, description: 'リッチなエスプレッソにスチームミルクを合わせました', image: latte },
    { id: 2, name: 'カプチーノ', price: 450, description: 'エスプレッソにスチームミルクとフォームをのせて', image: cappuccino },
    { id: 3, name: 'キャラメルマキアート', price: 525, description: 'エスプレッソにバニラシロップとキャラメルソースを添えて', image: macchiato },
    { id: 4, name: 'コールドブリュー', price: 400, description: 'じっくり水出しした、すっきりとした味わい', image: coldBrew },
    { id: 5, name: '抹茶ラテ', price: 550, description: 'なめらかでクリーミーな抹茶ラテ', image: matcha },
    { id: 6, name: 'アイスコーヒー', price: 350, description: '淹れたてを氷でキリッと冷やして', image: icedCoffee },
];

// お菓子系は実写写真を用意できないため、線画の SVG イラストを使用（フリー素材は不使用）。
const SWEETS = [
    { id: 7, name: 'ショートケーキ', price: 480, description: '苺と生クリームの定番ショートケーキ', image: shortcake },
    { id: 8, name: 'ニューヨークチーズケーキ', price: 520, description: '濃厚でなめらかなニューヨークスタイル', image: cheesecake },
    { id: 9, name: 'パンケーキ', price: 580, description: 'ふわふわ生地にメープルシロップを添えて', image: pancake },
    { id: 10, name: 'クロワッサン', price: 320, description: 'サクサク食感とバターの香り', image: croissant },
    { id: 11, name: 'ブルーベリーマフィン', price: 380, description: 'ブルーベリーがたっぷり入った素朴な味わい', image: muffin },
    { id: 12, name: 'ガトーショコラ', price: 500, description: 'しっとり濃厚なチョコレートケーキ', image: chocolateCake },
];

const cardStyle = {
    border: '1px solid var(--color-border)',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: 'var(--shadow-sm)',
};

const DrinkCard = ({ product, size, onSizeChange, onAdd }) => {
    const price = product.price + SIZE_DELTA[size];

    return (
        <div style={cardStyle}>
            <img src={product.image} alt={product.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
            <div style={{ padding: 'var(--spacing-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-sm)' }}>
                    <h3 style={{ fontSize: '1.25rem' }}>{product.name}</h3>
                    <span style={{ fontWeight: 'bold' }}>{formatYen(price)}</span>
                </div>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-md)', minHeight: '3rem' }}>
                    {product.description}
                </p>

                <div role="group" aria-label={`${product.name}のサイズを選ぶ`} style={{ display: 'flex', gap: '0.5rem', marginBottom: 'var(--spacing-md)' }}>
                    {SIZES.map((s) => (
                        <button
                            key={s}
                            type="button"
                            aria-pressed={size === s}
                            onClick={() => onSizeChange(product.id, s)}
                            style={{
                                flex: 1,
                                padding: '0.4rem 0',
                                borderRadius: '6px',
                                border: `1px solid var(--color-brand-primary)`,
                                backgroundColor: size === s ? 'var(--color-brand-primary)' : 'transparent',
                                color: size === s ? 'white' : 'var(--color-brand-primary)',
                                fontWeight: 600,
                            }}
                        >
                            {s}
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => onAdd(product, size, price)}
                    className="btn btn-outline"
                    style={{ width: '100%' }}
                >
                    カートに追加
                </button>
            </div>
        </div>
    );
};

const SweetCard = ({ product, onAdd }) => (
    <div style={cardStyle}>
        <img src={product.image} alt={product.name} style={{ width: '100%', height: '200px', objectFit: 'contain', backgroundColor: 'var(--color-bg-secondary)' }} />
        <div style={{ padding: 'var(--spacing-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-sm)' }}>
                <h3 style={{ fontSize: '1.25rem' }}>{product.name}</h3>
                <span style={{ fontWeight: 'bold' }}>{formatYen(product.price)}</span>
            </div>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-md)', minHeight: '3rem' }}>
                {product.description}
            </p>
            <button
                onClick={() => onAdd(product)}
                className="btn btn-outline"
                style={{ width: '100%' }}
            >
                カートに追加
            </button>
        </div>
    </div>
);

const Menu = () => {
    const { addToCart } = useShop();
    const [sizes, setSizes] = useState(() =>
        Object.fromEntries(DRINKS.map((d) => [d.id, 'M']))
    );

    const handleSizeChange = (productId, size) => {
        setSizes((prev) => ({ ...prev, [productId]: size }));
    };

    const handleAddDrink = (product, size, price) => {
        addToCart({
            id: `drink-${product.id}-${size}`,
            name: `${product.name}（${size}）`,
            price,
            image: product.image,
        });
    };

    const handleAddSweet = (product) => {
        addToCart({
            id: `sweet-${product.id}`,
            name: product.name,
            price: product.price,
            image: product.image,
        });
    };

    return (
        <div className="container" style={{ padding: 'var(--spacing-lg) 0' }}>
            <h1 className="text-center" style={{ marginBottom: 'var(--spacing-lg)' }}>メニュー</h1>

            <h2 style={{ marginBottom: 'var(--spacing-md)' }}>ドリンク</h2>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: 'var(--spacing-lg)',
                marginBottom: 'var(--spacing-xl)',
            }}>
                {DRINKS.map((product) => (
                    <DrinkCard
                        key={product.id}
                        product={product}
                        size={sizes[product.id]}
                        onSizeChange={handleSizeChange}
                        onAdd={handleAddDrink}
                    />
                ))}
            </div>

            <h2 style={{ marginBottom: 'var(--spacing-md)' }}>スイーツ・フード</h2>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: 'var(--spacing-lg)',
            }}>
                {SWEETS.map((product) => (
                    <SweetCard key={product.id} product={product} onAdd={handleAddSweet} />
                ))}
            </div>
        </div>
    );
};

export default Menu;
