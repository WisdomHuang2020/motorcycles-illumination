/* ==========================================================================
   MOTORCYCLES ILLUMINATION — 交互层
   纯原生 JS，无外部依赖，可离线打开。
   ========================================================================== */

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const fmt = n => Number(n).toLocaleString('zh-CN', { maximumFractionDigits: 2 });

/* ---------------- 表格 ---------------- */
function tableHTML(t) {
  return `<div class="tbl-wrap"><table><thead><tr>${t.head.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead>
    <tbody>${t.rows.map(r => `<tr>${r.map((c, i) => `<td class="${i > 0 && /^[≥≤<\d\s\/.×~+()\-]|^\d/.test(c) ? 'num' : ''}">${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}
function renderTable(key, elId) {
  const t = TABLES[key];
  const el = document.getElementById(elId);
  if (!el || !t) return;
  el.innerHTML = `<div class="tbl-head-row"><h3>${esc(t.title)} <span class="src-tag">${t.src}</span></h3><span class="src">${esc(t.sub)}</span></div>${tableHTML(t)}`;
}

/* ---------------- Hero 光束切换 ---------------- */
const BEAM_MODES = {
  sym: {
    label: '对称近光',
    note: '<b>BS / CS / DS 级</b>：截止线水平平直，V-V 左右至少 3° 内保持平直；照准时水平部分压在 H-H 下 0.57°。',
    shape: 'M40,210 L760,210 L760,360 L40,360 Z',
    cut: 'M40,210 L760,210',
    dark: 'M40,40 L760,40 L760,210 L40,210 Z',
    extra: '<text x="60" y="196" fill="#F6B26B" font-size="13" font-weight="700">平直截止线 · 左右对称</text>'
  },
  asym: {
    label: '非对称近光',
    note: '<b>C / V 级</b>：中国靠右行驶，左侧平直压低防眩目，右侧以 15° 上扬照清路牌路肩。<b>左暗右亮</b>是核心矛盾。',
    shape: 'M40,210 L400,210 L760,110 L760,360 L40,360 Z',
    cut: 'M40,210 L400,210 L760,110',
    dark: 'M40,40 L760,40 L760,110 L400,210 L40,210 Z',
    extra: `<text x="70" y="70" fill="#F27D6A" font-size="14" font-weight="700">左 · 对向来车侧（防眩）</text>
      <text x="540" y="300" fill="#FFD9A0" font-size="14" font-weight="700">右 · 本车侧（照路）</text>
      <text x="418" y="196" fill="#FFD9A0" font-size="12" font-weight="700">15°</text>
      <circle cx="500" cy="248" r="5" fill="#FFD9A0"/><text x="510" y="252" fill="#FFD9A0" font-size="12">75R ≥12 100 cd</text>
      <circle cx="250" cy="188" r="5" fill="#F27D6A"/><text x="140" y="184" fill="#F27D6A" font-size="12">B50L ≤350 cd</text>`
  },
  high: {
    label: '远光',
    note: '<b>A / B / BS / CS / DS 级</b>：无截止线，中心最亮（Imax），横向 ±3°~±12° 逐级铺开，整体上限 ≤215 000 cd。',
    shape: 'M40,360 L760,360 L760,110 Q400,60 40,110 Z',
    cut: '',
    dark: 'M40,40 L760,40 L760,90 Q400,50 40,90 Z',
    extra: `<ellipse cx="400" cy="215" rx="150" ry="95" fill="#FFD9A0" opacity="0.20"/>
      <ellipse cx="400" cy="215" rx="80" ry="55" fill="#FFD9A0" opacity="0.38"/>
      <circle cx="400" cy="215" r="7" fill="#FFF1CF"/>
      <text x="412" y="210" fill="#FFF1CF" font-size="13" font-weight="700">HV ≥ 0.8×Imax</text>
      <text x="60" y="340" fill="#94A3B8" font-size="12">±12° 最外侧仍有下限</text>`
  },
  ebike: {
    label: '电自近光',
    note: '<b>GB/T 31887.1-2019</b>：10 m 屏、照度 lx。H-H 及以上 &lt; 2 lx 防眩目，A 点 EA ≥ 10 lx 是整张表基准。',
    shape: 'M40,210 L760,210 L760,360 L40,360 Z',
    cut: 'M40,210 L760,210',
    dark: 'M40,40 L760,40 L760,210 L40,210 Z',
    extra: `<text x="560" y="70" fill="#F27D6A" font-size="13" font-weight="700">H-H 以上 &lt; 2 lx</text>
      <circle cx="400" cy="252" r="28" fill="#FFD9A0" opacity="0.55"/>
      <text x="400" y="256" fill="#7A4300" font-size="12" font-weight="800" text-anchor="middle">A ≥10 lx</text>
      <text x="60" y="340" fill="#94A3B8" font-size="12">10 m 屏 · 光轴水平 · 免照准直读 lux</text>`
  }
};
function renderBeam(mode) {
  const m = BEAM_MODES[mode];
  const svg = $('#beamSvg');
  svg.innerHTML = `
    <defs>
      <linearGradient id="beamGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#E8A33D" stop-opacity="0.10"/>
        <stop offset="0.45" stop-color="#E8A33D" stop-opacity="0.48"/>
        <stop offset="1" stop-color="#E8A33D" stop-opacity="0.88"/>
      </linearGradient>
      <filter id="glowB"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    <rect x="40" y="40" width="720" height="320" rx="10" fill="#0A1222" stroke="#2B3550"/>
    <g stroke="#1E2A42" stroke-width="1">
      ${[100,160,220,280,340].map(y => `<line x1="40" y1="${y}" x2="760" y2="${y}"/>`).join('')}
      ${[160,280,400,520,640].map(x => `<line x1="${x}" y1="40" x2="${x}" y2="360"/>`).join('')}
    </g>
    <path d="${m.shape}" fill="url(#beamGrad)"/>
    <path d="${m.dark}" fill="#060D1B" opacity="0.86"/>
    ${m.cut ? `<path d="${m.cut}" fill="none" stroke="#FFD9A0" stroke-width="3.5" filter="url(#glowB)"/>` : ''}
    <line x1="40" y1="210" x2="760" y2="210" stroke="#8B96AE" stroke-width="1.2" stroke-dasharray="3 5" opacity="0.65"/>
    <line x1="400" y1="40" x2="400" y2="360" stroke="#8B96AE" stroke-width="1.2" stroke-dasharray="3 5" opacity="0.65"/>
    <text x="766" y="205" fill="#8B96AE" font-size="11" font-family="monospace">H</text>
    <text x="405" y="34" fill="#8B96AE" font-size="11" font-family="monospace">V</text>
    ${m.extra}
    <text x="40" y="384" fill="#6F7C99" font-size="11">教学示意 · 非按比例 · 正面看配光屏 · 亮区在下、暗区在上</text>`;
  $('#beamNote').innerHTML = m.note;
  $$('#beamTabs button').forEach(b => b.classList.toggle('on', b.dataset.mode === mode));
}

/* ---------------- 配光屏点位交互 ---------------- */
function renderScreen(key) {
  const pts = BEAM_POINTS[key];
  const xs = pts.map(p => p.x).concat([0]);
  const ys = pts.map(p => p.y).concat([0]);
  let xmin = Math.min(Math.min(...xs) - 2, -10), xmax = Math.max(Math.max(...xs) + 2, 10);
  let ymin = Math.min(Math.min(...ys) - 1.2, -3), ymax = Math.max(Math.max(...ys) + 1.2, 3);
  const X = v => 60 + (v - xmin) / (xmax - xmin) * 680;
  const Y = v => 360 - (v - ymin) / (ymax - ymin) * 320;
  const y0 = Y(0), x0 = X(0);

  let overlay = '';
  if (key === 'cv') {
    overlay = `<path d="M60,${Y(-0.57)} L${X(0)},${Y(-0.57)} L740,${Y(0.9)}" fill="none" stroke="#FFD9A0" stroke-width="2.5" opacity="0.9"/>
      <text x="66" y="${Y(-0.57) - 8}" fill="#FFD9A0" font-size="11">明暗截止线（左平 / 右上扬 15°）</text>`;
  } else if (key === 'bs' || key === 'ebike') {
    overlay = `<path d="M60,${Y(key === 'ebike' ? 0 : -0.57)} L740,${Y(key === 'ebike' ? 0 : -0.57)}" fill="none" stroke="#FFD9A0" stroke-width="2.5" opacity="0.9"/>
      <text x="66" y="${Y(key === 'ebike' ? 0 : -0.57) - 8}" fill="#FFD9A0" font-size="11">${key === 'ebike' ? 'H-H 明暗截止线' : '水平平直截止线（H-H 下 0.57°）'}</text>`;
  } else {
    overlay = `<ellipse cx="${x0}" cy="${y0}" rx="120" ry="60" fill="#FFD9A0" opacity="0.14"/>
      <text x="66" y="60" fill="#FFD9A0" font-size="11">远光无截止线 · 中心亮、横向逐级铺开</text>`;
  }

  const dots = pts.map((p, i) => {
    const col = p.kind === 'max' ? '#F27D6A' : (p.kind === 'ref' ? '#9FB6D8' : (p.kind === 'both' ? '#F6B26B' : '#5EEAD4'));
    const lx = p.x > xmax - 4 ? -8 : 9;
    return `<g class="pt" data-i="${i}" style="cursor:pointer">
      <circle cx="${X(p.x)}" cy="${Y(p.y)}" r="12" fill="transparent"/>
      <circle cx="${X(p.x)}" cy="${Y(p.y)}" r="5.5" fill="${col}" stroke="#0A1222" stroke-width="1.2"/>
      <text x="${X(p.x) + (lx < 0 ? -8 : 8)}" y="${Y(p.y) - 8}" fill="${col}" font-size="11" font-weight="700" text-anchor="${lx < 0 ? 'end' : 'start'}">${esc(p.id)}</text>
    </g>`;
  }).join('');

  $('#screenSvg').innerHTML = `
    <defs><linearGradient id="scrGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#E8A33D" stop-opacity="0.05"/><stop offset="1" stop-color="#E8A33D" stop-opacity="0.42"/>
    </linearGradient></defs>
    <rect x="60" y="40" width="680" height="320" rx="8" fill="#0A1222" stroke="#2B3550"/>
    <rect x="60" y="40" width="680" height="${Math.max(0, y0 - 40)}" fill="#060D1B" opacity="0.55"/>
    <rect x="60" y="${y0}" width="680" height="${Math.max(0, 360 - y0)}" fill="url(#scrGrad)"/>
    <g stroke="#1E2A42" stroke-width="1">
      ${[90, 150, 210, 270, 330].map(y => `<line x1="60" y1="${y}" x2="740" y2="${y}"/>`).join('')}
      ${[160, 280, 400, 520, 640].map(x => `<line x1="${x}" y1="40" x2="${x}" y2="360"/>`).join('')}
    </g>
    ${overlay}
    <line x1="60" y1="${y0}" x2="740" y2="${y0}" stroke="#9FB6D8" stroke-width="1.1" stroke-dasharray="3 5" opacity="0.7"/>
    <line x1="${x0}" y1="40" x2="${x0}" y2="360" stroke="#9FB6D8" stroke-width="1.1" stroke-dasharray="3 5" opacity="0.7"/>
    <text x="744" y="${y0 - 5}" fill="#8B96AE" font-size="11" font-family="monospace">H-H</text>
    <text x="${x0 + 5}" y="34" fill="#8B96AE" font-size="11" font-family="monospace">V-V</text>
    ${dots}
    <text x="60" y="384" fill="#6F7C99" font-size="11">水平/垂直角度示意 · 点击圆点查看限值 · 角度与限值以标准表为准</text>`;

  $$('#screenSvg .pt').forEach(g => g.addEventListener('click', () => showPoint(key, +g.dataset.i)));
  $$('#screenTabs button').forEach(b => b.classList.toggle('on', b.dataset.key === key));
  showPoint(key, 0);
}
function showPoint(key, i) {
  const p = BEAM_POINTS[key][i];
  if (!p) return;
  const box = $('#pointDetail');
  const kindTxt = { min: '下限（要够亮）', max: '上限（别太亮）', both: '双限', ref: '基准' }[p.kind];
  box.innerHTML = `
    <div><span class="pd-id">${esc(p.id)}</span><span class="pd-kind ${p.kind}">${kindTxt}</span></div>
    <div class="pd-val">${esc(p.c)}</div>
    <div class="pd-val2">${esc(p.v)}</div>
    <div class="pd-desc">${esc(p.desc)}</div>
    <div class="pd-hint">坐标（示意）：水平 ${p.x}° / 垂直 ${p.y}°　·　来源 <span class="src-tag">${p.src}</span></div>`;
}

/* ---------------- 换算器 ---------------- */
function calcLux() {
  const I = parseFloat($('#calcI').value);
  const d = parseFloat($('#calcD').value);
  const out = $('#luxOut');
  if (!isFinite(I) || !isFinite(d) || d <= 0) { out.textContent = '—'; $('#luxFormula').textContent = '请输入有效数值'; return; }
  const E = I / (d * d);
  out.textContent = fmt(E) + ' lx';
  $('#luxFormula').innerHTML = `E = I ÷ d² = ${fmt(I)} ÷ ${fmt(d)}² = ${fmt(E)} lx`;
  $('#lux10').textContent = fmt(I / 100) + ' lx';
  $('#lux25').textContent = fmt(I / 625) + ' lx';
  $('#cd10').textContent = fmt(E * 100) + ' cd';
  $('#cd25').textContent = fmt(E * 625) + ' cd';
}
function calcMargin() {
  const v = parseFloat($('#marginVal').value);
  const k = parseFloat($('#marginKind').value);
  const el = $('#marginOut');
  if (!isFinite(v) || v < 0) { el.innerHTML = '<div class="rv">—</div><div class="rx">请输入有效的标准限值</div>'; return; }
  if (k === 1) {
    el.innerHTML = `<div class="rl">研发内控目标（下限点 ×1.3） · 量产下限（×0.8）</div>
      <div class="rv">≥ ${fmt(v * 1.3)} cd</div>
      <div class="mini"><div><b>≥ ${fmt(v * 0.8)}</b><span>量产一致性下限</span></div><div><b>+${((1.3 - 0.8) * 100).toFixed(0)}%</b><span>设计端到量产的安全余量</span></div></div>
      <div class="rx">依据：进阶培训 V6.7 §8.1 与 §12.3。例：75R 标准 12 100 → 内控 ≥15 700 cd。</div>`;
  } else {
    el.innerHTML = `<div class="rl">研发内控目标（上限点 ×0.8）</div>
      <div class="rv">≤ ${fmt(v * 0.8)} cd</div>
      <div class="mini"><div><b>≥ ${fmt(v - v * 0.8)}</b><span>预留的绝对余量</span></div><div><b>表 10~14</b><span>量产上限须查显式值</span></div></div>
      <div class="rx">依据：进阶培训 V6.7 §8.1 / §6.4。量产上限不能一律 ×1.2（如 BS 1 区 700 → 955，≈×1.36）。</div>`;
  }
}

/* ---------------- 流程 ---------------- */
function renderFlow() {
  const el = $('#flowBox');
  el.innerHTML = FLOW.map((ph, pi) => `
    <div class="phase">
      <div class="phase-head"><span class="pno">0${pi + 1}</span><h3>${esc(ph.phase)}</h3><span class="pline"></span></div>
      <div class="flow-row">
        ${ph.steps.map((s, si) => `<button class="flow-step" data-p="${pi}" data-s="${si}">
          <div class="fs-n">STEP ${pi * 5 + si + 1}</div>
          <div class="fs-t">${esc(s.t)}</div>
          <div class="fs-d">${esc(s.d)}</div></button>`).join('')}
      </div>
    </div>`).join('') + '<div class="flow-detail" id="flowDetail"><b>点击任一节点</b>查看该步骤的工程说明与依据。</div>';

  $$('.flow-step', el).forEach(btn => btn.addEventListener('click', () => {
    $$('.flow-step', el).forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const s = FLOW[+btn.dataset.p].steps[+btn.dataset.s];
    $('#flowDetail').innerHTML = `<b>${esc(s.t)}</b>　${esc(s.note)} <span class="src-tag">${s.src}</span>`;
  }));
}

/* ---------------- 冲突 / 来源 / 案例 / 标准 ---------------- */
function renderConflicts() {
  $('#conflictBox').innerHTML = CONFLICTS.map(c => `
    <div class="conflict">
      <div class="ch"><span class="mono">${c.id}</span><b>${esc(c.topic)}</b><span class="lvl ${c.level}">${c.level}优先级</span></div>
      <div class="row"><span class="k">资料 A</span><span>${esc(c.a)}</span></div>
      <div class="row"><span class="k">资料 B</span><span>${esc(c.b)}</span></div>
      <div class="act">本站处理：${esc(c.act)}</div>
    </div>`).join('');
}
function renderSources() {
  $('#sourceBox').innerHTML = Object.entries(SOURCES).map(([id, s]) => `
    <div class="src-item"><b><span class="sid">${id}</span>${esc(s.name)}</b>
      <span>${esc(s.file)}<br>${esc(s.unit)}　${esc(s.date)}</span></div>`).join('');
}
function renderPitfalls() {
  $('#pitBox').innerHTML = PITFALLS.map(p => `
    <div class="pit"><div class="pit-h"><span>${esc(p.t)}</span><span class="tag">${p.src}</span></div>
      <div class="pit-b">
        <p><span class="lbl">现象</span>${esc(p.p)}</p>
        <p><span class="lbl">根因</span>${esc(p.r)}</p>
        <p><span class="lbl">对策</span>${esc(p.f)}</p>
      </div></div>`).join('');
}
function renderStandards() {
  const t = { head: STANDARDS.head, rows: STANDARDS.rows };
  $('#standardsTable').innerHTML = tableHTML(t) + '<p class="tbl-note">来源：标准体系全面解析 xlsx「问题1-标准体系对比」(S4)。此表为定性对比；该表「问题2」中的具体限值与其他资料冲突，见第 10 节待核项，本站未采用。</p>';
}
function renderSampleData() {
  const bar = (arr, max) => `<div style="display:flex;align-items:flex-end;gap:8px;height:150px;margin:12px 0 6px">
    ${arr.map((d, i) => `<div style="flex:1;text-align:center">
      <div style="font-family:var(--mono);font-size:11px;color:var(--navy);font-weight:800">${d.v}</div>
      <div style="height:${Math.round(d.v / max * 105)}px;background:${['#1A5FB4', '#3B82C4', '#E8A33D', '#E8730C', '#0D9488'][i]};border-radius:5px 5px 0 0;margin-top:3px"></div>
      <div style="font-size:10.5px;color:var(--subtext);line-height:1.35;margin-top:6px">${esc(d.k)}</div>
    </div>`).join('')}</div>`;
  $('#sampleCharts').innerHTML = `
    <div class="card"><h3>近光光学效率链 <span class="src-tag">S6 / S3</span></h3>${bar(SAMPLE_DATA.near, 520)}
      <p class="tbl-note">520 lm 裸模组 → 整灯 210 lm；教程记为光学效率约 50%。</p></div>
    <div class="card"><h3>远光光学效率链 <span class="src-tag">S6 / S3</span></h3>${bar(SAMPLE_DATA.far, 980)}
      <p class="tbl-note">980 lm 裸模组 → 整灯 430 lm；3 颗 LED 方案。</p></div>`;
  $('#sampleFacts').innerHTML = `<div class="tbl-wrap"><table><thead><tr><th>项目</th><th>实测 / 记录</th><th>来源</th></tr></thead><tbody>
    ${SAMPLE_DATA.facts.map(r => `<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td><td><span class="src-tag">${r[2]}</span></td></tr>`).join('')}
    </tbody></table></div>`;
}

/* ---------------- 自测 ---------------- */
let quizState = new Array(QUIZ.length).fill(null);
function renderQuiz() {
  $('#quizBox').innerHTML = QUIZ.map((q, i) => `
    <div class="qitem" data-q="${i}">
      <div class="qh"><span class="qn">${String(i + 1).padStart(2, '0')}</span><span>${esc(q.q)}</span></div>
      <div class="opts">${q.opts.map((o, j) => `<button data-o="${j}">${String.fromCharCode(65 + j)}. ${esc(o)}</button>`).join('')}</div>
      <div class="qwhy"><b>解析：</b>${esc(q.why)} <span class="src-tag">${q.src}</span></div>
    </div>`).join('');
  $$('#quizBox .opts button').forEach(btn => btn.addEventListener('click', () => {
    const qi = +btn.closest('.qitem').dataset.q;
    quizState[qi] = +btn.dataset.o;
    paintQuiz();
  }));
  paintQuiz();
}
function paintQuiz() {
  $$('#quizBox .qitem').forEach(item => {
    const qi = +item.dataset.q, pick = quizState[qi];
    $$('.opts button', item).forEach(b => {
      b.classList.remove('correct', 'wrong');
      const j = +b.dataset.o;
      if (pick !== null) {
        if (j === QUIZ[qi].ans) b.classList.add('correct');
        else if (j === pick) b.classList.add('wrong');
      }
    });
    $('.qwhy', item).classList.toggle('show', pick !== null);
  });
  const done = quizState.filter(v => v !== null).length;
  const right = quizState.filter((v, i) => v === QUIZ[i].ans).length;
  $('#quizDone').textContent = `${done} / ${QUIZ.length}`;
  $('#quizRight').textContent = String(right);
}
function resetQuiz() { quizState = new Array(QUIZ.length).fill(null); paintQuiz(); }

/* ---------------- 限值速查（跨表搜索） ---------------- */
function quickSearch(kw) {
  const box = $('#quickResults');
  const k = kw.trim().toLowerCase();
  if (!k) { box.innerHTML = '<p class="tbl-note">输入关键词开始检索，例如「75R」「B50L」「ADB」「0.8」「电自」「光通量」。</p>'; return; }
  const hits = [];
  Object.entries(TABLES).forEach(([key, t]) => {
    t.rows.forEach(r => {
      if (r.some(c => String(c).toLowerCase().includes(k))) hits.push({ t: t.title, src: t.src, cells: r });
    });
  });
  if (!hits.length) { box.innerHTML = `<p class="tbl-note">未检索到「${esc(kw)}」相关行。</p>`; return; }
  box.innerHTML = `<p class="tbl-note">命中 ${hits.length} 行（最多显示 30 行）</p><div class="tbl-wrap"><table>
    <thead><tr><th>所属表格</th><th>匹配行</th><th>来源</th></tr></thead>
    <tbody>${hits.slice(0, 30).map(h => `<tr><td>${esc(h.t)}</td><td>${esc(h.cells.join(' ｜ '))}</td><td><span class="src-tag">${h.src}</span></td></tr>`).join('')}</tbody></table></div>`;
}

/* ---------------- 导航 ---------------- */
function initNav() {
  $('#navToggle').addEventListener('click', () => $('#navLinks').classList.toggle('open'));
  $$('#navLinks a').forEach(a => a.addEventListener('click', () => $('#navLinks').classList.remove('open')));
  const links = $$('#navLinks a');
  const secs = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const onScroll = () => {
    const y = window.scrollY + 110;
    let cur = 0;
    secs.forEach((s, i) => { if (s.offsetTop <= y) cur = i; });
    links.forEach((a, i) => a.classList.toggle('active', i === cur));
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ---------------- 启动 ---------------- */
document.addEventListener('DOMContentLoaded', () => {
  // Hero 光束
  $$('#beamTabs button').forEach(b => b.addEventListener('click', () => renderBeam(b.dataset.mode)));
  renderBeam('asym');

  // 配光屏
  $$('#screenTabs button').forEach(b => b.addEventListener('click', () => renderScreen(b.dataset.key)));
  renderScreen('cv');

  // 表格
  renderTable('bs', 'tblSlot');
  $$('#tableTabs button').forEach(b => b.addEventListener('click', () => {
    $$('#tableTabs button').forEach(x => x.classList.remove('on'));
    b.classList.add('on');
    renderTable(b.dataset.table, 'tblSlot');
  }));
  renderTable('high', 'tblHigh');
  renderTable('adbA', 'tblAdbA');
  renderTable('adbB', 'tblAdbB');
  renderTable('ebikeLow', 'tblEbikeLow');
  renderTable('ebikeHigh', 'tblEbikeHigh');
  renderTable('flux', 'tblFlux');
  renderTable('conformance', 'tblConformance');

  // 计算器
  ['#calcI', '#calcD'].forEach(s => $(s).addEventListener('input', calcLux));
  calcLux();
  ['#marginVal', '#marginKind'].forEach(s => $(s).addEventListener('input', calcMargin));
  calcMargin();

  // 其余模块
  renderFlow();
  renderStandards();
  renderConflicts();
  renderPitfalls();
  renderSampleData();
  renderSources();
  renderQuiz();
  $('#quizReset').addEventListener('click', resetQuiz);
  $('#quickSearch').addEventListener('input', e => quickSearch(e.target.value));
  quickSearch('');
  initNav();
});
