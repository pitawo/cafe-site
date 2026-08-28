import { Link } from 'react-router-dom';
import storefront from '../assets/storefront.webp';

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
                        Welcome to Cafe Site
                    </h1>
                    <p style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--spacing-lg)' }}>
                        Premium coffee, delivered to your screen.
                    </p>
                    <Link
                        to="/menu"
                        className="btn btn-primary"
                        style={{ backgroundColor: 'white', color: 'var(--color-brand-primary)' }}
                    >
                        Order Now
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
