/**
 * SkillPulse Frontend Interactive Engine
 * =====================================
 * Human-crafted clean architecture supporting:
 * - Active navigation link with glowing blue line on click and on scroll
 * - Sun ☀️ and Moon 🌙 theme toggle
 * - Letter-writing Typewriter animations
 * - Viewport scroll animations (Small -> Real size expansion)
 * - 4-Sided Neon light emission on hover and click
 * - 1. Student Guidance View Interactive Dashboard
 * - 2. 4-Way Mismatch Bottleneck Simulator
 * - 3. "Show Me Why" Audit Drawer (Slide-out panel)
 * - 4. Skillness Gate 5-Pillar Validator
 * - 5. Economic Corridors Explorer
 * - 6. Intervention Lifecycle Kanban Board
 * - Live FastAPI backend communicator
 */

// --------------------------------------------------------------------------
// 1. TYPEWRITER (LETTER WRITING) ANIMATION
// --------------------------------------------------------------------------
class TypeWriter {
  constructor(element, texts, speed = 60, deleteSpeed = 30, pauseTime = 2200) {
    this.element = element;
    this.texts = Array.isArray(texts) ? texts : [texts];
    this.speed = speed;
    this.deleteSpeed = deleteSpeed;
    this.pauseTime = pauseTime;
    
    this.currentTextIndex = 0;
    this.currentCharIndex = 0;
    this.isDeleting = false;
    
    this.textElement = document.createElement('span');
    this.cursorElement = document.createElement('span');
    this.cursorElement.className = 'typewriter-cursor';
    
    this.element.innerHTML = '';
    this.element.appendChild(this.textElement);
    this.element.appendChild(this.cursorElement);
    
    this.type();
  }

  type() {
    const currentText = this.texts[this.currentTextIndex];
    
    if (this.isDeleting) {
      this.textElement.textContent = currentText.substring(0, this.currentCharIndex - 1);
      this.currentCharIndex--;
    } else {
      this.textElement.textContent = currentText.substring(0, this.currentCharIndex + 1);
      this.currentCharIndex++;
    }
    
    let typeSpeed = this.isDeleting ? this.deleteSpeed : this.speed;
    
    if (!this.isDeleting && this.currentCharIndex === currentText.length) {
      typeSpeed = this.pauseTime;
      this.isDeleting = true;
    } else if (this.isDeleting && this.currentCharIndex === 0) {
      this.isDeleting = false;
      this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
      typeSpeed = 400;
    }
    
    setTimeout(() => this.type(), typeSpeed);
  }
}

const initTypewriter = () => {
  const elements = document.querySelectorAll('.typewriter-text');
  elements.forEach(el => {
    let texts;
    if (el.hasAttribute('data-texts')) {
      try {
        texts = JSON.parse(el.getAttribute('data-texts'));
      } catch (e) {
        texts = [el.getAttribute('data-texts')];
      }
    } else {
      texts = [el.getAttribute('data-text') || el.textContent.trim() || 'SkillPulse'];
    }
    new TypeWriter(el, texts);
  });
};

// --------------------------------------------------------------------------
// 2. THEME TOGGLE (SUN ☀️ & MOON 🌙 BUTTON IN RIGHT CORNER)
// --------------------------------------------------------------------------
const initTheme = () => {
  const toggleBtns = document.querySelectorAll('.theme-toggle, .theme-toggle-floating, #themeToggle, #themeToggleFloating');
  const savedTheme = localStorage.getItem('skillpulse_theme') || 'dark';
  
  document.body.setAttribute('data-theme', savedTheme);
  
  const updateIcons = (theme) => {
    toggleBtns.forEach(btn => {
      btn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
      btn.setAttribute('title', theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    });
  };

  updateIcons(savedTheme);

  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = document.body.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.body.setAttribute('data-theme', newTheme);
      localStorage.setItem('skillpulse_theme', newTheme);
      updateIcons(newTheme);
    });
  });
};

