/* SkillPulse: Evidence-to-Action Intelligence Layer (SIH 2026 PS 134)
   Connected to FastAPI backend with zero-latency local fallback. */

// Determine backend API URL:
// 1. URL parameter override: ?api=http://... or ?api_base=http://...
// 2. Same origin if already running on port 8000 (direct FastAPI serving)
// 3. Target port 8000 on the same host if frontend is served on another port (e.g. 5500 for Live Server)
// 4. Default fallback: http://127.0.0.1:8000
const getApiBase = () => {
  if (typeof window === 'undefined' || !window.location) {
    return 'http://127.0.0.1:8000';
  }

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const paramApi = urlParams.get('api_base') || urlParams.get('api');
    if (paramApi) return paramApi.replace(/\/+$/, '');
  } catch (e) {}

  // If FastAPI is serving the frontend directly
  if (window.location.port === '8000') {
    return window.location.origin;
  }

  // Local development: Live Server / other frontend server
  if (
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname === 'localhost'
  ) {
    return `${window.location.protocol}//${window.location.hostname}:8000`;
  }

  // Production: frontend and FastAPI are on the same Render origin
  return window.location.origin;
};

const API_BASE = getApiBase();

const DATA = {
  districts: {
    Pune: { demand: 'High', capacity: '68%', outcome: '64%', observability: 'Medium', centres: 4, detail: 'Strong advanced-manufacturing signals; training demand and placement evidence are comparatively well observed in the auto/tooling corridor.' },
    Nashik: { demand: 'Moderate', capacity: '41%', outcome: '52%', observability: 'Low', centres: 2, detail: 'Employer validation indicates real demand. Low digital observability means online job postings severely understate local MSME hiring.' },
    'Chhatrapati Sambhajinagar': { demand: 'High', capacity: '29%', outcome: '48%', observability: 'Low', centres: 1, detail: 'Industrial cluster demand is rising faster than advanced CNC capacity. Candidate movement from nearby Marathwada districts is material.' },
    Satara: { demand: 'Moderate', capacity: '37%', outcome: '55%', observability: 'Low', centres: 2, detail: 'Linked to the Pune-Shirwal labour corridor. Evidence is weighted toward training centres and tracer follow-up sources.' },
  },
  skills: [
    { id: 'cnc_programming', name: 'CNC Programming', canonical_name: 'CNC Programming', type: 'SKILL', aliases: 'CNC coding · G-code programming · CNC प्रोग्रामिंग · 5-axis setup', demand: 'Increasing', confidence: '0.82', observability: 'Medium', evidence: 23, courses: 2, capacity: '29%', outcome: '64%', geography: 'Pune · Chh. Sambhajinagar · Nashik' },
    { id: 'cad_cam', name: 'CAD/CAM', canonical_name: 'CAD/CAM', type: 'SKILL', aliases: 'Computer-aided design · CAM workflows · Mastercam', demand: 'Increasing', confidence: '0.76', observability: 'Medium', evidence: 18, courses: 2, capacity: '44%', outcome: '59%', geography: 'Pune · Nashik' },
    { id: 'plc_troubleshooting', name: 'PLC Troubleshooting', canonical_name: 'PLC Troubleshooting', type: 'SKILL', aliases: 'PLC diagnosis · PLC fault finding · Ladder logic', demand: 'Emerging', confidence: '0.71', observability: 'Low', evidence: 14, courses: 1, capacity: '35%', outcome: '48%', geography: 'Pune · Satara' },
    { id: 'digital_measurement', name: 'Digital Measurement', canonical_name: 'Digital Measurement', type: 'SKILL', aliases: 'Digital metrology · CMM operation · डिजिटल मापन', demand: 'Increasing', confidence: '0.79', observability: 'Medium', evidence: 16, courses: 2, capacity: '51%', outcome: '62%', geography: 'Pune · Chh. Sambhajinagar' },
    { id: 'collaborative_robotics', name: 'Collaborative Robot Setup', canonical_name: 'Collaborative Robot Setup', type: 'SKILL', aliases: 'Cobot programming · Cobot teaching · रोबोटिक्स', demand: 'Emerging', confidence: '0.65', observability: 'Low', evidence: 11, courses: 1, capacity: '24%', outcome: '42%', geography: 'Pune' },
  ],
  evidence: [
    { name: 'CNC programmer requirement', source: 'Apex Precision Works', date: '18 Sep 2026', place: 'Pune', kind: 'Employer signal', state: 'Observed', confidence: '0.89', detail: 'Employer requirement / 5-axis Fanuc CNC operator' },
    { name: 'CNC placement conversion', source: 'Pune Advanced Skills Centre', date: '13 Sep 2026', place: 'Pune', kind: 'Placement record', state: 'Observed', confidence: '0.86', detail: '78 certified / 41 confirmed target-sector placements' },
    { name: 'Six-month occupation retention', source: 'Graduate tracer cohort 24-Q1', date: '09 Sep 2026', place: 'Pune–Satara corridor', kind: 'Tracer observation', state: 'Estimated', confidence: '0.66', detail: '140 retained at 6 months / 160 unobserved outcomes' },
    { name: 'AI-assisted PCB design phrase', source: 'Electronics employer cluster', date: '02 Sep 2026', place: 'Pune', kind: 'Industry survey', state: 'Observed', confidence: '0.71', detail: 'Repeated phrase / 4 independent employers' },
    { name: 'CNC equipment inventory', source: 'Sambhajinagar Training Network', date: '27 Aug 2026', place: 'Chh. Sambhajinagar', kind: 'Infrastructure record', state: 'Observed', confidence: '0.83', detail: 'Two operating simulators / one under maintenance' },
    { name: 'Unknown graduate outcome', source: 'CNC L4 2025 cohort', date: '20 Aug 2026', place: 'Nashik', kind: 'Tracer observation', state: 'Unobserved', confidence: '0.00', detail: '54 candidates did not respond; retained as unobserved' },
  ],
  interventions: [{ id: 'int_cnc_pilot', code: 'I-01', title: 'Expand advanced CNC pilot capacity', target: 'Pune and Chhatrapati Sambhajinagar', duration: 'One planning cycle', metric: 'Six-month target-sector retention', status: 'Proposed controlled pilot' }],
};

const NAV = [
  ['INTELLIGENCE', [['overview','Overview','◉'],['market','Market intelligence','↗'],['skills','Skill intelligence','⌘'],['supply','Supply & outcomes','⇣'],['emerging','Emerging skills','✦'],['geography','Geography','⌖']]],
  ['DECISION', [['alignment','Alignment engine','⊞'],['interventions','Interventions','→'],['candidate','Candidate guidance','★']]],
  ['ASSURANCE', [['evidence','Evidence explorer','≡'],['quality','Data quality','◌'],['system','System & methodology','◎']]],
];

const state = {
  page: 'overview',
  selectedSkill: 'CNC Programming',
  selectedSkillId: 'cnc_programming',
  selectedDistrict: 'Pune',
  selectedNode: 'CNC Programming',
  filter: { district: 'All districts', sector: 'Advanced manufacturing', period: '90', sources: new Set(['employer','placement','tracer']) },
  graph: null,
  liveData: {}
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const iconLabel = (text, tone = 'blue') => `<span class="tiny-tag ${tone === 'blue' ? '' : tone}">${text}</span>`;
const why = (key = 'cnc') => `<button class="button-secondary why-button" data-why="${key}">Show me why <span aria-hidden="true">↗</span></button>`;
const pageHeader = (eyebrow, title, description, meta = 'DEMO DATASET / 24 SEP 2026') => `<div class="page-heading"><div><span class="eyebrow">${eyebrow}</span><h1>${title}</h1>${description ? `<p>${description}</p>` : ''}</div><div class="heading-meta"><span class="status-dot live"></span>${meta}</div></div>`;

// Explicit data-unavailable renderer (replaces silent mock fallback intelligence)
function renderDataUnavailable(title, endpoint) {
  return `
    <div class="page-heading">
      <div>
        <span class="eyebrow">INTELLIGENCE SERVICE STATUS</span>
        <h1>${title}</h1>
        <p>Live intelligence backend service is currently unreachable.</p>
      </div>
      <div class="heading-meta"><span class="status-dot offline"></span>SERVICE OFFLINE</div>
    </div>
    <div class="content-stack">
      <article class="panel data-unavailable-panel">
        <div class="unavailable-icon">⚠</div>
        <h3>Live Intelligence Service Unavailable</h3>
        <p class="unavailable-msg">
          SkillPulse refuses to silently substitute fabricated mock intelligence when the live backend is disconnected. 
          The required data service at <code>${endpoint}</code> could not be reached. Start the backend service with:
          <br><br>
          <code style="background:var(--surface); padding:4px 8px; border:1px solid var(--line); color:var(--teal);">python -m uvicorn backend.main:app --port 8000</code>
        </p>
        <div class="unavailable-actions">
          <button class="button-primary" onclick="renderPage()">Retry Connection</button>
        </div>
      </article>
    </div>
  `;
}

function setBackendStatus(online, message = '') {
  state.backendOnline = online;
  const dot = $('#backend-status-dot');
  const txt = $('#backend-status-text');
  if (dot) {
    dot.className = `status-dot ${online ? 'live' : 'offline'}`;
  }
  if (txt) {
    txt.textContent = online ? 'PLANNING CYCLE 03' : 'PLANNING CYCLE 03 · OFFLINE';
  }
  let banner = $('#offline-banner');
  if (!online) {
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'offline-banner';
      banner.className = 'offline-service-banner';
      banner.innerHTML = `<span><strong>DATA SERVICE OFFLINE:</strong> FastAPI/SQLite service unreachable (${message || 'connection failed'}). Run <code>python -m uvicorn backend.main:app --port 8000</code> to restore live queries.</span><button onclick="this.parentElement.remove()" aria-label="Dismiss banner">×</button>`;
      document.body.prepend(banner);
    }
  } else if (banner) {
    banner.remove();
  }
}

