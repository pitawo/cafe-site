import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);
const STORAGE_KEY = 'cafe-site/user';

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });

    // 画面を閉じても入り直さなくて済むように、利用者だけ保存する。
    // パスワードは保持しないし、どこにも記録しない。
    useEffect(() => {
        try {
            if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
            else localStorage.removeItem(STORAGE_KEY);
        } catch {
            // プライベートモードなどで書けない場合は保存しないだけにする
        }
    }, [user]);

    /**
     * このデモには認証サーバーが無いため、入力されたメールアドレスを
     * そのまま利用者名として扱う。パスワードは照合にも保存にも使わない。
     */
    const login = (email) => {
        const address = String(email || '').trim();
        // 未入力でもゲストとして扱う。デモの流れを止めない
        setUser({
            email: address || null,
            name: address ? address.split('@')[0] : 'ゲスト',
        });
        return { ok: true };
    };

    const logout = () => setUser(null);

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
