/**
 * 路由的 React 绑定：Provider / useRoute / Link
 *
 * 只用 History API，不引第三方路由库。`Link` 会拦截普通左键点击做
 * 无刷新跳转，但**保留真实 href** —— 这样右键「在新标签打开」、复制链接、
 * 中键点击、以及 JS 未加载时都仍然可用。
 */
import {
  createContext, useCallback, useContext, useEffect, useMemo, useState,
  type AnchorHTMLAttributes, type MouseEvent, type ReactNode,
} from 'react'
import { normalizePath, pageAt, titleOf, type Page } from './router'

type RouterValue = {
  path: string
  page: Page | null
  go: (to: string, opts?: { replace?: boolean }) => void
}

const RouterContext = createContext<RouterValue | null>(null)

export function RouterProvider({ children }: { children: ReactNode }) {
  const [path, setPath] = useState(() => normalizePath(location.pathname))

  // 浏览器前进 / 后退
  useEffect(() => {
    const onPop = () => setPath(normalizePath(location.pathname))
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const go = useCallback((to: string, opts?: { replace?: boolean }) => {
    const target = normalizePath(to)
    if (target === normalizePath(location.pathname)) {
      window.scrollTo(0, 0)
      return
    }
    if (opts?.replace) history.replaceState(null, '', target)
    else history.pushState(null, '', target)
    setPath(target)
  }, [])

  const page = pageAt(path)

  // 每个页面自己的标题与描述 —— 11 个页面共用一条 <title> 是 SEO 与分享卡片的减分项
  useEffect(() => {
    document.title = titleOf(page)
    const meta = document.querySelector('meta[name="description"]')
    if (meta && page) meta.setAttribute('content', page.desc)
  }, [page])

  // 切页回到顶部：阅读型站点若沿用上一页的滚动位置，会让人以为「这页是空的」
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [path])

  const value = useMemo(() => ({ path, page, go }), [path, page, go])
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>
}

export function useRoute(): RouterValue {
  const ctx = useContext(RouterContext)
  if (!ctx) throw new Error('useRoute 必须在 <RouterProvider> 内使用')
  return ctx
}

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  to: string
  /** 跳转前顺带做的事，比如收起移动端目录 */
  beforeNavigate?: () => void
}

export function Link({ to, beforeNavigate, onClick, children, ...rest }: LinkProps) {
  const { go } = useRoute()

  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e)
    // 组合键 / 中键 / 已阻止默认：交还给浏览器（新标签页打开等）
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    beforeNavigate?.()
    go(to)
  }

  return (
    <a href={to} onClick={handle} {...rest}>
      {children}
    </a>
  )
}