// --------------------------------------------------------------------------
// 3. 4-SIDED NEON LIGHT EMISSION ON BOX HOVER & CLICK
// --------------------------------------------------------------------------
const initBoxLighting = () => {
  const allBoxes = document.querySelectorAll('.glow-card, .smart-module, .pillar-box, .stat-card, .concept-card, .detail-card, .bot-card, .kanban-item');
  
  allBoxes.forEach(box => {
    box.addEventListener('click', () => {
      const wasActive = box.classList.contains('active-light');
      const parent = box.parentElement;
      if (parent) {
        parent.querySelectorAll('.active-light').forEach(b => b.classList.remove('active-light'));
      }
      if (!wasActive) {
        box.classList.add('active-light');
      }
    });

    box.addEventListener('mousemove', (e) => {
      const rect = box.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      box.style.setProperty('--mouse-x', `${x}px`);
      box.style.setProperty('--mouse-y', `${y}px`);
    });
  });
};

// --------------------------------------------------------------------------
// 4. SCROLL ANIMATIONS (Small to Real Size Expansion)
// --------------------------------------------------------------------------
const initScrollAnimations = () => {
  const animatedElements = document.querySelectorAll(
    '.animate-on-scroll, .glow-card, .smart-module, .pillar-box, .stat-card, .bot-card, .student-card'
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px'
  });

  animatedElements.forEach(el => observer.observe(el));
};

// --------------------------------------------------------------------------
// 5. STATS COUNTER ANIMATION
// --------------------------------------------------------------------------
const animateCounter = (element, target, duration = 1600) => {
  const startTime = performance.now();
  
  const step = (now) => {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const currentVal = Math.floor(easeOut * target);
    
    element.textContent = currentVal;
    
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      element.textContent = target;
    }
  };
  
  requestAnimationFrame(step);
};

const initCounters = () => {
  const counterEls = document.querySelectorAll('.counter, [data-target]');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const targetVal = parseInt(entry.target.getAttribute('data-target') || entry.target.textContent);
        if (!isNaN(targetVal) && targetVal > 0) {
          animateCounter(entry.target, targetVal);
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  counterEls.forEach(el => observer.observe(el));
};

// --------------------------------------------------------------------------
// 6. BACKGROUND ANIMATIONS DISABLED (Clean static enterprise background)
// --------------------------------------------------------------------------
class ParticleSystem {
  constructor(canvasId) {
    // Background canvas animation removed per user preference for clean static background
    const canvas = document.getElementById(canvasId);
    if (canvas) {
      canvas.style.display = 'none';
    }
  }
}

// --------------------------------------------------------------------------
// 7. SMOOTH NAVIGATION & ACTIVE BLUE UNDERLINE (CLICK & SCROLLSPY)
// --------------------------------------------------------------------------
const initNavigation = () => {
  const nav = document.querySelector('.nav');
  const progressBar = document.querySelector('.scroll-progress');
  const backToTopBtn = document.querySelector('.back-to-top');
  const allNavLinks = document.querySelectorAll('.nav-links a');

  const setActiveLink = (activeLink) => {
    allNavLinks.forEach(l => l.classList.remove('active'));
    if (activeLink) {
      activeLink.classList.add('active');
    }
  };

  // Sync URL for detail pages
  const currentPath = window.location.pathname;
  allNavLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && !href.startsWith('#')) {
      if (currentPath.endsWith(href) || (href !== '../index.html' && currentPath.includes(href.replace('../', '')))) {
        setActiveLink(link);
      }
    }
  });

  // Click Handler: Immediate blue line
  allNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        e.preventDefault();
        setActiveLink(link);

        if (targetId === '#home') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          const targetEl = document.querySelector(targetId);
          if (targetEl) {
            const navHeight = nav ? nav.offsetHeight : 65;
            const targetPos = targetEl.getBoundingClientRect().top + window.pageYOffset - navHeight - 10;
            window.scrollTo({ top: targetPos, behavior: 'smooth' });
          }
        }
      } else {
        setActiveLink(link);
      }
    });
  });

  // ScrollSpy: Automatically move the blue line as section enters viewport
  const sections = document.querySelectorAll('section[id], header[id]');
  const updateScrollSpy = () => {
    if (sections.length === 0) return;
    const scrollY = window.pageYOffset;
    const navHeight = nav ? nav.offsetHeight : 65;

    if (scrollY < 180) {
      const homeLink = document.querySelector('.nav-links a[href="#home"], .nav-links a[href="#"]');
      if (homeLink) setActiveLink(homeLink);
      return;
    }

    let currentSectionId = '';
    sections.forEach(sec => {
      const secTop = sec.offsetTop - navHeight - 100;
      const secHeight = sec.offsetHeight;
      const secId = sec.getAttribute('id');
      if (scrollY >= secTop && scrollY < secTop + secHeight) {
        currentSectionId = secId;
      }
    });

    if (currentSectionId) {
      const matchingLink = document.querySelector(`.nav-links a[href="#${currentSectionId}"]`);
      if (matchingLink) {
        setActiveLink(matchingLink);
      }
    }
  };

  window.addEventListener('scroll', () => {
    if (nav) {
      if (window.scrollY > 30) {
        nav.style.background = 'var(--nav-bg)';
        nav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.4)';
      } else {
        nav.style.background = 'rgba(5, 10, 24, 0.75)';
        nav.style.boxShadow = 'none';
      }
    }

    if (progressBar) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
      progressBar.style.width = `${progress}%`;
    }

    if (backToTopBtn) {
      if (window.scrollY > 450) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    updateScrollSpy();
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Hamburger menu toggle for mobile
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      hamburger.innerHTML = navLinks.classList.contains('active') ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });

    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.innerHTML = '<i class="fas fa-bars"></i>';
      });
    });
  }
};

