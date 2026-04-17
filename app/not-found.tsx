export default function NotFound() {
    return (
        <div className="flex h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main className="flex w-full max-w-3xl flex-1 flex-col items-center justify-between bg-white px-16 py-32 sm:items-start dark:bg-black">
                <h1 className="text-destructive text-6xl font-bold">404</h1>
                <p className="text-muted-foreground text-xl">页面未找到</p>
            </main>
        </div>
    );
}
