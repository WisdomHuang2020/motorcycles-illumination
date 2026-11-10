import { useState, type ReactElement } from 'react'
import { ArrowLeft, ArrowRight, House } from 'lucide-react'
import ThemeSwitcher from './components/ThemeSwitcher'
import { Link, RouterProvider, useRoute } from './Route'
import { PAGES, siblings, type PageId } from './router'
import {
  BasisPage, CaveatsPage, ControlPage, HomePage, PathsPage, PitfallsPage,
  QuizPage, ScreenPage, TablesPage, TestPage, WorkflowPage,
} from './pages'
import Feedback from './pages/Feedback'
import Admin from './pages/Admin'

/** 路由 → 页面组件。新增章节只需在此加一行 + 在 router.ts 加一条定义。 */
const VIEWS: Record<PageId, () => ReactElement> = {
  feedback: Feedback,
  admin: Admin,
  home: HomePage,
  basis: BasisPage,
  screen: ScreenPage,
  paths: PathsPage,
  tables: TablesPage,
  workflow: WorkflowPage,
  test: TestPage,
  control: ControlPage,
  pitfalls: PitfallsPage,
  quiz: QuizPage,
  caveats: CaveatsPage,
}

/* 页尾「上一页 / 下一页」：拆成多页后读者失去「一路滚到底」的连续感，
   必须给一个明确的下一步，否则读完一节就断了。 */
function PageNav({ id }: { id: PageId }) {
  const { prev, next } = siblings(id)
  return (
    <div className="wrap page-nav-wrap">
      <nav className="page-nav" aria-label="章节翻页">
        {prev ? (
          <Link className="page-nav-item prev" to={prev.path}>
            <ArrowLeft size={15} strokeWidth={2} aria-hidden="true" />
            <span>
              <small>上一节{prev.no ? ` · ${prev.no}` : ''}</small>
              <b>{prev.label.replace(/^\d+\s*/, '') || prev.label}</b>
            </span>
          </Link>
        ) : (
          <span className="page-nav-item is-empty" aria-hidden="true" />
        )}
        {next ? (
          <Link className="page-nav-item next" to={next.path}>
            <span>
              <small>下一节{next.no ? ` · ${next.no}` : ''}</small>
              <b>{next.label.replace(/^\d+\s*/, '') || next.label}</b>
            </span>
            <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />
          </Link>
        ) : (
          <Link className="page-nav-item next" to="/">
            <span>
              <small>已读完</small>
              <b>回到首页目录</b>
            </span>
            <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />
          </Link>
        )}
      </nav>
    </div>
  )
}