// --------------------------------------------------------------------------
// 8. MODULE 1: STUDENT GUIDANCE VIEW (Interactive Dashboard)
// --------------------------------------------------------------------------
const studentProfiles = {
  machinist: {
    name: 'Rahul Sharma',
    year: '2nd Year ITI Machinist, Pune Cluster',
    targetRole: 'Senior 5-Axis CNC Programmer',
    salaryTarget: '₹32,000 - ₹38,000 / mo',
    currentSkills: ['Basic Lathe Operating (85%)', 'G-Code Basics (60%)', 'Manual Milling (75%)'],
    gapSkills: ['5-Axis Multi-Tasking CNC', 'CAD/CAM SolidWorks', 'CMM Quality Inspection'],
    pathway: [
      { step: '1. Foundation', text: 'Master G-Code & M-Code offsets via ITI Practical Lab (3 weeks)' },
      { step: '2. Industry Module', text: 'Enrol in Pune-Chakan OEM Apprenticeship for 5-Axis Simulator (6 weeks)' },
      { step: '3. Certification', text: 'NCVET-Certified Advanced Machinist Credential (Score > 80%)' },
      { step: '4. Placement Gateway', text: 'Direct interview allocation with 18 verified Auto Consortium employers' }
    ]
  },
  electronics: {
    name: 'Priya Patil',
    year: 'Final Year Diploma Electronics, Nagpur Hub',
    targetRole: 'EV Powertrain & Battery Diagnostics Tech',
    salaryTarget: '₹35,000 - ₹42,000 / mo',
    currentSkills: ['Circuit Soldering (90%)', 'PLC Basics (70%)', 'Digital Multimeter (95%)'],
    gapSkills: ['High-Voltage Battery BMS', 'Thermal Runaway Testing', 'CAN Bus Diagnostics'],
    pathway: [
      { step: '1. Safety Training', text: 'Complete High-Voltage Safety Protocol & EV Isolation Certification' },
      { step: '2. Hands-on Lab', text: 'Practical BMS testing on MIHAN Regional EV Training Rig' },
      { step: '3. Dual Apprenticeship', text: '8-week industry internship with Tier-1 EV Battery Assembly plant' },
      { step: '4. Role Deployment', text: 'Onboarding into Regional EV Charging & Fleet Service Centers' }
    ]
  },
  it: {
    name: 'Amit Deshmukh',
    year: 'COPA Passout, Nashik ITI',
    targetRole: 'Industrial Data Operations Specialist',
    salaryTarget: '₹28,000 - ₹34,000 / mo',
    currentSkills: ['Data Entry & Excel (95%)', 'Basic Python (65%)', 'PC Hardware (80%)'],
    gapSkills: ['SQL Database Queries', 'Power BI Industrial Dashboards', 'Shopfloor IoT Logging'],
    pathway: [
      { step: '1. Data Querying', text: 'Complete 30-hour intensive SQL & PostgreSQL data extraction course' },
      { step: '2. Industry Dashboarding', text: 'Build live OEE production tracking dashboards in Power BI' },
      { step: '3. Shopfloor Integration', text: 'Connect IoT sensor feeds from Nashik auto supplier machinery' },
      { step: '4. Career Placement', text: 'Placement across Manufacturing Execution Systems (MES) tech teams' }
    ]
  }
};

