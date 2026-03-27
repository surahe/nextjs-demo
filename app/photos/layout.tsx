export default function PhotosLayout({
    children,
    modal,
}: {
    children: React.ReactNode;
    modal: React.ReactNode;
}) {
    return (
        <>
            {children}
            {/* @modal 插槽：软导航时渲染拦截路由（弹窗），硬导航/刷新时 modal = null（default.tsx 返回 null） */}
            {modal}
        </>
    );
}
