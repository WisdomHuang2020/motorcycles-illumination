import {
  CONFLICTS, PITFALLS, SAMPLE_DATA, SOURCES, STANDARDS,
  type SampleBar
} from '../data'
import { DataTable, SrcTag } from './ui'

/** 03 · 核心差异表（v1 手写表格，保留逐格 num 标注） */
export function PathTable() {
  return (
    <div className="tbl-wrap">
      <table>
        <thead><tr><th>维度</th><th>摩托车 / 电动摩托车</th><th>电动自行车</th></tr></thead>
        <tbody>
          <tr><td>主标准</td><td className="num">GB 19152-2025</td><td className="num">GB/T 31887.1-2019（版本状态见第 10 节）</td></tr>
          <tr><td>认证路径</td><td>机动车 CCC：前照灯 GB 19152 + 光信号 GB 17510 + 安装 GB 18100</td><td>随整车 GB 17761 验收，灯具不单独 CCC</td></tr>
          <tr><td>测试距离 / 单位</td><td className="num">25 m / cd</td><td className="num">10 m / lx</td></tr>
          <tr><td>防眩目（上限）</td><td>B50L ≤350 cd · Ⅲ区 ≤625 cd · BR ≤1 750 cd</td><td>H-H 及以上 &lt; 2 lx</td></tr>
          <tr><td>照路（下限）</td><td>75R ≥12 100 · 50R ≥10 100 · 50V ≥5 100 cd（C 级）</td><td>A 点 EA ≥10 lx；远光 HV ≥50 lx</td></tr>
          <tr><td>远光核心</td><td>Imax 27 000 / 40 000 cd（整体 ≤215 000 cd），HV ≥0.8×Imax</td><td>HV ≥50 lx 单档</td></tr>
          <tr><td>近光分级</td><td>对称 BS/CS/DS、非对称 C/V；远光 A/B 与次级 BS/CS/DS；ADB 仅 L3/L4/L5</td><td>不分级，按 A 点实测 EA 分档（EA ≤20 / &gt;20 lx）</td></tr>
          <tr><td>换算</td><td className="num">lx = cd ÷ 625</td><td className="num">cd = lx × 100</td></tr>
        </tbody>
      </table>
    </div>
  )
}

/** 03 · 标准体系逐维度对照（S4 定性表 + 不采用冲突数值的说明） */
export function StandardsBlock() {
  return (
    <>
      <DataTable table={STANDARDS} />
      <p className="tbl-note">
        来源：标准体系全面解析 xlsx「问题1-标准体系对比」(S4)。此表为定性对比；该表「问题2」中的具体限值与其他资料冲突，见第 10 节待核项，本站未采用。
      </p>
    </>
  )
}

/** 10 · 六项资料内部矛盾，逐条列出，不做静默统一 */
export function ConflictsList() {
  return (
    <>
      {CONFLICTS.map((c) => (
        <div className="conflict" key={c.id}>
          <div className="ch">
            <span className="mono">{c.id}</span>
            <b>{c.topic}</b>
            <span className={'lvl ' + c.level}>{c.level}优先级</span>
          </div>
          <div className="row"><span className="k">资料 A</span><span>{c.a}</span></div>
          <div className="row"><span className="k">资料 B</span><span>{c.b}</span></div>
          <div className="act">本站处理：{c.act}</div>
        </div>
      ))}
    </>
  )
}

/** 10 · 来源清单 S1~S7 */
export function SourcesList() {
  return (
    <div className="src-grid">
      {Object.entries(SOURCES).map(([id, s]) => (
        <div className="src-item" key={id}>
          <b><span className="sid">{id}</span>{s.name}</b>
          <span>{s.file}<br />{s.unit}　{s.date}</span>
        </div>
      ))}
    </div>
  )
}

/** 08 · 六个翻车案例 */
export function PitfallsList() {
  return (
    <>
      {PITFALLS.map((p) => (
        <div className="pit" key={p.t}>
          <div className="pit-h"><span>{p.t}</span><span className="tag">{p.src}</span></div>
          <div className="pit-b">
            <p><span className="lbl">现象</span>{p.p}</p>
            <p><span className="lbl">根因</span>{p.r}</p>
            <p><span className="lbl">对策</span>{p.f}</p>
          </div>
        </div>
      ))}
    </>
  )
}

/** 05 · 光学效率链柱状图。颜色走主题变量，用透明度递减表达逐级损失 */
function BarChart({ data, max }: { data: SampleBar[]; max: number }) {
  return (
    <div className="bar-chart">
      {data.map((d, i) => (
        <div className="bar-col" key={d.k}>
          <div className="bar-val">{d.s}</div>
          <div
            className="bar-fill"
            style={{ height: Math.round((d.v / max) * 105) + 'px', opacity: 1 - i * 0.13 }}
          />
          <div className="bar-label">{d.k}</div>
        </div>
      ))}
    </div>
  )
}