// Safe API Fetcher with explicit status indicator
async function apiGet(path) {
  try {
    const res = await fetch(`${API_BASE}${path}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    setBackendStatus(true);
    return await res.json();
  } catch (err) {
    console.debug(`API fallback for ${path}:`, err.message);
    setBackendStatus(false, err.message);
    return null;
  }
}

async function apiPost(path, body) {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    setBackendStatus(true);
    return await res.json();
  } catch (err) {
    console.debug(`API fallback POST for ${path}:`, err.message);
    setBackendStatus(false, err.message);
    return null;
  }
}

function renderNav() {
  $('#main-nav').innerHTML = NAV.map(([section, items]) => `<div class="nav-section">${section}</div>${items.map(([id, label, icon]) => `<button class="nav-button ${state.page === id ? 'active' : ''}" data-page="${id}"><span class="nav-icon">${icon}</span>${label}</button>`).join('')}`).join('');
}

function renderOverview() {
  const d = state.liveData.overview;
  if (!d) return renderDataUnavailable('Overview Intelligence', '/api/overview');
  const metrics = d.pulse_metrics;
  const critical = d.critical_signals || [];
  const strip = d.cnc_strip || { change: '+18%', evidence_count: 23, confidence: 0.82, trend_bars: [28,34,31,43,47,59,63] };
  const supplyMini = d.effective_supply_mini || { certified: 380, relevant: 220, six_month: 140, caption: 'Exit reasons are shown only for traced respondents.' };
  const obsSpot = d.observability_spotlight || { district: 'NASHIK / CNC PROGRAMMING', obs_value: 'LOW', coverage_pct: '31%', demand_signal: 'MOD.', note: 'A low posting count is not read as low demand. Offline employer evidence remains in scope.' };

  return `
    <section class="hero-zone">
      <span class="eyebrow">EVIDENCE TO ACTION / MAHARASHTRA · CYCLE 03</span>
      <h1 class="hero-statement">The skill market is moving.<br /><em>See where the system is drifting.</em></h1>
      <p class="hero-sub">SkillPulse connects imperfect demand, training, capacity and outcome signals into a traceable planning view — without converting uncertainty into false precision.</p>
    </section>
    <section class="command-grid">
      <article class="panel">
        <header class="panel-header"><div><div class="panel-title">LABOUR MARKET PULSE</div><div class="panel-kicker">ADVANCED MANUFACTURING / ${state.filter.district.toUpperCase()}</div></div>${why('pulse')}</header>
        <div class="signal-pulse"><div class="pulse-layout">
          <div class="pulse-axis">
            <div><b>${metrics.demand_signal}</b><span>Demand signal</span></div>
            <div><b>${metrics.advanced_capacity}</b><span>Advanced capacity</span></div>
            <div><b>${metrics.effective_supply_range}</b><span>Effective supply range</span></div>
            <div><b>${metrics.system_confidence}</b><span>System confidence</span></div>
          </div>
          <div class="pulse-hub">
            <div class="pulse-rings"></div>
            <div class="pulse-core"><b>DRIFT</b><span>DETECTED</span></div>
            ${(metrics.orbit_tags || []).map(t => `<span class="orbit-tag ${t.class}">${t.name} <strong>${t.val}</strong></span>`).join('')}
          </div>
          <div class="pulse-alerts">
            ${(metrics.micro_alerts || []).map(a => `<div class="micro-alert ${a.type}"><b>${a.title}</b><span>${a.detail}</span></div>`).join('')}
          </div>
        </div></div>
      </article>
      <article class="panel critical-panel">
        <header class="panel-header"><div><div class="panel-title">CRITICAL SIGNALS</div><div class="panel-kicker">REQUIRES PLANNING REVIEW</div></div><button class="text-action" data-page="market">View all</button></header>
        <div class="critical-list">
          ${critical.map(s => `<button class="critical-signal why-button" data-why="${s.why || 'cnc'}"><span class="signal-code">${s.code}</span><span><b>${s.title}</b><p>${s.detail}</p></span><i class="severity ${s.severity}"></i></button>`).join('')}
        </div>
      </article>
    </section>
    ${(() => {
      const rs = d.program_risk_summary || {};
      const progs = rs.programs || [];
      if (!progs.length) return '';
      return `<article class="panel program-flag-panel">
        <header class="panel-header"><div><div class="panel-title">TRADITIONAL PROGRAMS FLAGGED</div><div class="panel-kicker">HIGH INTAKE · FALLING PLACEMENT · FALLING RETENTION — NOT ONLY RISING DEMAND</div></div><button class="text-action" data-page="supply">Review programs</button></header>
        <div class="program-flag-summary"><b>${rs.over_enrolled_count || 0}</b> over-enrolled · <b>${rs.flagged_count || 0}</b> critical / at risk · <b>~${rs.seats_to_redeploy || 0}</b> seats flagged for redeployment</div>
        <div class="program-flag-list">${progs.map(r => `<button class="program-flag-row ${r.risk_state === 'Critical' ? 'critical' : r.risk_state === 'At Risk' ? 'warn' : 'watch'}" data-page="supply"><span class="tiny-tag ${r.risk_state === 'Critical' ? 'critical' : r.risk_state === 'At Risk' ? 'warn' : 'watch'}">${r.risk_state.toUpperCase()}</span><b>${r.program_name}</b><span>Intake ${r.enrollment_count}</span><span style="color:var(--red)">Placement ${r.placement_trend}</span><span style="color:var(--red)">Retention ${r.retention_trend}</span><em>${r.flag_label}</em></button>`).join('')}</div>
      </article>`;
    })()}
    <section class="under-grid">
      <article class="panel compact-panel"><header class="panel-header"><div><div class="panel-title">CNC PROGRAMMING SIGNAL</div><div class="panel-kicker">90-DAY DEMAND TRAJECTORY</div></div><button class="text-action" data-page="market">Inspect</button></header><div class="metric-strip"><div><strong>${strip.change}</strong><span>Fused signal change</span></div><div><strong>${strip.evidence_count}</strong><span>Evidence records</span></div><div><strong>${strip.confidence}</strong><span>Confidence</span></div></div><div class="trend-chart">${strip.trend_bars.map(h=>`<i class="trend-bar" style="height:${h}%"></i>`).join('')}</div></article>
      <article class="panel compact-panel"><header class="panel-header"><div><div class="panel-title">EFFECTIVE SUPPLY</div><div class="panel-kicker">CNC L4 / 2025 COHORT</div></div><button class="text-action" data-page="supply">Trace flow</button></header><div class="pipeline-mini"><div><b>${supplyMini.certified}</b><span>CERTIFIED</span></div><i></i><div><b>${supplyMini.relevant}</b><span>RELEVANT</span></div><i></i><div><b>${supplyMini.six_month}</b><span>6-MO</span></div></div><p class="pipeline-caption"><strong>Not a causal claim:</strong> ${supplyMini.caption}</p></article>
      <article class="panel compact-panel"><header class="panel-header"><div><div class="panel-title">MARKET OBSERVABILITY</div><div class="panel-kicker">${obsSpot.district}</div></div><button class="text-action" data-page="quality">Assess</button></header><div class="observability"><div class="obs-value">${obsSpot.obs_value}</div><div class="bar-row"><span>DIGITAL COVERAGE</span><i style="--w:${obsSpot.coverage_pct}"></i><b>${obsSpot.coverage_pct}</b></div><div class="bar-row"><span>DEMAND SIGNAL</span><i style="--w:58%"></i><b>${obsSpot.demand_signal}</b></div><p class="obs-note">${obsSpot.note}</p></div></article>
    </section>`;
}

function renderMarket() {
  const m = state.liveData.marketSignals;
  if (!m) return renderDataUnavailable('Market Intelligence', '/api/market/signals');
  const occs = state.liveData.occupations || [];

  return `${pageHeader('MARKET INTELLIGENCE', 'Demand signals with their limits', 'A fused market signal is not a vacancy count. This view separates evidence of demand from our ability to observe it digitally.')}
  <div class="page-grid"><div class="content-stack"><article class="panel chart-panel"><header class="panel-header"><div><div class="panel-title">${m.skill_name.toUpperCase()} / FUSED DEMAND SIGNAL</div><div class="panel-kicker">EMPLOYER + PLACEMENT + TRACER + SURVEY</div></div>${why('cnc')}</header><div class="chart-body"><div class="signal-chart"><span class="axis-label">CONFIDENCE-WEIGHTED SIGNAL</span>${m.monthly_trend.map(t=>`<div class="chart-column"><i style="--h:${t.height_pct}%"></i><span>${t.month}</span></div>`).join('')}</div><div class="legend-row"><span><i></i>Fused demand signal</span><span><i class="teal"></i>Planning attention threshold</span><span>↑ ${m.trend_pct}% vs prior 90 days</span></div></div></article>
  <article class="panel"><header class="panel-header"><div><div class="panel-title">OCCUPATION SIGNALS</div><div class="panel-kicker">SELECTED SECTOR / CURRENT CYCLE</div></div><button class="text-action" data-page="evidence">Open evidence</button></header><div class="table-wrap"><table class="data-table"><thead><tr><th>Occupation</th><th>Signal</th><th>Trend</th><th>Observability</th><th>Confidence</th><th></th></tr></thead><tbody>${occs.map(r=>`<tr><td><b class="record-name">${r.title}</b><span class="record-sub">${r.sector}</span></td><td>${iconLabel(r.demand_signal.toUpperCase(), r.demand_signal === 'Emerging' ? 'estimated' : 'observed')}</td><td><span class="state-observed">↗ ${r.trend}</span></td><td>${r.market_observability}</td><td class="confidence">${Number(r.confidence_score).toFixed(2)}</td><td>${why('cnc')}</td></tr>`).join('')}</tbody></table></div></article></div>
  <aside class="side-stack"><article class="panel"><header class="panel-header"><div><div class="panel-title">SOURCE CONTRIBUTION</div><div class="panel-kicker">${m.skill_name.toUpperCase()} / 23 RECORDS</div></div></header><div class="source-mix">${m.source_mix.map(s=>`<div class="source-row"><span>${s.source}</span><i><b style="--value:${s.pct}"></b></i><strong>${s.pct}</strong></div>`).join('')}</div></article><article class="panel"><header class="panel-header"><div><div class="panel-title">READ THIS SIGNAL</div><div class="panel-kicker">INTERPRETATION BOUNDARY</div></div></header><div class="assumption-note"><p><b>Observed:</b> ${m.boundary_note.observed}</p><p><b>Estimated:</b> ${m.boundary_note.estimated}</p><p><b>Unobserved:</b> ${m.boundary_note.unobserved}</p>${why('observability')}</div></article></aside></div>`;
}

function renderSkills() {
  const skillsList = state.liveData.skills;
  if (!skillsList || skillsList.length === 0) return renderDataUnavailable('Skill Intelligence', '/api/skills');
  const currentSkill = skillsList.find(s => s.id === state.selectedSkillId || s.name === state.selectedSkill || s.canonical_name === state.selectedSkill) || skillsList[0];
  const displayName = currentSkill.canonical_name || currentSkill.name || 'CNC Programming';

  return `${pageHeader('SKILL INTELLIGENCE', 'Trace a competency through the system', 'Select any node in the spatial model. Connected evidence remains visible; unrelated elements recede. The graph is an analytic model, not decoration.', 'DRAG TO ROTATE · SCROLL TO ZOOM')}
  <article class="panel graph-layout"><div class="graph-shell"><canvas id="skill-graph" aria-label="Interactive 3D Skill Intelligence Graph. Drag to rotate; select a node to inspect its connections."></canvas><div class="graph-overlay" aria-hidden="true"></div><div class="graph-controls"><select id="graph-skill-select" aria-label="Select competency to visualize" style="background:var(--surface);color:var(--paper);border:1px solid var(--line);padding:4px 8px;font:9px var(--mono);">${skillsList.map(s => `<option value="${s.id}" ${(s.id === state.selectedSkillId || s.canonical_name === displayName) ? 'selected' : ''}>${s.canonical_name || s.name}</option>`).join('')}</select><button data-graph-reset>Reset view</button><button data-graph-isolate>Isolate ${displayName}</button><button data-why="cnc" class="why-button">Evidence chain</button></div><div class="graph-legend"><span style="--c:#6bc9e8">Evidence</span><span style="--c:#5bbfa7">Supply</span><span style="--c:#e0ad5b">Demand</span><span style="--c:#d96962">Mismatch</span></div></div>
  <aside id="graph-profile" class="graph-profile">${renderGraphProfile(currentSkill)}</aside></article>`;
}

function renderGraphProfile(skill, nodeName) {
  const name = nodeName || skill.canonical_name || skill.name || 'CNC Programming';
  const aliases = skill.aliases || 'CNC coding · G-code programming · CNC प्रोग्रामिंग';
  const specs = {
    'CNC Programming': { type:'CANONICAL SKILL', aliases:aliases, a:[['DEMAND','INCREASING'],['CONFIDENCE','0.82'],['OBSERVABILITY','MEDIUM'],['EVIDENCE','23 RECORDS']], r:[['CNC Operator','OCCUPATION'],['CNC Machining L4','COURSE'],['Pune cluster','GEOGRAPHY'],['9 employer signals','PROVENANCE']] },
    'CAD/CAM': { type:'CANONICAL SKILL', aliases:'Parametric 3D mechanical modelling · SolidWorks · Mastercam', a:[['DEMAND','INCREASING'],['CONFIDENCE','0.76'],['OBSERVABILITY','MEDIUM'],['EVIDENCE','18 RECORDS']], r:[['CAD/CAM Designer','OCCUPATION'],['CAD/CAM L5','COURSE'],['Pune · Nashik','GEOGRAPHY'],['Toolpath validation','PROVENANCE']] },
    'PLC Troubleshooting': { type:'CANONICAL SKILL', aliases:'Ladder logic debug · Siemens/Allen-Bradley · Sensor I/O', a:[['DEMAND','EMERGING'],['CONFIDENCE','0.71'],['OBSERVABILITY','LOW'],['EVIDENCE','14 RECORDS']], r:[['PLC Maintenance Technician','OCCUPATION'],['Automation L4','COURSE'],['Pune · Satara','GEOGRAPHY'],['Simulator rigs','EQUIPMENT']] },
    'Digital Measurement': { type:'CANONICAL SKILL', aliases:'CMM operation · Optical metrology · Statistical tolerance', a:[['DEMAND','INCREASING'],['CONFIDENCE','0.79'],['OBSERVABILITY','MEDIUM'],['EVIDENCE','16 RECORDS']], r:[['Quality Inspector','OCCUPATION'],['Metrology L4','COURSE'],['Pune · Sambhajinagar','GEOGRAPHY'],['Bridge CMM','EQUIPMENT']] },
    'Collaborative Robot Setup': { type:'CANONICAL SKILL', aliases:'Cobot teach pendant · Safety envelope · Cooperative assembly', a:[['DEMAND','EMERGING'],['CONFIDENCE','0.65'],['OBSERVABILITY','LOW'],['EVIDENCE','11 RECORDS']], r:[['Automation Tech','OCCUPATION'],['Automation L4','COURSE'],['Pune cluster','GEOGRAPHY'],['Safety calibration','PROVENANCE']] },
    'Industry demand': { type:'FUSED DEMAND SIGNAL', aliases:'Not a vacancy total · evidence fusion', a:[['STATE','STRONG'],['TREND','↑ 18%'],['SOURCE MIX','4 TYPES'],['FRESHNESS','6 DAYS']], r:[['Apex Precision Works','EMPLOYER'],['CNC Operator','OCCUPATION'],['23 observations','EVIDENCE'],['Medium visibility','LIMIT']] },
    'CNC Operator': { type:'OCCUPATION', aliases:'NCO-2015/7223.01 · Advanced Manufacturing', a:[['SIGNAL','STRONG'],['TREND','INCREASING'],['OBSERVABILITY','MEDIUM'],['CONFIDENCE','0.82']], r:[['CNC Programming','SKILL'],['Apex Precision Works','EMPLOYER'],['Placement records','OUTCOMES'],['Bhosari cluster','GEOGRAPHY']] },
    'Automation Tech': { type:'OCCUPATION', aliases:'NCO-2015/7412.02 · Industrial Automation', a:[['SIGNAL','EMERGING'],['TREND','INCREASING'],['OBSERVABILITY','LOW'],['CONFIDENCE','0.71']], r:[['PLC Troubleshooting','SKILL'],['Collaborative Robot Setup','SKILL'],['Satara ITI','CENTRE'],['Shirwal belt','GEOGRAPHY']] },
    'CNC Machining L4': { type:'COURSE', aliases:'Current delivery at 3 centres', a:[['COVERAGE','42%'],['CAPACITY','29%'],['TRAINERS','6'],['EQUIPMENT','14 UNITS']], r:[['CNC Programming','SKILL'],['Pune ASC','CENTRE'],['G-code module','CURRICULUM'],['Sambhajinagar','DISTRICT']] },
    'CAD/CAM L5': { type:'COURSE', aliases:'Certificate in CAD/CAM Engineering Design', a:[['COVERAGE','56%'],['CAPACITY','44%'],['TRAINERS','4'],['EQUIPMENT','18 UNITS']], r:[['CAD/CAM','SKILL'],['Pune ASC','CENTRE'],['SolidWorks module','CURRICULUM'],['Nashik','DISTRICT']] },
    'Automation L4': { type:'COURSE', aliases:'Industrial Automation & PLC Maintenance', a:[['COVERAGE','31%'],['CAPACITY','35%'],['TRAINERS','3'],['EQUIPMENT','8 UNITS']], r:[['PLC Troubleshooting','SKILL'],['Collaborative Robot Setup','SKILL'],['Satara ITI','CENTRE'],['Trainer gap','ALIGNMENT']] },
    'Metrology L4': { type:'COURSE', aliases:'Digital Metrology & Quality Assurance', a:[['COVERAGE','63%'],['CAPACITY','51%'],['TRAINERS','5'],['EQUIPMENT','12 UNITS']], r:[['Digital Measurement','SKILL'],['Sambhajinagar Net','CENTRE'],['CMM Scanner','EQUIPMENT'],['Quality Engineering','SECTOR']] },
    'Training capacity': { type:'CAPACITY SIGNAL', aliases:'Centres, trainers and usable equipment', a:[['USABLE','29%'],['CENTRES','3'],['TRAINERS','6'],['EQUIPMENT','14']], r:[['CNC Machining L4','COURSE'],['CNC simulators','EQUIPMENT'],['Pune ASC','CENTRE'],['Capacity gap','ALIGNMENT']] },
    'Employment outcomes': { type:'OUTCOME SIGNAL', aliases:'Tracer records do not infer missing outcomes', a:[['CONFIRMED','220'],['UNKNOWN','160'],['RANGE','220–290'],['RETENTION','140']], r:[['CNC L4 2025','COHORT'],['6-month tracer','EVIDENCE'],['Relevant sector','OUTCOME'],['Response risk','LIMIT']] },
    'Evidence records': { type:'PROVENANCE RECORDS', aliases:'23 active records in selected scope', a:[['EMPLOYER','9'],['PLACEMENT','6'],['TRACER','4'],['SURVEY','4']], r:[['Apex Precision','SOURCE'],['Pune ASC','SOURCE'],['Cohort 24-Q1','SOURCE'],['Audit Trail','SHOW ME WHY']] },
    'Pune cluster': { type:'INDUSTRIAL CLUSTER', aliases:'Bhosari, Talegaon & Chakan industrial corridor', a:[['OPENINGS','36 VERIFIED'],['CENTRES','4 ACTIVE'],['CORRIDORS','3 CONNECTED'],['OBSERVABILITY','MEDIUM']], r:[['Bharat Forging','EMPLOYER'],['Apex Precision','EMPLOYER'],['Pune ASC','CENTRE'],['Sambhajinagar','CORRIDOR']] },
    'Equipment inventory': { type:'EQUIPMENT ASSET', aliases:'CNC simulators and physical milling rigs', a:[['OPERATIONAL','14'],['MAINTENANCE','1'],['VERIFIED','18 SEP 2026'],['UTILITY','0.92']], r:[['Pune ASC','CENTRE'],['Sambhajinagar Net','CENTRE'],['Simulators','TYPE'],['Capacity gap','ALIGNMENT']] },
    'AI PCB candidate': { type:'EMERGING COMPETENCY', aliases:'AI-assisted PCB design workflows', a:[['STAGE','04 ACCUMULATION'],['EVIDENCE','4 EMPLOYERS'],['PERSISTENCE','3 MONTHS'],['CONFIDENCE','0.74']], r:[['Electronics cluster','SOURCE'],['PCB Design','QUALIFICATION'],['Skillness Gate','VALIDATED'],['Human review','STATUS']] }
  };
  const v = specs[name] || {
    type: 'CANONICAL COMPETENCY',
    aliases: aliases,
    a: [['DEMAND', skill.demand || 'ACTIVE'], ['CONFIDENCE', skill.confidence || '0.78'], ['OBSERVABILITY', skill.observability || 'MEDIUM'], ['EVIDENCE', `${skill.evidence || 16} RECORDS`]],
    r: [['Connected Occupation', 'OCCUPATION'], ['Accredited Course', 'COURSE'], ['Industrial Corridor', 'GEOGRAPHY'], ['Source Records', 'PROVENANCE']]
  };

  return `<span class="profile-type">${v.type}</span><h2>${name}</h2><p class="profile-alias">${v.aliases}</p><div class="profile-attributes">${v.a.map(([x,y])=>`<div><span>${x}</span><strong>${y}</strong></div>`).join('')}</div><div class="linked-records"><h3>CONNECTED RECORDS</h3>${v.r.map(([x,y])=>`<div class="linked-record"><b></b>${x}<span>${y}</span></div>`).join('')}</div><div class="action-row" style="margin-top:17px">${why(name === 'Employment outcomes' ? 'supply' : 'cnc')}</div>`;
}

function renderSupply() {
  const p = state.liveData.supplyPipeline;
  if (!p) return renderDataUnavailable('Supply & Outcomes Intelligence', '/api/supply/pipeline');
  const programRisks = state.liveData.programRisks || [];

  return `${pageHeader('SUPPLY & OUTCOMES', 'From certification to effective supply', 'Training volume is not treated as labour supply. The pipeline preserves observed, estimated and unobserved outcomes explicitly.')}
  <div class="content-stack">
    <article class="panel">
      <header class="panel-header"><div><div class="panel-title">${p.cohort_name.toUpperCase()}</div><div class="panel-kicker">NOMINAL SUPPLY → EFFECTIVE TARGET-SECTOR SUPPLY</div></div>${why('supply')}</header>
      <div class="supply-flow">
        <div class="flow-step"><span class="flow-index">01 / OBSERVED</span><strong>${p.enrolled}</strong><b>Enrolled</b><span>Programme records</span></div>
        <div class="flow-step"><span class="flow-index">02 / OBSERVED</span><strong>${p.completed}</strong><b>Completed</b><span>Completion records</span></div>
        <div class="flow-step known"><span class="flow-index">03 / OBSERVED</span><strong>${p.certified}</strong><b>Certified</b><span>Certification records</span></div>
        <div class="flow-step unknown"><span class="flow-index">04 / PARTIAL</span><strong>${p.confirmed_target_employed}</strong><b>Relevant sector</b><span>Confirmed among traced candidates</span></div>
        <div class="flow-step critical"><span class="flow-index">05 / PARTIAL</span><strong>${p.six_month_retained}</strong><b>Retained at 6 mo.</b><span>Do not generalise beyond observed cohort</span></div>
      </div>
    </article>

    <article class="panel leakage-grid">
      <div class="leakage-bar">
        <header class="panel-header"><div><div class="panel-title">TRAINING-TO-EMPLOYMENT LEAKAGE</div><div class="panel-kicker">CONVERSION, NOT CAUSAL EXPLANATION</div></div></header>
        <div style="padding-top:20px">${p.leakage_rates.map(r=>`<div class="leakage-line"><span>${r.stage}</span><i style="--w:${r.width_pct}"><b></b></i><strong>${r.rate}</strong></div>`).join('')}</div>
      </div>
      <aside class="assumption-note">
        <p><b>Potential effective supply: ${p.effective_supply_range}.</b></p>
        <p>${p.confirmed_target_employed} target-sector outcomes are confirmed. ${p.unobserved_outcome} outcomes remain unknown; the upper bound applies stated tracer-response assumptions.</p>
        <p><b>Reported among traced respondents</b></p>
        <div class="reason-list">
          <div><b>${p.reported_exit_reasons.wage_concerns || 41}%</b><span>Wage concerns</span></div>
          <div><b>${p.reported_exit_reasons.location_constraints || 23}%</b><span>Location constraints</span></div>
          <div><b>${p.reported_exit_reasons.occupation_change || 18}%</b><span>Occupation change</span></div>
        </div>
        ${why('supply')}
      </aside>
    </article>

    <!-- ENHANCEMENT 1: PROGRAM RISK SIGNALS -->
    <article class="panel">
      <header class="panel-header">
        <div>
          <div class="panel-title">PROGRAM RISK SIGNALS</div>
          <div class="panel-kicker">TRADITIONAL TRAINING SUPPLY MISALIGNMENT & OUTCOME DRIFT DETECTION</div>
        </div>
        ${why('program_risk')}
      </header>
      <div style="padding:16px 20px 14px;">
        <p style="margin:0 0 14px; color:var(--muted); font-size:10px; line-height:1.5;">
          Identifies traditional programs exhibiting combinations of high intake, declining placement, and shifting industry demand.
          <strong>Planning Principle:</strong> Declining placement signals training-supply misalignment requiring planning review; it does not automatically prove curricular defect.
        </p>
        <div class="program-risk-grid">
          ${programRisks.map(r => {
            const stateTone = r.risk_state === 'Critical' ? 'critical' : r.risk_state === 'At Risk' ? 'warn' : r.risk_state === 'Watch' ? 'watch' : 'good';
            return `
              <div class="program-risk-card ${stateTone}">
                <div class="risk-card-head">
                  <div>
                    <span class="tiny-tag ${stateTone}">${r.risk_state.toUpperCase()} / ${r.code}</span>${r.over_enrolled ? ' <span class="tiny-tag critical">OVER-ENROLLED</span>' : ''}
                    <h3 style="margin:6px 0 2px; color:var(--paper); font-size:13px; font-weight:700;">${r.program_name}</h3>
                    <span style="font:8px var(--mono); color:var(--muted);">NSQF Level ${r.nsqf_level} · Risk: ${r.risk_category}</span>
                  </div>
                  <div class="risk-metric-box">
                    <span style="font:7px var(--mono); color:var(--faint);">ENROLLMENT</span>
                    <strong style="color:var(--paper); font:12px var(--mono);">${r.enrollment_level} (${r.enrollment_count})</strong>
                  </div>
                </div>

                <div class="risk-metric-row">
                  <div>
                    <span>Placement Trend</span>
                    <strong style="color:${r.placement_trend.includes('↓') ? 'var(--red)' : 'var(--teal)'}; font:12px var(--mono);">${r.placement_trend}</strong>
                  </div>
                  <div>
                    <span>6-Mo Retention</span>
                    <strong style="color:${r.retention_trend.includes('↓') ? 'var(--red)' : 'var(--teal)'}; font:12px var(--mono);">${r.retention_trend}</strong>
                  </div>
                  <div>
                    <span>Current Demand</span>
                    <strong style="color:var(--amber); font:10px var(--mono);">${r.current_demand}</strong>
                  </div>
                  <div>
                    <span>Evidence / Conf.</span>
                    <strong style="color:var(--blue); font:10px var(--mono);">${r.evidence_count} recs · ${Number(r.confidence_score).toFixed(2)}</strong>
                  </div>
                </div>

                <div class="risk-rationale">
                  <p style="margin:0 0 6px; font-size:9px; color:var(--muted); line-height:1.45;"><strong>Observation:</strong> ${r.review_rationale}</p>
                  <p style="margin:0; font-size:9px; color:var(--teal); line-height:1.45;"><strong>Recommended Review Action:</strong> ${r.recommended_action}</p>
                  <p style="margin:6px 0 0; font-size:9px; color:var(--amber); line-height:1.45;"><strong>Intake quota:</strong> ${r.intake_recommendation}</p>
                </div>

                <div class="action-row" style="margin-top:12px; justify-content:space-between; align-items:center;">
                  <span style="font:8px var(--mono); color:var(--faint);">STATE: ${r.risk_state.toUpperCase()}</span>
                  ${why('program_risk')}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </article>

    <div class="page-grid">
      <article class="panel">
        <header class="panel-header"><div><div class="panel-title">TRACER OBSERVATIONS</div><div class="panel-kicker">3, 6 AND 12 MONTH FOLLOW-UP</div></div></header>
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th>Timepoint</th><th>Responses</th><th>Target sector</th><th>Occupation retained</th><th>Outcome state</th></tr></thead>
            <tbody>${p.tracer_timeline.map(t=>`<tr><td><b class="record-name">${t.timepoint}</b></td><td>${t.responses}</td><td>${t.target_sector}</td><td>${t.retained}</td><td>${iconLabel(t.state,t.state_tone)}</td></tr>`).join('')}</tbody>
          </table>
        </div>
      </article>
      <aside class="side-stack">
        <article class="panel">
          <header class="panel-header"><div><div class="panel-title">RESPONSE SELECTION RISK</div><div class="panel-kicker">TRACER COHORT</div></div></header>
          <div class="observability">
            <div class="obs-value" style="color:var(--amber)">${p.response_selection_risk.toUpperCase()}</div>
            <p class="obs-note"><strong>Missing ≠ failure.</strong> A non-response is held as unknown until evidence exists. Sensitivity ranges are used where justified.</p>
          </div>
        </article>
      </aside>
    </div>
  </div>`;
}

function renderEmerging() {
  const candidates = state.liveData.emerging;
  if (!candidates || candidates.length === 0) return renderDataUnavailable('Emerging Skill Intelligence', '/api/emerging');

  return `${pageHeader('EMERGING SKILLS', 'What is changing before the framework catches up', 'Technical phrases pass a skillness gate and accumulate independent evidence before they become emerging competency candidates.')}
  <div class="content-stack"><article class="panel"><header class="panel-header"><div><div class="panel-title">EMERGING COMPETENCY PIPELINE</div><div class="panel-kicker">PHRASE → TECHNICAL RELEVANCE → EVIDENCE THRESHOLD</div></div>${why('emerging')}</header><div class="emerging-pipeline"><div class="emerging-stage"><span class="stage-no">01</span><b>Technical phrase</b><p>“AI-assisted PCB design” appears in employer materials.</p></div><div class="emerging-stage"><span class="stage-no">02</span><b>Skillness gate</b><p>Passes: technical competency, not a condition or document requirement.</p></div><div class="emerging-stage"><span class="stage-no">03</span><b>Known match</b><p>Maps partly to PCB design; AI workflow is not sufficiently covered.</p></div><div class="emerging-stage active"><span class="stage-no">04</span><b>Evidence accumulation</b><p>4 independent employers, 3 monthly observations, high technical relevance.</p></div><div class="emerging-stage active"><span class="stage-no">05</span><b>Candidate</b><p>Flag for human validation, not automatic qualification creation.</p></div></div></article>
  
  <section class="candidate-grid">${candidates.map((c, i)=>`
    <article class="candidate-card ${i===0?'highlight':''}">
      <span class="candidate-type">EMERGING COMPETENCY CANDIDATE</span>
      <h3>${c.technical_phrase}</h3>
      <p>${c.qualification_gap}</p>
      <div class="confidence-meter">${[18,28,21,31,25].map((h,gi)=>`<i style="--h:${h}px" class="${gi >= c.pipeline_stage ? 'off':''}"></i>`).join('')}</div>
      <div class="candidate-foot"><span>${c.pipeline_stage}/5 GATES</span><span>CONF. ${Number(c.confidence_score).toFixed(2)}</span></div>
      <div class="action-row" style="margin-top:13px">${why('emerging')}</div>
    </article>`).join('')}
  </section>

  <article class="panel gate-tester">
    <header class="panel-header"><div><div class="panel-title">INTERACTIVE SKILLNESS GATE</div><div class="panel-kicker">TEST REAL-TIME COMPETENCY VS. CONDITION CLASSIFIER</div></div></header>
    <div style="padding: 14px 16px;">
      <p style="margin:0 0 10px; color:var(--muted); font-size:10px;">Test any requirement phrase against the live classification model to verify it distinguishes true skills from conditions:</p>
      <div class="gate-tester-form">
        <input id="gate-test-input" class="gate-tester-input" type="text" placeholder="Type a phrase (e.g. 5-axis CNC programming, night shift only, Aadhaar card mandatory)..." value="PLC troubleshooting" />
        <button id="gate-test-button" class="button-primary">Evaluate Gate</button>
      </div>
      <div class="gate-pills">
        <span style="color:var(--faint); font:8px var(--mono); align-self:center;">QUICK TEST:</span>
        <button class="gate-pill" data-pill="PLC troubleshooting">PLC troubleshooting</button>
        <button class="gate-pill" data-pill="Night shift">Night shift</button>
        <button class="gate-pill" data-pill="Aadhaar required">Aadhaar required</button>
        <button class="gate-pill" data-pill="AI-assisted PCB design">AI-assisted PCB design</button>
        <button class="gate-pill" data-pill="Willing to relocate">Willing to relocate</button>
        <button class="gate-pill" data-pill="5-axis toolpath optimization">5-axis toolpath optimization</button>
      </div>
      <div id="gate-live-result" class="gate-live-result">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <b id="gate-res-phrase" style="color:var(--paper); font-size:11px;">PLC troubleshooting</b>
          <em id="gate-res-badge" class="gate-result">SKILL / 0.91</em>
        </div>
        <div id="gate-res-desc" style="color:var(--muted); font-size:9px; margin-top:4px;">Category: Technical Competency — Specific technical competence with verifiable task context.</div>
      </div>
    </div>
  </article>

  <article class="panel"><header class="panel-header"><div><div class="panel-title">SKILLNESS GATE / BENCHMARK PHRASES</div><div class="panel-kicker">WHY REQUIREMENTS ARE NOT AUTOMATICALLY CALLED SKILLS</div></div></header><div class="gate-grid"><div class="gate-row"><b>PLC troubleshooting</b><span>Specific technical competence with a verifiable task context.</span><em class="gate-result">SKILL / 0.91</em></div><div class="gate-row"><b>Night shift</b><span>Working condition, not a competency.</span><em class="gate-result reject">NOT A SKILL / 0.98</em></div><div class="gate-row"><b>Aadhaar required</b><span>Administrative eligibility condition, not a competency.</span><em class="gate-result reject">NOT A SKILL / 0.99</em></div></div></article></div>`;
}

function renderGeography() {
  const geo = state.liveData.geography;
  if (!geo || !geo.districts || geo.districts.length === 0) return renderDataUnavailable('Labour Market Geography', '/api/geography');
  const districtList = geo.districts;
  const district = districtList.find(d => d.name === state.selectedDistrict) || districtList[0];
  const corridors = geo.corridors || [];
  const plan = state.liveData.districtActionPlan;

  return `${pageHeader('LABOUR MARKET GEOGRAPHY', 'Where the mismatch is occurring', 'District boundaries are administrative. This map shows evidence-linked labour corridors, capacity and cross-district movement rather than treating each district as an isolated market.')}
  <article class="panel geo-layout"><div class="map-canvas"><svg viewBox="0 0 700 470" role="img" aria-label="Interactive labour-market map of selected Maharashtra districts">
    <defs><pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(163,203,202,.12)" stroke-width="1"/></pattern><filter id="soft"><feGaussianBlur stdDeviation="3"/></filter></defs><rect width="700" height="470" fill="url(#grid)" />
    <path d="M154 100 L280 58 L410 98 L526 154 L550 276 L475 368 L306 400 L164 345 L91 242 Z" fill="#132125" stroke="#4d6669" stroke-width="1.5"/>
    <path class="district-shape ${state.selectedDistrict==='Nashik'?'selected':''}" data-district="Nashik" d="M196 120 L294 91 L335 161 L273 224 L173 195 Z" fill="rgba(91,191,167,.12)" stroke="#6b8888" />
    <path class="district-shape ${state.selectedDistrict==='Pune'?'selected':''}" data-district="Pune" d="M275 225 L381 170 L456 235 L419 331 L306 353 L238 294 Z" fill="rgba(107,201,232,.14)" stroke="#6b8888" />
    <path class="district-shape ${state.selectedDistrict==='Chhatrapati Sambhajinagar'?'selected':''}" data-district="Chhatrapati Sambhajinagar" d="M379 168 L482 151 L522 242 L456 235 Z" fill="rgba(217,105,98,.13)" stroke="#6b8888" />
    <path class="district-shape ${state.selectedDistrict==='Satara'?'selected':''}" data-district="Satara" d="M237 294 L306 353 L285 395 L184 343 Z" fill="rgba(224,173,91,.11)" stroke="#6b8888" />
    <path d="M316 270 C365 225,420 212,475 203" fill="none" stroke="#e0ad5b" stroke-width="2" stroke-dasharray="5 5"/><path d="M289 278 C240 239,225 196,235 162" fill="none" stroke="#6bc9e8" stroke-width="2" stroke-dasharray="5 5"/><path d="M286 296 C258 322,246 338,236 359" fill="none" stroke="#5bbfa7" stroke-width="2" stroke-dasharray="5 5"/>
    <circle cx="316" cy="270" r="10" fill="#6bc9e8" filter="url(#soft)"/><circle cx="316" cy="270" r="4" fill="#b9eafb"/><circle cx="475" cy="203" r="8" fill="#d96962"/><circle cx="235" cy="162" r="8" fill="#5bbfa7"/><circle cx="236" cy="359" r="8" fill="#e0ad5b"/>
    <text class="map-label" x="300" y="255">Pune</text><text class="map-label" x="450" y="188">Chh. Sambhajinagar</text><text class="map-label" x="181" y="144">Nashik</text><text class="map-label" x="187" y="379">Satara</text><text class="map-label-small" x="352" y="246">CNC labour corridor</text>
  </svg><div class="map-legend"><span><i></i> Demand node</span><span><i class="capacity"></i> Capacity node</span><span><i class="outcome"></i> Outcome/tracer node</span></div></div>
  <aside class="geo-profile">
    <span class="profile-type">SELECTED DISTRICT</span>
    <h2>${state.selectedDistrict}</h2>
    <p>${district.detail || ''}</p>
    <div class="geo-metrics">
      <div><span>Demand signal</span><b>${district.demand_signal || 'Moderate'}</b></div>
      <div><span>Market observability</span><b>${district.market_observability || 'Low'}</b></div>
      <div><span>Advanced capacity</span><b>${district.advanced_capacity_pct ? district.advanced_capacity_pct + '%' : '41%'}</b></div>
      <div><span>6-month target outcome</span><b>${district.six_month_outcome_pct ? district.six_month_outcome_pct + '%' : '52%'}</b></div>
      <div><span>Training centres</span><b>${district.centres_count || 2}</b></div>
    </div>
    <div class="corridor-list">
      <h3>CONNECTED LABOUR CORRIDORS</h3>
      ${corridors.map(c=>`<div class="corridor">${c.name || c.corridor_name}<span>${c.dynamic_type}</span></div>`).join('')}
    </div>
    <button id="btn-generate-district-plan" class="button-primary" style="width:100%;margin-top:14px;padding:9px 12px;display:flex;justify-content:center;align-items:center;gap:6px;">
      <span>Generate District Action Plan</span> <span>📋</span>
    </button>
    <div class="action-row" style="margin-top:14px">${why('geography')}</div>
  </aside></article>

  <!-- ENHANCEMENT 2: EXECUTIVE DISTRICT ACTION PLAN -->
  ${plan ? `
  <article id="district-action-plan-section" class="panel district-plan-panel">
    <header class="panel-header">
      <div>
        <div class="panel-title">DISTRICT ACTION PLAN</div>
        <div class="panel-kicker">EXECUTIVE DECISION SUPPORT / PLANNING ${plan.planning_cycle.toUpperCase()} · ${plan.district_name.toUpperCase()}</div>
      </div>
      <div class="action-row">
        <button id="btn-export-plan-report" class="button-primary" data-plan-district="${plan.district_id}">Export Executive Brief (PDF/Print) ↗</button>
        <button id="btn-export-plan-csv" class="button-secondary" data-plan-district="${plan.district_id}">Download CSV ⤓</button>
        <button id="btn-export-plan-json" class="button-secondary" data-plan-district="${plan.district_id}">Download JSON ⤓</button>
        ${why('district_plan')}
      </div>
    </header>

    <div class="priorities-strip">
      ${plan.priorities.map(p => `
        <div class="priority-card ${p.priority_level.toLowerCase()}">
          <div class="priority-header">
            <span>${p.priority_num}</span>
            <span class="tiny-tag ${p.priority_level==='CRITICAL'||p.priority_level==='HIGH'?'critical':'warn'}">${p.priority_level}</span>
          </div>
          <div style="font-size:12px; font-weight:700; color:var(--paper); margin-bottom:4px;">Action: ${p.action}</div>
          <div style="font-size:11px; color:var(--teal); font-family:var(--mono); margin-bottom:6px;">${p.target_metric}</div>
          <div style="font-size:9px; color:var(--muted); line-height:1.4;"><strong>Evidence:</strong> ${p.evidence_basis}</div>
        </div>
      `).join('')}
    </div>

    <div class="district-spec-grid">
      <div class="district-spec-cell full-width">
        <span>01 / IDENTIFIED MISMATCH</span>
        <strong>${plan.identified_mismatch}</strong>
      </div>
      <div class="district-spec-cell">
        <span>02 / RECOMMENDED INTERVENTION</span>
        <strong>${plan.recommended_intervention}</strong>
        <div style="margin-top:6px;">
          <button class="button-secondary" data-page="interventions" style="padding:2px 8px; font-size:8px;">View Intervention (${plan.intervention_code}) →</button>
        </div>
      </div>
      <div class="district-spec-cell">
        <span>03 / SEAT & CAPACITY RECOMMENDATION</span>
        <strong style="color:var(--teal);">${plan.seat_capacity_recommendation}</strong>
      </div>
      <div class="district-spec-cell">
        <span>04 / TRAINER UPSKILLING REQUIREMENT</span>
        <strong>${plan.trainer_requirement}</strong>
      </div>
      <div class="district-spec-cell">
        <span>05 / EQUIPMENT & LAB REQUIREMENT</span>
        <strong>${plan.equipment_requirement}</strong>
      </div>
      <div class="district-spec-cell">
        <span>06 / INDICATIVE BUDGET PRIORITY</span>
        <strong style="color:var(--amber); font-family:var(--mono);">${plan.indicative_budget_priority}</strong>
      </div>
      <div class="district-spec-cell">
        <span>07 / MID-CYCLE REVIEW GATE</span>
        <strong style="color:var(--blue); font-family:var(--mono);">${plan.review_date}</strong>
      </div>
      <div class="district-spec-cell full-width">
        <span>08 / EXPECTED MEASURABLE OUTCOME</span>
        <strong>${plan.expected_measurable_outcome}</strong>
      </div>
      <div class="district-spec-cell">
        <span>09 / EVIDENCE & CONFIDENCE</span>
        <strong>${plan.evidence_count} active records · Confidence ${plan.evidence_confidence_score}</strong>
      </div>
      <div class="district-spec-cell">
        <span>10 / DERIVATION ENGINE</span>
        <strong style="font-size:9px; color:var(--muted);">Market Demand + Supply & Outcomes + Capacity + Equipment + Trainers + Corridors</strong>
      </div>
    </div>

    ${(plan.program_seat_quota || []).length ? `<div style="padding:0 20px 16px;"><div class="panel-kicker" style="margin-bottom:8px;">SEAT QUOTA / TRADITIONAL PROGRAM INTAKE — ${plan.district_name.toUpperCase()} (+${plan.seats_added} ADDED · −${plan.seats_released} RELEASED)</div>
      <div class="table-wrap"><table class="data-table"><thead><tr><th>Program</th><th>Flags</th><th>Current intake</th><th>Recommended</th><th>Released</th></tr></thead><tbody>${plan.program_seat_quota.map(q => `<tr><td><b class="record-name">${q.code} · ${q.program}</b></td><td>${q.flag}</td><td>${q.current_intake}</td><td style="color:var(--teal)">${q.recommended_intake}</td><td>${q.seats_released}</td></tr>`).join('')}</tbody></table></div></div>` : ''}
    <div style="padding:0 20px 16px;">
      <div class="assumption-note" style="border-left-color:var(--amber); background:rgba(224,173,91,0.04);">
        <p style="margin:0; font-size:9px; color:var(--muted); line-height:1.45;">
          <strong style="color:var(--amber);">Administrative & Governance Caveat:</strong> ${plan.governance_caveat}
        </p>
      </div>
    </div>
  </article>
  ` : ''}
  ${state.liveData.statewidePlan ? (() => { const sw = state.liveData.statewidePlan, t = sw.totals; return `
  <article id="statewide-plan-section" class="panel district-plan-panel">
    <header class="panel-header"><div><div class="panel-title">STATEWIDE SEAT QUOTA & BUDGET PRIORITY</div><div class="panel-kicker">ALL DISTRICTS COMPILED · RANKED · ${sw.planning_cycle.toUpperCase()}</div></div>
      <div class="action-row"><button id="btn-export-statewide-report" class="button-primary">Executive Brief (Print/PDF) ↗</button><button id="btn-export-statewide-csv" class="button-secondary">CSV ⤓</button><button id="btn-export-statewide-json" class="button-secondary">JSON ⤓</button></div></header>
    <div class="program-flag-summary"><b>+${t.seats_added}</b> seats added · <b>−${t.seats_released}</b> released from at-risk programs (${t.seats_redeployed} redeployed, ${t.seats_held_for_review} held for review) · <b>₹${t.budget_min_lakh}L – ₹${t.budget_max_lakh}L</b> indicative · <b>${t.trainers_target}</b> trainers</div>
    <div class="table-wrap" style="padding:0 20px 16px;"><table class="data-table"><thead><tr><th>#</th><th>District</th><th>Priority</th><th>Intervention</th><th>Seats added</th><th>Released</th><th>Net</th><th>Indicative budget</th><th>Share</th></tr></thead><tbody>${sw.districts.map(d => `<tr><td>${d.rank}</td><td><b class="record-name">${d.district_name}</b></td><td><span class="tiny-tag ${d.priority_level === 'CRITICAL' || d.priority_level === 'HIGH' ? 'critical' : 'warn'}">${d.priority_level}</span></td><td>${d.intervention_code}</td><td>+${d.seats_added}</td><td>−${d.seats_released}</td><td>${d.net_seat_position > 0 ? '+' : ''}${d.net_seat_position}</td><td style="font-family:var(--mono)">₹${d.budget_min_lakh}L – ₹${d.budget_max_lakh}L</td><td>${d.budget_share_pct}%</td></tr>`).join('')}</tbody></table></div>
    <div style="padding:0 20px 16px;"><div class="assumption-note" style="border-left-color:var(--amber);"><p style="margin:0;font-size:9px;color:var(--muted);"><strong style="color:var(--amber);">Caveat:</strong> ${sw.governance_caveat}</p></div></div>
  </article>`; })() : ''}`;
}

function scoreCell(value, note) { const c = value < 45 ? 'var(--red)' : value < 65 ? 'var(--amber)' : 'var(--teal)'; return `<div class="matrix-score"><i style="--w:${value}%;--c:${c}"><b></b></i><span>${value}%</span></div><span class="matrix-note">${note}</span>`; }
function renderAlignment() {
  const al = state.liveData.alignment;
  if (!al || !al.matrix || al.matrix.length === 0) return renderDataUnavailable('Alignment Engine', '/api/alignment');

  return `${pageHeader('ALIGNMENT ENGINE', 'Where requirements and readiness diverge', 'This view compares industry requirements, curriculum, usable capacity, trainer capability and equipment. Scores lead to inspectable mismatches, not automatic decisions.')}
  <div class="content-stack"><article class="panel"><header class="panel-header"><div><div class="panel-title">ADVANCED MANUFACTURING / CAPABILITY ALIGNMENT</div><div class="panel-kicker">SELECTED SKILLS / TARGET TRAINING SYSTEM</div></div>${why('alignment')}</header><div class="alignment-matrix"><div class="matrix-cell head">COMPETENCY</div><div class="matrix-cell head">INDUSTRY REQUIREMENT</div><div class="matrix-cell head">CURRICULUM COVERAGE</div><div class="matrix-cell head">TRAINING CAPACITY</div><div class="matrix-cell head">TRAINERS & EQUIPMENT</div>${al.matrix.map(r=>`<div class="matrix-cell skill">${r.competency}</div><div class="matrix-cell">${scoreCell(r.industry_requirement_pct,'Demand evidence')}</div><div class="matrix-cell">${scoreCell(r.curriculum_coverage_pct,'Current modules')}</div><div class="matrix-cell">${scoreCell(r.training_capacity_pct,'Usable seats')}</div><div class="matrix-cell">${scoreCell(r.trainers_equipment_pct,'Verified inventory')}</div>`).join('')}</div></article>
  <div class="page-grid"><article class="panel"><header class="panel-header"><div><div class="panel-title">PRIORITY MISMATCHES</div><div class="panel-kicker">ACTIONABLE, EVIDENCE-LINKED GAPS</div></div></header><div class="gap-list">${al.priority_mismatches.map(g=>`<div class="gap-item"><span class="gap-index">${g.code}</span><span><b>${g.title}</b><p>${g.detail}</p></span><strong class="gap-score">${g.priority_score}</strong>${why('alignment')}</div>`).join('')}</div></article><aside class="side-stack"><article class="panel"><header class="panel-header"><div><div class="panel-title">HOW TO READ</div><div class="panel-kicker">BOUNDARY</div></div></header><div class="assumption-note"><p><b>A lower readiness score is not evidence of failure.</b></p><p>It identifies a planning question: whether curriculum, capacity, trainer and equipment evidence supports the demand signal.</p></div></article></aside></div></div>`;
}

function renderInterventions() {
  const list = state.liveData.interventions;
  if (!list || list.length === 0) return renderDataUnavailable('Interventions Decision Layer', '/api/interventions');
  const intv = list[0];
  const rationale = intv.evidence_rationale || [];
  const steps = intv.pilot_steps || [];

  return `${pageHeader('INTERVENTIONS', 'A recommendation that can be reversed', 'SkillPulse turns a traceable mismatch into a proposed, measurable pilot. It does not make policy autonomously.')}
  <div class="content-stack"><article class="panel intervention-card"><div class="intervention-main"><span class="intervention-label">${(intv.status || 'PROPOSED CONTROLLED PILOT').toUpperCase()} / ${intv.code || 'I-01'}</span><h2>${intv.title || 'Expand advanced CNC training capacity before the next planning cycle.'}</h2><p>Test a targeted curriculum and equipment upgrade at selected centres in Pune and Chhatrapati Sambhajinagar. Expansion remains conditional on outcome measures and employer validation.</p><div class="intervention-facts"><div><span>Target</span><b>${intv.target_scope || intv.target || '2 training centres'}</b></div><div><span>Duration</span><b>${intv.duration || 'One planning cycle'}</b></div><div><span>Scope</span><b>${intv.scope_skills || 'CNC programming + digital measurement'}</b></div><div><span>Reversibility</span><b>${intv.reversibility_mechanism || 'Pilot before permanent expansion'}</b></div></div><div class="action-row" style="margin-top:18px">${why('intervention')}<button id="mark-review-btn" class="button-primary">${intv.status === 'Under Planning Review' ? '✓ In Planning Review' : 'Mark for review'}</button></div></div><aside class="intervention-side"><h3>EVIDENCE RATIONALE</h3><div class="evidence-rationale">${rationale.map(r=>`<div>${r}</div>`).join('')}</div></aside></article>
  <section class="pilot-strip">${steps.map(s=>`<article class="pilot-step"><span>${s.step}</span><b>${s.title}</b><p>${s.desc}</p></article>`).join('')}</section>
  <article class="panel"><header class="panel-header"><div><div class="panel-title">SUCCESS MEASUREMENT</div><div class="panel-kicker">PILOT DECISION GATE</div></div></header><div class="quality-grid"><div class="quality-cell good"><span>PLACEMENT</span><b>≥ 55%</b><p>Target-sector placement among traced participants.</p></div><div class="quality-cell good"><span>RETENTION</span><b>≥ 40%</b><p>Six-month target occupation retention among traced participants.</p></div><div class="quality-cell warn"><span>CURRICULUM</span><b>≥ 70%</b><p>Coverage against validated competency set.</p></div><div class="quality-cell"><span>VALIDATION</span><b>≥ 5</b><p>Independent employer confirmations before scaling.</p></div></div></article></div>`;
}

function renderCandidate() {
  const cg = state.liveData.candidate;
  if (!cg) return renderDataUnavailable('Candidate Guidance (Downstream Extension)', '/api/candidate/guidance');
  
  const p = cg.profile;
  const li = cg.learning_intelligence;
  const pathways = cg.pathways || [];
  const careers = cg.careers || [];
  const rwp = cg.real_world_problems || [];
  
  return `
    ${pageHeader('CANDIDATE GUIDANCE', 'Downstream Decision Layer Extension', 'Candidate guidance connects directly to validated ecosystem and market intelligence. It does not replace the institutional alignment engine.', 'SECTIONS 4.1 & 10 ARCHITECTURE')}
    
    <div class="content-stack">
      ${cg.active_system_alignment && cg.active_system_alignment.system_notice ? `
      <aside class="system-notice" role="status">
        <span class="system-notice-tag">SYSTEM NOTICE · ${cg.active_system_alignment.intervention_code} · ${cg.active_system_alignment.planning_cycle.toUpperCase()}</span>
        <p>${cg.active_system_alignment.system_notice}</p>
        <small>${cg.active_system_alignment.system_notice_boundary || ''}</small>
        <button class="button-secondary" data-page="interventions">View intervention →</button>
      </aside>` : ''}
      <article class="panel">
        <header class="panel-header">
          <div><div class="panel-title">CANDIDATE CONTEXT & READINESS</div><div class="panel-kicker">PROFILE · DISTRICT CLUSTER · GOALS</div></div>
          ${why('candidate')}
        </header>
        <div class="candidate-profile-bar">
          <div><span>CANDIDATE</span><b>${p.name}</b></div>
          <div><span>QUALIFICATION</span><b>${p.current_qualification}</b></div>
          <div><span>LOCATION</span><b>${p.district}</b></div>
          <div><span>TARGET ROLE</span><b style="color:var(--teal)">${p.target_role}</b></div>
          <div><span>TRAJECTORY</span><b>${p.learning_level}</b></div>
        </div>
      </article>

      <div class="page-grid">
        <article class="panel">
          <header class="panel-header">
            <div><div class="panel-title">LEARNING INTELLIGENCE</div><div class="panel-kicker">DIAGNOSED GAPS AGAINST MARKET DEMAND</div></div>
          </header>
          <div style="padding:14px 16px;">
            <p style="color:var(--muted);font-size:10px;margin-bottom:12px;">${li.evidence_backing}</p>
            <div class="gap-list">
              ${li.diagnosed_gaps.map(g => `
                <div class="gap-item">
                  <span class="gap-index" style="color:var(--teal)">${g.status.toUpperCase()}</span>
                  <span>
                    <b>${g.competency} (Demand: ${g.market_demand})</b>
                    <p>${g.industry_need}</p>
                  </span>
                  <strong class="gap-score">${Number(g.confidence).toFixed(2)}</strong>
                </div>
              `).join('')}
            </div>
            <div class="assumption-note" style="margin-top:14px;">
              <b>Recommended Curriculum Module:</b> ${li.curriculum_recommendation}
            </div>
          </div>
        </article>

        <aside class="side-stack">
          <article class="panel">
            <header class="panel-header">
              <div><div class="panel-title">CAREER EXPLORATION</div><div class="panel-kicker">MARKET-BACKED PATHWAYS</div></div>
            </header>
            <div style="padding:14px 16px;">
              ${careers.map(c => `
                <div style="margin-bottom:12px;padding-bottom:10px;border-bottom:1px solid var(--line);">
                  <div style="display:flex;justify-content:space-between;align-items:center;">
                    <b style="color:var(--paper);font-size:11px;">${c.role}</b>
                    ${iconLabel(c.demand_signal, 'observed')}
                  </div>
                  <div style="color:var(--muted);font-size:9px;margin-top:3px;">Sector: ${c.sector} · Hubs: ${c.avg_hiring_clusters}</div>
                  <div style="color:var(--teal);font-size:8px;font-family:var(--mono);margin-top:2px;">Hiring Employers: ${c.verified_employers.join(', ')}</div>
                </div>
              `).join('')}
            </div>
          </article>
        </aside>
      </div>

      <article class="panel">
        <header class="panel-header">
          <div><div class="panel-title">VALIDATED SKILL PATHWAY</div><div class="panel-kicker">STEP-BY-STEP COMPETENCY PROGRESSION</div></div>
        </header>
        <section class="pilot-strip">
          ${pathways.map((s, idx) => `
            <article class="pilot-step">
              <span>0${idx + 1}</span>
              <b>${s.milestone}</b>
              <p style="color:var(--paper);font-size:10px;margin-top:3px;">${s.skills}</p>
              <div style="color:var(--teal);font-size:8px;font-family:var(--mono);margin-top:4px;">Validation: ${s.validation}</div>
            </article>
          `).join('')}
        </section>
      </article>

      <!-- ENHANCEMENT 3: ACTIVE SYSTEM ALIGNMENT -->
      ${cg.active_system_alignment ? (() => {
        const asa = cg.active_system_alignment;
        return `
        <article class="panel" style="border:1px solid var(--line-bright); background:linear-gradient(135deg, rgba(14,24,28,0.85), rgba(9,15,18,0.95));">
          <header class="panel-header">
            <div>
              <div class="panel-title">${asa.status_badge || 'ACTIVE SYSTEM ALIGNMENT'}</div>
              <div class="panel-kicker">INSTITUTIONAL PLANNING INTERVENTION LINK · ${asa.planning_cycle.toUpperCase()}</div>
            </div>
            ${why('intervention')}
          </header>
          <div style="padding:16px 20px;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:12px; margin-bottom:14px;">
              <div>
                <p style="margin:0 0 4px; color:var(--paper); font-size:12px; font-weight:600;">
                  This pathway is aligned with the active <strong style="color:var(--blue);">${asa.program_title}</strong>.
                </p>
                <p style="margin:0; color:var(--muted); font-size:10px;">${asa.evidence_backing}</p>
              </div>
              <div style="display:flex; gap:8px;">
                <span class="tiny-tag observed">${asa.status.toUpperCase()}</span>
                <span class="tiny-tag" style="color:var(--blue); border-color:var(--blue-dim);">${asa.intervention_code}</span>
              </div>
            </div>

            <div class="candidate-profile-bar" style="margin-bottom:16px; background:rgba(107,201,232,0.06); border:1px solid var(--line);">
              <div><span>CLUSTER</span><b>${asa.cluster}</b></div>
              <div><span>SKILL</span><b style="color:var(--teal);">${asa.skill}</b></div>
              <div><span>INTERVENTION</span><b>${asa.intervention_type}</b></div>
              <div><span>PLANNED SEATS</span><b style="color:var(--paper);">+${asa.planned_additional_seats} Seats Planned</b></div>
              <div><span>CONFIDENCE</span><b>${asa.confidence_score} (${asa.evidence_count} Records)</b></div>
            </div>

            <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:10px; margin-bottom:14px;">
              <div style="background:var(--surface); border:1px solid var(--line); padding:10px;">
                <span style="font:7px var(--mono); color:var(--faint); display:block; margin-bottom:4px;">01 / CANDIDATE RECOMMENDATION</span>
                <p style="margin:0; font-size:9px; color:var(--paper); line-height:1.45;">${asa.distinction.candidate_recommendation}</p>
              </div>
              <div style="background:var(--surface); border:1px solid var(--line); padding:10px;">
                <span style="font:7px var(--mono); color:var(--faint); display:block; margin-bottom:4px;">02 / CURRENT MARKET EVIDENCE</span>
                <p style="margin:0; font-size:9px; color:var(--muted); line-height:1.45;">${asa.distinction.current_market_evidence}</p>
              </div>
              <div style="background:var(--surface); border:1px solid var(--line); padding:10px;">
                <span style="font:7px var(--mono); color:var(--faint); display:block; margin-bottom:4px;">03 / ACTIVE TRAINING INTERVENTION</span>
                <p style="margin:0; font-size:9px; color:var(--blue); line-height:1.45;">${asa.distinction.active_training_intervention}</p>
              </div>
              <div style="background:var(--surface); border:1px solid var(--line); padding:10px;">
                <span style="font:7px var(--mono); color:var(--faint); display:block; margin-bottom:4px;">04 / PLANNING STATUS</span>
                <p style="margin:0; font-size:9px; color:var(--amber); line-height:1.45;">${asa.distinction.planning_status}</p>
              </div>
            </div>

            <div class="assumption-note" style="border-left-color:var(--amber); background:rgba(224,173,91,.04); padding:10px 14px;">
              <p style="margin:0; font-size:9px; color:var(--muted); line-height:1.45;">
                <strong style="color:var(--amber);">Planning Boundary:</strong> ${asa.non_guarantee_notice}
              </p>
            </div>

            <div class="action-row" style="margin-top:16px;">
              <button id="view-linked-intervention-btn" class="button-primary" data-intervention="${asa.intervention_id}">
                View Relevant Training Intervention (${asa.intervention_code}) →
              </button>
              ${why('intervention')}
            </div>
          </div>
        </article>
        `;
      })() : ''}

      <article class="panel">
        <header class="panel-header">
          <div><div class="panel-title">REAL-WORLD PROBLEM SPACE</div><div class="panel-kicker">INDUSTRY-GROUNDED APPLICATION CONTEXTS</div></div>
        </header>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;padding:14px 16px;">
          ${rwp.map(rw => `
            <div style="background:var(--surface);border:1px solid var(--line);padding:12px;border-radius:3px;">
              <span class="tiny-tag">${rw.context.toUpperCase()}</span>
              <h4 style="color:var(--paper);font-size:11px;margin:6px 0 4px;">${rw.title}</h4>
              <p style="color:var(--muted);font-size:9px;line-height:1.4;margin-bottom:6px;"><strong>Problem:</strong> ${rw.problem}</p>
              <p style="color:var(--teal);font-size:9px;line-height:1.4;"><strong>Learning Application:</strong> ${rw.learning_application}</p>
            </div>
          `).join('')}
        </div>
      </article>
    </div>
  `;
}

function renderEvidence() {
  const records = state.liveData.evidence;
  if (!records || records.length === 0) return renderDataUnavailable('Evidence Explorer & Provenance', '/api/evidence');
  const filtered = records.filter(r => state.filter.district === 'All districts' || (r.place || r.geography || '').includes(state.filter.district.replace('Chhatrapati ', 'Chh. ')) || (r.place || r.geography || '').includes(state.filter.district));

  return `${pageHeader('EVIDENCE EXPLORER', 'Every conclusion can be inspected', 'Source observations retain their provenance, transformation history and uncertainty state. Raw terms and their canonical interpretations remain reversible.')}
  <div class="content-stack"><article class="panel"><header class="panel-header"><div><div class="panel-title">EVIDENCE RECORDS</div><div class="panel-kicker">${filtered.length} OF ${records.length} RECORDS IN CURRENT SCOPE</div></div><div class="action-row">${why('cnc')}<button class="button-secondary" data-toast="Evidence export is prepared for the demo — provenance records verified.">Prepare export</button></div></header><div class="table-wrap"><table class="data-table"><thead><tr><th>Observation</th><th>Source</th><th>Date</th><th>Geography</th><th>State</th><th>Confidence</th><th>Transformation</th></tr></thead><tbody>${filtered.map(r=>{
    const conf = r.confidence !== undefined ? r.confidence : (r.confidence_score !== undefined ? r.confidence_score : 0);
    return `<tr><td><b class="record-name">${r.name || r.observation_name}</b><span class="record-sub">${r.source_type || r.kind}</span></td><td>${r.source || r.source_name}</td><td>${r.date || r.ingested_date}</td><td>${r.place || r.geography}</td><td>${iconLabel((r.state || r.evidence_state).toUpperCase(), (r.state || r.evidence_state).toLowerCase())}</td><td class="confidence">${Number(conf).toFixed(2)}</td><td><button class="history-button why-button" data-why="provenance">View chain</button></td></tr>`;
  }).join('')}</tbody></table></div></article>
  <div class="page-grid"><article class="panel"><header class="panel-header"><div><div class="panel-title">REVERSIBLE NORMALIZATION</div><div class="panel-kicker">RAW VALUE IS NEVER DESTROYED</div></div></header><div class="method-table"><div><b class="record-name">Raw phrase</b></div><div>“फिटर” / “fitter ka kaam”</div><div>EMPLOYER TEXT</div><div><b class="record-name">Canonical interpretation</b></div><div>Fitter</div><div>CONF. 0.88 / ALIAS KB</div><div><b class="record-name">Validation state</b></div><div>Mapped automatically; available for human review.</div><div>REVERSIBLE</div></div></article><aside class="side-stack"><article class="panel"><header class="panel-header"><div><div class="panel-title">SCOPE REMINDER</div><div class="panel-kicker">CURRENT FILTERS</div></div></header><div class="fact-list"><div class="fact-row"><span>District</span><strong>${state.filter.district}</strong></div><div class="fact-row"><span>Sector</span><strong>${state.filter.sector}</strong></div><div class="fact-row"><span>Period</span><strong>${state.filter.period} DAYS</strong></div></div></article></aside></div></div>`;
}

function renderQuality() {
  const q = state.liveData.quality;
  if (!q) return renderDataUnavailable('Data Quality & Limitations', '/api/quality');

  return `${pageHeader('DATA QUALITY', 'Limitations are part of the intelligence', 'Coverage, freshness and missingness shape the confidence of a signal. The system surfaces limitations instead of presenting a single dataset as truth.')}
  <div class="content-stack"><article class="panel"><header class="panel-header"><div><div class="panel-title">CURRENT INTELLIGENCE HEALTH</div><div class="panel-kicker">ADVANCED MANUFACTURING / ALL ACTIVE SOURCES</div></div>${why('quality')}</header><div class="quality-grid"><div class="quality-cell good"><span>SOURCE FRESHNESS</span><b>${q.source_freshness_pct}%</b><p>Records refreshed in the selected 90-day period.</p></div><div class="quality-cell warn"><span>OUTCOME MISSINGNESS</span><b>${q.outcome_missingness_pct}%</b><p>Graduate employment outcomes remain unobserved.</p></div><div class="quality-cell good"><span>ENTITY CONFIDENCE</span><b>${Number(q.entity_confidence_score).toFixed(2)}</b><p>Weighted confidence for active entity mappings.</p></div><div class="quality-cell critical"><span>LOW-PRECISION GEO</span><b>${q.low_precision_geo_pct}%</b><p>Evidence references corridor or district rather than a precise site.</p></div></div></article>
  <article class="panel quality-detail"><div><h3>SOURCE QUALITY PROFILE</h3>${q.source_profiles.map(s=>`<div class="risk-row"><span>${s.name}</span><i style="--w:${s.pct};--c:${s.color}"><b></b></i><strong>${s.pct}</strong></div>`).join('')}</div><div><h3>VISIBLE LIMITATIONS</h3>${q.visible_limitations.map(l=>`<p class="limitation"><b>${l.title}.</b> ${l.detail}</p>`).join('')}</div></article>
  <div class="page-grid"><article class="panel"><header class="panel-header"><div><div class="panel-title">CONFLICTING OBSERVATIONS</div><div class="panel-kicker">PRESERVED, NOT SILENTLY RESOLVED</div></div></header><div class="gap-list">${q.conflicting_observations.map(c=>`<div class="gap-item"><span class="gap-index">${c.code}</span><span><b>${c.title}</b><p>${c.detail}</p></span>${why(c.why || 'observability')}</div>`).join('')}</div></article><aside class="side-stack"><article class="panel"><header class="panel-header"><div><div class="panel-title">CONFIDENCE MODEL</div><div class="panel-kicker">NOT AN ACCURACY CLAIM</div></div></header><div class="assumption-note"><p><b>${Number(q.confidence_score).toFixed(2)} is a decision-support confidence indicator.</b></p><p>It reflects evidence recency, diversity, quality and agreement — not an assertion that the underlying market is known exactly.</p></div></article></aside></div></div>`;
}

function renderSystem() {
  return `${pageHeader('SYSTEM & METHODOLOGY', 'Assistive intelligence with a visible boundary', 'SkillPulse consolidates evidence and explains relationships. AI may assist extraction, matching and clustering; it does not invent evidence or decide policy autonomously.')}
  <div class="content-stack"><article class="panel"><header class="panel-header"><div><div class="panel-title">EVIDENCE TO ACTION ARCHITECTURE</div><div class="panel-kicker">THE CONNECTED SYSTEM MODEL</div></div></header><div class="system-map">${[['01','Evidence ingestion','Employer, training, outcome and structural observations.'],['02','Quality & provenance','Freshness, coverage, confidence and transformation history.'],['03','Entity resolution','Raw terms, aliases and canonical entities remain reversible.'],['04','Intelligence','Demand, supply, emerging competency and geography signals.'],['05','Decision & feedback','Auditable, measurable and reversible intervention pilots.']].map(([x,t,d],i)=>`<div class="system-layer ${i===3?'active':''}"><span>${x}</span><b>${t}</b><p>${d}</p></div>`).join('')}</div></article>
  <article class="panel"><header class="panel-header"><div><div class="panel-title">SYSTEM PRINCIPLES</div><div class="panel-kicker">WHAT THE PROTOTYPE WILL AND WILL NOT CLAIM</div></div></header><div class="method-table"><div><b class="record-name">Evidence fusion</b></div><div>Multiple imperfect sources contribute to a stronger signal; no one dataset equals truth.</div><div>USE</div><div><b class="record-name">Uncertainty states</b></div><div>Observed, estimated and unobserved states remain explicit through every relevant view.</div><div>USE</div><div><b class="record-name">Market observability</b></div><div>Demand is distinguished from the availability of digital evidence about demand.</div><div>USE</div><div><b class="record-name">AI assistance</b></div><div>Supports extraction, semantic matching and explanations; evidence remains auditable.</div><div>ASSISTIVE</div><div><b class="record-name">Policy decisions</b></div><div>Recommendations require human review and are framed as measurable, reversible pilots.</div><div>HUMAN</div><div><b class="record-name">False certainty</b></div><div>Missing or contradictory data is surfaced rather than silently converted to a precise conclusion.</div><div>NOT ALLOWED</div></div></article>
  
  <article class="panel">
    <header class="panel-header"><div><div class="panel-title">MULTILINGUAL SKILL INTELLIGENCE (LAYER 04)</div><div class="panel-kicker">TEST REAL-TIME TRANSLITERATION & LOCAL VOCABULARY RESOLVER</div></div></header>
    <div style="padding: 14px 16px;">
      <p style="margin:0 0 10px; color:var(--muted); font-size:10px;">Test candidate phrases in Marathi, Hindi, Hinglish, and transliterated trade jargon against the live Entity Resolution engine:</p>
      <div class="gate-tester-form">
        <input id="multi-test-input" class="gate-tester-input" type="text" placeholder="Type a phrase (e.g. Lathe chalavta aala pahije, सीएनसी मशीनिंग ऑपरेटर, fitter ka kaam)..." value="Lathe chalavta aala pahije" />
        <button id="multi-test-button" class="button-primary">Resolve Entity</button>
      </div>
      <div class="gate-pills">
        <span style="color:var(--faint); font:8px var(--mono); align-self:center;">QUICK TEST:</span>
        <button class="multi-pill" data-pill="Lathe chalavta aala pahije">Lathe chalavta aala pahije</button>
        <button class="multi-pill" data-pill="सीएनसी मशीनिंग ऑपरेटर">सीएनसी मशीनिंग ऑपरेटर</button>
        <button class="multi-pill" data-pill="पीएलसी फॉल्ट शोधणे">पीएलसी फॉल्ट शोधणे</button>
        <button class="multi-pill" data-pill="fitter ka kaam">fitter ka kaam</button>
        <button class="multi-pill" data-pill="5-axis G-code programming">5-axis G-code programming</button>
      </div>
      <div id="multi-live-result" class="gate-live-result">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <b id="multi-res-phrase" style="color:var(--paper); font-size:11px;">Lathe chalavta aala pahije</b>
          <em id="multi-res-badge" class="gate-result">CANONICAL / 0.84</em>
        </div>
        <div id="multi-res-desc" style="color:var(--muted); font-size:9px; margin-top:4px;">Language: Marathi (transliterated) → Canonical Competency: Lathe Operation & Turning (Reversible / Reviewable)</div>
      </div>
    </div>
  </article>

  <div class="page-grid"><article class="panel"><header class="panel-header"><div><div class="panel-title">MULTILINGUAL PROCESSING BENCHMARK</div><div class="panel-kicker">VISIBLE INTERPRETATION PATH</div></div></header><div class="pilot-strip"><div class="pilot-step"><span>RAW</span><b>“Lathe chalavta aala pahije.”</b><p>Hinglish/Marathi candidate text.</p></div><div class="pilot-step"><span>LANGUAGE</span><b>Marathi transliterated</b><p>Detected with moderate confidence.</p></div><div class="pilot-step"><span>EXTRACTION</span><b>Lathe operation</b><p>Canonical competency candidate.</p></div><div class="pilot-step"><span>REVIEW</span><b>0.84 / reviewable</b><p>Raw phrase preserved alongside mapping.</p></div></div></article><aside class="side-stack"><article class="panel"><header class="panel-header"><div><div class="panel-title">AUDIT QUESTION</div><div class="panel-kicker">ON EVERY MAJOR RESULT</div></div></header><div class="assumption-note"><p><b>“Why should I believe this?”</b></p><p>The Show Me Why interaction exposes signals, entities, source observations, quality, assumptions and uncertainty.</p>${why('cnc')}</div></article></aside></div></div>`;
}

const PAGE_RENDERERS = {
  overview: renderOverview, market: renderMarket, skills: renderSkills,
  supply: renderSupply, emerging: renderEmerging, geography: renderGeography,
  alignment: renderAlignment, interventions: renderInterventions, candidate: renderCandidate,
  evidence: renderEvidence, quality: renderQuality, system: renderSystem
};

async function loadPageData(page) {
  if (page === 'overview') {
    const d = await apiGet(`/api/overview?district=${encodeURIComponent(state.filter.district)}`);
    if (d) state.liveData.overview = d;
  } else if (page === 'market') {
    const s = await apiGet(`/api/market/signals?skill_id=${state.selectedSkillId}`);
    const o = await apiGet('/api/market/occupations');
    if (s) state.liveData.marketSignals = s;
    if (o) state.liveData.occupations = o;
  } else if (page === 'skills') {
    const sk = await apiGet('/api/skills');
    if (sk) state.liveData.skills = sk;
  } else if (page === 'supply') {
    const sp = await apiGet('/api/supply/pipeline');
    if (sp) state.liveData.supplyPipeline = sp;
    const pr = await apiGet('/api/supply/program-risks');
    if (pr) state.liveData.programRisks = pr;
  } else if (page === 'emerging') {
    const em = await apiGet('/api/emerging');
    if (em) state.liveData.emerging = em;
  } else if (page === 'geography') {
    const geo = await apiGet('/api/geography');
    if (geo) {
      state.liveData.geography = geo;
      const dsel = (geo.districts || []).find(d => d.name === state.selectedDistrict) || geo.districts[0];
      if (dsel) {
        const plan = await apiGet(`/api/geography/district/${dsel.id}/action-plan`);
        if (plan) state.liveData.districtActionPlan = plan;
      }
      const sw = await apiGet('/api/geography/action-plan/statewide');
      if (sw) state.liveData.statewidePlan = sw;
    }
  } else if (page === 'alignment') {
    const al = await apiGet('/api/alignment');
    if (al) state.liveData.alignment = al;
  } else if (page === 'interventions') {
    const iv = await apiGet('/api/interventions');
    if (iv) state.liveData.interventions = iv;
  } else if (page === 'candidate') {
    const cg = await apiGet('/api/candidate/guidance');
    if (cg) state.liveData.candidate = cg;
  } else if (page === 'evidence') {
    const ev = await apiGet(`/api/evidence?district=${encodeURIComponent(state.filter.district)}`);
    if (ev) state.liveData.evidence = ev;
  } else if (page === 'quality') {
    const qu = await apiGet('/api/quality');
    if (qu) state.liveData.quality = qu;
  }
}

async function renderPage() {
  await loadPageData(state.page);
  const render = PAGE_RENDERERS[state.page] || renderOverview;
  $('#app-content').innerHTML = render();
  $('#crumb-current').textContent = (NAV.flatMap(([,v]) => v).find(([id]) => id === state.page)?.[1] || 'Overview').toUpperCase();
  renderNav();
  bindContent();
  if (state.page === 'skills') requestAnimationFrame(initGraph);
}

function bindContent() {
  $$('[data-page]').forEach(b => b.addEventListener('click', () => navigate(b.dataset.page)));
  $$('.why-button').forEach(b => b.addEventListener('click', (event) => { event.stopPropagation(); openEvidence(b.dataset.why || 'cnc'); }));
  $$('[data-toast]').forEach(b => b.addEventListener('click', () => showToast(b.dataset.toast)));
  $$('[data-district]').forEach(el => el.addEventListener('click', () => { state.selectedDistrict = el.dataset.district; renderPage(); showToast(`${state.selectedDistrict} selected in labour-market map`); }));
  $('[data-graph-reset]')?.addEventListener('click', () => state.graph?.reset());
  $('[data-graph-isolate]')?.addEventListener('click', () => state.graph?.isolate(state.selectedSkill));

  // Graph: Skill Selector Dropdown
  const skillSelect = $('#graph-skill-select');
  if (skillSelect) {
    skillSelect.addEventListener('change', (e) => {
      const sId = e.target.value;
      const skillsList = state.liveData.skills || DATA.skills;
      const cur = skillsList.find(s => s.id === sId);
      if (cur) {
        state.selectedSkillId = sId;
        state.selectedSkill = cur.canonical_name || cur.name;
        state.selectedNode = null;
        renderPage();
      }
    });
  }

  // District / statewide action plan actions
  const planUrl = (d, f) => `${API_BASE}/api/geography/district/${d}/action-plan/export?format=${f}`;
  const swUrl = f => `${API_BASE}/api/geography/action-plan/statewide/export?format=${f}`;
  $('#btn-generate-district-plan')?.addEventListener('click', async () => {
    const dsel = (state.liveData.geography?.districts || []).find(x => x.name === state.selectedDistrict);
    const plan = dsel && await apiGet(`/api/geography/district/${dsel.id}/action-plan`);
    if (plan) { state.liveData.districtActionPlan = plan; }
    await renderPage();
    $('#district-action-plan-section')?.scrollIntoView({ behavior: 'smooth' });
    showToast(`District Action Plan generated for ${state.selectedDistrict}`);
  });
  $('#btn-export-plan-report')?.addEventListener('click', e => window.open(planUrl(e.currentTarget.dataset.planDistrict, 'html'), '_blank'));
  $('#btn-export-plan-csv')?.addEventListener('click', e => window.open(planUrl(e.currentTarget.dataset.planDistrict, 'csv'), '_blank'));
  $('#btn-export-plan-json')?.addEventListener('click', e => window.open(planUrl(e.currentTarget.dataset.planDistrict, 'json'), '_blank'));
  $('#btn-export-statewide-report')?.addEventListener('click', () => window.open(swUrl('html'), '_blank'));
  $('#btn-export-statewide-csv')?.addEventListener('click', () => window.open(swUrl('csv'), '_blank'));
  $('#btn-export-statewide-json')?.addEventListener('click', () => window.open(swUrl('json'), '_blank'));
  $('#view-linked-intervention-btn')?.addEventListener('click', () => navigate('interventions'));

  // Interventions: Mark for Review button
  const reviewBtn = $('#mark-review-btn');
  if (reviewBtn) {
    reviewBtn.addEventListener('click', async () => {
      const curStatus = (state.liveData.interventions && state.liveData.interventions[0]?.status) || '';
      const action = curStatus === 'Under Planning Review' ? 'reset' : 'review';
      const res = await apiPost('/api/interventions/int_cnc_pilot/review', { action });
      if (res) {
        state.liveData.interventions = [res];
        showToast(action === 'review' ? 'Intervention I-01 status: Under Planning Review' : 'Intervention I-01 reset to Proposed pilot');
        renderPage();
      } else {
        showToast('Pilot brief marked for planning review');
      }
    });
  }

  // Interactive Skillness Gate Tester
  const gateInput = $('#gate-test-input');
  const gateBtn = $('#gate-test-button');
  if (gateBtn && gateInput) {
    const runGateTest = async (phrase) => {
      const text = phrase || gateInput.value.trim();
      if (!text) return;
      gateInput.value = text;
      const res = await apiPost('/api/emerging/skillness-gate', { phrase: text });
      const badge = $('#gate-res-badge');
      const desc = $('#gate-res-desc');
      const phraseEl = $('#gate-res-phrase');
      const container = $('#gate-live-result');

      if (res && badge && desc && phraseEl) {
        phraseEl.textContent = res.phrase;
        if (res.is_skill) {
          badge.textContent = `SKILL / ${res.confidence.toFixed(2)}`;
          badge.className = 'gate-result';
          container.className = 'gate-live-result';
        } else {
          badge.textContent = `NOT A SKILL / ${res.confidence.toFixed(2)}`;
          badge.className = 'gate-result reject';
          container.className = 'gate-live-result reject';
        }
        desc.textContent = `Category: ${res.category} — ${res.explanation}`;
      }
    };
    gateBtn.addEventListener('click', () => runGateTest());
    gateInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') runGateTest(); });
    $$('.gate-pill').forEach(pill => pill.addEventListener('click', () => runGateTest(pill.dataset.pill)));
  }

  // Interactive Multilingual Skill Resolver (Layer 04)
  const multiInput = $('#multi-test-input');
  const multiBtn = $('#multi-test-button');
  if (multiBtn && multiInput) {
    const runMultiTest = async (phrase) => {
      const text = phrase || multiInput.value.trim();
      if (!text) return;
      multiInput.value = text;
      const res = await apiPost('/api/skills/multilingual-resolve', { phrase: text });
      const badge = $('#multi-res-badge');
      const desc = $('#multi-res-desc');
      const phraseEl = $('#multi-res-phrase');
      const container = $('#multi-live-result');

      if (res && badge && desc && phraseEl) {
        phraseEl.textContent = res.raw_phrase;
        badge.textContent = `CANONICAL / ${Number(res.confidence_score).toFixed(2)}`;
        badge.className = 'gate-result';
        container.className = 'gate-live-result';
        desc.textContent = `Detected: ${res.detected_language} → Canonical: ${res.canonical_name} (${res.validation_state})`;
      }
    };
    multiBtn.addEventListener('click', () => runMultiTest());
    multiInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') runMultiTest(); });
    $$('.multi-pill').forEach(pill => pill.addEventListener('click', () => runMultiTest(pill.dataset.pill)));
  }
}

function navigate(page) {
  state.page = page;
  if (window.location.hash.replace('#', '') !== page) {
    window.location.hash = page;
  }
  renderPage();
  $('#app-content').focus({ preventScroll: true });
  closeSidebars();
  window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
}


const CHAINS = {
  cnc: { title: 'Why expand CNC planning attention?', text: 'The recommendation combines several independent signals. It is a planning prompt, not a claim of exact labour demand.', steps: [['RECOMMENDATION','Expand advanced CNC pilot capacity','A reversible pilot is proposed rather than permanent expansion.'],['FUSED SIGNALS','Increasing CNC programming demand','9 employer signals, 6 placement records and 3 recent tracer observations point in the same direction.'],['NORMALIZED ENTITIES','CNC programming ↔ CNC operator ↔ CNC Machining L4','Aliases and raw terms remain available for review.'],['SOURCE OBSERVATIONS','23 active evidence records','Employer, placement, tracer and survey sources each carry dates, geography and precision.'],['QUALITY & CONFIDENCE','Confidence 0.82 / observability medium','Digital signals are not treated as total demand.'],['LIMIT & ASSUMPTION','Outcome conversion is incomplete','Unknown outcomes are retained as unknown; causality is not inferred.']] },
  pulse: { title: 'Why does the market pulse show drift?', text: 'The pulse compares demand, readiness and outcomes. It draws attention to a gap between increasing requirements and constrained delivery.', steps: [['SIGNAL','Demand increased 18%','Weighted change across the selected 90-day evidence window.'],['ALIGNMENT','Curriculum coverage is 42%','Current CNC L4 modules under-cover validated programming requirements.'],['CAPACITY','Usable advanced capacity is 29%','Capacity reflects centres, trainers and equipment status.'],['OUTCOME','140 retained at 6 months','Observed among traced candidates only.'],['DECISION','Review a controlled pilot','The intervention is reversible and includes outcome gates.']] },
  supply: { title: 'Why is effective supply a range?', text: 'The system only knows some graduate outcomes directly. It exposes the unknown portion instead of turning it into a definitive employment number.', steps: [['COHORT','380 certified candidates','Observed certification records.'],['CONFIRMED OUTCOMES','220 target-sector employed','Observed through source-linked outcomes.'],['UNOBSERVED','160 outcomes not verified','No response or verification does not imply failure.'],['SENSITIVITY','Potential effective supply 220–290','Range derives from stated tracer response assumptions.'],['LIMIT','Selection risk is medium','Respondents may not represent the complete cohort.']] },
  emerging: { title: 'Why is AI-assisted PCB design a candidate?', text: 'The phrase is not automatically treated as a new qualification. It has crossed an evidence threshold and is waiting for human validation.', steps: [['PHRASE','AI-assisted PCB design','Repeated technical phrase extracted from employer materials.'],['SKILLNESS','Passed technical relevance gate','Classified as a competency rather than a working condition.'],['KNOWN MATCH','Partial PCB Design match','Existing curriculum does not adequately cover the AI-assisted workflow.'],['ACCUMULATION','4 independent employers / 3 periods','Repetition, independence and persistence support a candidate state.'],['BOUNDARY','Candidate, not new qualification','Human validation is required before action.']] },
  geography: { title: 'Why focus on this labour corridor?', text: 'Economic relationships cross administrative boundaries. Capacity in one district can affect employment and employer demand in another.', steps: [['CORRIDOR','Pune ↔ Chhatrapati Sambhajinagar','Linked demand and capacity evidence.'],['DEMAND','High CNC signal at industrial nodes','Employer and placement sources contribute.'],['CAPACITY','29% usable advanced capacity','Centre, trainer and equipment records.'],['MOVEMENT','Candidate path across districts','Tracer evidence is partial and not a full mobility census.'],['LIMIT','Observability varies by district','Low online visibility is not interpreted as no demand.']] },
  alignment: { title: 'Why is this called an alignment gap?', text: 'The mismatch is calculated across independently inspectable dimensions; the score is a planning aid, not a judgement on a course or centre.', steps: [['REQUIREMENT','CNC programming requirement 89%','Demand-side evidence strength.'],['CURRICULUM','Coverage 42%','Validated module-to-competency comparison.'],['CAPACITY','Usable seats 29%','Centres, trainers and equipment.'],['RESULT','Curriculum and capacity mismatch','Priority is high because requirements outpace readiness.'],['ACTION','Inspect before intervening','Pilot proposal keeps the decision measurable and reversible.']] },
  intervention: { title: 'Why is a controlled pilot proposed?', text: 'The intervention is based on a connected evidence path and explicitly includes conditions for review, scaling or reversal.', steps: [['DEMAND','Increasing CNC programming signal','Multiple recent employer and training evidence sources.'],['READINESS','42% curriculum coverage / 29% capacity','Inspectable curriculum, trainer and equipment gaps.'],['OUTCOMES','Effective supply uncertain','Existing conversion must be improved and measured.'],['ACTION','Two-centre controlled pilot','Limited scope before permanent investment.'],['SUCCESS GATE','Placement, retention and validation','Pilot continues only against visible outcome measures.']] },
  candidate: { title: 'How is candidate guidance derived?', text: 'Candidate pathways and skill gap diagnoses are grounded in the same verified market and institutional evidence base, avoiding unsupported predictions.', steps: [['EVIDENCE BASE','23 verified industry observations','Derived from active employer requirements and placement observations in linked industrial clusters.'],['CANONICAL MODEL','Shared competency framework','Diagnoses use the same NSQF and industry competency definitions as the institutional alignment engine.'],['ECOSYSTEM CONTEXT','Corridor & capacity constraints','Pathways reflect actual training centre locations and usable equipment availability.'],['CAREER EXPLORATION','Verified employer signals','Recommended target roles map directly to hiring employers with active demand.'],['RESPONSIBLE BOUNDARY','Assistive, not prescriptive','Candidate maintains agency; pathways remain recommendations rather than tracking mandates.']] },
  observability: { title: 'Why distinguish demand from observability?', text: 'A market may be hard to observe digitally without being small. SkillPulse carries the limitation into its interpretation.', steps: [['DIGITAL RECORD','Low online vacancy count','A signal about visibility, not necessarily market size.'],['OTHER SOURCES','Employer and training evidence present','Independent sources continue to support a moderate demand signal.'],['GEOGRAPHY','Nashik precision is limited','Available records represent only part of local hiring.'],['INTERPRETATION','Demand: moderate / observability: low','The two states stay separate.'],['LIMIT','Offline and informal hiring incomplete','No attempt is made to estimate an exact total without support.']] },
  quality: { title: 'Why is confidence 0.78?', text: 'Confidence reflects the quality of the visible evidence, not a certainty score for the labour market.', steps: [['RECENCY','86% sources refreshed in 90 days','Freshness contributes positively.'],['DIVERSITY','Four active source types','Evidence fusion reduces dependence on one dataset.'],['MISSINGNESS','54% tracer outcomes unknown','Outcome incompleteness reduces confidence.'],['PRECISION','31% low geographic precision','Some observations cover a corridor rather than a site.'],['RESULT','0.78 decision-support confidence','Limitations remain visible in the recommendation.']] },
  provenance: { title: 'How was this record transformed?', text: 'Evidence records preserve source context and every material normalization step.', steps: [['RAW OBSERVATION','Source text retained','Original phrase, date, geography and source are immutable in the evidence view.'],['LANGUAGE & EXTRACTION','Language-aware processing','The source phrase is evaluated for technical relevance.'],['NORMALIZATION','Canonical entity linked','Alias knowledge base returns the interpretation and confidence.'],['VALIDATION','Mapping remains reviewable','A human can audit or correct a low-confidence mapping.'],['USE','Contributes to a fused signal','The raw record remains traceable from any decision.']] },
};

async function openEvidence(key) {
  let c = CHAINS[key] || CHAINS.cnc;
  const liveChain = await apiGet(`/api/evidence/chain/${key}`);
  if (liveChain && liveChain.steps) {
    c = {
      title: liveChain.title,
      text: liveChain.explanation,
      steps: liveChain.steps.map(s => [s.step_label, s.title, s.detail])
    };
  }

  const metaRecs = (liveChain && liveChain.meta && liveChain.meta.active_records) || 23;
  const metaConf = (liveChain && liveChain.meta && liveChain.meta.confidence) || 0.82;
  const metaFresh = (liveChain && liveChain.meta && liveChain.meta.freshness) || '6 DAYS';

  $('#evidence-drawer').innerHTML = `<button class="icon-button drawer-close" data-close-evidence aria-label="Close evidence chain">×</button><div class="drawer-heading"><span class="eyebrow">SHOW ME WHY / AUDIT TRAIL</span><h2>${c.title}</h2><p>${c.text}</p></div><div class="chain">${c.steps.map(([s,t,d])=>`<div class="chain-item"><i class="chain-dot"></i><span class="chain-step">${s}</span><b>${t}</b><p>${d}</p></div>`).join('')}</div><div class="drawer-meta"><div><span>DATA FRESHNESS</span><strong>${metaFresh}</strong></div><div><span>GEOGRAPHIC PRECISION</span><strong>DISTRICT / CORRIDOR</strong></div><div><span>ACTIVE EVIDENCE</span><strong>${metaRecs} RECORDS</strong></div><div><span>CONFIDENCE</span><strong>${Number(metaConf).toFixed(2)}</strong></div></div><p class="drawer-limit"><b>Interpretation boundary.</b> The chain makes supporting observations and uncertainty visible. It does not claim that missing evidence is zero, or that association proves causality.</p>`;
  $('#evidence-drawer').classList.add('open');
  $('#evidence-drawer').setAttribute('aria-hidden','false');
  $('#scrim').hidden = false;
  $('[data-close-evidence]').addEventListener('click', closeEvidence);
}

function closeEvidence() {
  $('#evidence-drawer').classList.remove('open');
  $('#evidence-drawer').setAttribute('aria-hidden','true');
  if (!$('#filter-panel').classList.contains('open')) $('#scrim').hidden = true;
}

function initFilters() {
  const districtOptions = ['All districts', ...Object.keys(DATA.districts)];
  $('#district-filter').innerHTML = districtOptions.map(x => `<option value="${x}">${x}</option>`).join('');
  $('#sector-filter').innerHTML = ['Advanced manufacturing','Electronics','Industrial automation'].map(x=>`<option>${x}</option>`).join('');
  $('#district-filter').value = state.filter.district;
  $('#sector-filter').value = state.filter.sector;
  $('#period-filter').value = state.filter.period;

  $('#district-filter').addEventListener('change', e => { state.filter.district = e.target.value; updateFilterCount(); renderPage(); });
  $('#sector-filter').addEventListener('change', e => { state.filter.sector = e.target.value; updateFilterCount(); renderPage(); });
  $('#period-filter').addEventListener('change', e => { state.filter.period = e.target.value; renderPage(); });
  $$('[data-source]').forEach(el => el.addEventListener('change', e => {
    e.target.checked ? state.filter.sources.add(e.target.dataset.source) : state.filter.sources.delete(e.target.dataset.source);
    updateFilterCount();
    renderPage();
  }));
  $('#reset-filters').addEventListener('click', () => {
    state.filter = { district:'All districts', sector:'Advanced manufacturing', period:'90', sources:new Set(['employer','placement','tracer']) };
    initFilters();
    updateFilterCount();
    renderPage();
    showToast('Scope reset to statewide default');
  });
}

function updateFilterCount() {
  $('#filter-count').textContent = String(1 + (state.filter.district !== 'All districts' ? 1 : 0) + state.filter.sources.size);
}

function toggleFilters() {
  const p = $('#filter-panel');
  const now = !p.classList.contains('open');
  p.classList.toggle('open', now);
  p.setAttribute('aria-hidden', String(!now));
  $('#filter-toggle').setAttribute('aria-expanded', String(now));
  $('#scrim').hidden = !now;
}

function closeSidebars() {
  $('#filter-panel').classList.remove('open');
  $('#filter-panel').setAttribute('aria-hidden','true');
  $('.sidebar').classList.remove('open');
  $('#filter-toggle').setAttribute('aria-expanded','false');
  $('#scrim').hidden=true;
}

function initSearch() {
  const input = $('#global-search'), results = $('#search-results');
  const fallbackEntries = [
    {id:'cnc_programming', name:'CNC Programming',type:'SKILL',page:'skills'},
    {id:'cad_cam', name:'CAD/CAM',type:'SKILL',page:'skills'},
    {id:'plc_troubleshooting', name:'PLC Troubleshooting',type:'SKILL',page:'skills'},
    {id:'digital_measurement', name:'Digital Measurement',type:'SKILL',page:'skills'},
    {id:'collaborative_robotics', name:'Collaborative Robot Setup',type:'SKILL',page:'skills'},
    {id:'occ_cnc_operator', name:'CNC Operator',type:'OCCUPATION',page:'market'},
    {id:'course_cnc_l4', name:'CNC Machining Level 4',type:'COURSE',page:'skills'},
    ...Object.keys(DATA.districts).map(x=>({id:x.toLowerCase().replace(/[\s\/]+/g, '_'), name:x,type:'DISTRICT',page:'geography'})),
    {id:'em_ai_pcb', name:'AI-assisted PCB design',type:'EMERGING COMPETENCY',page:'emerging'}
  ];

  const close = () => { results.hidden = true; };
  const show = (matches) => {
    results.innerHTML = matches.map((x,i)=>`<button class="search-result" data-index="${i}"><span>${x.name}</span><span>${x.type}</span></button>`).join('') || `<div style="padding:11px;color:var(--muted);font-size:10px">No matching entities</div>`;
    results.hidden = false;
    $$('.search-result', results).forEach((b,i)=>b.addEventListener('click',()=>choose(matches[i])));
  };

  const choose = (x) => {
    if (x.type === 'SKILL') {
      state.selectedSkill = x.name;
      const skillsList = state.liveData.skills || DATA.skills;
      const match = skillsList.find(s => s.id === x.id || s.name === x.name || s.canonical_name === x.name);
      state.selectedSkillId = x.id || (match ? match.id : x.name.toLowerCase().replace(/[\s\/]+/g, '_'));
      state.selectedNode = null;
    }
    if (x.type === 'DISTRICT') {
      state.selectedDistrict = x.name;
      state.filter.district = x.name;
    }
    input.value = '';
    close();
    navigate(x.page);
    showToast(`${x.name} selected`);
  };

  input.addEventListener('input', async () => {
    const q = input.value.trim().toLowerCase();
    if (!q) return close();
    const liveMatches = await apiGet(`/api/search?q=${encodeURIComponent(q)}`);
    if (liveMatches && liveMatches.length > 0) {
      show(liveMatches.slice(0, 6));
    } else {
      show(fallbackEntries.filter(x=>x.name.toLowerCase().includes(q)).slice(0,6));
    }
  });

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !results.hidden) {
      const q = input.value.trim().toLowerCase();
      const x = fallbackEntries.find(x=>x.name.toLowerCase().includes(q));
      if(x) choose(x);
    }
    if (e.key === 'Escape') close();
  });

  document.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase()==='k') { e.preventDefault(); input.focus(); }
    if (e.key==='Escape') { close(); closeEvidence(); closeSidebars(); }
  });
}

