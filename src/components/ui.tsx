import type { ReactNode } from 'react'
import { TABLES, type TableDef, type TableKey } from '../data'

/** 来源编号徽标（S1~S7 / 表号） */
export function SrcTag({ children }: { children: ReactNode }) {
  return <span className="src-tag">{children}</span>
}

/** 表格上方的「标题 + 副标题」行 */
export function TableHeadRow({ title, src, sub }: { title: ReactNode; src?: string; sub?: string }) {
  return (
    <div className="tbl-head-row">
      <h3>{title}{src && <> <SrcTag>{src}</SrcTag></>}</h3>
      {sub && <span className="src">{sub}</span>}
    </div>
  )
}

/* 与 v1 tableHTML() 完全相同的「数字列」判定：第 2 列起，以数值/比较符开头加等宽字体 */
const NUM_RE = /^[≥≤<\d\s\/.×~+()\-]|^\d/

export function DataTable({ table }: { table: TableDef }) {
  return (
    <div className="tbl-wrap">
      <table>
        <thead>
          <tr>{table.head.map((h, i) => <th key={i}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {table.rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td key={ci} className={ci > 0 && NUM_RE.test(cell) ? 'num' : undefined}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** v1 renderTable(key, elId) 的等价物：表头行 + 表格 */
export function DataTableBlock({ tableKey }: { tableKey: TableKey }) {
  const t: TableDef = TABLES[tableKey]
  return (
    <>
      <TableHeadRow title={t.title} src={t.src} sub={t.sub} />
      <DataTable table={t} />
    </>
  )
}

export type CalloutKind = 'default' | 'orange' | 'warn' | 'teal'
/** v1 .callout / .callout.orange / .callout.warn / .callout.teal */
export function Callout({ kind = 'default', title, children }: {
  kind?: CalloutKind; title: ReactNode; children: ReactNode
}) {
  return (
    <div className={'callout' + (kind === 'default' ? '' : ' ' + kind)}>
      <span className="ct">{title}</span>
      {children}
    </div>
  )
}

/** 原培训插图卡片，图片统一走 Vite public 目录 /img/ */
export function FigCard({ src, alt, children }: { src: string; alt: string; children: ReactNode }) {
  return (
    <div className="figcard">
      <img src={src} alt={alt} loading="lazy" />
      <div className="cap">{children}</div>
    </div>
  )
}

export function SectionHead({ no, title, sub }: { no: string; title: string; sub: string }) {
  return (
    <div className="sec-head">
      <span className="sec-no">{no}</span>
      <h2>{title}</h2>
      <span className="sub">{sub}</span>
    </div>
  )
}

export function Notice({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="notice">
      <span className="ni">{label}</span>
      <span>{children}</span>
    </div>
  )
}

export function Section({ id, no, title, sub, children }: {
  id: string; no: string; title: string; sub: string; children: ReactNode
}) {
  return (
    <section className="sec" id={id}>
      <SectionHead no={no} title={title} sub={sub} />
      {children}
    </section>
  )
}
