/** @type {import("prettier").Config} */
const config = {
    // 缩进字节数
    tabWidth: 4,
    // 缩进不使用tab，使用空格
    useTabs: false,
    // 使用单引号代替双引号（JSX 中依然是双引号）
    singleQuote: true,
    // 句尾添加分号
    semi: true,
    // 多行时尽可能打印尾随逗号（例如数组、对象的最后一项）
    trailingComma: 'all',
    // 超过最大值换行
    printWidth: 100,
    // 自动按官方规范对 Tailwind CSS 类名进行排序
    plugins: ['prettier-plugin-tailwindcss'],
};

export default config;