const initStudentGuidance = () => {
  const selector = document.getElementById('studentProfileSelect');
  if (!selector) return;

  const updateStudentView = (key) => {
    const data = studentProfiles[key] || studentProfiles.machinist;
    document.getElementById('studName').textContent = data.name;
    document.getElementById('studYear').textContent = data.year;
    document.getElementById('studTargetRole').textContent = data.targetRole;
    document.getElementById('studSalary').textContent = data.salaryTarget;

    // Current Skills
    const curContainer = document.getElementById('studCurrentSkills');
    curContainer.innerHTML = data.currentSkills.map(s => 
      `<span class="chip" style="background: rgba(0,230,118,0.15); border: 1px solid var(--neon-green); color: var(--neon-green); margin: 3px;">✔ ${s}</span>`
    ).join('');

    // Gap Skills
    const gapContainer = document.getElementById('studGapSkills');
    gapContainer.innerHTML = data.gapSkills.map(s => 
      `<span class="chip" style="background: rgba(255,0,127,0.15); border: 1px solid var(--neon-pink); color: var(--neon-pink); margin: 3px;">⚠ ${s}</span>`
    ).join('');

    // Pathway Steps
    const pathContainer = document.getElementById('studPathwaySteps');
    pathContainer.innerHTML = data.pathway.map(p => `
      <div class="student-pathway-step">
        <div class="pathway-step-icon"><i class="fas fa-check"></i></div>
        <div>
          <strong class="text-white small d-block">${p.step}</strong>
          <span class="text-secondary small">${p.text}</span>
        </div>
      </div>
    `).join('');
  };

  selector.addEventListener('change', (e) => {
    updateStudentView(e.target.value);
  });

  updateStudentView('machinist');
};

// --------------------------------------------------------------------------
// 9. MODULE 2: 4-WAY MISMATCH BREAKDOWN SIMULATOR
// --------------------------------------------------------------------------
const initMismatchBreakdown = () => {
  const reqSlider = document.getElementById('simReq');
  const currSlider = document.getElementById('simCurr');
  const trainSlider = document.getElementById('simTrain');
  const equipSlider = document.getElementById('simEquip');
  
  if (!reqSlider || !currSlider || !trainSlider || !equipSlider) return;

  const updateMismatch = () => {
    const r = parseInt(reqSlider.value);
    const c = parseInt(currSlider.value);
    const t = parseInt(trainSlider.value);
    const e = parseInt(equipSlider.value);

    // Update value text
    document.getElementById('simReqVal').textContent = `${r}%`;
    document.getElementById('simCurrVal').textContent = `${c}%`;
    document.getElementById('simTrainVal').textContent = `${t}%`;
    document.getElementById('simEquipVal').textContent = `${e}%`;

    const currGap = Math.max(0, r - c);
    const trainGap = Math.max(0, r - t);
    const equipGap = Math.max(0, r - e);
    const capGap = Math.max(0, Math.round(r * 0.75 - c * 0.5));

    document.getElementById('gapCurrValue').textContent = `${currGap}% Deficit`;
    document.getElementById('gapTrainValue').textContent = `${trainGap}% Deficit`;
    document.getElementById('gapEquipValue').textContent = `${equipGap}% Deficit`;
    document.getElementById('gapCapValue').textContent = `${capGap}% Capacity Strain`;

    const actionText = document.getElementById('simActionSummary');
    if (currGap > trainGap && currGap > equipGap) {
      actionText.textContent = `Primary Bottleneck is Curriculum Coverage. Action: Deploy 5-Axis addendum syllabus to regional ITI Machinist programs.`;
    } else if (trainGap >= currGap && trainGap >= equipGap) {
      actionText.textContent = `Primary Bottleneck is Trainer Readiness. Action: Sponsor 50 vocational instructors for 8-week OEM industry apprenticeships.`;
    } else {
      actionText.textContent = `Primary Bottleneck is Practical Lab Equipment. Action: Reallocate mobile precision training pods from surplus districts.`;
    }
  };

  [reqSlider, currSlider, trainSlider, equipSlider].forEach(s => s.addEventListener('input', updateMismatch));
  updateMismatch();
};

