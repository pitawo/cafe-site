import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Login from './pages/Login';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Success from './pages/Success';

function App() {
  return (
    <div className="app">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/success" element={<Success />} />
        </Routes>
      </main>
      <footer style={{
        textAlign: 'center',
        padding: '2rem',
        marginTop: '4rem',
        borderTop: '1px solid var(--color-border)',
        fontSize: '0.875rem',
        color: 'var(--color-text-secondary)'
      }}>
        © 2025 Cafe Site. All rights reserved.
      </footer>
    </div>
  );
}

export default App;
