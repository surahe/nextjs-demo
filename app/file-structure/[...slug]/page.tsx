import { notFound } from "next/navigation";

/**
 * 捕获所有未匹配的 /file-structure/* 路径，
 * 调用 notFound() 触发同段的 not-found.tsx。
 */
export default function TriggerNotFound() {
    notFound();
}
