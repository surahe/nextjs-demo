// lib/notify.ts
// 统一的 toast 通知封装，隔离对 sonner 的直接依赖
// 后续如需更换 toast 库，只需改此文件

import { toast, type ExternalToast } from 'sonner';

type NotifyMessage = Parameters<typeof toast.success>[0];
type NotifyOptions = ExternalToast;
type NotifyMethod = (message: NotifyMessage, data?: NotifyOptions) => string | number;
type PendingTask = () => void;

// 优先级高于Toaster的默认选项，低于notify传入的选项
export const notifyDefaultOptions: NotifyOptions = {
    closeButton: false,
};

/**
 * Toaster 可能在首屏切换时尚未完成挂载。
 * 在 ready 前先缓存通知任务，ready 后统一回放，避免首条 toast 丢失。
 */
let notifyReady = false;
const pendingTasks: PendingTask[] = [];

function runOrQueue(task: PendingTask) {
    if (notifyReady) {
        task();
        return;
    }
    pendingTasks.push(task);
}

export function markNotifyReady() {
    notifyReady = true;
    if (pendingTasks.length === 0) return;

    const tasks = pendingTasks.splice(0, pendingTasks.length);
    for (const task of tasks) task();
}

function resolveOptions(options?: NotifyOptions): NotifyOptions {
    return {
        ...notifyDefaultOptions,
        ...options,
    };
}

function createNotifyMethod(method: NotifyMethod) {
    return (message: NotifyMessage, options?: NotifyOptions) => {
        let id: string | number = '';
        runOrQueue(() => {
            id = method(message, resolveOptions(options));
        });
        return id;
    };
}

export const notify = {
    success: createNotifyMethod(toast.success),
    error: createNotifyMethod(toast.error),
    info: createNotifyMethod(toast.info),
    warning: createNotifyMethod(toast.warning),
    loading: createNotifyMethod(toast.loading),
    dismiss: (id?: string | number) => toast.dismiss(id),
    promise: toast.promise,
};

export type { NotifyOptions };
