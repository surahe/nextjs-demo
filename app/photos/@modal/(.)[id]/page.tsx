// 拦截路由页面：在 @modal 插槽内渲染 /photos/[id]
// 仅在软导航（点击链接）时触发；刷新或直接访问 URL 时，渲染 app/photos/[id]/page.tsx
import { notFound } from 'next/navigation';
import { PHOTOS } from '../../data';
import PhotoModal from './modal-client';

export default async function InterceptedPhotoPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const photo = PHOTOS.find((p) => p.id === id);
    if (!photo) notFound();

    return <PhotoModal photo={photo} id={id} />;
}
