import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach } from 'vitest';
import { AuthProvider } from './context/AuthContext';
import { ShopProvider } from './context/ShopContext';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

const renderApp = (path = '/') =>
    render(
        <AuthProvider>
            <ShopProvider>
                <MemoryRouter initialEntries={[path]}>
                    <App />
                </MemoryRouter>
            </ShopProvider>
        </AuthProvider>
    );

/** 先頭の商品（Caffe Latte $4.50）をカートに入れる */
const addLatte = async (user, count = 1) => {
    const buttons = await screen.findAllByRole('button', { name: /add to cart/i });
    for (let i = 0; i < count; i++) await user.click(buttons[0]);
};

/** メニュー → カート → 決済画面まで進む */
const goToCheckout = async (user, count = 2) => {
    await addLatte(user, count);
    await user.click(screen.getByRole('link', { name: /カート/ }));
    await user.click(await screen.findByRole('link', { name: /Proceed to Checkout/i }));
};

beforeEach(() => {
    localStorage.clear();
});

describe('トップページ', () => {
    it('見出しと導線が出る', () => {
        renderApp('/');
        expect(screen.getByText(/Welcome to Cafe Site/i)).toBeInTheDocument();
        expect(screen.getByText(/Order Now/i)).toBeInTheDocument();
    });
});

describe('カート', () => {
    it('商品を追加すると件数が増える', async () => {
        const user = userEvent.setup();
        renderApp('/menu');
        await addLatte(user, 2);
        expect(screen.getByRole('link', { name: /カート/ })).toHaveTextContent('2');
    });

    it('追加した内容がブラウザに保存される（読み込み直しても消えない）', async () => {
        const user = userEvent.setup();
        renderApp('/menu');
        await addLatte(user, 1);

        const saved = JSON.parse(localStorage.getItem('cafe-site/cart') || '[]');
        expect(saved).toHaveLength(1);
        expect(saved[0].quantity).toBe(1);
    });

    it('空のときは決済画面に進めない', () => {
        renderApp('/checkout');
        expect(screen.getByText(/カートに商品がありません/)).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /を支払う/ })).not.toBeInTheDocument();
    });
});

describe('決済画面', () => {
    it('小計・消費税・合計を計算して出す', async () => {
        const user = userEvent.setup();
        renderApp('/menu');
        await goToCheckout(user, 2); // $4.50 × 2 = $9.00

        // $9.00 は明細と小計の2か所に出るので、行を特定して確かめる
        const subtotal = (await screen.findByText('小計')).closest('div');
        expect(subtotal).toHaveTextContent('$9.00');

        const taxRow = screen.getByText(/消費税/).closest('div');
        expect(taxRow).toHaveTextContent('$0.90');

        const totalRow = screen.getByText('合計').closest('div');
        expect(totalRow).toHaveTextContent('$9.90');

        expect(screen.getByRole('button', { name: /\$9\.90 を支払う/ })).toBeInTheDocument();
    });

    it('配達を選ぶと配送料が加算される', async () => {
        const user = userEvent.setup();
        renderApp('/menu');
        await goToCheckout(user, 2);

        await user.selectOptions(screen.getByLabelText(/受け取り方法/), 'delivery');
        // 9.00 + 0.90 + 3.00 = 12.90
        expect(await screen.findByRole('button', { name: /\$12\.90 を支払う/ })).toBeInTheDocument();
    });

    it('カード情報は読み取り専用で、打ち込んでも変わらない', async () => {
        const user = userEvent.setup();
        renderApp('/menu');
        await goToCheckout(user, 1);

        const cardNumber = await screen.findByLabelText(/カード番号/);
        expect(cardNumber).toHaveAttribute('readonly');

        const before = cardNumber.value;
        await user.type(cardNumber, '1111');
        expect(cardNumber.value).toBe(before);
    });

    it('支払うとカートが空になり、完了画面に金額が出る', async () => {
        const user = userEvent.setup();
        renderApp('/menu');
        await goToCheckout(user, 2);

        await user.type(screen.getByLabelText(/お名前/), 'テスト太郎');
        await user.click(screen.getByRole('button', { name: /を支払う/ }));

        expect(await screen.findByText(/ご注文ありがとうございます/, {}, { timeout: 3000 })).toBeInTheDocument();
        expect(screen.getByText(/テスト太郎/)).toBeInTheDocument();
        expect(screen.getByText(/\$9\.90/)).toBeInTheDocument();
        expect(JSON.parse(localStorage.getItem('cafe-site/cart') || '[]')).toHaveLength(0);
    });
});

describe('サインイン', () => {
    it('空のままでも進める（デモの流れを止めない）', async () => {
        const user = userEvent.setup();
        renderApp('/login');
        await user.click(screen.getByRole('button', { name: /サインインして続ける/ }));
        expect(await screen.findByText(/Our Menu/i)).toBeInTheDocument();
    });

    it('パスワードの入力欄を持たない', () => {
        const { container } = renderApp('/login');
        expect(container.querySelector('input[type="password"]')).toBeNull();
    });
});
