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

/** 先頭の商品（カフェラテ・デフォルトサイズ M・¥500）をカートに入れる */
const addLatte = async (user, count = 1) => {
    const buttons = await screen.findAllByRole('button', { name: /カートに追加/ });
    for (let i = 0; i < count; i++) await user.click(buttons[0]);
};

/** メニュー → カート → 決済画面まで進む */
const goToCheckout = async (user, count = 2) => {
    await addLatte(user, count);
    await user.click(screen.getByRole('link', { name: /^カート（/ }));
    await user.click(await screen.findByRole('link', { name: /お支払いへ進む/ }));
};

beforeEach(() => {
    localStorage.clear();
});

describe('トップページ', () => {
    it('見出しと導線が出る', () => {
        renderApp('/');
        expect(screen.getByText(/カフェサイトへようこそ/)).toBeInTheDocument();
        expect(screen.getByText(/メニューを見る/)).toBeInTheDocument();
    });

    it('お知らせと営業時間が出る（架空のデモ用と明記されている）', () => {
        renderApp('/');
        expect(screen.getByRole('heading', { name: 'お知らせ' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: '営業時間' })).toBeInTheDocument();
        expect(screen.getByText(/実在のカフェ・店舗ではありません/)).toBeInTheDocument();
    });
});

describe('カート', () => {
    it('商品を追加すると件数が増える', async () => {
        const user = userEvent.setup();
        renderApp('/menu');
        await addLatte(user, 2);
        expect(screen.getByRole('link', { name: /^カート（/ })).toHaveTextContent('2');
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

    it('ドリンクはサイズを選べて、選んだサイズで金額が変わる', async () => {
        const user = userEvent.setup();
        renderApp('/menu');

        // 先頭の商品（カフェラテ）を L サイズに変更してから追加する
        const sizeButtons = await screen.findAllByRole('button', { name: 'L' });
        await user.click(sizeButtons[0]);
        const addButtons = screen.getAllByRole('button', { name: /カートに追加/ });
        await user.click(addButtons[0]);

        await user.click(screen.getByRole('link', { name: /^カート（/ }));
        // S 基準 ¥450 + L 加算 ¥100 = ¥550
        expect(screen.getByText('¥550')).toBeInTheDocument();
        expect(screen.getByText(/カフェラテ（L）/)).toBeInTheDocument();
    });
});

describe('決済画面', () => {
    it('小計・消費税・合計を計算して出す', async () => {
        const user = userEvent.setup();
        renderApp('/menu');
        await goToCheckout(user, 2); // ¥500（M） × 2 = ¥1,000

        const subtotal = (await screen.findByText('小計')).closest('div');
        expect(subtotal).toHaveTextContent('¥1,000');

        const taxRow = screen.getByText(/消費税/).closest('div');
        expect(taxRow).toHaveTextContent('¥100');

        const totalRow = screen.getByText('合計').closest('div');
        expect(totalRow).toHaveTextContent('¥1,100');

        expect(screen.getByRole('button', { name: /¥1,100 を支払う/ })).toBeInTheDocument();
    });

    it('配達を選ぶと配送料が加算される', async () => {
        const user = userEvent.setup();
        renderApp('/menu');
        await goToCheckout(user, 2);

        await user.selectOptions(screen.getByLabelText(/受け取り方法/), 'delivery');
        // 1,000 + 100 + 300 = 1,400
        expect(await screen.findByRole('button', { name: /¥1,400 を支払う/ })).toBeInTheDocument();
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

    it('支払うとカートが空になり、完了画面に金額と受付番号が出る', async () => {
        const user = userEvent.setup();
        renderApp('/menu');
        await goToCheckout(user, 2);

        await user.type(screen.getByLabelText(/お名前/), 'テスト太郎');
        await user.click(screen.getByRole('button', { name: /を支払う/ }));

        expect(await screen.findByText(/ご注文ありがとうございます/, {}, { timeout: 3000 })).toBeInTheDocument();
        expect(screen.getByText(/テスト太郎/)).toBeInTheDocument();
        expect(screen.getByText(/¥1,100/)).toBeInTheDocument();
        expect(screen.getByText(/受付番号: DEMO-\d{8}-\d{4}/)).toBeInTheDocument();
        expect(JSON.parse(localStorage.getItem('cafe-site/cart') || '[]')).toHaveLength(0);
    });
});

describe('サインイン', () => {
    it('空のままでも進める（デモの流れを止めない）', async () => {
        const user = userEvent.setup();
        renderApp('/login');
        await user.click(screen.getByRole('button', { name: /サインインして続ける/ }));
        // from の指定がないときはトップに戻る（メニューへ自動遷移はしない）
        expect(await screen.findByText(/カフェサイトへようこそ/)).toBeInTheDocument();
    });

    it('サインインすると元いた画面に戻る（自動でメニューには飛ばない）', async () => {
        const user = userEvent.setup();
        renderApp('/menu');
        await user.click(screen.getByRole('link', { name: 'サインイン' }));
        await user.click(screen.getByRole('button', { name: /サインインして続ける/ }));
        expect(await screen.findByRole('heading', { level: 1, name: 'メニュー' })).toBeInTheDocument();
    });

    it('パスワードの入力欄を持たない', () => {
        const { container } = renderApp('/login');
        expect(container.querySelector('input[type="password"]')).toBeNull();
    });
});

describe('カート導線ボタン（画面右下固定）', () => {
    it('カートが空のときは出ない', () => {
        renderApp('/');
        expect(screen.queryByRole('link', { name: /カートを見る/ })).not.toBeInTheDocument();
    });

    it('カートに追加すると出て、件数バッジが増える', async () => {
        const user = userEvent.setup();
        renderApp('/menu');
        await addLatte(user, 2);
        expect(screen.getByRole('link', { name: /カートを見る（2点）/ })).toBeInTheDocument();
    });
});
