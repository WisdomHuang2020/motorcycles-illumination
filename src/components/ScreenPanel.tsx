import { useState } from 'react'
import { BEAM_POINTS, SCREEN_KEYS, type PointKind, type ScreenKey } from '../data'
import { SrcTag } from './ui'

const KIND_TEXT: Record<PointKind, string> = {
  min: '下限（要够亮）', max: '上限（别太亮）', both: '双限', ref: '基准'
}
const KIND_COLOR: Record<PointKind, string> = {
  min: '#5EEAD4', max: '#F27D6A', both: '#F6B26B', ref: '#9FB6D8'
}

/** v1 renderScreen / showPoint 的 React 版：四套点位 + 点击圆点查看限值 */
export default function ScreenPanel() {
  const [key, setKey] = useState<ScreenKey>('cv')
  const [sel, setSel] = useState(0)
  const pts = BEAM_POINTS[key]

  const xs = pts.map((p) => p.x).concat([0])
  const ys = pts.map((p) => p.y).concat([0])
  const xmin = Math.min(Math.min(...xs) - 2, -10)
  const xmax = Math.max(Math.max(...xs) + 2, 10)
  const ymin = Math.min(Math.min(...ys) - 1.2, -3)
  const ymax = Math.max(Math.max(...ys) + 1.2, 3)
  const X = (v: number) => 60 + ((v - xmin) / (xmax - xmin)) * 680
  const Y = (v: number) => 360 - ((v - ymin) / (ymax - ymin)) * 320
  const y0 = Y(0)
  const x0 = X(0)

  function pick(k: ScreenKey) {
    setKey(k)
    setSel(0)
  }

  const p = pts[sel] ?? pts[0]

  return (
    <>
      <div className="tabs" role="tablist" aria-label="配光屏体系切换">
        {SCREEN_KEYS.map(({ key: k, label }) => (
          <button
            key={k}
            type="button"
            role="tab"
            aria-selected={key === k}
            className={key === k ? 'on' : undefined}
            onClick={() => pick(k)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="screen-grid">
        <div className="screen-box">
          <svg
            className="screen-svg"
            viewBox="0 0 800 400"
            role="img"
            aria-label="配光测试屏点位交互图，点击圆点查看限值"
          >
            <defs>
              <linearGradient id="scrGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#E8A33D" stopOpacity="0.05" />
                <stop offset="1" stopColor="#E8A33D" stopOpacity="0.42" />
              </linearGradient>
            </defs>
            <rect x="60" y="40" width="680" height="320" rx="8" fill="#0A1222" stroke="#2B3550" />
            <rect x="60" y="40" width="680" height={Math.max(0, y0 - 40)} fill="#060D1B" opacity="0.55" />
            <rect x="60" y={y0} width="680" height={Math.max(0, 360 - y0)} fill="url(#scrGrad)" />
            {/* 网格线只作背景，不能吞掉落在点位附近的点击 */}
            <g stroke="#1E2A42" strokeWidth="1" pointerEvents="none">
              {[90, 150, 210, 270, 330].map((y) => <line key={'sy' + y} x1="60" y1={y} x2="740" y2={y} />)}
              {[160, 280, 400, 520, 640].map((x) => <line key={'sx' + x} x1={x} y1="40" x2={x} y2="360" />)}
            </g>

            {key === 'cv' && (
              <>
                <path
                  d={`M60,${Y(-0.57)} L${X(0)},${Y(-0.57)} L740,${Y(0.9)}`}
                  fill="none" stroke="#FFD9A0" strokeWidth="2.5" opacity="0.9"
                />
                <text x="66" y={Y(-0.57) - 8} fill="#FFD9A0" fontSize="11">明暗截止线（左平 / 右上扬 15°）</text>
              </>
            )}
            {(key === 'bs' || key === 'ebike') && (
              <>
                <path
                  d={`M60,${Y(key === 'ebike' ? 0 : -0.57)} L740,${Y(key === 'ebike' ? 0 : -0.57)}`}
                  fill="none" stroke="#FFD9A0" strokeWidth="2.5" opacity="0.9"
                />
                <text x="66" y={Y(key === 'ebike' ? 0 : -0.57) - 8} fill="#FFD9A0" fontSize="11">
                  {key === 'ebike' ? 'H-H 明暗截止线' : '水平平直截止线（H-H 下 0.57°）'}
                </text>
              </>
            )}
            {key === 'high' && (
              <>
                <ellipse cx={x0} cy={y0} rx="120" ry="60" fill="#FFD9A0" opacity="0.14" />
                <text x="66" y="60" fill="#FFD9A0" fontSize="11">远光无截止线 · 中心亮、横向逐级铺开</text>
              </>
            )}

            <line x1="60" y1={y0} x2="740" y2={y0} stroke="#9FB6D8" strokeWidth="1.1" strokeDasharray="3 5" opacity="0.7" />
            <line x1={x0} y1="40" x2={x0} y2="360" stroke="#9FB6D8" strokeWidth="1.1" strokeDasharray="3 5" opacity="0.7" />
            <text x="744" y={y0 - 5} fill="#8B96AE" fontSize="11" fontFamily="monospace">H-H</text>
            <text x={x0 + 5} y="34" fill="#8B96AE" fontSize="11" fontFamily="monospace">V-V</text>

            {pts.map((pt, i) => {
              const col = KIND_COLOR[pt.kind]
              const lx = pt.x > xmax - 4 ? -8 : 9
              return (
                <g key={pt.id} className="pt" style={{ cursor: 'pointer' }} onClick={() => setSel(i)}>
                  {/* fill="transparent" 在部分浏览器不算 painted，必须显式声明可命中 */}
                  <circle cx={X(pt.x)} cy={Y(pt.y)} r="12" fill="transparent" pointerEvents="all" />
                  <circle cx={X(pt.x)} cy={Y(pt.y)} r="5.5" fill={col} stroke="#0A1222" strokeWidth="1.2" pointerEvents="all" />
                  <text
                    x={X(pt.x) + (lx < 0 ? -8 : 8)} y={Y(pt.y) - 8}
                    fill={col} fontSize="11" fontWeight="700"
                    textAnchor={lx < 0 ? 'end' : 'start'}
                  >
                    {pt.id}
                  </text>
                </g>
              )
            })}
            <text x="60" y="384" fill="#6F7C99" fontSize="11">水平/垂直角度示意 · 点击圆点查看限值 · 角度与限值以标准表为准</text>
          </svg>
        </div>

        <div className="point-detail">
          <div>
            <span className="pd-id">{p.id}</span>
            <span className={'pd-kind ' + p.kind}>{KIND_TEXT[p.kind]}</span>
          </div>
          <div className="pd-val">{p.c}</div>
          <div className="pd-val2">{p.v}</div>
          <div className="pd-desc">{p.desc}</div>
          <div className="pd-hint">
            坐标（示意）：水平 {p.x}° / 垂直 {p.y}°　·　来源 <SrcTag>{p.src}</SrcTag>
          </div>
        </div>
      </div>
    </>
  )
}