// --------------------------------------------------------------------------
// 10. MODULE 3: "SHOW ME WHY" AUDIT DRAWER (SLIDE-OUT PANEL)
// --------------------------------------------------------------------------
const auditEvidenceData = {
  'cnc': {
    title: 'Update Pune & Nagpur ITI Curricula for 5-Axis CNC Programming',
    canonicalId: 'SKILL_001',
    confidence: '0.87 (High Multi-Source Convergence)',
    sources: [
      { name: 'Job Postings (Weight: 35%)', text: '67% of machinist vacancies require 5-axis/CAD-CAM' },
      { name: 'Employer Surveys (Weight: 25%)', text: '23 of 30 auto suppliers report active CNC technician shortage' },
      { name: 'Consortium Roundtables (Weight: 20%)', text: 'Maharashtra Auto Group confirmed transition to German 5-axis machines' },
      { name: 'Tracer Outcomes (Weight: 20%)', text: '84% in-sector retention for past pilot trainees' }
    ],
    assumptions: [
      'Digital job postings cover registered Tier-1/2 vendors; MSMEs estimated via district industrial associations.',
      '33% non-response in historical graduate tracer is marked Unobserved (Missing ≠ Failure).'
    ],
    metric: '80% trainee practical competency at 6 months; 75% in-sector retention at 12 months.'
  },
  'analytics': {
    title: 'Launch Industrial Data Operations Course & Lab Upgrades',
    canonicalId: 'SKILL_002',
    confidence: '0.92 (Strong Evidence Fusion)',
    sources: [
      { name: 'Job Postings (Weight: 40%)', text: 'Surge in shopfloor MES data entry & SQL logging requirements' },
      { name: 'Employer Surveys (Weight: 30%)', text: '45 manufacturing plants seeking Python/PowerBI operators' },
      { name: 'Academic Consultations (Weight: 15%)', text: 'Syllabus gap identified in COPA computer operator trade' },
      { name: 'Outcome Feedback (Weight: 15%)', text: 'Previous batch achieved 88% placement in logistics & supply chain' }
    ],
    assumptions: [
      'Remote job posts excluded to reflect physical manufacturing hub demand in Pune-Mumbai corridor.'
    ],
    metric: '50 certified instructors trained; 300 trainees enrolled in pilot cohort.'
  },
  'ev': {
    title: 'Establish High-Voltage EV Diagnostics Lab in Nagpur MIHAN SEZ',
    canonicalId: 'SKILL_003',
    confidence: '0.78 (Emerging Signal State)',
    sources: [
      { name: 'Public Tender & Investments (Weight: 35%)', text: '3 EV bus battery assembly plants commissioned in Nagpur SEZ' },
      { name: 'Employer Ingestion (Weight: 30%)', text: 'Immediate requirement for 120 certified high-voltage battery technicians' },
      { name: 'Qualification Framework (Weight: 20%)', text: 'Zero existing NSQF Level 4 training capacity in Vidarbha region' },
      { name: 'Tracer Benchmarks (Weight: 15%)', text: 'Automotive electrical trade baseline retention: 76%' }
    ],
    assumptions: [
      'Safety qualification standards mapped directly from ARAI / NCVET guidelines.'
    ],
    metric: '100% safety certified technicians; operational shared battery diagnostic lab.'
  }
};

const openAuditDrawer = (key = 'cnc') => {
  const data = auditEvidenceData[key] || auditEvidenceData['cnc'];
  const drawer = document.getElementById('auditDrawer');
  const overlay = document.getElementById('auditDrawerOverlay');
  if (!drawer || !overlay) return;

  document.getElementById('drawerTitle').textContent = data.title;
  document.getElementById('drawerCanonical').textContent = `Canonical ID: ${data.canonicalId}`;
  document.getElementById('drawerConfidence').textContent = data.confidence;
  document.getElementById('drawerMetric').textContent = data.metric;

  const sourceContainer = document.getElementById('drawerSources');
  sourceContainer.innerHTML = data.sources.map(s => `
    <div class="p-3 mb-2" style="background: rgba(255,255,255,0.03); border-radius: 8px; border-left: 3px solid var(--neon-cyan);">
      <strong class="text-cyan small d-block">${s.name}</strong>
      <span class="text-secondary small">${s.text}</span>
    </div>
  `).join('');

  const assumpContainer = document.getElementById('drawerAssumptions');
  assumpContainer.innerHTML = data.assumptions.map(a => `
    <li class="text-secondary small mb-1">${a}</li>
  `).join('');

  drawer.classList.add('active');
  overlay.classList.add('active');
};

