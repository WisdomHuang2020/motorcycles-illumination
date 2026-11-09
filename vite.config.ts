import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import pkg from './package.json'

/**
 * 与站群（llc-design-tool / main-website-entrance）同一套构建链：
 * Vite + @vitejs/plugin-react + @tailwindcss/vite。
 *
 * base 用 '/' 而不是站群的 './'：本站只有 Lighthouse 自有域名根路径这一条发布通道，
 * 没有 GitHub Pages 子路径兜底（见 .github/workflows/deploy.yml）。
 * 用绝对 base 可让 public/img 下 7 张中文文件名插图在任何路径下都稳定解析。
 *
 * __APP_VERSION__ 与 package.json 的 version 单一来源绑定，页脚徽标引用它。
 */
export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
  define: {
    __APP_VERSION__: JSON.stringify(`v${pkg.version}`),
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})