/** 05 · 样件实测：两张效率链图 + 实测记录表 */
export function SampleDataBlock() {
  return (
    <>
      <div className="grid2">
        <div className="card">
          <h3>近光光学效率链 <SrcTag>S6 / S3</SrcTag></h3>
          <BarChart data={SAMPLE_DATA.near} max={520} />
          <p className="tbl-note">520 lm 裸模组 → 整灯 210 lm；教程记为光学效率约 50%。</p>
        </div>
        <div className="card">
          <h3>远光光学效率链 <SrcTag>S6 / S3</SrcTag></h3>
          <BarChart data={SAMPLE_DATA.far} max={980} />
          <p className="tbl-note">980 lm 裸模组 → 整灯 430 lm；3 颗 LED 方案。</p>
        </div>
      </div>
      <div className="spacer" />
      <div className="tbl-wrap">
        <table>
          <thead><tr><th>项目</th><th>实测 / 记录</th><th>来源</th></tr></thead>
          <tbody>
            {SAMPLE_DATA.facts.map((r, i) => (
              <tr key={i}>
                <td>{r[0]}</td>
                <td>{r[1]}</td>
                <td><SrcTag>{r[2]}</SrcTag></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

/** 06 · 摩托车 25 m 场核心条款 */
export function MotorcycleTestTable() {
  return (
    <div className="tbl-wrap">
      <table style={{ minWidth: 0 }}>
        <thead><tr><th>条款</th><th>要求</th></tr></thead>
        <tbody>
          <tr><td>6.1.7</td><td>测试距离为基准中心前 25 m</td></tr>
          <tr><td>6.1.9</td><td>基准中心与测角计旋转中心重合</td></tr>
          <tr><td>6.3.1.1</td><td>水平：对称光形对 V-V／非对称转角在 V-V</td></tr>
          <tr><td>6.3.1.2</td><td>垂直：截止线水平部分在 H-H 下 0.57°</td></tr>
          <tr><td>6.3.2</td><td>远光：最大发光强度区域中心对 HV</td></tr>
          <tr><td>6.1.6</td><td>受光器有效测量面积 ≤65 mm 正方形</td></tr>
        </tbody>
      </table>
    </div>
  )
}

/** 06 · 电动自行车 10 m 场核心条款 */
export function EbikeTestTable() {
  return (
    <div className="tbl-wrap">
      <table style={{ minWidth: 0 }}>
        <thead><tr><th>项目</th><th>要求</th></tr></thead>
        <tbody>
          <tr><td>测试距离</td><td>10 m，标准直接规定，无需换算</td></tr>
          <tr><td>灯具安装</td><td>固定在支架上，光轴水平，灯具中心与 HV 同高</td></tr>
          <tr><td>照准</td><td>无强制截止线照准；以光轴与屏幕交点为 HV</td></tr>
          <tr><td>坐标系</td><td>H-H 为水平轴、V-V 为垂直轴，直接读 lux</td></tr>
          <tr><td>限值</td><td>直接以 lx 给出（EA ≥10、HV ≥50 lx）</td></tr>
        </tbody>
      </table>
    </div>
  )
}

/** 07 · 附录 C / D / E 判据表 */
export function AppendixCriteriaTable() {
  return (
    <div className="tbl-wrap">
      <table style={{ minWidth: 0 }}>
        <thead><tr><th>项目</th><th>判据</th></tr></thead>
        <tbody>
          <tr><td>附录 C 稳定判据</td><td>15 min 内变化 &lt;3%，或 5 min 内 &lt;1%</td></tr>
          <tr><td>双状态</td><td>点亮 1 min 与热稳定态两状态均须达标</td></tr>
          <tr><td>附录 D · 12 h 后</td><td>B50L ≤170 cd；1.5L/R-0.50U ≤255 cd；其余测试点 ≤10%</td></tr>
          <tr><td>附录 D 截止线漂移</td><td>3 min vs 60 min：上偏 ≤1.0 mrad、下偏 ≤2.0 mrad</td></tr>
          <tr><td>附录 E 耐候性</td><td>5500~6000 K 黑体、1200 W/m²±200、4500 MJ/m²±200；试后透过率变化 ≤0.020</td></tr>
          <tr><td>附录 K 机械磨损后</td><td>非对称近光 B50L ≤最大值 130%、75R ≥最小值 90%；单远光 HV ≥最小值 90%</td></tr>
          <tr><td>生产一致性</td><td>下限 ×0.8；上限按表 10~14 显式值，不能一律 ×1.2</td></tr>
        </tbody>
      </table>
    </div>
  )
}
