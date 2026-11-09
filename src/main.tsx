import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { migrateLegacyUrl } from './router'
import './index.css'

const el = document.getElementById('root')
if (!el) throw new Error('#root is missing in index.html')

/* 必须在 render 之前：v2 的 `/#basis` 这类老链接要在这里改写成 `/basis`，
   否则 RouterProvider 初始化时读到的还是带 hash 的旧地址。 */
migrateLegacyUrl()

/* 已经在本站页面上时，粘贴 `/#basis` 属于「同文档跳转」，不会重新加载页面，
   上面那一次调用不会执行 —— 必须再监听 hashchange 才能兜住。 */
window.addEventListener('hashchange', migrateLegacyUrl)

createRoot(el).render(
  <StrictMode>
    <App />
  </StrictMode>
)
