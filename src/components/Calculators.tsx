import { useState } from 'react'

const fmt = (n: number) => n.toLocaleString('zh-CN', { maximumFractionDigits: 2 })

/** v1 calcLux() 的 React 版：E = I ÷ d²，并给出 10 m / 25 m 两套体系的互换 */
export function LuxCalculator() {
  const [rawI, setRawI] = useState('10000')
  const [rawD, setRawD] = useState('25')
  const I = parseFloat(rawI)
  const d = parseFloat(rawD)
  const valid = Number.isFinite(I) && Number.isFinite(d) && d > 0
  const E = valid ? I / (d * d) : null

  return (
    <div className="calc" style={{ gridTemplateColumns: '1fr' }}>
      <div>
        <div className="field">
          <label htmlFor="calcI">光强 I（cd）</label>
          <input id="calcI" type="number" min="0" step="100" value={rawI} onChange={(e) => setRawI(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="calcD">测试距离 d（m）</label>
          <input id="calcD" type="number" min="0.1" step="0.5" value={rawD} onChange={(e) => setRawD(e.target.value)} />
        </div>
      </div>
      <div className="result">
        <div className="rl">该方向在该距离屏上的照度 E</div>
        <div className="rv">{E === null ? '—' : fmt(E) + ' lx'}</div>
        <div className="rx">
          {E === null ? '请输入有效数值' : `E = I ÷ d² = ${fmt(I)} ÷ ${fmt(d)}² = ${fmt(E)} lx`}
        </div>
        <div className="mini">
          <div><b>{E === null ? '—' : fmt(I / 100) + ' lx'}</b><span>同一光强在 10 m 屏（I÷100）</span></div>
          <div><b>{E === null ? '—' : fmt(I / 625) + ' lx'}</b><span>同一光强在 25 m 屏（I÷625）</span></div>
          <div><b>{E === null ? '—' : fmt(E * 100) + ' cd'}</b><span>反推 10 m 体系光强（E×100）</span></div>
          <div><b>{E === null ? '—' : fmt(E * 625) + ' cd'}</b><span>反推 25 m 体系光强（E×625）</span></div>
        </div>
      </div>
    </div>
  )
}

/** v1 calcMargin() 的 React 版：下限 ×1.3 / 上限 ×0.8 的研发内控目标 */
export function MarginCalculator() {
  const [rawVal, setRawVal] = useState('12100')
  const [kind, setKind] = useState<'1' | '0'>('1')
  const v = parseFloat(rawVal)
  const valid = Number.isFinite(v) && v >= 0

  return (
    <>
      <div className="field">
        <label htmlFor="marginVal">标准限值（输入数字，如 12100 或 350）</label>
        <input id="marginVal" type="number" min="0" step="10" value={rawVal} onChange={(e) => setRawVal(e.target.value)} />
      </div>
      <div className="field">
        <label htmlFor="marginKind">限值类型</label>
        <select id="marginKind" value={kind} onChange={(e) => setKind(e.target.value as '1' | '0')}>
          <option value="1">下限点（要够亮，如 75R / 50V / Imax）</option>
          <option value="0">上限点（别太亮，如 B50L / Ⅲ区）</option>
        </select>
      </div>
      <div className="result">
        {!valid ? (
          <>
            <div className="rv">—</div>
            <div className="rx">请输入有效的标准限值</div>
          </>
        ) : kind === '1' ? (
          <>
            <div className="rl">研发内控目标（下限点 ×1.3） · 量产下限（×0.8）</div>
            <div className="rv">≥ {fmt(v * 1.3)} cd</div>
            <div className="mini">
              <div><b>≥ {fmt(v * 0.8)}</b><span>量产一致性下限</span></div>
              <div><b>+{((1.3 - 0.8) * 100).toFixed(0)}%</b><span>设计端到量产的安全余量</span></div>
            </div>
            <div className="rx">依据：进阶培训 V6.7 §8.1 与 §12.3。例：75R 标准 12 100 → 内控 ≥15 700 cd。</div>
          </>
        ) : (
          <>
            <div className="rl">研发内控目标（上限点 ×0.8）</div>
            <div className="rv">≤ {fmt(v * 0.8)} cd</div>
            <div className="mini">
              <div><b>≥ {fmt(v - v * 0.8)}</b><span>预留的绝对余量</span></div>
              <div><b>表 10~14</b><span>量产上限须查显式值</span></div>
            </div>
            <div className="rx">依据：进阶培训 V6.7 §8.1 / §6.4。量产上限不能一律 ×1.2（如 BS 1 区 700 → 955，≈×1.36）。</div>
          </>
        )}
      </div>
    </>
  )
}
