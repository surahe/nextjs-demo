import Image from "next/image";
import Link from "next/link";

const demos = [
  {
    href: "/suspense",
    label: "Suspense 演示",
    desc: "React Suspense + 异步组件",
    color: "bg-sky-500",
  },
  {
    href: "/tailwind-directives",
    label: "Tailwind v4 指令",
    desc: "@import / @theme / @utility 等",
    color: "bg-teal-500",
  },
  {
    href: "/parallel-intercept",
    label: "并行路由 & 拦截路由",
    desc: "@slot 命名插槽 + 模态拦截",
    color: "bg-violet-500",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            To get started, edit the page.tsx file.
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Looking for a starting point or more instructions? Head over to{" "}
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Templates
            </a>{" "}
            or the{" "}
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Learning
            </a>{" "}
            center.
          </p>

          <div className="flex w-full flex-col gap-3 pt-2">
            <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">演示页面</p>
            {demos.map((demo) => (
              <Link
                key={demo.href}
                href={demo.href}
                className="flex items-center gap-3 rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-3 transition-colors hover:border-zinc-200 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 dark:hover:bg-zinc-800"
              >
                <span className={`flex size-8 shrink-0 items-center justify-center rounded-lg text-white text-xs ${demo.color}`}>
                  →
                </span>
                <div>
                  <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{demo.label}</div>
                  <div className="text-xs text-zinc-400">{demo.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}