function NotFoundPage() {
  return (
    <main className="wrap">
      <section className="sec">
        <div className="sec-head">
          <span className="sec-no">404</span>
          <h2>这个页面不存在</h2>
          <span className="sub">链接可能来自旧版本，本站已改为「每章一页」</span>
        </div>
        <p className="lead">
          如果你是从旧书签或旧分享链接进来的，它可能还带着 <b className="mono">#</b> 锚点。
          请从下面的目录重新进入，或直接回到首页。
        </p>
        <div className="pager-grid">
          {PAGES.filter((p) => !p.hidden).map((p) => (
            <Link className="pager-card" to={p.path} key={p.id}>
              <span className="pager-no">{p.no || '·'}</span>
              <span className="pager-body">
                <b>{p.title}</b>
                <span className="pager-sub">{p.sub}</span>
              </span>
              <ArrowRight className="pager-arrow" size={16} strokeWidth={2} aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}

function Shell() {
  const { page } = useRoute()
  const [navOpen, setNavOpen] = useState(false)
  const View = page ? VIEWS[page.id] : null

  return (
    <>
      {/* ============ 顶部导航 ============ */}
      <header className="topbar">
        <div className="bar">
          <Link className="brand" to="/" aria-label="返回首页">
            <i className="mark" aria-hidden="true" />
            <span className="brand-text">
              <b className="brand-en">MOTORCYCLES ILLUMINATION</b>
              <span className="brand-sub">二轮车照明配光技术站</span>
            </span>
          </Link>
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
            {PAGES.filter((p) => !p.hidden).map((p) => (
              <Link
                key={p.id}
                to={p.path}
                className={page?.id === p.id ? 'active' : undefined}
                aria-current={page?.id === p.id ? 'page' : undefined}
                beforeNavigate={() => setNavOpen(false)}
              >
                {p.label}
              </Link>
            ))}
          </nav>
          {/* 站群入口：与导航按钮同排、同高、同风格，位于导航行最右端。
              刻意放在 .navlinks **外面** —— 1140px 以下导航收进抽屉时
              .navlinks 会 display:none，放在里面会把站群入口一起藏掉。 */}
          <a
            className="nav-cta"
            href="https://power-knowledge.tech/"
            title="返回 power-knowledge.tech 站群入口"
          >
            <House size={14} strokeWidth={2} aria-hidden="true" />
            <span className="nav-cta-text">站群入口</span>
          </a>
          {/* 8 色主题切换器固定在顶栏最右侧，排在导航之后，不参与导航宽度分配 */}
          <ThemeSwitcher />
        </div>
      </header>

      {/* ============ 当前页面 ============ */}
      {View ? <View /> : <NotFoundPage />}

      {page && <PageNav id={page.id} />}

      <footer>
        <div className="foot-wrap">
          <div className="foot-grid">
            <div className="foot-col">
              <div className="foot-brand">
                <i className="mark" aria-hidden="true" />
                <b>MOTORCYCLES ILLUMINATION</b>
              </div>
              <p className="foot-desc">
                把 GB 19152-2025（25 m / cd）与 GB/T 31887.1-2019（10 m / lx）两套体系整理成可交互的配光知识站：
                逐表速查、配光屏点位、光型四态、cd↔lx 换算与研发内控判断。
              </p>
              <p className="foot-note foot-note-tight">
                视觉规范：power-knowledge.tech 站群通用 8 套主题，与主入口 / LLC 系列一致。
              </p>
              <a className="foot-back" href="https://power-knowledge.tech/">
                <House size={16} strokeWidth={2} aria-hidden="true" />
                返回站群入口
              </a>
            </div>

            <div className="foot-col">
              <h4>章节导航</h4>
              <div className="foot-links">
                {PAGES.filter((p) => !p.hidden).map((p) => (
                  <Link key={p.id} to={p.path}>{p.label}</Link>
                ))}
              </div>
            </div>

            <div className="foot-col">
              <h4>资料口径</h4>
              <p className="foot-note">
                内容基础：益明光电（无锡）· 实益达 SEA STAR 研发中心培训资料（2026-08）——
                进阶培训 V6.7 · 教程 Rev3.3 · 设计全流程教程 2026-08。
              </p>
              <p className="foot-note">
                资料内部 6 处矛盾逐条并列保留，不做静默统一；实际判定以标准正文与主机厂技术要求为准。
              </p>
              <h4 className="foot-h-gap">版权</h4>
              <p className="foot-note">
                站内引用的标准条文、培训教程与插图，版权归各自权利人所有，仅作技术说明与教学引用。
              </p>
            </div>
          </div>

          <div className="foot-legal">
            <div>
              <p className="foot-copy">© 2026 二轮车照明配光技术站 · 结果仅供工程估算与学习参考</p>
              {/* 备案信息：工信部与公安联网备案均要求网站底部公开展示，与站群其余站同一套主体备案号 */}
              <div className="foot-beian">
                <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">
                  苏ICP备2026073104号-1
                </a>
                <a
                  href="https://beian.mps.gov.cn/#/query/webSearch?code=32021402005238"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src="/beian.png" alt="" />
                  苏公网安备32021402005238号
                </a>
              </div>
            </div>
            <div className="foot-legal-right">
              <span className="app-version">{__APP_VERSION__}</span>
              {/* 2026-11-10 站群统一口径：页面上的 GitHub 源码仓库链接与图标全部移除。 */}
            </div>
          </div>

          <div className="foot-disclaimer">
            <p>
              <b>免责声明：</b>本站为个人非商业性技术分享。全部表格数据、换算与判定结论基于公开标准文本与解析近似，
              仅供工程估算与学习研究参考，不构成设计保证，亦不替代标准正文、认证机构判定、实测光型与第三方专业复核。
              任何主体引用本站内容或据此作出的工程决策，风险与责任由该主体自行承担；因使用本站内容所产生的间接损失，本站不予承担。
            </p>
            <p>
              站内表格、图示与文字为作者整理或基于公开资料绘制，著作权归作者所有；文中提及的标准、软件、
              商标与厂商名称，权利均归各自权利人所有，仅作技术说明引用，不代表任何隶属、赞助或背书关系。
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}

export default function App() {
  return (
    <RouterProvider>
      <Shell />
    </RouterProvider>
  )
}
