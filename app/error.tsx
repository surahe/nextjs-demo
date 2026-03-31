'use client'; // 必须写

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
    return (
        <div style={{ padding: 20, color: 'red', background: '#fee' }}>
            <h2>页面加载失败</h2>
            <p>{error.message}</p>
            <button onClick={() => reset()}>重试</button>
        </div>
    );
}
