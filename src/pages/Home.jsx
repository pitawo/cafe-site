import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="home-page">
            <section className="hero" style={{
                backgroundColor: 'var(--color-brand-dark)',
                color: 'white',
                padding: 'var(--spacing-xl) var(--spacing-md)',
                textAlign: 'center'
            }}>
                <h1 style={{ fontSize: 'var(--font-size-3xl)', marginBottom: 'var(--spacing-md)' }}>
                    Welcome to Cafe Site
                </h1>
                <p style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--spacing-lg)' }}>
                    Premium coffee, delivered to your screen.
                </p>
                <Link to="/menu" className="btn btn-primary" style={{
                    backgroundColor: 'white',
                    color: 'var(--color-brand-primary)'
                }}>
                    Order Now
                </Link>
            </section>
        </div>
    );
};

export default Home;
