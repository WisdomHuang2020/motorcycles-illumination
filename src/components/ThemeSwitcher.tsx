import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown, Palette } from 'lucide-react'
import { DEFAULT_THEME, THEMES, applyTheme, readStoredTheme, type ThemeId } from '../theme'

/**
 * 站群 8 色风格切换器（2026-11-09 从 main-website-entrance 移植）。
 * 只切换根元素的 data-theme，结构不动；默认深墨 teal 与「没选过」视觉一致。
 */
export default function ThemeSwitcher() {
  const [open, setOpen] = useState(false)
  const [theme, setTheme] = useState<ThemeId>(DEFAULT_THEME)
  const boxRef = useRef<HTMLDivElement>(null)

  // data-theme 已由 index.html 内联脚本设好，这里只把 UI 状态对齐
  useEffect(() => {
    const id = readStoredTheme()
    setTheme(id)
    document.documentElement.dataset.theme = id
  }, [])

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  function pick(id: ThemeId) {
    setTheme(id)
    applyTheme(id)
    setOpen(false)
  }

  const current = THEMES.find((t) => t.id === theme) ?? THEMES[0]

  return (
    <div className="theme-switcher" ref={boxRef}>
      <button
        type="button"
        className="theme-trigger"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="切换页面配色风格"
        title="切换页面配色风格"
      >
        <Palette size={15} strokeWidth={1.9} aria-hidden="true" />
        <span className="theme-dot" style={{ backgroundColor: current.dot }} />
        <span className="theme-name">{current.name}</span>
        <ChevronDown size={14} strokeWidth={2} aria-hidden="true" />
      </button>
      {open && (
        <div className="theme-menu" role="menu">
          <div className="theme-menu-title">页面风格 · 站群通用 8 套</div>
          {THEMES.map((t) => (
            <button
              key={t.id}
              type="button"
              role="menuitemradio"
              aria-checked={t.id === theme}
              className={'theme-option' + (t.id === theme ? ' on' : '')}
              onClick={() => pick(t.id)}
            >
              <span className="theme-dot" style={{ backgroundColor: t.dot }} />
              <span>{t.name}</span>
              <span className="theme-id">{t.id}</span>
              {t.id === theme && <Check size={14} strokeWidth={2.4} aria-hidden="true" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
