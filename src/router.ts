/**
 * 站点路由（无依赖，基于 History API）
 *
 * 2026-11-09 v3.0.0：原本是「一个页面里 10 个章节 + 滚动高亮」，现改为
 * 每个导航项一个独立页面、一个独立 URL。理由与约束：
 *   · 首页从 `/#home` 变为 `/` —— 不带任何 hash；
 *   · 其余章节为 `/basis` `/screen` … `/caveats`，可被收藏、可被分享、可被检索；
 *   · 深链接要求服务器把未知路径回退到 index.html（nginx try_files 配置见 README/CHANGELOG）。
 *
 * 为什么不用 react-router：本站只有 11 个静态页面、无嵌套、无参数、无 loader。
 * 引入一个路由库只为一个 pathname 的字符串比较，不划算；手写 60 行反而更透明。
 */

export type PageId =
  | 'home' | 'basis' | 'screen' | 'paths' | 'tables'
  | 'workflow' | 'test' | 'control' | 'pitfalls' | 'quiz' | 'caveats'
  | 'feedback' | 'admin'

export type Page = {
  id: PageId
  /** 站内绝对路径，首页为 '/' */
  path: string
  /** 章节序号，首页为空串 */
  no: string
  /** 导航与页脚显示的文字 */
  label: string
  /** 页面主标题（用于 <title> 与首页导览卡） */
  title: string
  /** 副标题，导航悬停与首页导览卡使用 */
  sub: string
  /** 供 <meta name="description"> 使用，避免 11 个页面共用一段描述 */
  desc: string
  /** 不在导航与首页导览卡里显示（管理后台入口用） */
  hidden?: boolean
}

/** 站名。首页 <title> 直接用它，其余页面用它作后缀。 */
export const SITE_NAME = '二轮车照明配光技术站'

export const PAGES: readonly Page[] = [
  {
    id: 'home', path: '/', no: '', label: '首页',
    title: SITE_NAME,
    sub: 'cd / lx / 距离平方反比',
    desc: '基于内部培训资料构建的二轮车照明配光技术知识站：GB 19152-2025 与 GB/T 31887.1-2019 逐表速查、配光屏交互、设计全流程、测试照准、研发内控与自测。',
  },
  {
    id: 'basis', path: '/basis', no: '01', label: '01 基础',
    title: '先记住三条结论',
    sub: 'cd / lx / 距离平方反比',
    desc: '摩托车在 25 m 屏测发光强度（cd），电动自行车在 10 m 屏测照度（lx），两者靠 E = I ÷ d² 互换，10 m 与 25 m 相差 6.25 倍。',
  },
  {
    id: 'screen', path: '/screen', no: '02', label: '02 配光屏',
    title: '配光屏与测试点命名',
    sub: '一面墙 · 一套坐标 · 一套命名规则',
    desc: '以 HV 为原点、H-H 与 V-V 为轴的配光测试屏坐标系，点名里的数字是道路距离（米）而非角度，以及照准对截止线的要求。',
  },
  {
    id: 'paths', path: '/paths', no: '03', label: '03 合规路径',
    title: '两条合规路径',
    sub: '机动车 CCC vs 随整车验收',
    desc: '摩托车走机动车路线、车灯单独 CCC，电动自行车随整车走非机动车路线；两条路径的标准链完整度与市场端问题逐项对照。',
  },
  {
    id: 'tables', path: '/tables', no: '04', label: '04 逐表速查',
    title: '标准表格逐表速查',
    sub: '表 3 / 4 / 5 / 8 / 9 / 10~14 · 电自表 3 / 4',
    desc: 'GB 19152-2025 近光表 3/4/5、远光表 8、ADB 表 9 与 GB/T 31887.1-2019 电自表 3/4 的限值速查，附跨表检索。',
  },
  {
    id: 'workflow', path: '/workflow', no: '05', label: '05 设计流程',
    title: '摩托车前照灯设计全流程',
    sub: '三阶段十五步 · 从立项到市场监督',
    desc: '设计、验证、量产三阶段共十五步的工程说明与依据，附样件实测数据与区域光通量的旋转不变性说明。',
  },
  {
    id: 'test', path: '/test', no: '06', label: '06 测试照准',
    title: '测试设置与照准实操',
    sub: '25 m / cd / 照准 vs 10 m / lx / 直测',
    desc: '摩托车 25 m 场必须先照准后测点，电动自行车 10 m 场摆正即可直测；两套摆法、供电与环境条件、开测前自检清单。',
  },
  {
    id: 'control', path: '/control', no: '07', label: '07 内控',
    title: '稳定性 · 生产一致性 · 研发内控',
    sub: '附录 C / D / E · 表 10~14 · 1.3× / 0.8×',
    desc: '稳定性与生产一致性的附录判据、研发内控余量（1.3× 下限 / 0.8× 上限）、开模前六项 Checklist 与六个常见误区。',
  },
  {
    id: 'pitfalls', path: '/pitfalls', no: '08', label: '08 翻车案例',
    title: '常见坑与案例复盘',
    sub: '实测 → 回流校准仿真 → 回归优化',
    desc: '六个来自培训资料的真实或典型失败案例，以及「仿真 → 打样 → 实测 → 回归」的四步闭环复盘方法论。',
  },
  {
    id: 'quiz', path: '/quiz', no: '09', label: '09 自测',
    title: '十二道自测题',
    sub: '答不上来就回头翻对应章节',
    desc: '十二道取自进阶培训的自测题，选择后立即显示答案与解析，并指回对应章节。',
  },
  {
    id: 'caveats', path: '/caveats', no: '10', label: '10 资料口径',
    title: '资料口径与待核项',
    sub: '矛盾不抹平 · 来源可追溯',
    desc: '培训资料内部 6 处互相矛盾的记载逐条并列保留，附 S1~S7 资料来源清单与免责说明。',
  },

  {
    id: 'feedback', path: '/feedback', no: '·', label: '留言',
    title: '读者留言',
    sub: '发现配光数据或公式问题？',
    desc: '提交配光参数、公式或数据上的问题，帮助作者改进本站。',
  },
  {
    id: 'admin', path: '/admin', no: '', label: '管理',
    title: '留言管理',
    sub: '作者专用',
    desc: '本站留言管理后台。',
    hidden: true,
  },
] as const

