import React from 'react';

const directives = [
  {
    name: "@import",
    use: "引入 Tailwind v4 的入口指令，必须放在全局样式文件开头",
    detail: "加载主题、基础样式与工具类生成器，是 v4 唯一推荐的入口方式，替代了 v3 的 @tailwind 指令。",
    example: '@import "tailwindcss";',
    fullExample: `@import "tailwindcss";

/* 以下可以继续写你的其他自定义配置 */
@theme {
  --color-brand: #3b82f6;
}`,
    practice: "用于 app/globals.css 的第一行，保证后续所有的 Tailwind 魔法生效。",
    preview: (
      <div className="flex items-center gap-2 rounded-lg border border-black/5 bg-slate-50 px-3 py-2 text-xs text-slate-700 dark:border-white/10 dark:bg-slate-950 dark:text-slate-200">
        <span className="inline-flex size-2 rounded-full bg-emerald-500 animate-pulse" />
        Tailwind 引擎已成功加载
      </div>
    ),
  },
  {
    name: "@layer",
    use: "把样式分层，控制优先级与覆盖顺序",
    detail:
      "CSS 原生的级联层特性。Tailwind 默认分为 theme, base, components, utilities。后声明的层优先级高于前面的层。它本身不注册工具类，只是决定普通 CSS 的权重。",
    example: "@layer base { h1 { font-size: var(--text-2xl); font-weight: bold; } }",
    fullExample: `/* 控制优先级：utilities 层的内容会覆盖 base 层 */
@layer base {
  h1 { font-size: var(--text-2xl); }
}

@layer components {
  .card { border-radius: var(--radius-lg); border: 1px solid var(--color-gray-200); }
}

@layer utilities {
  /* 仅提高优先级，但不能在 HTML 里使用 hover:text-balance */
  .text-balance { text-wrap: balance; }
}`,
    practice: "把裸标签样式（如 h1, a）放 base，把普通 CSS 写的组件样式放 components。",
    preview: (
      <div className="flex flex-col gap-2 text-xs">
        <div className="flex w-full items-center justify-between rounded-md border border-black/5 bg-slate-50 px-3 py-2 dark:border-white/10 dark:bg-slate-950">
          <span>优先级最低 (Base)</span>
          <span className="text-gray-400">标签默认样式</span>
        </div>
        <div className="flex w-full items-center justify-between rounded-md border border-black/5 bg-slate-100 px-3 py-2 dark:border-white/10 dark:bg-slate-900">
          <span>中等优先级 (Components)</span>
          <span className="text-gray-400">组件类</span>
        </div>
        <div className="flex w-full items-center justify-between rounded-md border border-black/10 bg-slate-200 px-3 py-2 font-medium dark:border-white/20 dark:bg-slate-800">
          <span>最高优先级 (Utilities)</span>
          <span className="text-gray-500">工具类覆盖</span>
        </div>
      </div>
    ),
  },
  {
    name: "@utility",
    use: "向 Tailwind 引擎注册一个真正的工具类",
    detail:
      "v4 新增指令。它不仅仅是写一段 CSS，而是告诉 Tailwind：“这是一个工具类”。这意味着 Tailwind 会自动为它生成 hover:、focus:、md: 等变体，并支持按需打包。",
    example: "@utility btn { background-color: var(--color-primary); color: white; padding: 0.5rem 1rem; border-radius: var(--radius-md); }",
    fullExample: `/* 注册工具类，支持变体 */
@utility badge {
  display: inline-flex;
  align-items: center;
  border-radius: var(--radius-full);
  background-color: var(--color-primary);
  color: white;
  padding: 0.25rem 0.5rem;
  font-size: var(--text-xs);
}

/* 在 HTML 中使用： */
/* <span class="badge hover:badge-hover">（配合嵌套或其他工具类）</span> */`,
    practice: "当你需要一个自定义类，并且希望它能配合 hover: 或 lg: 一起使用时，必须用 @utility 而不是 @layer utilities。",
    preview: (
      <div className="flex items-center gap-4">
        <span className="inline-flex cursor-pointer items-center rounded-full bg-primary px-3 py-1 text-xs text-white transition-opacity hover:opacity-80">
          基础 utility 效果
        </span>
        <span className="text-xs text-gray-500">← 假设这是 @utility btn，自动支持 hover 变体</span>
      </div>
    ),
  },
  {
    name: "@apply",
    use: "把现有的 Tailwind 工具类组合到一起",
    example:
      ".btn-danger { @apply inline-flex items-center gap-2 px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600; }",
    detail:
      "常用于提取重复的工具类组合。注意：它只是 CSS 的宏替换，不会生成新的工具类（除非你把它包在 @utility 里）。",
    fullExample: `/* 传统组合方式（普通 CSS 类） */
.card-shadow {
  @apply shadow-md hover:shadow-lg transition-shadow duration-300;
  border: 1px solid var(--color-gray-100);
}

/* 结合 @utility（v4 最佳实践：注册为带变体的工具类） */
@utility btn-primary {
  @apply rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700;
}`,
    practice: "不推荐滥用。如果只是想复用样式，React 组件本身是更好的复用边界。但对于全局通用的简单按钮样式，@apply 很方便。",
    preview: (
      <button className="inline-flex items-center gap-2 rounded bg-red-500 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-red-600">
        <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        删除操作 (@apply btn-danger)
      </button>
    ),
  },
  {
    name: "@theme",
    use: "定义全局主题变量，生成对应的工具类并保留级联覆盖能力",
    detail:
      "用 @theme 定义的变量，Tailwind 会自动生成对应的工具类（如 bg-brand）。最重要的是，生成的工具类里会保留 CSS 变量引用（如 background-color: var(--color-brand)），这意味着你可以通过覆盖 CSS 变量来做主题切换。",
    example: "@theme { --color-brand: #8b5cf6; --font-heading: 'Inter', sans-serif; }",
    fullExample: `@theme {
  --color-brand: #8b5cf6;
  --spacing-container: 2rem;
}

/* 配合 :root 覆盖变量，实现深色模式或多主题 */
@layer base {
  :root {
    --color-brand: #8b5cf6; /* 亮色默认 */
  }
  .theme-dark {
    --color-brand: #c4b5fd; /* 暗色覆盖 */
  }
}`,
    practice: "所有需要支持明暗切换、或者会在特定容器下覆盖的颜色、间距，都放进 @theme 里。",
    preview: (
      <div className="flex gap-4">
        <div className="flex flex-col items-center gap-1">
          <div className="size-10 rounded-lg bg-violet-500 shadow-sm" />
          <span className="text-[10px] text-gray-500">亮色变量</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="size-10 rounded-lg bg-violet-300 shadow-sm" />
          <span className="text-[10px] text-gray-500">暗色变量覆盖</span>
        </div>
      </div>
    ),
  },
  {
    name: "@theme inline",
    use: "内联主题变量，把值直接写死到工具类中",
    detail:
      "与 @theme 相对，inline 模式生成的工具类不会引用 CSS 变量，而是直接把十六进制颜色或具体数值内联进去。这样做生成的 CSS 更干净，但失去了动态覆盖变量的能力。",
    example: "@theme inline { --color-static-red: #ef4444; --font-mono: var(--font-geist-mono); }",
    fullExample: `/* 这里通常用于：
   1. 透传外部库提供的变量（比如 next/font）
   2. 绝对不会被覆盖的常量 */
@theme inline {
  --font-sans: var(--font-geist-sans);
  --color-brand-fixed: #ff0000;
}

/* 生成的工具类类似这样，没有 var()： */
/* .bg-brand-fixed { background-color: #ff0000; } */`,
    practice: "Next.js 项目中，用于对接 next/font 注入的 --font-geist-sans 等变量，或者定义永远不变的纯黑色/纯白色。",
    preview: (
      <div className="flex flex-col gap-2 rounded-lg border border-black/5 bg-slate-50 p-3 font-mono text-xs text-slate-700 dark:border-white/10 dark:bg-slate-900 dark:text-slate-200">
        <div>{`// 静态值，不受外层变量覆盖影响`}</div>
        <div className="text-red-500">const STATIC_RED = &quot;#ef4444&quot;;</div>
      </div>
    ),
  },
  {
    name: "@variant",
    use: "定义变体样式块，为特定状态提供样式",
    example: "@variant dark { background-color: black; color: white; }",
    detail:
      "允许你在 CSS 中为现有的变体（如 hover, focus, dark）编写自定义样式块。它将样式包裹在对应变体的逻辑中。",
    fullExample: `/* 在全局 CSS 中定义特定变体下的样式行为 */
@layer base {
  body {
    background-color: white;
    
    @variant dark {
      background-color: #0a0a0a;
      color: #ededed;
    }
  }
}`,
    practice: "常用于全局的基础样式设定，比如在 body 级别直接用 @variant dark 设置背景色，而不是在 HTML 上写一长串 dark:bg-black。",
    preview: (
      <div className="group relative cursor-pointer rounded-lg border border-gray-200 p-4 transition-colors hover:border-blue-500 hover:bg-blue-50 dark:border-gray-700 dark:hover:bg-blue-900/20">
        <span className="text-xs text-gray-500 transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
          把鼠标移上来，模拟 hover 变体触发的内部元素变化
        </span>
      </div>
    ),
  },
  {
    name: "@custom-variant",
    use: "创造你自己的变体选择器（如 data-*, 复杂伪类）",
    example: '@custom-variant invalid (&:invalid, &.is-invalid);',
    detail:
      "把复杂的 CSS 选择器映射成一个简短的 Tailwind 变体前缀。让你可以在 HTML 中像用 hover: 一样使用你自定义的条件。",
    fullExample: `/* 1. 注册一个针对 data-state 的变体 */
@custom-variant active (&[data-state='active']);

/* 2. 注册一个只有在父元素有 error 类时才触发的变体 */
@custom-variant group-error (:merge(.group).error &);`,
    practice: "与 Radix UI 或其他无头组件库配合时，用来把 [data-state='open'] 映射为 open: 变体。",
    preview: (
      <div className="flex gap-2">
        <div className="flex items-center justify-center rounded border border-gray-200 bg-gray-100 px-3 py-1 text-xs text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">默认状态</div>
        <div className="flex items-center justify-center rounded border border-blue-600 bg-blue-500 px-3 py-1 text-xs font-medium text-white shadow-sm ring-2 ring-blue-500/20 dark:border-blue-500 dark:bg-blue-600">
          active: (模拟自定义变体激活)
        </div>
      </div>
    ),
  },
  {
    name: "@source",
    use: "显式指定 Tailwind 扫描类名的文件路径",
    example: '@source "../shared/components/**/*.tsx";',
    detail:
      "v4 默认会自动扫描当前目录下的所有相关文件。但如果你的项目是 Monorepo，或者引用了外部包里的组件，就需要用 @source 手动把那些路径加进来。",
    fullExample: `/* 引入当前工作区以外的组件库类名扫描 */
@source "../../packages/ui/src/**/*.tsx";

/* 引入某个包含 Tailwind 类的 markdown 文件夹 */
@source "./content/**/*.mdx";`,
    practice: "Monorepo 架构下共享 UI 库时必用，否则外部组件的 Tailwind 类名不会被编译进 CSS。",
    preview: (
      <div className="flex flex-wrap gap-2 text-xs">
        <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
          packages/ui/src
        </span>
        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
          已包含在扫描范围内
        </span>
      </div>
    ),
  },
  {
    name: "@plugin",
    use: "加载 Tailwind 插件（如排版、表单插件）",
    example: '@plugin "@tailwindcss/typography";',
    detail:
      "v4 中插件不再写在 tailwind.config.js 里，而是直接在 CSS 中通过 @plugin 引入。支持官方插件和第三方插件。",
    fullExample: `/* 引入官方排版插件 */
@plugin "@tailwindcss/typography";

/* 引入带配置的插件（如果插件支持） */
@plugin "daisyui";

/* 使用插件生成的类名 */
<article class="prose lg:prose-xl">
  <h1>...</h1>
</article>`,
    practice: "当你需要大段文本排版（typography）、原生表单元素重置（forms）或者动画增强时使用。",
    preview: (
      <div className="rounded-lg border border-black/5 bg-white p-4 dark:border-white/10 dark:bg-slate-900">
        <div className="space-y-2 border-l-2 border-gray-200 pl-4 dark:border-gray-700">
          <h4 className="font-serif text-sm font-bold text-gray-900 dark:text-gray-100">这是 Prose 插件效果模拟</h4>
          <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400">
            插件自动为原生的 <code className="rounded bg-gray-100 px-1 py-0.5 text-[10px] text-red-500 dark:bg-gray-800">h1</code>, <code className="rounded bg-gray-100 px-1 py-0.5 text-[10px] text-red-500 dark:bg-gray-800">p</code> 等标签添加了优美的行高、间距和字体排版。
          </p>
        </div>
      </div>
    ),
  }
];

