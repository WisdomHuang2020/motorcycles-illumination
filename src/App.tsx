import { useEffect, useState } from 'react'
import type { TableKey } from './data'
import ThemeSwitcher from './components/ThemeSwitcher'
import BeamPanel from './components/BeamPanel'
import ScreenPanel from './components/ScreenPanel'
import { LuxCalculator, MarginCalculator } from './components/Calculators'
import FlowBox from './components/FlowBox'
import QuizBox from './components/QuizBox'
import QuickSearch from './components/QuickSearch'
import { Callout, DataTableBlock, FigCard, Notice, Section, SrcTag, TableHeadRow } from './components/ui'
import {
  AppendixCriteriaTable, ConflictsList, EbikeTestTable, MotorcycleTestTable,
  PathTable, PitfallsList, SampleDataBlock, SourcesList, StandardsBlock
} from './components/content'

const NAV = [
  { href: '#home', label: '首页' },
  { href: '#basis', label: '01 基础' },
  { href: '#screen', label: '02 配光屏' },
  { href: '#paths', label: '03 合规路径' },
  { href: '#tables', label: '04 逐表速查' },
  { href: '#workflow', label: '05 设计流程' },
  { href: '#test', label: '06 测试照准' },
  { href: '#control', label: '07 内控' },
  { href: '#pitfalls', label: '08 翻车案例' },
  { href: '#quiz', label: '09 自测' },
  { href: '#caveats', label: '10 资料口径' }
] as const

const LOW_TABLES: { key: TableKey; label: string }[] = [
  { key: 'bs', label: '表 3 · BS 级' },
  { key: 'csds', label: '表 4 · CS / DS 级' },
  { key: 'cv', label: '表 5 · C / V 级' }
]