export const HOME_PAGE = PAGES[0]

const BY_PATH = new Map(PAGES.map((p) => [p.path, p] as const))

/** 路径归一：去掉查询串与尾斜杠，`/basis/` 与 `/basis` 视为同一页 */
export function normalizePath(raw: string): string {
  let p = raw.split('?')[0].split('#')[0]
  if (p.length > 1 && p.endsWith('/')) p = p.replace(/\/+$/, '') || '/'
  return p || '/'
}

export function pageAt(pathname: string): Page | null {
  return BY_PATH.get(normalizePath(pathname)) ?? null
}

export function pageOf(id: PageId): Page {
  return BY_PATH.get(pathOf(id)) ?? HOME_PAGE
}

export function pathOf(id: PageId): string {
  const hit = PAGES.find((p) => p.id === id)
  return hit ? hit.path : '/'
}

/** 上一页 / 下一页，用于页尾连续阅读导航（首页返回 null） */
export function siblings(id: PageId): { prev: Page | null; next: Page | null } {
  // 只串可见页面：admin 是隐藏的后台入口，不该出现在「下一页」链条里
  const visible = PAGES.filter((p) => !p.hidden)
  const i = visible.findIndex((p) => p.id === id)
  if (i < 0) return { prev: null, next: null }
  return { prev: i > 0 ? visible[i - 1] : null, next: i < PAGES.length - 1 ? visible[i + 1] : null }
}

/**
 * `<title>` 文案。
 * 首页的 page.title 本身就是站名，直接加后缀会得到「A · A」，
 * 所以与站名相同时原样返回，其余页面才拼 `页面标题 · 站名`。
 */
export function titleOf(page: Page | null): string {
  if (!page) return `页面未找到 · ${SITE_NAME}`
  return page.title === SITE_NAME ? SITE_NAME : `${page.title} · ${SITE_NAME}`
}

/**
 * v2 及更早版本的链接是 `/#basis`、`/#caveats` 这类 hash。
 * 老书签、老分享链接、搜索引擎收录都可能还指着它们 —— 直接 404 会白丢流量，
 * 所以在首屏渲染前把它们原地改写成新路径（replaceState 不产生历史记录）。
 */
const LEGACY_HASH: Record<string, PageId> = {
  '#home': 'home',
  '#basis': 'basis',
  '#screen': 'screen',
  '#paths': 'paths',
  '#tables': 'tables',
  '#workflow': 'workflow',
  '#test': 'test',
  '#control': 'control',
  '#pitfalls': 'pitfalls',
  '#quiz': 'quiz',
  '#caveats': 'caveats',
}

export function migrateLegacyUrl(): void {
  const id = LEGACY_HASH[location.hash]
  if (!id) return
  const target = pathOf(id) + location.search
  history.replaceState(null, '', target)
}