export default function TailwindDirectivesPage() {
  return (
    <div className="min-h-full bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-12">
        <header className="flex flex-col gap-4 border-b border-slate-200 pb-8 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-sky-500 text-white shadow-sm">
              <svg className="size-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4.5C12 4.5 10 9 5.5 9C10 9 12 13.5 12 13.5C12 13.5 14 9 18.5 9C14 9 12 4.5 12 4.5Z" fill="currentColor"/>
                <path d="M19.5 15.5C19.5 15.5 18.5 17.5 16 17.5C18.5 17.5 19.5 19.5 19.5 19.5C19.5 19.5 20.5 17.5 23 17.5C20.5 17.5 19.5 15.5 19.5 15.5Z" fill="currentColor"/>
                <path d="M5.5 16C5.5 16 4 19 0 19C4 19 5.5 22 5.5 22C5.5 22 7 19 11 19C7 19 5.5 16 5.5 16Z" fill="currentColor"/>
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Tailwind CSS v4 指令手册</h1>
              <span className="text-sm font-medium text-sky-600 dark:text-sky-400">@directives Reference</span>
            </div>
          </div>
          <p className="max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            Tailwind CSS v4 采用了全新的“CSS 优先”配置模式，彻底废弃了 tailwind.config.js。现在，所有的配置、主题变量、插件加载和自定义工具类，全部通过 CSS 中的 <code className="rounded bg-slate-200 px-1.5 py-0.5 font-mono text-slate-800 dark:bg-slate-800 dark:text-slate-200">@指令</code> 来完成。本指南详细拆解了每个指令的原理与实战用法。
          </p>
        </header>

        <section className="flex flex-col gap-8">
          {directives.map((item, index) => (
            <div
              key={item.name}
              className="group relative flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              {/* 标题栏 */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-4 dark:border-slate-800/50">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-3">
                    <span className="flex size-6 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                      {index + 1}
                    </span>
                    <h2 className="font-mono text-xl font-bold text-sky-600 dark:text-sky-400">
                      {item.name}
                    </h2>
                  </div>
                  <p className="mt-1 font-medium text-slate-800 dark:text-slate-200">{item.use}</p>
                </div>
              </div>

              {/* 核心说明区 */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">底层原理与细节</h3>
                    <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{item.detail}</p>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">实战场景建议</h3>
                    <div className="rounded-lg border-l-4 border-sky-500 bg-sky-50 py-2.5 pl-3 pr-4 text-sm text-sky-800 dark:bg-sky-950/30 dark:text-sky-300">
                      {item.practice}
                    </div>
                  </div>

                  <div className="mt-auto pt-2">
                    <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">视觉效果演示</h3>
                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800/50 dark:bg-slate-950/50">
                      {item.preview}
                    </div>
                  </div>
                </div>

                {/* 代码示例区 */}
                <div className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-950 shadow-inner">
                  <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-4 py-2">
                    <div className="flex items-center gap-2">
                      <div className="size-3 rounded-full bg-red-500/20" />
                      <div className="size-3 rounded-full bg-yellow-500/20" />
                      <div className="size-3 rounded-full bg-green-500/20" />
                    </div>
                    <span className="font-mono text-[10px] text-slate-500">styles.css</span>
                  </div>
                  <div className="flex-1 overflow-x-auto p-4">
                    <pre className="font-mono text-xs leading-loose text-slate-300">
                      <code>
                        {item.fullExample.split('\n').map((line, i) => {
                          if (line.includes('/*') || line.includes('//')) {
                            return <span key={i} className="text-slate-500">{line}{'\n'}</span>;
                          }
                          const parts = line.split(/(@[a-zA-Z-]+|--[a-zA-Z0-9-]+)/g);
                          return (
                            <span key={i}>
                              {parts.map((part, j) => {
                                if (part.startsWith('@')) return <span key={j} className="text-pink-400">{part}</span>;
                                if (part.startsWith('--')) return <span key={j} className="text-sky-300">{part}</span>;
                                return part;
                              })}
                              {'\n'}
                            </span>
                          );
                        })}
                      </code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* 核心对比区 */}
        <section className="mt-8 flex flex-col gap-6 rounded-2xl bg-slate-900 p-8 text-white shadow-xl dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <span className="flex size-8 items-center justify-center rounded-lg bg-yellow-500/20 text-yellow-400">
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </span>
            <h2 className="text-xl font-bold">高频易混淆概念解析</h2>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            {/* 对比 1 */}
            <div className="rounded-xl border border-slate-700 bg-slate-800 p-5">
              <h3 className="mb-4 flex items-center gap-2 font-mono text-sm font-bold">
                <span className="text-pink-400">@layer utilities</span>
                <span className="text-slate-400">vs</span>
                <span className="text-pink-400">@utility</span>
              </h3>
              <ul className="flex flex-col gap-3 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-red-400">×</span>
                  <div>
                    <strong>@layer utilities</strong> 只是原生的 CSS 层级控制。它<strong>不会</strong>注册 Tailwind 工具类，你<strong>不能</strong>在它身上使用 <code className="text-sky-300">hover:</code> 等修饰符。
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-emerald-400">✓</span>
                  <div>
                    <strong>@utility</strong> 是 Tailwind v4 的魔法指令。它把你的 CSS 注册为一个<strong>真正的工具类</strong>，自动支持响应式、暗色模式、状态伪类等所有 Tailwind 变体。
                  </div>
                </li>
              </ul>
            </div>

            {/* 对比 2 */}
            <div className="rounded-xl border border-slate-700 bg-slate-800 p-5">
              <h3 className="mb-4 flex items-center gap-2 font-mono text-sm font-bold">
                <span className="text-pink-400">@theme</span>
                <span className="text-slate-400">vs</span>
                <span className="text-pink-400">@theme inline</span>
              </h3>
              <ul className="flex flex-col gap-3 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-sky-400">⚡</span>
                  <div>
                    <strong>@theme</strong> 生成的类会保留 <code className="text-sky-300">var(--xxx)</code> 引用。这使得你可以在不同的 DOM 节点或暗色模式下覆盖这个变量，实现主题切换。
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-slate-400">🔒</span>
                  <div>
                    <strong>@theme inline</strong> 生成的类会将值<strong>硬编码写死</strong>。适合永远不变的绝对常量，或者只是为了读取外部注入的变量（如 next/font）。
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