export default function App() {
  const [navOpen, setNavOpen] = useState(false)
  const [activeHref, setActiveHref] = useState<string>('#home')
  const [lowTable, setLowTable] = useState<TableKey>('bs')

  /* v1 initNav()：滚动高亮当前章节；点击导航收起移动端目录 */
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY + 110
      let cur = 0
      NAV.forEach((n, i) => {
        const el = document.querySelector(n.href) as HTMLElement | null
        if (el && el.offsetTop <= y) cur = i
      })
      setActiveHref(NAV[cur].href)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      {/* ============ 顶部导航 ============ */}
      <header className="topbar">
        <div className="bar">
          <div className="brand">
            <i className="mark" />
            <b>MOTORCYCLES ILLUMINATION</b>
            <span>二轮车照明配光技术站</span>
          </div>
          <ThemeSwitcher />
          <button
            className="nav-toggle"
            type="button"
            aria-label="展开导航"
            aria-expanded={navOpen}
            onClick={() => setNavOpen((v) => !v)}
          >
            目录 ▾
          </button>
          <nav className={'navlinks' + (navOpen ? ' open' : '')} aria-label="章节导航">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className={activeHref === n.href ? 'active' : undefined}
                onClick={() => setNavOpen(false)}
              >
                {n.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* ============ HERO ============ */}
      <div className="hero" id="home">
        <div className="hero-inner">
          <div>
            <div className="eyebrow">Photometric Engineering · Technical Knowledge Base</div>
            <h1>把二轮车灯的<br /><em>每一个测试点</em>讲明白</h1>
            <p className="lede">
              GB 19152-2025 与 GB/T 31887.1-2019，一套是 25 m 屏上的 cd，一套是 10 m 屏上的 lx。本站把内部培训资料整理成可交互的配光知识站：逐表速查、测试点定位、设计流程、照准实操、研发内控与自测。
            </p>
            <div className="chips">
              <span className="hot">摩托车 · GB 19152-2025 · 25 m · cd</span>
              <span>电动自行车 · GB/T 31887.1-2019 · 10 m · lx</span>
              <span>进阶培训 V6.7 · 76 页</span>
              <span>教程 Rev3.3 · 14 页</span>
              <span>全流程教程 · 11 章 + 附录</span>
            </div>
            <div className="hero-cta">
              <a className="btn btn-primary" href="#screen">打开交互配光屏 →</a>
              <a className="btn btn-ghost" href="#tables">查标准限值</a>
            </div>
            <div className="hero-meta">
              资料来源：益明光电（无锡）· 实益达 SEA STAR 研发中心《电动摩托车光型配光进阶培训 V6.7》等，2026-08。<br />
              本站为培训资料的整理与可视化，<b>不替代标准原文</b>；认证判定以标准原文及检测机构意见为准。资料内部存在矛盾之处，见第 10 节。
            </div>
          </div>
          <BeamPanel />
        </div>
      </div>

      <main className="wrap">
        <div className="notice" style={{ marginTop: 26 }}>
          <span className="ni">阅读前须知</span>
          <span>
            本站所有数值均标注资料来源编号（S1~S7）。<b>资料之间存在互相矛盾的记载</b>（如 75R 限值、GB/T 31887.1-2019 的版本状态、电自是否允许远光），已逐条列在 <a href="#caveats">第 10 节「资料口径与待核项」</a>，本站不做静默统一。凡涉及认证判定的数值，请回查标准原文。
          </span>
        </div>

        {/* ============ 01 基础 ============ */}
        <Section id="basis" no="01" title="先记住三条结论" sub="cd / lx / 距离平方反比">
          <div className="kpi-row">
            <div className="kpi orange"><div className="v">25 m <small>· cd</small></div><div className="k">摩托车走「机动车」路线，在灯前 25 m 测发光强度（坎德拉）。GB 19152-2025 6.1.7。</div></div>
            <div className="kpi teal"><div className="v">10 m <small>· lx</small></div><div className="k">电动自行车随整车走「非机动车」路线，在灯前 10 m 测照度（勒克斯）。GB/T 31887.1-2019。</div></div>
            <div className="kpi"><div className="v">E = I ÷ d²</div><div className="k">两者是同一束光的两种说法。距离固定即可互换；10 m 与 25 m 的照度差 6.25 倍。</div></div>
          </div>

          <div className="grid2">
            <div className="card">
              <h3>概念：光强 vs 照度 <SrcTag>S1 / S2</SrcTag></h3>
              <p><b>光强（cd）</b>是「光源朝某一方向发出的光有多猛」，属于灯自身属性，与距离无关。<b>照度（lx）</b>是「光打到某个面上，那个面有多亮」，随距离平方衰减。</p>
              <p>标准要规定的其实是：在 10 m 或 25 m 那面墙上，<b>哪里必须亮（下限）、哪里绝不能亮（上限）</b>。</p>
              <Callout kind="orange" title="一句话记忆">摩托车说 cd、测 25 m；电自说 lx、测 10 m。数值不能直接比较，先统一单位与距离。</Callout>
            </div>
            <div className="card">
              <h3>交互式换算器 <SrcTag>S1 / S2</SrcTag></h3>
              <LuxCalculator />
              <p className="tbl-note">举例（S2 第 56 页）：I = 10 000 cd → 10 m 处 100 lx、25 m 处 16 lx，比值 6.25。教程 Rev3.3 换算举例：摩托车 50V ≥5 100 cd 折合 25 m 屏约 8.2 lx；电自 A 点 ≥10 lx 折合约 1 000 cd。</p>
            </div>
          </div>
        </Section>

        {/* ============ 02 配光屏 ============ */}
        <Section id="screen" no="02" title="配光屏与测试点命名" sub="一面墙 · 一套坐标 · 一套命名规则">
          <p className="lead">
            暗室中把灯放在测角仪支架上，正前方立一面测试屏；受光器沿屏幕逐点扫描。屏幕以 <b className="mono">HV</b> 为原点，建立 <b className="mono">H-H</b>（水平）与 <b className="mono">V-V</b>（垂直）坐标系。<SrcTag>S1 / S2</SrcTag>
          </p>

          <ScreenPanel />

          <Callout kind="orange" title={<>点名里的数字是道路距离（米），不是角度 <SrcTag>S2 第 10 页</SrcTag></>}>
            由 0.75 m 安装高度反推：50 → 0.86°D（tan⁻¹ 0.75/50）、75 → 0.57°D、25 → 1.72°D。<b className="mono">B50L</b>＝左 3.43°、上 0.57°，正是对向 50 m 处驾驶员眼睛的位置。方位字母：U 上 / D 下 / R 右 / L 左（标准 6.1.8）。
          </Callout>
          <Callout kind="warn" title="照准是前提（GB 19152-2025 6.3.1）">
            非对称近光：截止线转角必须压在 V-V 线上，水平部分位于 H-H 线以下 <b className="mono">0.57°</b>（25 m 屏上约低 25 cm）。照准不准，后面所有 cd / lx 数值都作废。
          </Callout>

          <div className="grid2 spacer">
            <FigCard src="/img/配光测试点位置图.png" alt="GB 19152-2025 配光测试点位置图（25 m 屏）">
              <b>原培训插图 · 配光测试点位置图（25 m 屏）</b>：图中标注 1 区 ≤700 cd、Ⅲ 区 ≤625 cd、2 区 ≥1100 cd 等。注意该图混用了不同级别的点位坐标，属教学示意；<b>点位角度与限值以标准表为准</b>。<SrcTag>S6</SrcTag>
            </FigCard>
            <FigCard src="/img/截止线结构图.png" alt="对称与非对称近光截止线结构对比">
              <b>原培训插图 · 近光明暗截止线结构对比</b>：左为对称近光（BS/CS/DS）水平平直截止线，右为非对称近光（C/V）右侧 15° 上扬的肘肩。<SrcTag>S6</SrcTag>
            </FigCard>
          </div>
        </Section>

        {/* ============ 03 合规路径 ============ */}
        <Section id="paths" no="03" title="两条合规路径" sub="机动车 CCC vs 随整车验收">
          <div className="card">
            <h3>核心差异 <SrcTag>S1 / S2 / S4</SrcTag></h3>
            <PathTable />
            <p className="tbl-note">
              电动自行车标准状态存在重要争议：标准体系 xlsx 记载 GB/T 31887.1-2019 已于 2026-05-01 废止、2025 版删除电自适用范围，但 GB 17761-2024 仍引用 2019 版；且该 xlsx「问题5」称电自禁止远光，而进阶培训 V6.7 第 9.3 节讲解电自远光表 4。两者已列入 <a href="#caveats">待核项 C3 / C4</a>。
            </p>
          </div>

          <div className="spacer" />
          <TableHeadRow title="标准体系逐维度对照" src="S4" sub="摩托车有完整标准链，电自存在体系断裂" />
          <StandardsBlock />

          <Callout kind="warn" title="市场层面的系统性问题（S4「问题4」，观察性结论，B 级可信度）">
            配光标准引用已废止版本、安装标准错位、环境可靠性标准空白、反射器标准版本争议；车灯无独立 CCC、电商与改装市场大量无截止线裸 LED；产品层面存在光型不合格、色温乱标、功率虚标、防水虚标、安装随意。该表自评可信度 B 级（市场观察 / 电商调研），本站按定性结论引用，不作为判据。
          </Callout>

          <div className="grid2 spacer">
            <FigCard src="/img/近光级别对比图.png" alt="近光各级别关键测试点限值对比柱状图">
              <b>原培训插图 · 近光各级别关键测试点限值对比</b>：50V 下限、50L~50R 线下限、1 区/Ⅲ 区上限。BS 2200/1100/700，CS 2450/1100/700，DS 4900/2200/700，V 5100/1800/625，C 5100/2540/625（cd）。<SrcTag>S6</SrcTag>
            </FigCard>
            <FigCard src="/img/远光级别对比图.png" alt="远光各级别 Imax / HV 限值对比柱状图">
              <b>原培训插图 · 远光各级别 Imax / HV 限值对比</b>：A 级 27 000 / 8 000，B 级 40 000 / 8 000，BS 级 20 000 / 16 000（cd）。<SrcTag>S6</SrcTag>　注：该图 A/B 的 HV 取 8 000 cd，与进阶培训表 8「HV ≥0.8×Imax」不一致，见待核项 C5。
            </FigCard>
          </div>
        </Section>

        {/* ============ 04 逐表速查 ============ */}
        <Section id="tables" no="04" title="标准表格逐表速查" sub="表 3 / 4 / 5 / 8 / 9 / 10~14 · 电自表 3 / 4">
          <p className="lead">数值为培训资料对 GB 19152-2025 与 GB/T 31887.1-2019 的节选整理，完整要求以标准原文为准。<SrcTag>S1 / S2 / S3</SrcTag></p>

          <h3 className="blk-title">近光配光表</h3>
          <div className="tabs" role="tablist" aria-label="近光配光表切换">
            {LOW_TABLES.map((t) => (
              <button
                key={t.key}
                type="button"
                role="tab"
                aria-selected={lowTable === t.key}
                className={lowTable === t.key ? 'on' : undefined}
                onClick={() => setLowTable(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>
          <DataTableBlock tableKey={lowTable} />

          <div className="spacer" />
          <h3 className="blk-title">远光 · 表 8</h3>
          <DataTableBlock tableKey="high" />
          <Callout kind="teal" title={<>0.8×Imax 为什么存在 <SrcTag>S2 第 29 页</SrcTag></>}>
            Imax 可能落在偏心位置（例如某颗透镜焦点偏了）。HV 必须独立设下限，防止「边缘很亮、正前方反而黑」的空心光斑；中心与峰值差不得超过 20%。
          </Callout>

          <div className="spacer" />
          <h3 className="blk-title">ADB 自适应远光 · 表 9（仅 L3/L4/L5）</h3>
          <div className="grid2">
            <DataTableBlock tableKey="adbA" />
            <div>
              <DataTableBlock tableKey="adbB" />
              <Callout kind="orange" title={<>三条附加规则 <SrcTag>S2 第 35 页</SrcTag></>}>
                中性状态（未检测到来车）须满足 5.7.4 远光要求；成对安装单侧 HV ≥16 200 cd；其余点取两侧平均值判定；近光参与且达标时 B 部分可免测。
              </Callout>
            </div>
          </div>

          <div className="spacer" />
          <h3 className="blk-title">电动自行车 · GB/T 31887.1（10 m 屏，lx）</h3>
          <div className="grid2">
            <DataTableBlock tableKey="ebikeLow" />
            <DataTableBlock tableKey="ebikeHigh" />
          </div>
          <Callout title={<>电自信号灯要点 <SrcTag>S2 第 55 页</SrcTag></>}>
            转向灯 1~2 Hz、占空比 45%~55%、光强 50~350 cd（不是 1.5~2.5 Hz）；制动灯 ≥40 cd 或 ≥5×后灯最大值（取高者）、≤185 cd；前/后位置灯持续发光或 1~4 Hz 闪光。
          </Callout>

          <div className="spacer" />
          <h3 className="blk-title">光通量与生产一致性</h3>
          <div className="grid2">
            <DataTableBlock tableKey="flux" />
            <DataTableBlock tableKey="conformance" />
          </div>

          <div className="spacer" />
          <div className="card">
            <h3>限值速查（跨表检索） <SrcTag>全站表格</SrcTag></h3>
            <QuickSearch />
          </div>
        </Section>

        {/* ============ 05 设计流程 ============ */}
        <Section id="workflow" no="05" title="摩托车前照灯设计全流程" sub="三阶段十五步 · 从立项到市场监督">
          <p className="lead">节点标题与副标题逐字取自「设计全流程图」；点击任一节点查看工程说明与依据。<SrcTag>S6 / S3</SrcTag></p>
          <div className="card"><FlowBox /></div>

          <div className="spacer" />
          <FigCard src="/img/设计全流程图.png" alt="摩托车前照灯设计全流程：三阶段十五步">
            <b>原培训插图 · 设计全流程图</b>：设计阶段（需求分析 → LED 选型 → 光学设计 → 仿真验证 → 原型制作）、验证阶段（暗室测试 → 分布光度计 → 报告判定 → 稳定性验证 → 型式试验）、量产阶段（生产一致性 → 来料检验 → 在线配光 → 出厂检验 → 市场监督）。<SrcTag>S6</SrcTag>
          </FigCard>

          <div className="spacer" />
          <TableHeadRow title="样件实测数据" src="S3 / S6" sub="数据取自全流程教程实测记录" />
          <SampleDataBlock />
          <Callout kind="teal" title={<>区域光通量的旋转不变性 <SrcTag>S3 第 7.2 节</SrcTag></>}>
            区域Ⅰ＝30L~30R / 1U~15D，区域Ⅱ＝30L~30R / 1U~3.5D（含于Ⅰ内）。绕光轴旋转不改变区域光通量，因此其判定与照准无关；IES 的 candela multiplier 偏差只影响绝对值，不影响角度分布占比。
          </Callout>
        </Section>

        {/* ============ 06 测试照准 ============ */}
        <Section id="test" no="06" title="测试设置与照准实操" sub="25 m / cd / 照准 vs 10 m / lx / 直测">
          <p className="lead">同一间暗室，两套摆法，一步摆错全部白测。<SrcTag>S2 第 11 章</SrcTag></p>
          <div className="grid2">
            <div className="card">
              <h3>摩托车 · 25 m 场（先照准、后测点）</h3>
              <p><b>核心条款（GB 19152-2025 第 6 章）</b></p>
              <MotorcycleTestTable />
              <p className="tbl-note">动手四步：布场 → 定位 → 近光照准 → 远光照准，顺序不能反。组合灯（远近光共用调光机构）远光必须在近光照准后的位置直接测量，不允许单独调整（6.2 条）。供电稳压，LED 测试电压 13.2 V（附录 H）；试验条件 23 ℃±5 ℃、湿度 ≤80%、一级照度计（6.1.3 / 6.1.5）。</p>
            </div>
            <div className="card">
              <h3>电动自行车 · 10 m 场（摆正就能测）</h3>
              <p><b>核心条款（GB/T 31887.1-2019 第 5 章，依 S2 第 64 页整理）</b></p>
              <EbikeTestTable />
              <p className="tbl-note">动手三步：布场 → 装灯 → 测量，不调灯、不复位、一次测完。<b>口诀：「摆正就能测」</b> —— 无照准、无下倾、直接读 lux。H-H 未在安装说明中定义时二选一：以上照度 ≤2 lx 的线，或 Emax 所在线之上 3.5° 的线。</p>
            </div>
          </div>
          <Callout kind="warn" title={<>开测前 10 秒自检清单 <SrcTag>S2 第 68 页</SrcTag></>}>
            摩托车：距离 25 m □　基准中心重合 □　水平对 V-V □　垂直压 0.57° □　远光 Imax 对 HV □　稳压供电 □<br />
            电自：10 m 屏 □　光轴水平且与 HV 同高 □　逐点直读 lux □　免照准不下倾 □　按标称电压供电 □　暗室无杂散光 □
          </Callout>
        </Section>

        {/* ============ 07 内控 ============ */}
        <Section id="control" no="07" title="稳定性 · 生产一致性 · 研发内控" sub="附录 C / D / E · 表 10~14 · 1.3× / 0.8×">
          <div className="grid2">
            <div className="card">
              <h3>附录 C / D / E 判据 <SrcTag>S2 第 38~40 页</SrcTag></h3>
              <AppendixCriteriaTable />
            </div>
            <div className="card">
              <h3>研发内控余量计算器 <SrcTag>S2 §8.1 / §12.3</SrcTag></h3>
              <MarginCalculator />
              <p className="tbl-note">1.3× / 0.8× 是资料给出的行业常用内控经验值，用于覆盖透镜公差、灯珠批次差异与热态光衰。它<b>不是标准条文</b>，是研发设计目标。</p>
            </div>
          </div>

          <div className="spacer" />
          <div className="grid2">
            <FigCard src="/img/稳定性测试时间线.png" alt="附录 C/D 稳定性测试时间线">
              <b>原培训插图 · 附录 C/D 稳定性测试时间线</b>：点亮 → 1 分钟判定 → 持续点亮 → 热稳定（&lt;3%/15 min）→ 稳定态判定 → 12 小时耐久 → B50L ≤170 cd / 截止线漂移 → 判定完成。<SrcTag>S6</SrcTag>
            </FigCard>
            <FigCard src="/img/光学损失链.png" alt="近光与远光光学效率链">
              <b>原培训插图 · 近光 / 远光光学效率链</b>：近光 520 → 442 → 332 → 312 → 210 lm；远光 980 → 784 → 549 → 505 → 430 lm。括号百分比为各环节保留率。<SrcTag>S6</SrcTag>
            </FigCard>
          </div>

          <Callout kind="teal" title={<>开模前六项 Checklist <SrcTag>S2 第 48 页</SrcTag></>}>
            ① 配光：75R / B50L / HV / Imax 四点全核，余量 ≥1.3× / ≤0.8×　② 截止线：清晰度 + 转角对准 V-V，偏移 &lt;1.0 mrad　③ 热态：稳定态衰减仿真 ≤余量，散热路径确认　④ 材料：塑料透镜耐候 / 耐化学 / 附着力按附录 E　⑤ 电控：供电稳压、ADB 分区响应与标定　⑥ 一致性：量产工艺公差 → 配光容差预算。
          </Callout>
          <Callout kind="warn" title={<>六个常见误区 <SrcTag>S2 第 49 页</SrcTag></>}>
            只看下限不看上限 · 瓦数＝亮度 · 冷态合格就交差 · 截止线「差不多就行」 · 拿电自数值套摩托车 · 忽略生产一致性。
          </Callout>
        </Section>

        {/* ============ 08 翻车案例 ============ */}
        <Section id="pitfalls" no="08" title="常见坑与案例复盘" sub="实测 → 回流校准仿真 → 回归优化">
          <p className="lead">前两例取自进阶培训 V6.7 §12.6，后四例取自《摩托车前照灯设计全流程教程》第十一章；均为资料记录的真实或典型翻车。<SrcTag>S2 / S3</SrcTag></p>
          <div className="grid2"><PitfallsList /></div>
          <Callout kind="orange" title={<>复盘方法论 <SrcTag>S2 §8.4 / §12.6</SrcTag></>}>
            仿真 → 打样 → 实测 → 回归，四步闭环；实测数据必须回流校准仿真模型。两个认证翻车案例都输在「余量没留够」：一个仿真只留 1.05×，一个没有按 0.8× 控防眩上限。
          </Callout>
        </Section>

        {/* ============ 09 自测 ============ */}
        <Section id="quiz" no="09" title="十二道自测题" sub="答不上来就回头翻对应章节">
          <p className="lead">题目与解析逐字取自进阶培训 V6.7 第 59~60 页。选择后立即显示答案与解析。<SrcTag>S2</SrcTag></p>
          <QuizBox />
        </Section>

        {/* ============ 10 资料口径 ============ */}
        <Section id="caveats" no="10" title="资料口径与待核项" sub="矛盾不抹平 · 来源可追溯">
          <Notice label="直谏">
            培训资料并非自洽。以下 6 项是我在逐份读取后发现的<b>互相矛盾记载</b>，网站按「采用哪份 + 保留哪份」明写处理，<b>没有替资料做静默统一</b>。涉及产品定义、认证申报或对外承诺时，请回查标准原文与检测机构意见。
          </Notice>
          <ConflictsList />

          <div className="spacer" />
          <TableHeadRow title="资料来源清单" src="S1~S7" sub="全部文件位于工作区「培训」目录（S7 为视觉规范）" />
          <SourcesList />

          <Callout title="未纳入本站的内容">
            「签到表.pdf」为 2026-08-18「二轮车灯入门基础培训」手写签到扫描件，含姓名与工号等个人信息，不纳入公开页面；「关于二轮车车灯相关的一些问题.md」仅列出 5 个待答问题、无答案，本站只引用其题目所指向的标准体系 xlsx 结论；能力展示 PPT 项目（design.md / outline.md）仅用于视觉规范，未作为技术数值来源。
          </Callout>
          <Callout kind="warn" title="免责与适用范围">
            本站是培训资料的通俗解读与可视化整理，覆盖摩托车（含轻便摩托车 L1~L5）与电动自行车前照灯。所有示意图为教学示意、非按比例。数值为 GB 19152-2025 表 3/4/5/8/9、附录 C/D/E、表 10~14 与 GB/T 31887.1-2019 表 3/4 的节选。<b>不替代标准原文</b>，认证判定以标准原文及检测机构意见为准。
          </Callout>
        </Section>
      </main>

      <footer>
        <div className="foot-inner">
          <div>
            <b>MOTORCYCLES ILLUMINATION</b> · 二轮车照明配光技术站<br />
            <span className="muted">内容基础：益明光电（无锡）· 实益达 SEA STAR 研发中心培训资料（2026-08）</span><br />
            <span className="muted">视觉规范：power-knowledge.tech 站群通用 8 套主题（主入口 / LLC 系列一致）</span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <b>资料版本</b><br />
            <span className="muted">进阶培训 V6.7 · 教程 Rev3.3 · 全流程教程 2026-08</span><br />
            <span className="muted">Vite · React · TypeScript · Tailwind 4 构建，无后端依赖</span><br />
            <span className="app-version">{__APP_VERSION__}</span>
          </div>
        </div>
      </footer>
    </>
  )
}