const closeAuditDrawer = () => {
  const drawer = document.getElementById('auditDrawer');
  const overlay = document.getElementById('auditDrawerOverlay');
  if (drawer) drawer.classList.remove('active');
  if (overlay) overlay.classList.remove('active');
};

// --------------------------------------------------------------------------
// 11. MODULE 4: SKILLNESS GATE 5-PILLAR VALIDATOR
// --------------------------------------------------------------------------
const gateSamples = {
  'cnc5axis': {
    phrase: '5-Axis CNC Programming & G-Code Offsets',
    status: 'PASS - Valid Technical Competency',
    color: 'var(--neon-green)',
    repetition: '34 Distinct Job Mentions (Threshold ≥ 25)',
    independence: '11 Unrelated Industrial Employers (Threshold ≥ 6)',
    persistence: '180 Days Active Market Presence (Threshold > 90)',
    techRelevance: '0.88 Cosine Similarity to Machinist Taxonomy',
    nsqfGap: 'Missing in current standard ITI Machinist syllabus'
  },
  'freelunch': {
    phrase: 'Free Lunch & Subsidized Air Conditioned Canteen',
    status: 'FAIL - Workplace Condition / HR Perk',
    color: 'var(--neon-pink)',
    repetition: '88 Mentions in job description perk sections',
    independence: 'Filtered at Grammatical Dependency Parser (Noun-Object: Food)',
    persistence: 'Non-competency phrase',
    techRelevance: '0.04 Technical Cosine Similarity',
    nsqfGap: 'Not an educational competency'
  },
  'joiner': {
    phrase: 'Immediate Joiner within 7 Days Required',
    status: 'FAIL - Administrative Hiring Term',
    color: 'var(--neon-yellow)',
    repetition: '140 Mentions',
    independence: 'Filtered by Syntactic Action-Verb Proximity',
    persistence: 'Temporal recruiter constraint',
    techRelevance: '0.01 Technical Relevance',
    nsqfGap: 'Administrative timeline requirement'
  },
  'cobot': {
    phrase: 'Collaborative Robot (Cobot) Joint Calibration',
    status: 'PASS - Emerging Competency Candidate',
    color: 'var(--neon-cyan)',
    repetition: '28 Mentions (Surging 45% QoQ)',
    independence: '8 Auto OEMs & Electronics Assemblers',
    persistence: '120 Days Sustained Demand',
    techRelevance: '0.81 Technical Alignment to Robotics',
    nsqfGap: 'Zero current NSQF course code — Scheduled for fast-track pilot'
  }
};

const initSkillnessGate = () => {
  const buttons = document.querySelectorAll('.gate-phrase-btn');
  if (buttons.length === 0) return;

  const runGateTest = (key) => {
    const data = gateSamples[key] || gateSamples['cnc5axis'];
    document.getElementById('gateTestedPhrase').textContent = `"${data.phrase}"`;
    const statusEl = document.getElementById('gateStatusBadge');
    statusEl.textContent = data.status;
    statusEl.style.borderColor = data.color;
    statusEl.style.color = data.color;
    statusEl.style.background = `rgba(0,0,0,0.4)`;

    document.getElementById('gateRepText').textContent = data.repetition;
    document.getElementById('gateIndText').textContent = data.independence;
    document.getElementById('gatePersText').textContent = data.persistence;
    document.getElementById('gateTechText').textContent = data.techRelevance;
    document.getElementById('gateGapText').textContent = data.nsqfGap;
  };

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active-pill'));
      btn.classList.add('active-pill');
      runGateTest(btn.getAttribute('data-sample'));
    });
  });

  runGateTest('cnc5axis');
};

