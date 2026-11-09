import { useState } from 'react'
import { BEAM_MODES, BEAM_MODE_LIST, type BeamMode } from '../data'

/**
 * Hero 光型四态切换（v1 renderBeam 的 React 版）。
 * 教学光型图是暗室配光屏的物理示意，画布固定深色，不随主题反转；
 * 外框、分段按钮与说明文字则走主题变量。
 *
 * note / extra 是站内硬编码的静态 SVG/HTML 片段（逐字来自 v1 常量，
 * 不含任何用户输入），因此这里保留 dangerouslySetInnerHTML 以避免把
 * 教学标注拆成几十个 JSX 节点后反而丢格式。
 */
export default function BeamPanel() {
  const [mode, setMode] = useState<BeamMode>('asym')
  const m = BEAM_MODES[mode]

  return (
    <div className="beam-panel">
      <div className="panel-head">
        <span className="lbl">BEAM PATTERN · 光型切换</span>
        <div className="seg" role="tablist" aria-label="光型切换">
          {BEAM_MODE_LIST.map((k) => (
            <button
              key={k}
              type="button"
              role="tab"
              aria-selected={mode === k}
              className={mode === k ? 'on' : undefined}
              onClick={() => setMode(k)}
            >
              {BEAM_MODES[k].label}
            </button>
          ))}
        </div>
      </div>

      <svg
        className="beam-svg"
        viewBox="0 0 800 400"
        role="img"
        aria-label="配光屏光型示意，可切换对称近光、非对称近光、远光、电动自行车近光"
      >
        <defs>
          <linearGradient id="beamGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#E8A33D" stopOpacity="0.10" />
            <stop offset="0.45" stopColor="#E8A33D" stopOpacity="0.48" />
            <stop offset="1" stopColor="#E8A33D" stopOpacity="0.88" />
          </linearGradient>
          <filter id="glowB">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <rect x="40" y="40" width="720" height="320" rx="10" fill="#0A1222" stroke="#2B3550" />
        <g stroke="#1E2A42" strokeWidth="1">
          {[100, 160, 220, 280, 340].map((y) => <line key={'y' + y} x1="40" y1={y} x2="760" y2={y} />)}
          {[160, 280, 400, 520, 640].map((x) => <line key={'x' + x} x1={x} y1="40" x2={x} y2="360" />)}
        </g>
        <path d={m.shape} fill="url(#beamGrad)" />
        <path d={m.dark} fill="#060D1B" opacity="0.86" />
        {m.cut && <path d={m.cut} fill="none" stroke="#FFD9A0" strokeWidth="3.5" filter="url(#glowB)" />}
        <line x1="40" y1="210" x2="760" y2="210" stroke="#8B96AE" strokeWidth="1.2" strokeDasharray="3 5" opacity="0.65" />
        <line x1="400" y1="40" x2="400" y2="360" stroke="#8B96AE" strokeWidth="1.2" strokeDasharray="3 5" opacity="0.65" />
        <text x="766" y="205" fill="#8B96AE" fontSize="11" fontFamily="monospace">H</text>
        <text x="405" y="34" fill="#8B96AE" fontSize="11" fontFamily="monospace">V</text>
        <g dangerouslySetInnerHTML={{ __html: m.extra }} />
        <text x="40" y="384" fill="#6F7C99" fontSize="11">教学示意 · 非按比例 · 正面看配光屏 · 亮区在下、暗区在上</text>
      </svg>

      <div className="beam-note" dangerouslySetInnerHTML={{ __html: m.note }} />
    </div>
  )
}
