import { useShop } from '../context/ShopContext';

const PRODUCTS = [
    { id: 1, name: 'Caffe Latte', price: 4.50, description: 'Rich espresso with steamed milk', image: 'https://placehold.co/300x200?text=Latte' },
    { id: 2, name: 'Cappuccino', price: 4.50, description: 'Espresso with steamed milk and foam', image: 'https://placehold.co/300x200?text=Cappuccino' },
    { id: 3, name: 'Caramel Macchiato', price: 5.25, description: 'Espresso, vanilla syrup, and caramel drizzle', image: 'https://placehold.co/300x200?text=Macchiato' },
    { id: 4, name: 'Cold Brew', price: 4.00, description: 'Slow-steeped cool coffee', image: 'https://placehold.co/300x200?text=Cold+Brew' },
    { id: 5, name: 'Matcha Green Tea Latte', price: 5.50, description: 'Smooth and creamy matcha', image: 'https://placehold.co/300x200?text=Matcha' },
    { id: 6, name: 'Iced Coffee', price: 3.50, description: 'Freshly brewed and served over ice', image: 'https://placehold.co/300x200?text=Iced+Coffee' },
];

const Menu = () => {
    const { addToCart } = useShop();

    return (
        <div className="container" style={{ padding: 'var(--spacing-lg) 0' }}>
            <h1 className="text-center" style={{ marginBottom: 'var(--spacing-lg)' }}>Our Menu</h1>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: 'var(--spacing-lg)'
            }}>
                {PRODUCTS.map((product) => (
                    <div key={product.id} style={{
                        border: '1px solid var(--color-border)',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        boxShadow: 'var(--shadow-sm)'
                    }}>
                        <img src={product.image} alt={product.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                        <div style={{ padding: 'var(--spacing-md)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-sm)' }}>
                                <h3 style={{ fontSize: '1.25rem' }}>{product.name}</h3>
                                <span style={{ fontWeight: 'bold' }}>${product.price.toFixed(2)}</span>
                            </div>
                            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-md)', minHeight: '3rem' }}>
                                {product.description}
                            </p>
                            <button
                                onClick={() => addToCart(product)}
                                className="btn btn-outline"
                                style={{ width: '100%' }}
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Menu;