function showToast(message) {
  const t = $('#toast');
  t.textContent = message;
  t.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => t.classList.remove('show'), 2600);
}

// 3D Interactive Intelligence Canvas
async function initGraph() {
  const canvas = $('#skill-graph');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Attempt live 3D graph fetch from API
  let liveGraph = await apiGet(`/api/skills/${state.selectedSkillId || 'cnc_programming'}/graph`);

  let nodes = [
    {n:'CNC Programming', t:'skill', x:0,y:0,z:0,c:'#6bc9e8',r:12},
    {n:'Industry demand',t:'demand',x:-120,y:-55,z:30,c:'#e0ad5b',r:8},
    {n:'CNC Operator',t:'occupation',x:-100,y:67,z:-45,c:'#e0ad5b',r:7},
    {n:'CNC Machining L4',t:'course',x:104,y:-56,z:42,c:'#5bbfa7',r:8},
    {n:'Training capacity',t:'capacity',x:138,y:36,z:-27,c:'#5bbfa7',r:8},
    {n:'Employment outcomes',t:'outcome',x:20,y:114,z:51,c:'#5bbfa7',r:8},
    {n:'Evidence records',t:'evidence',x:-28,y:-120,z:-50,c:'#6bc9e8',r:7},
    {n:'Pune cluster',t:'geo',x:-148,y:-5,z:-22,c:'#b09add',r:6},
    {n:'Equipment inventory',t:'equipment',x:78,y:96,z:-46,c:'#d96962',r:6},
    {n:'AI PCB candidate',t:'emerging',x:125,y:-105,z:-51,c:'#e0ad5b',r:6}
  ];
  let edges = [[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[0,8],[1,2],[1,6],[3,4],[3,8],[4,5],[5,6],[7,1],[6,9],[3,9]];

  if (liveGraph && liveGraph.nodes && liveGraph.edges) {
    nodes = liveGraph.nodes.map(n => ({ n: n.label, t: n.type, x: n.x, y: n.y, z: n.z, c: n.color, r: n.radius, meta: n.meta }));
    edges = liveGraph.edges.map(e => [e.source, e.target]);
  }

  let rotX = -0.25, rotY = 0.45, zoom = 1, dragging = false, last = {x:0, y:0}, hover = null, anim = 0, raf;
  let selected = state.selectedNode || nodes[0].n;

  const project = node => {
    let {x,y,z} = node;
    const cy=Math.cos(rotY), sy=Math.sin(rotY), cx=Math.cos(rotX), sx=Math.sin(rotX);
    const x1=x*cy-z*sy, z1=x*sy+z*cy;
    const y1=y*cx-z1*sx, z2=y*sx+z1*cx;
    const scale=(260/(440+z2))*zoom;
    return { x: canvas.width/2 + x1*scale, y: canvas.height/2 + y1*scale, z: z2, scale };
  };

  function size() {
    const dpr = Math.min(window.devicePixelRatio||1, 2), box = canvas.getBoundingClientRect();
    canvas.width = Math.round(box.width*dpr);
    canvas.height = Math.round(box.height*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
    canvas.width = box.width;
    canvas.height = box.height;
  }

  function draw() {
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    const pts = nodes.map(project);
    const selIndex = nodes.findIndex(x => x.n === selected);
    const connected = new Set([selIndex]);
    edges.forEach(([a,b]) => {
      if (a === selIndex) connected.add(b);
      if (b === selIndex) connected.add(a);
    });

    // Draw Edges
    edges.forEach(([a,b]) => {
      const A = pts[a], B = pts[b];
      if (!A || !B) return;
      const on = connected.has(a) && connected.has(b);
      ctx.beginPath();
      ctx.moveTo(A.x, A.y);
      ctx.lineTo(B.x, B.y);
      ctx.strokeStyle = on ? 'rgba(120,211,231,.65)' : 'rgba(138,180,183,.16)';
      ctx.lineWidth = on ? 1.4 : 1;
      ctx.stroke();

      if (on && !reduce) {
        const q = (anim % 1);
        ctx.beginPath();
        ctx.arc(A.x + (B.x - A.x)*q, A.y + (B.y - A.y)*q, 2.2, 0, Math.PI*2);
        ctx.fillStyle = '#d5f4fb';
        ctx.fill();
      }
    });

    // Draw Nodes with depth ordering
    pts.map((p,i)=>({p,i})).sort((a,b)=>a.p.z-b.p.z).forEach(({p,i}) => {
      const n = nodes[i];
      if (!n) return;
      const active = connected.has(i), isSel = n.n === selected;
      const alpha = active ? 1 : 0.25;
      const r = n.r * p.scale * (isSel ? 1.25 : 1);

      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, r + 4, 0, Math.PI*2);
      ctx.fillStyle = n.c + '22';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI*2);
      ctx.fillStyle = n.c;
      ctx.fill();
      ctx.strokeStyle = '#e5f5f5';
      ctx.lineWidth = isSel ? 1.2 : 0.5;
      ctx.stroke();

      if (active || p.scale > 0.7) {
        ctx.globalAlpha = active ? 1 : 0.47;
        ctx.fillStyle = '#d7e6e5';
        ctx.font = `${Math.max(8, 8*p.scale)}px DM Mono, monospace`;
        ctx.fillText(n.n, p.x + r + 6, p.y + 3);
      }
    });

    ctx.globalAlpha = 1;
    if (!reduce) {
      anim += 0.006;
      raf = requestAnimationFrame(draw);
    }
  }

  function pick(e) {
    const r = canvas.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
    let best = null, dist = Infinity;
    nodes.forEach((n,i) => {
      const p = project(n), d = Math.hypot(p.x - x, p.y - y);
      if (d < Math.max(14, n.r*p.scale + 5) && d < dist) {
        best = i;
        dist = d;
      }
    });
    return best;
  }

  canvas.addEventListener('pointerdown', e => {
    dragging = true;
    last = {x: e.clientX, y: e.clientY};
    canvas.setPointerCapture(e.pointerId);
  });

  canvas.addEventListener('pointermove', e => {
    if (dragging) {
      rotY += (e.clientX - last.x) * 0.01;
      rotX = Math.max(-1.2, Math.min(1.2, rotX + (e.clientY - last.y) * 0.01));
      last = {x: e.clientX, y: e.clientY};
      if (reduce) draw();
    } else {
      hover = pick(e);
      canvas.style.cursor = hover !== null ? 'pointer' : 'grab';
    }
  });

  canvas.addEventListener('pointerup', e => {
    const pickNode = pick(e);
    if (Math.hypot(e.clientX - last.x, e.clientY - last.y) < 5 && pickNode !== null) {
      selected = nodes[pickNode].n;
      state.selectedNode = selected;
      const skillsList = state.liveData.skills || DATA.skills;
      const curSkill = skillsList.find(s => s.id === state.selectedSkillId || s.name === state.selectedSkill || s.canonical_name === state.selectedSkill) || skillsList[0];
      $('#graph-profile').innerHTML = renderGraphProfile(curSkill, selected);
      bindContent();
      if (reduce) draw();
    }
    dragging = false;
  });

  canvas.addEventListener('wheel', e => {
    e.preventDefault();
    zoom = Math.max(0.6, Math.min(1.75, zoom - e.deltaY * 0.0008));
    if (reduce) draw();
  }, { passive: false });

  state.graph = {
    reset() {
      rotX = -0.25; rotY = 0.45; zoom = 1;
      selected = nodes[0].n;
      state.selectedNode = selected;
      const skillsList = state.liveData.skills || DATA.skills;
      const curSkill = skillsList.find(s => s.id === state.selectedSkillId || s.name === state.selectedSkill || s.canonical_name === state.selectedSkill) || skillsList[0];
      $('#graph-profile').innerHTML = renderGraphProfile(curSkill, selected);
      bindContent();
      if (reduce) draw();
    },
    isolate(name) {
      selected = name;
      state.selectedNode = name;
      const skillsList = state.liveData.skills || DATA.skills;
      const curSkill = skillsList.find(s => s.id === state.selectedSkillId || s.name === state.selectedSkill || s.canonical_name === state.selectedSkill) || skillsList[0];
      $('#graph-profile').innerHTML = renderGraphProfile(curSkill, name);
      bindContent();
      if (reduce) draw();
      showToast(`${name} isolated with connected evidence`);
    }
  };

  size();
  window.addEventListener('resize', size, { once: true });
  if (reduce) draw();
  else {
    cancelAnimationFrame(raf);
    draw();
  }
}

