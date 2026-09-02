import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    // サインイン前にいた画面に戻す。直接 /login を開いた場合はトップへ。
    // 「サインインしたら自動でメニューに飛ぶ」動きはしない。
    const from = location.state?.from || '/';

    // 入力は任意。空のままでも進める（デモの流れを止めないため）
    const handleSubmit = (e) => {
        e.preventDefault();
        login(email);
        navigate(from, { replace: true });
    };

    return (
        <div className="container" style={{ maxWidth: '400px', marginTop: 'var(--spacing-xl)' }}>
            <h1>サインイン</h1>

            <p className="notice" style={{ marginBottom: 'var(--spacing-md)' }}>
                デモのため<strong>入力は任意</strong>です。空のままサインインするとゲストとして続けられます。
                パスワードは受け取りも保存もしません。
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                <input
                    type="email"
                    placeholder="you@example.com（任意）"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-label="メールアドレス（任意）"
                    style={{ padding: '0.75rem' }}
                />
                <button type="submit" className="btn btn-primary">サインインして続ける</button>
            </form>
        </div>
    );
};

export default Login;
