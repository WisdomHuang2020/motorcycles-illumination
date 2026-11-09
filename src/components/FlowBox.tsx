import { useState } from 'react'
import { FLOW } from '../data'
import { SrcTag } from './ui'

/** v1 renderFlow() 的 React 版：三阶段十五步，点击节点展开工程说明 */
export default function FlowBox() {
  const [sel, setSel] = useState<{ p: number; s: number } | null>(null)
  const step = sel ? FLOW[sel.p].steps[sel.s] : null

  return (
    <div>
      {FLOW.map((ph, pi) => (
        <div className="phase" key={ph.phase}>
          <div className="phase-head">
            <span className="pno">0{pi + 1}</span>
            <h3>{ph.phase}</h3>
            <span className="pline" />
          </div>
          <div className="flow-row">
            {ph.steps.map((s, si) => (
              <button
                type="button"
                key={s.t}
                className={'flow-step' + (sel?.p === pi && sel?.s === si ? ' active' : '')}
                onClick={() => setSel({ p: pi, s: si })}
              >
                <div className="fs-n">STEP {pi * 5 + si + 1}</div>
                <div className="fs-t">{s.t}</div>
                <div className="fs-d">{s.d}</div>
              </button>
            ))}
          </div>
        </div>
      ))}
      <div className="flow-detail">
        {step ? (
          <><b>{step.t}</b>　{step.note} <SrcTag>{step.src}</SrcTag></>
        ) : (
          <><b>点击任一节点</b>查看该步骤的工程说明与依据。</>
        )}
      </div>
    </div>
  )
}