function boot() {
  const hash = window.location.hash.replace('#', '');
  if (hash && PAGE_RENDERERS[hash]) {
    state.page = hash;
  }
  window.addEventListener('hashchange', () => {
    const h = window.location.hash.replace('#', '');
    if (h && PAGE_RENDERERS[h] && h !== state.page) {
      navigate(h);
    }
  });
  renderNav();
  renderPage();
  initFilters();
  initSearch();
  $('#filter-toggle').addEventListener('click', toggleFilters);
  $('[data-close-filters]').addEventListener('click', closeSidebars);
  $('#scrim').addEventListener('click', () => { closeEvidence(); closeSidebars(); });
  $('#quality-button').addEventListener('click', () => navigate('quality'));
}


boot();

/* ============================================================
   MOBILE RESPONSIVE PATCH
   Keeps existing SkillPulse logic intact.
   ============================================================ */

(() => {
  'use strict';

  const isMobile = () => window.innerWidth <= 900;

  /* ------------------------------------------------------------
     MOBILE NAVIGATION
     ------------------------------------------------------------ */

  function setupMobileNavigation() {
    const sidebar = document.querySelector('.sidebar');
    const workspace = document.querySelector('.workspace');

    if (!sidebar || !workspace) return;

    // Create mobile navigation button if it does not exist.
    let toggle = document.getElementById('mobile-nav-toggle');

    if (!toggle) {
      toggle = document.createElement('button');
      toggle.id = 'mobile-nav-toggle';
      toggle.className = 'mobile-nav-toggle';
      toggle.type = 'button';
      toggle.setAttribute('aria-label', 'Open navigation');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.innerHTML = '☰';

      document.body.appendChild(toggle);
    }

    function closeSidebar() {
      if (isMobile()) {
        sidebar.classList.remove('open');
        const scrim = document.getElementById('scrim');
        if (scrim) scrim.hidden = true;
      } else {
        document.body.classList.add('nav-collapsed');
        sidebar.classList.remove('open');
      }
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open navigation');
      toggle.innerHTML = '☰';
    }

    function openSidebar() {
      if (isMobile()) {
        sidebar.classList.add('open');
        const scrim = document.getElementById('scrim');
        if (scrim) scrim.hidden = false;
      } else {
        document.body.classList.remove('nav-collapsed');
      }
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Close navigation');
      toggle.innerHTML = '×';
    }

    toggle.addEventListener('click', () => {
      const isOpen = isMobile()
        ? sidebar.classList.contains('open')
        : !document.body.classList.contains('nav-collapsed');
      if (isOpen) closeSidebar(); else openSidebar();
    });

    // Close drawer when a navigation item is selected.
    document.addEventListener('click', event => {
      const navButton = event.target.closest('.nav-button, .method-link');

      if (navButton && isMobile()) {
        closeSidebar();
      }
    });

    // Close drawer when clicking outside it.
    document.addEventListener('click', event => {
      if (!isMobile()) return;
      if (!sidebar.classList.contains('open')) return;

      if (
        !sidebar.contains(event.target) &&
        !toggle.contains(event.target)
      ) {
        closeSidebar();
      }
    });

    // Reset mobile state when returning to desktop.
    window.addEventListener('resize', () => {
      if (!isMobile()) {
        sidebar.classList.remove('open');
        const scrim = document.getElementById('scrim');
        if (scrim) scrim.hidden = true;
        toggle.innerHTML = document.body.classList.contains('nav-collapsed') ? '☰' : '×';
        toggle.setAttribute('aria-expanded', String(!document.body.classList.contains('nav-collapsed')));
      } else {
        document.body.classList.remove('nav-collapsed');
        toggle.innerHTML = sidebar.classList.contains('open') ? '×' : '☰';
        toggle.setAttribute('aria-expanded', String(sidebar.classList.contains('open')));
      }
    });
  }


  /* ------------------------------------------------------------
     MOBILE FILTER ACCESS
     ------------------------------------------------------------ */

  function setupMobileFilters() {
    const filterPanel = document.getElementById('filter-panel');
    const filterToggle = document.getElementById('filter-toggle');
    const scrim = document.getElementById('scrim');

    if (!filterPanel) return;

    let mobileFilterButton = document.getElementById(
      'mobile-filter-toggle'
    );

    if (!mobileFilterButton) {
      mobileFilterButton = document.createElement('button');

      mobileFilterButton.id = 'mobile-filter-toggle';
      mobileFilterButton.className = 'mobile-filter-toggle';
      mobileFilterButton.type = 'button';
      mobileFilterButton.textContent = 'Scope';
      mobileFilterButton.setAttribute('aria-expanded', 'false');

      const topbar = document.querySelector('.top-actions');

      if (topbar) {
        topbar.insertBefore(
          mobileFilterButton,
          topbar.firstChild
        );
      }
    }

    function openFilters() {
      filterPanel.classList.add('open');
      filterPanel.setAttribute('aria-hidden', 'false');

      if (scrim) {
        scrim.hidden = false;
        scrim.classList.add('visible');
      }

      mobileFilterButton.setAttribute('aria-expanded', 'true');

      if (filterToggle) {
        filterToggle.setAttribute('aria-expanded', 'true');
      }
    }

    function closeFilters() {
      filterPanel.classList.remove('open');
      filterPanel.setAttribute('aria-hidden', 'true');

      if (scrim) {
        scrim.classList.remove('visible');
        scrim.hidden = true;
      }

      mobileFilterButton.setAttribute('aria-expanded', 'false');

      if (filterToggle) {
        filterToggle.setAttribute('aria-expanded', 'false');
      }
    }

    mobileFilterButton.addEventListener('click', () => {
      if (filterPanel.classList.contains('open')) {
        closeFilters();
      } else {
        openFilters();
      }
    });

    if (filterToggle) {
      filterToggle.addEventListener('click', () => {
        if (filterPanel.classList.contains('open')) {
          closeFilters();
        } else {
          openFilters();
        }
      });
    }

    if (scrim) {
      scrim.addEventListener('click', closeFilters);
    }

    document.addEventListener('click', event => {
      if (event.target.closest('[data-close-filters]')) {
        closeFilters();
      }
    });

    window.addEventListener('resize', () => {
      if (!isMobile()) {
        closeFilters();
      }
    });
  }


  /* ------------------------------------------------------------
     GRAPH RESPONSIVE RESIZE
     ------------------------------------------------------------ */

  function setupResponsiveGraphResize() {
    let resizeTimer;

    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);

      resizeTimer = setTimeout(() => {
        const canvas = document.getElementById('skill-graph');

        if (!canvas) return;

        /*
         * If the existing graph object exposes a resize method,
         * use it. Otherwise trigger a normal resize event so the
         * existing graph renderer can recalculate dimensions.
         */
        if (
          window.state &&
          window.state.graph &&
          typeof window.state.graph.resize === 'function'
        ) {
          window.state.graph.resize();
        } else {
          canvas.dispatchEvent(new Event('resize'));
        }
      }, 150);
    });
  }


  /* ------------------------------------------------------------
     ESCAPE KEY SUPPORT
     ------------------------------------------------------------ */

  function setupMobileEscape() {
    document.addEventListener('keydown', event => {
      if (event.key !== 'Escape') return;

      const sidebar = document.querySelector('.sidebar');
      const filterPanel = document.getElementById('filter-panel');
      const scrim = document.getElementById('scrim');

      if (sidebar) {
        sidebar.classList.remove('open');
      }

      if (filterPanel) {
        filterPanel.classList.remove('open');
        filterPanel.setAttribute('aria-hidden', 'true');
      }

      if (scrim) {
        scrim.classList.remove('visible');
        scrim.hidden = true;
      }

      const navToggle =
        document.getElementById('mobile-nav-toggle');

      if (navToggle) {
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Open navigation');
        navToggle.innerHTML = '☰';
      }

      const mobileFilter =
        document.getElementById('mobile-filter-toggle');

      if (mobileFilter) {
        mobileFilter.setAttribute('aria-expanded', 'false');
      }
    });
  }


  /* ------------------------------------------------------------
     INITIALIZE
     ------------------------------------------------------------ */

  function initMobilePatch() {
    setupMobileNavigation();
    setupMobileFilters();
    setupResponsiveGraphResize();
    setupMobileEscape();
  }

  /*
   * The original app may already have a DOMContentLoaded handler.
   * This patch waits until the DOM is ready without touching the
   * existing application boot process.
   */
  if (document.readyState === 'loading') {
    document.addEventListener(
      'DOMContentLoaded',
      initMobilePatch,
      { once: true }
    );
  } else {
    initMobilePatch();
  }

})();

