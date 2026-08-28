import { Link, useLocation } from 'react-router-dom';

const Success = () => {
    const { state } = useLocation();
    const name = state?.name;
    const method = state?.method === 'delivery' ? '配達' : '店頭受け取り';
    const total = state?.total;

    return (
        <div className="container text-center" style={{ padding: 'var(--spacing-xl) 0', maxWidth: '600px' }}>
            <h1 style={{ color: 'var(--color-brand-primary)' }}>ご注文ありがとうございます</h1>
            <p style={{ marginTop: 'var(--spacing-md)' }}>
                {name ? `${name} 様のご注文を承りました。` : 'ご注文を承りました。'}
                <br />受け取り方法: {method}
                {total && <><br />お支払い金額: ${total}</>}
            </p>

            <p className="notice" style={{ textAlign: 'left', marginTop: 'var(--spacing-lg)' }}>
                これは動作を確かめるためのデモです。<strong>実際の注文は行われず、決済もありません。</strong>
                入力した内容はブラウザの外に送信されていません。
            </p>

            <Link to="/" className="btn btn-outline" style={{ marginTop: 'var(--spacing-lg)', display: 'inline-block' }}>
                トップへ戻る
            </Link>
        </div>
    );
};

export default Success;