// --------------------------------------------------------------------------
// 12. MODULE 5: ECONOMIC CORRIDORS MAP EXPLORER
// --------------------------------------------------------------------------
const corridorData = {
  'pune': {
    name: 'Pune - Chakan - Talegaon - Raigad Manufacturing Corridor',
    districts: 'Pune, Raigad, Thane',
    sectors: 'Automotive, Precision Machine Tools, Heavy Fabrication, Electronics',
    employers: '280+ Verified Industrial Plants',
    itis: '24 ITIs & Polytechnics connected',
    mobility: '34% of trained workforce commutes across district borders daily',
    smi: 'Spatial Mismatch Index: 0.22 (Low friction, established bus/rail feeder routes)'
  },
  'nagpur': {
    name: 'Nagpur - Wardha - Butibori Industrial & Logistics Corridor',
    districts: 'Nagpur, Wardha, Chandrapur',
    sectors: 'MIHAN SEZ Aerospace, Defense Assembly, Power & Metal Fabrication',
    employers: '95+ Verified Plants & Logistics Hubs',
    itis: '14 ITIs in catchment travel-shed',
    mobility: '26% inter-district technical apprentice travel along NH-44',
    smi: 'Spatial Mismatch Index: 0.38 (Requires shared morning transit shuttles)'
  },
  'nashik': {
    name: 'Nashik - Sinnar - Aurangabad Auto & Engineering Corridor',
    districts: 'Nashik, Chhatrapati Sambhajinagar (Aurangabad), Jalna',
    sectors: 'Auto Components, Electrical Equipment, Steel & Agro-Tech',
    employers: '160+ Verified Manufacturing Suppliers',
    itis: '18 Technical Training Centres',
    mobility: '29% supplier-chain apprentice mobility between MIDC parks',
    smi: 'Spatial Mismatch Index: 0.31 (High cluster density along Samruddhi Highway)'
  }
};

const initCorridors = () => {
  const buttons = document.querySelectorAll('.corridor-pill-btn');
  if (buttons.length === 0) return;

  const updateCorridor = (key) => {
    const data = corridorData[key] || corridorData['pune'];
    document.getElementById('corrName').textContent = data.name;
    document.getElementById('corrDistricts').textContent = data.districts;
    document.getElementById('corrSectors').textContent = data.sectors;
    document.getElementById('corrEmployers').textContent = data.employers;
    document.getElementById('corrItis').textContent = data.itis;
    document.getElementById('corrMobility').textContent = data.mobility;
    document.getElementById('corrSmi').textContent = data.smi;
  };

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      updateCorridor(btn.getAttribute('data-corridor'));
    });
  });

  updateCorridor('pune');
};

// --------------------------------------------------------------------------
// 13. MODULE 6: INTERVENTION TRACKING LIFECYCLE (KANBAN)
// --------------------------------------------------------------------------
const initInterventionLifecycle = () => {
  // Can filter or highlight items
  document.querySelectorAll('.kanban-item').forEach(item => {
    item.addEventListener('click', () => {
      const skill = item.getAttribute('data-skill') || 'cnc';
      openAuditDrawer(skill);
    });
  });
};

// --------------------------------------------------------------------------
// 14. SIMPLE CLEAN SKILL TAXONOMY INSPECTOR (REPLACES CHAOTIC CANVAS)
// --------------------------------------------------------------------------
const cleanTaxonomyData = {
  'cnc': {
    name: 'CNC Programming & Multi-Axis Machining',
    id: 'SKILL_001',
    category: 'Manufacturing & Precision Engineering',
    nsqf: 'NSQF Level 5',
    demand: 'Strong (Increasing)',
    aliases: ['CNC Machining', 'सीएनसी प्रोग्रामिंग (Hindi)', 'G-Code / M-Code Operating', 'सीएनसी ऑपरेटर (Marathi)'],
    prereqs: ['Blueprint Reading', 'Basic Machinist Lathe', 'Engineering Metrology'],
    specializations: ['5-Axis Milling', 'CAD/CAM SolidCAM', 'Die & Mould Programming'],
    courses: ['ITI Machinist', 'ITI Turner', 'Diploma Mechanical Engineering'],
    employers: 'Tata Motors, Bharat Forge, Kirloskar, Mahindra Auto Vendors'
  },
  'python': {
    name: 'Python & Industrial Data Analytics',
    id: 'SKILL_002',
    category: 'Information Technology & Data Operations',
    nsqf: 'NSQF Level 5.5',
    demand: 'Strong (Accelerating)',
    aliases: ['Data Analytics', 'डेटा एनालिटिक्स (Hindi)', 'SQL & MES Reporting', 'Industrial Python'],
    prereqs: ['Excel & Basic Computing', 'Basic Algebra & Statistics'],
    specializations: ['Shopfloor MES Logging', 'Power BI Dashboards', 'Predictive Maintenance Basics'],
    courses: ['ITI COPA (Computer Operator)', 'Diploma Computer Tech'],
    employers: 'Capgemini, Infosys Manufacturing, Reliance Logistics, Bosch'
  },
  'ev': {
    name: 'Electric Vehicle Powertrain & BMS Diagnostics',
    id: 'SKILL_003',
    category: 'Automotive & Clean Energy Tech',
    nsqf: 'NSQF Level 5',
    demand: 'Emerging (High Growth)',
    aliases: ['EV Technology', 'ईवी बैटरी सिस्टम (Hindi)', 'High-Voltage Wiring', 'BMS Testing'],
    prereqs: ['Automotive Electricals', 'Basic Electronics', 'Safety PPE Protocols'],
    specializations: ['Cell Balancing Diagnostics', 'Thermal Runaway Testing', 'Fast Charger Servicing'],
    courses: ['ITI Mechanic Auto Electricals', 'Diploma Electrical Engineering'],
    employers: 'PMI Electro Mobility, Ola Electric Service, Minda Corp, Tata AutoComp'
  }
};

