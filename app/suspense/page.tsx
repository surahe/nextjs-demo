// app/page.tsx
import { Suspense } from 'react';

// 模拟成功接口
async function fetchSuccess() {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return ['数据A', '数据B', '数据C'];
}

// 模拟失败接口
async function fetchFail() {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    throw new Error('加载失败：接口挂了');
}

// 成功组件
async function SuccessBox() {
    const data = await fetchSuccess();
    return (
        <div style={{ padding: 20, backgroundColor: '#efe' }}>
            <h3>成功加载</h3>
            {data.map((item) => (
                <div key={item}>{item}</div>
            ))}
        </div>
    );
}

// 失败组件
async function FailBox() {
    await fetchFail(); // 直接 await，不需要接收返回值
    return <div>永远不会执行到这里</div>;
}

// 主页面
export default function Home() {
    return (
        <main style={{ padding: 20 }}>
            <h1>Next.js TS + Suspense 演示</h1>

            {/* 成功区块 */}
            <Suspense fallback={<div>加载中...</div>}>
                <SuccessBox />
            </Suspense>

            <div style={{ margin: '20px 0' }} />

            {/* 失败区块 */}
            <Suspense fallback={<div>加载中...</div>}>
                <FailBox />
            </Suspense>
        </main>
    );
}
