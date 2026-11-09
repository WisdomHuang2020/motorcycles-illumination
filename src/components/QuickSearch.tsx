import { useState } from 'react'
import { TABLES, type TableKey } from '../data'
import { SrcTag } from './ui'

interface Hit { title: string; src: string; cells: string[] }

/** v1 quickSearch() 的 React 版：跨全部 10 张数据表检索命中行 */
export default function QuickSearch() {
  const [kw, setKw] = useState('')
  const k = kw.trim().toLowerCase()
  const hits: Hit[] = []
  if (k) {
    for (const key of Object.keys(TABLES) as TableKey[]) {
      const t = TABLES[key]
      for (const row of t.rows) {
        if (row.some((c) => c.toLowerCase().includes(k))) {
          hits.push({ title: t.title, src: t.src, cells: row })
        }
      }
    }
  }

  return (
    <>
      <div className="field">
        <label htmlFor="quickSearch">输入测试点、数值或关键词</label>
        <input
          id="quickSearch"
          type="search"
          placeholder="例如：75R / B50L / 0.8 / ADB / 光通量 / 电自"
          value={kw}
          onChange={(e) => setKw(e.target.value)}
        />
      </div>
      {!k ? (
        <p className="tbl-note">输入关键词开始检索，例如「75R」「B50L」「ADB」「0.8」「电自」「光通量」。</p>
      ) : hits.length === 0 ? (
        <p className="tbl-note">未检索到「{kw}」相关行。</p>
      ) : (
        <>
          <p className="tbl-note">命中 {hits.length} 行（最多显示 30 行）</p>
          <div className="tbl-wrap">
            <table>
              <thead><tr><th>所属表格</th><th>匹配行</th><th>来源</th></tr></thead>
              <tbody>
                {hits.slice(0, 30).map((h, i) => (
                  <tr key={i}>
                    <td>{h.title}</td>
                    <td>{h.cells.join(' ｜ ')}</td>
                    <td><SrcTag>{h.src}</SrcTag></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  )
}