const initCleanTaxonomy = () => {
  const tabs = document.querySelectorAll('.tax-tab-btn');
  if (tabs.length === 0) return;

  const renderTax = (key) => {
    const data = cleanTaxonomyData[key] || cleanTaxonomyData['cnc'];
    document.getElementById('taxSkillName').textContent = data.name;
    document.getElementById('taxId').textContent = data.id;
    document.getElementById('taxCategory').textContent = data.category;
    document.getElementById('taxNsqf').textContent = data.nsqf;
    document.getElementById('taxDemand').textContent = data.demand;
    document.getElementById('taxEmployers').textContent = data.employers;

    document.getElementById('taxAliases').innerHTML = data.aliases.map(a => 
      `<span class="chip" style="background: rgba(0,240,255,0.1); border: 1px solid var(--neon-cyan); color: #00f0ff; margin: 3px;">${a}</span>`
    ).join('');

    document.getElementById('taxPrereqs').innerHTML = data.prereqs.map(p => 
      `<span class="chip" style="background: rgba(168,85,247,0.12); border: 1px solid var(--neon-purple); color: var(--neon-purple); margin: 3px;">▸ ${p}</span>`
    ).join('');

    document.getElementById('taxSpecs').innerHTML = data.specializations.map(s => 
      `<span class="chip" style="background: rgba(0,230,118,0.12); border: 1px solid var(--neon-green); color: var(--neon-green); margin: 3px;">★ ${s}</span>`
    ).join('');

    document.getElementById('taxCourses').innerHTML = data.courses.map(c => 
      `<span class="chip" style="background: rgba(255,183,3,0.12); border: 1px solid var(--neon-yellow); color: var(--neon-yellow); margin: 3px;">🎓 ${c}</span>`
    ).join('');
  };

  tabs.forEach(t => {
    t.addEventListener('click', () => {
      tabs.forEach(btn => btn.classList.remove('active-tab'));
      t.classList.add('active-tab');
      renderTax(t.getAttribute('data-skill'));
    });
  });

  renderTax('cnc');
};

// --------------------------------------------------------------------------
// 15. FULL-STACK API INTEGRATION (FASTAPI BACKEND COMMUNICATOR)
// --------------------------------------------------------------------------
const initLiveAPI = async () => {
  const liveIndicator = document.getElementById('liveApiStatus');
  try {
    const res = await fetch('/api/overview', { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      if (liveIndicator) {
        liveIndicator.innerHTML = '<span class="live-dot"></span> FASTAPI BACKEND LIVE [Port 8000]';
        liveIndicator.style.color = 'var(--neon-green)';
        liveIndicator.style.borderColor = 'var(--neon-green)';
      }
    }
  } catch (err) {
    if (liveIndicator) {
      liveIndicator.innerHTML = '<span class="live-dot" style="background-color: var(--neon-cyan); box-shadow: 0 0 6px var(--neon-cyan);"></span> CLIENT DEMONSTRATOR MODE';
      liveIndicator.style.color = 'var(--neon-cyan)';
    }
  }
};

// --------------------------------------------------------------------------
// INITIALIZATION ON DOM READY
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initTypewriter();
  initBoxLighting();
  initScrollAnimations();
  initCounters();
  initNavigation();
  new ParticleSystem('particles-canvas');
  initStudentGuidance();
  initMismatchBreakdown();
  initSkillnessGate();
  initCorridors();
  initInterventionLifecycle();
  initCleanTaxonomy();
  initLiveAPI();
});
