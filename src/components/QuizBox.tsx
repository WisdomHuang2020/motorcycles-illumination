import { useState } from 'react'
import { QUIZ } from '../data'
import { SrcTag } from './ui'

/** v1 renderQuiz / paintQuiz / resetQuiz 的 React 版：12 题，选择立即出解析 */
export default function QuizBox() {
  const [picks, setPicks] = useState<(number | null)[]>(() => QUIZ.map(() => null))
  const done = picks.filter((v) => v !== null).length
  const right = picks.filter((v, i) => v === QUIZ[i].ans).length

  return (
    <>
      <div className="quiz">
        {QUIZ.map((q, i) => {
          const pick = picks[i]
          return (
            <div className="qitem" key={q.q}>
              <div className="qh"><span className="qn">{String(i + 1).padStart(2, '0')}</span><span>{q.q}</span></div>
              <div className="opts">
                {q.opts.map((o, j) => {
                  const cls = pick !== null
                    ? j === q.ans ? 'correct' : j === pick ? 'wrong' : undefined
                    : undefined
                  return (
                    <button
                      type="button"
                      key={o}
                      className={cls}
                      onClick={() => setPicks((prev) => prev.map((v, k) => (k === i ? j : v)))}
                    >
                      {String.fromCharCode(65 + j)}. {o}
                    </button>
                  )
                })}
              </div>
              <div className={'qwhy' + (pick !== null ? ' show' : '')}>
                <b>解析：</b>{q.why} <SrcTag>{q.src}</SrcTag>
              </div>
            </div>
          )
        })}
      </div>
      <div className="quiz-score">
        <span>已完成 <b>{done} / {QUIZ.length}</b>　·　答对 <b>{right}</b> 题</span>
        <button type="button" onClick={() => setPicks(QUIZ.map(() => null))}>重置作答</button>
      </div>
    </>
  )
}
