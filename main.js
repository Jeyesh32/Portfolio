/**
 * JEYESH VISHNU S — SENIOR SOFTWARE ENGINEER PORTFOLIO
 * Main Interactive Engine: Blueprint Build Sequence, GAT Canvas, X-Ray, Easter Eggs
 */

(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // 01. ENVIRONMENT & ACCESSIBILITY FEATURE CHECKS
  // ---------------------------------------------------------------------------
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchDevice = window.matchMedia('(hover: none) or (pointer: coarse)').matches;

  let sessionIntroSeen = false;
  try {
    sessionIntroSeen = sessionStorage.getItem('jeyesh_build_intro_seen') === 'true';
  } catch (err) {
    console.warn('SessionStorage unavailable:', err);
  }

  // ---------------------------------------------------------------------------
  // 02. DOM ELEMENT CACHE
  // ---------------------------------------------------------------------------
  const body = document.body;
  const introOverlay = document.getElementById('build-intro');
  const buildCounter = document.getElementById('build-counter');
  const buildSkipBtn = document.getElementById('build-skip-btn');
  const stageNum = document.getElementById('stage-num');
  const stageTitle = document.getElementById('stage-title');
  const stageSentence = document.getElementById('stage-sentence');
  const stageBars = document.querySelectorAll('.stage-bar');
  const introCanvas = document.getElementById('intro-canvas');

  // Intro layers
  const layerGuides = document.getElementById('intro-guides-layer');
  const layerTypeface = document.getElementById('intro-typeface-layer');
  const layerPalette = document.getElementById('intro-palette-layer');
  const layerWireframe = document.getElementById('intro-wireframe-layer');
  const layerSettle = document.getElementById('intro-settle-layer');

  // Navigation & Control elements
  const xrayToggleBtn = document.getElementById('xray-toggle');
  const replayBuildBtn = document.getElementById('replay-build-btn');
  const footerReplayBtn = document.getElementById('footer-replay-btn');
  const navBuildText = document.getElementById('nav-build-text');
  const eggCountEl = document.getElementById('egg-count');
  const eggTracker = document.getElementById('egg-tracker');
  const eggModal = document.getElementById('egg-modal');
  const eggModalClose = document.getElementById('egg-modal-close');
  const eggModalDismiss = document.getElementById('egg-modal-dismiss');
  const toastNotice = document.getElementById('toast-notice');

  // Custom Cursor
  const customCursor = document.getElementById('custom-cursor');
  const cursorReadout = document.getElementById('cursor-readout');

  // Canvas elements
  const heroGatCanvas = document.getElementById('hero-gat-canvas');

  // ---------------------------------------------------------------------------
  // 03. INTRO BUILD SEQUENCE LOGIC (01 — 07 STAGES)
  // ---------------------------------------------------------------------------
  const STAGES_DATA = [
    {
      num: '01 — 07',
      title: 'A line',
      sentence: 'Thin guides draw across a blank page with measured coordinates.',
      startPct: 1,
      endPct: 16
    },
    {
      num: '02 — 07',
      title: 'A grid',
      sentence: 'Columns and gutters appear; a red crosshair coordinates the layout.',
      startPct: 17,
      endPct: 32
    },
    {
      num: '03 — 07',
      title: 'A graph',
      sentence: 'Scattered OCR tokens connect with edges, forming a Graph Attention Network.',
      startPct: 33,
      endPct: 50
    },
    {
      num: '04 — 07',
      title: 'A typeface',
      sentence: 'The hero headline appears with its measured scale and kerning annotated.',
      startPct: 51,
      endPct: 68
    },
    {
      num: '05 — 07',
      title: 'A colour',
      sentence: 'The palette swatches calibrate: Ink, Paper substrate, and Signal Red.',
      startPct: 69,
      endPct: 82
    },
    {
      num: '06 — 07',
      title: 'A line of code',
      sentence: 'Wireframe boundary placeholders fill with verified production modules.',
      startPct: 83,
      endPct: 94
    },
    {
      num: '07 — 07',
      title: 'Your turn',
      sentence: 'The blueprint solidifies into the live production environment.',
      startPct: 95,
      endPct: 100
    }
  ];

  let introAnimationTimer = null;
  let introCanvasCtx = null;
  let isIntroActive = false;
  let introStartTime = 0;
  const INTRO_TOTAL_DURATION_MS = 13500; // ~13.5 seconds total auto-play

  // Setup intro canvas context
  if (introCanvas) {
    introCanvasCtx = introCanvas.getContext('2d');
    resizeIntroCanvas();
    window.addEventListener('resize', resizeIntroCanvas);
  }

  function resizeIntroCanvas() {
    if (!introCanvas) return;
    const dpr = window.devicePixelRatio || 1;
    introCanvas.width = window.innerWidth * dpr;
    introCanvas.height = window.innerHeight * dpr;
    if (introCanvasCtx) {
      introCanvasCtx.scale(dpr, dpr);
    }
  }

  // Graph nodes for Stage 3 OCR Visual
  const ocrNodes = [
    { x: 0.22, y: 0.32, text: 'INVOICE #9204', type: 'header' },
    { x: 0.38, y: 0.28, text: 'VENDOR: ACME AI', type: 'vendor' },
    { x: 0.65, y: 0.34, text: 'DATE: 2026-08-14', type: 'meta' },
    { x: 0.28, y: 0.50, text: 'ITEM: GAT RUNTIME', type: 'item' },
    { x: 0.52, y: 0.52, text: 'QTY: 04', type: 'qty' },
    { x: 0.74, y: 0.51, text: '$4,850.00', type: 'price' },
    { x: 0.30, y: 0.68, text: 'SUBTOTAL', type: 'sub' },
    { x: 0.48, y: 0.69, text: 'TAX 18%', type: 'tax' },
    { x: 0.72, y: 0.70, text: 'TOTAL: $5,723.00', type: 'total' }
  ];

  function startBuildIntro() {
    if (!introOverlay) return;
    isIntroActive = true;
    body.classList.add('intro-active');
    introOverlay.classList.remove('intro-hidden');
    introStartTime = performance.now();

    function renderIntroFrame(now) {
      if (!isIntroActive) return;
      const elapsed = now - introStartTime;
      const progress = Math.min(elapsed / INTRO_TOTAL_DURATION_MS, 1);

      // Current percentage (001% → 100%)
      const pct = Math.max(1, Math.floor(progress * 100));
      if (buildCounter) {
        buildCounter.textContent = String(pct).padStart(3, '0') + '%';
      }

      // Determine active stage
      let currentStageIdx = 0;
      for (let i = 0; i < STAGES_DATA.length; i++) {
        if (pct >= STAGES_DATA[i].startPct && pct <= STAGES_DATA[i].endPct) {
          currentStageIdx = i;
          break;
        }
      }
      if (pct >= 100) currentStageIdx = 6;

      updateIntroStageUI(currentStageIdx, progress);
      drawIntroCanvas(currentStageIdx, progress);

      if (progress < 1) {
        introAnimationTimer = requestAnimationFrame(renderIntroFrame);
      } else {
        // Intro complete: transition into live page
        setTimeout(() => {
          completeIntro();
        }, 600);
      }
    }

    introAnimationTimer = requestAnimationFrame(renderIntroFrame);
  }

  function updateIntroStageUI(stageIdx, progress) {
    const data = STAGES_DATA[stageIdx];
    if (stageNum) stageNum.textContent = data.num;
    if (stageTitle) stageTitle.textContent = data.title;
    if (stageSentence) stageSentence.textContent = data.sentence;

    stageBars.forEach((bar, idx) => {
      bar.classList.toggle('active', idx === stageIdx);
    });

    // Toggle overlay layers based on active stage
    if (layerGuides) layerGuides.classList.toggle('active', stageIdx >= 0 && stageIdx <= 2);
    if (layerTypeface) layerTypeface.classList.toggle('active', stageIdx === 3);
    if (layerPalette) layerPalette.classList.toggle('active', stageIdx === 4);
    if (layerWireframe) layerWireframe.classList.toggle('active', stageIdx === 5);
    if (layerSettle) layerSettle.classList.toggle('active', stageIdx === 6);
  }

  function drawIntroCanvas(stageIdx, progress) {
    if (!introCanvasCtx || !introCanvas) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const ctx = introCanvasCtx;

    ctx.clearRect(0, 0, w, h);

    // Stage 0: Thin coordinate guides drawing across
    if (stageIdx === 0) {
      const stageProgress = (progress - 0.0) / (STAGES_DATA[0].endPct / 100);
      const drawW = w * Math.min(stageProgress * 1.2, 1);
      const drawH = h * Math.min(stageProgress * 1.2, 1);

      ctx.strokeStyle = 'rgba(18, 18, 20, 0.25)';
      ctx.lineWidth = 1;

      // Horizontal caliper lines
      ctx.beginPath();
      ctx.moveTo(0, h * 0.25);
      ctx.lineTo(drawW, h * 0.25);
      ctx.moveTo(0, h * 0.75);
      ctx.lineTo(drawW, h * 0.75);
      ctx.stroke();

      // Vertical caliper lines
      ctx.beginPath();
      ctx.moveTo(w * 0.15, 0);
      ctx.lineTo(w * 0.15, drawH);
      ctx.moveTo(w * 0.85, 0);
      ctx.lineTo(w * 0.85, drawH);
      ctx.stroke();

      // Coordinate ticks
      ctx.fillStyle = '#E8203A';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText(`[x: ${Math.round(drawW)}px · y: ${Math.round(h * 0.25)}px]`, drawW - 140, h * 0.25 - 8);
    }

    // Stage 1: Grid columns and moving crosshair
    if (stageIdx === 1) {
      ctx.strokeStyle = 'rgba(232, 32, 58, 0.12)';
      ctx.lineWidth = 1;
      const cols = 12;
      const colW = w / cols;

      for (let i = 1; i < cols; i++) {
        ctx.beginPath();
        ctx.moveTo(i * colW, 0);
        ctx.lineTo(i * colW, h);
        ctx.stroke();
      }

      // Moving crosshair animation
      const scanX = w * (0.2 + 0.6 * Math.sin(progress * 15));
      const scanY = h * (0.3 + 0.4 * Math.cos(progress * 12));

      ctx.strokeStyle = '#E8203A';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(scanX, scanY, 16, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(scanX - 24, scanY);
      ctx.lineTo(scanX + 24, scanY);
      ctx.moveTo(scanX, scanY - 24);
      ctx.lineTo(scanX, scanY + 24);
      ctx.stroke();
    }

    // Stage 2: Graph Attention Network (GAT) visual with OCR tokens! (Signature Stage)
    if (stageIdx === 2) {
      const stageProgress = (progress - 0.33) / 0.17;
      const nodeAlpha = Math.min(stageProgress * 2, 1);

      // Draw Attention Edges
      ctx.lineWidth = 1.2;
      for (let i = 0; i < ocrNodes.length; i++) {
        for (let j = i + 1; j < ocrNodes.length; j++) {
          const n1 = ocrNodes[i];
          const n2 = ocrNodes[j];
          const x1 = n1.x * w;
          const y1 = n1.y * h;
          const x2 = n2.x * w;
          const y2 = n2.y * h;

          const dist = Math.hypot(x2 - x1, y2 - y1);
          if (dist < w * 0.38) {
            const pulse = 0.5 + 0.5 * Math.sin(progress * 25 + i * j);
            ctx.strokeStyle = i % 2 === 0 ? `rgba(232, 32, 58, ${0.4 * pulse})` : `rgba(18, 18, 20, ${0.2 * pulse})`;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
          }
        }
      }

      // Draw OCR Document Tokens & Bounding Capsules
      ctx.font = '11px "JetBrains Mono", monospace';
      ocrNodes.forEach((node, idx) => {
        const nx = node.x * w;
        const ny = node.y * h;
        const isSignal = node.type === 'total' || node.type === 'header';

        ctx.fillStyle = isSignal ? 'rgba(232, 32, 58, 0.95)' : 'rgba(255, 255, 255, 0.9)';
        ctx.strokeStyle = isSignal ? '#E8203A' : '#121214';
        ctx.lineWidth = 1.5;

        const textMetrics = ctx.measureText(node.text);
        const padX = 12;
        const boxW = textMetrics.width + padX * 2;
        const boxH = 26;

        ctx.beginPath();
        ctx.rect(nx - boxW / 2, ny - boxH / 2, boxW, boxH);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = isSignal ? '#FFFFFF' : '#121214';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.text, nx, ny);

        // Small indicator circle
        ctx.fillStyle = '#E8203A';
        ctx.beginPath();
        ctx.arc(nx + boxW / 2 + 5, ny - 6, 3, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  }

  function completeIntro() {
    isIntroActive = false;
    if (introAnimationTimer) cancelAnimationFrame(introAnimationTimer);

    if (introOverlay) {
      introOverlay.classList.add('intro-hidden');
    }
    body.classList.remove('intro-active');

    try {
      sessionStorage.setItem('jeyesh_build_intro_seen', 'true');
    } catch (e) {}

    if (navBuildText) {
      navBuildText.textContent = 'SOLIDIFIED · 100%';
    }

    // Initialize Hero GAT interactive canvas once visible
    initHeroGatCanvas();

    // Recalculate dimensions & trigger GSAP ScrollTrigger refresh
    updateSectionDimensions();
    if (window.ScrollTrigger) {
      window.ScrollTrigger.refresh();
    }
  }

  // Skip Button Event
  if (buildSkipBtn) {
    buildSkipBtn.addEventListener('click', () => {
      completeIntro();
    });
  }

  // Replay intro buttons
  function triggerIntroReplay() {
    window.scrollTo({ top: 0, behavior: 'instant' });
    startBuildIntro();
  }

  if (replayBuildBtn) replayBuildBtn.addEventListener('click', triggerIntroReplay);
  if (footerReplayBtn) footerReplayBtn.addEventListener('click', triggerIntroReplay);

  // ---------------------------------------------------------------------------
  // 04. HERO GRAPH ATTENTION NETWORK (GAT) INTERACTIVE CANVAS
  // ---------------------------------------------------------------------------
  let heroNodes = [];
  let heroEdges = [];
  let hoveredNode = null;
  let mousePos = { x: -1000, y: -1000 };

  function initHeroGatCanvas() {
    if (!heroGatCanvas) return;
    const ctx = heroGatCanvas.getContext('2d');
    const wrap = heroGatCanvas.parentElement;

    function resizeHeroCanvas() {
      const rect = wrap.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      heroGatCanvas.width = rect.width * dpr;
      heroGatCanvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    }

    resizeHeroCanvas();
    window.addEventListener('resize', resizeHeroCanvas);

    // Generate Document Tokens Graph
    const tokenLabels = [
      'VENDOR', 'INVOICE_ID', 'LINE_ITEM_1', 'LINE_ITEM_2',
      'LINE_ITEM_3', 'QUANTITY', 'UNIT_PRICE', 'SUBTOTAL',
      'TAX_CGST', 'TAX_SGST', 'GRAND_TOTAL', 'PAYMENT_TERMS',
      'CLIENT_NAME', 'BILLING_ADDR', 'SHIPPING_ADDR', 'DUE_DATE',
      'PO_NUMBER', 'CURRENCY'
    ];

    const w = heroGatCanvas.clientWidth || 560;
    const h = heroGatCanvas.clientHeight || 420;

    heroNodes = tokenLabels.map((lbl, idx) => ({
      id: idx,
      label: lbl,
      x: w * (0.15 + 0.7 * Math.random()),
      y: h * (0.15 + 0.7 * Math.random()),
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: lbl.includes('TOTAL') || lbl === 'VENDOR' ? 14 : 10,
      isCore: lbl.includes('TOTAL') || lbl === 'VENDOR',
      attentionWeight: 0.5 + Math.random() * 0.5
    }));

    // Connect nearest spatial neighbors
    heroEdges = [];
    for (let i = 0; i < heroNodes.length; i++) {
      for (let j = i + 1; j < heroNodes.length; j++) {
        const d = Math.hypot(heroNodes[i].x - heroNodes[j].x, heroNodes[i].y - heroNodes[j].y);
        if (d < w * 0.4) {
          heroEdges.push({
            source: i,
            target: j,
            weight: Math.max(0.2, 1 - d / (w * 0.4))
          });
        }
      }
    }

    // Update UI counters in header/footer
    const nodeCountEl = document.getElementById('hero-node-count');
    const edgeCountEl = document.getElementById('hero-edge-count');
    if (nodeCountEl) nodeCountEl.textContent = heroNodes.length;
    if (edgeCountEl) edgeCountEl.textContent = heroEdges.length;

    // Mouse interactions
    heroGatCanvas.addEventListener('mousemove', (e) => {
      const rect = heroGatCanvas.getBoundingClientRect();
      mousePos = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };

      // Check hover
      hoveredNode = null;
      for (let n of heroNodes) {
        if (Math.hypot(n.x - mousePos.x, n.y - mousePos.y) < n.radius + 12) {
          hoveredNode = n;
          break;
        }
      }
    });

    heroGatCanvas.addEventListener('mouseleave', () => {
      mousePos = { x: -1000, y: -1000 };
      hoveredNode = null;
    });

    // Render loop
    function animateHeroGat() {
      const curW = heroGatCanvas.clientWidth;
      const curH = heroGatCanvas.clientHeight;
      ctx.clearRect(0, 0, curW, curH);

      // Draw subtle background measurement dots
      ctx.fillStyle = 'rgba(18, 18, 20, 0.04)';
      for (let gx = 20; gx < curW; gx += 40) {
        for (let gy = 20; gy < curH; gy += 40) {
          ctx.beginPath();
          ctx.arc(gx, gy, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Physics update: gentle drift
      heroNodes.forEach(n => {
        n.x += n.vx;
        n.y += n.vy;

        if (n.x < 30 || n.x > curW - 30) n.vx *= -1;
        if (n.y < 30 || n.y > curH - 30) n.vy *= -1;

        // If hovered, slight repulsion from cursor
        const dMouse = Math.hypot(n.x - mousePos.x, n.y - mousePos.y);
        if (dMouse < 80) {
          const angle = Math.atan2(n.y - mousePos.y, n.x - mousePos.x);
          n.x += Math.cos(angle) * 1.5;
          n.y += Math.sin(angle) * 1.5;
        }
      });

      // Draw GAT Edges with Attention weights
      heroEdges.forEach(edge => {
        const n1 = heroNodes[edge.source];
        const n2 = heroNodes[edge.target];
        const isHighlighted = hoveredNode && (hoveredNode.id === n1.id || hoveredNode.id === n2.id);

        ctx.beginPath();
        ctx.moveTo(n1.x, n1.y);
        ctx.lineTo(n2.x, n2.y);

        if (isHighlighted) {
          ctx.strokeStyle = '#E8203A';
          ctx.lineWidth = 2;
        } else {
          ctx.strokeStyle = `rgba(18, 18, 20, ${0.12 * edge.weight})`;
          ctx.lineWidth = 1;
        }
        ctx.stroke();
      });

      // Draw Nodes
      heroNodes.forEach(n => {
        const isHovered = hoveredNode && hoveredNode.id === n.id;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius + (isHovered ? 4 : 0), 0, Math.PI * 2);

        if (n.isCore || isHovered) {
          ctx.fillStyle = isHovered ? '#FF002B' : '#E8203A';
          ctx.strokeStyle = '#121214';
          ctx.lineWidth = 2;
        } else {
          ctx.fillStyle = '#FFFFFF';
          ctx.strokeStyle = '#121214';
          ctx.lineWidth = 1.5;
        }
        ctx.fill();
        ctx.stroke();

        // Node Label
        ctx.font = '8px "JetBrains Mono", monospace';
        ctx.fillStyle = isHovered ? '#E8203A' : '#121214';
        ctx.textAlign = 'center';
        ctx.fillText(n.label, n.x, n.y - n.radius - 4);
      });

      requestAnimationFrame(animateHeroGat);
    }

    animateHeroGat();
  }

  // ---------------------------------------------------------------------------
  // 05. CUSTOM CURSOR & POSITION HUD
  // ---------------------------------------------------------------------------
  if (!isTouchDevice && customCursor) {
    let mouseX = -100, mouseY = -100;
    let cursorX = -100, cursorY = -100;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (cursorReadout) {
        cursorReadout.textContent = `X:${String(Math.round(mouseX)).padStart(4, '0')} Y:${String(Math.round(mouseY)).padStart(4, '0')}`;
      }
    });

    function renderCursor() {
      // Lerp smoothing
      cursorX += (mouseX - cursorX) * 0.22;
      cursorY += (mouseY - cursorY) * 0.22;

      customCursor.style.left = `${cursorX}px`;
      customCursor.style.top = `${cursorY}px`;

      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    // Interactive Hover Elements
    const hoverTargets = 'a, button, .project-card, .service-card, .stack-item, .easter-egg-dot, canvas';
    document.querySelectorAll(hoverTargets).forEach(el => {
      el.addEventListener('mouseenter', () => customCursor.classList.add('is-hovering'));
      el.addEventListener('mouseleave', () => customCursor.classList.remove('is-hovering'));
    });
  }

  // ---------------------------------------------------------------------------
  // 06. X-RAY BLUEPRINT TOGGLE & SHORTCUT (KEY: 'X')
  // ---------------------------------------------------------------------------
  function toggleXRayMode() {
    const isActive = body.classList.toggle('x-ray-mode');
    if (xrayToggleBtn) {
      xrayToggleBtn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      const textSpan = xrayToggleBtn.querySelector('.xray-text');
      if (textSpan) textSpan.textContent = isActive ? 'X-RAY [ON]' : 'X-RAY';
    }
    showToast(isActive ? 'X-Ray Blueprint Active (12-Col Grid)' : 'X-Ray Blueprint Deactivated');
  }

  if (xrayToggleBtn) {
    xrayToggleBtn.addEventListener('click', toggleXRayMode);
  }

  // Keyboard shortcut: Press 'X' or 'x'
  window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === 'x' || e.key === 'X') {
      toggleXRayMode();
    }
  });

  // ---------------------------------------------------------------------------
  // 07. EASTER EGGS SYSTEM (8 HIDDEN SYSTEM NODES)
  // ---------------------------------------------------------------------------
  const TOTAL_EGGS = 8;
  const discoveredEggs = new Set();

  const eggDots = document.querySelectorAll('.easter-egg-dot');
  eggDots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      const eggId = dot.getAttribute('data-egg-id');

      if (!discoveredEggs.has(eggId)) {
        discoveredEggs.add(eggId);
        dot.classList.add('found');
        dot.setAttribute('title', `Node ${eggId} Discovered`);

        // Update Tracker
        if (eggCountEl) eggCountEl.textContent = discoveredEggs.size;

        if (discoveredEggs.size === TOTAL_EGGS) {
          // All 8 found! Celebrate!
          showToast('Graph Fully Resolved! 8/8 Nodes Connected.');
          openEggModal();
        } else {
          showToast(`System Node ${discoveredEggs.size}/8 Discovered.`);
        }
      }
    });
  });

  function openEggModal() {
    if (eggModal) {
      eggModal.removeAttribute('hidden');
      eggModal.classList.add('is-open');
      if (eggModalClose) eggModalClose.focus();
    }
  }

  function closeEggModal() {
    if (eggModal) {
      eggModal.classList.remove('is-open');
      eggModal.setAttribute('hidden', '');
    }
  }

  if (eggModalClose) {
    eggModalClose.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeEggModal();
    });
  }

  if (eggModalDismiss) {
    eggModalDismiss.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeEggModal();
    });
  }

  if (eggModal) {
    eggModal.addEventListener('click', (e) => {
      if (e.target === eggModal) {
        e.preventDefault();
        closeEggModal();
      }
    });
  }

  // Escape key closes the easter egg modal
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && eggModal && eggModal.classList.contains('is-open')) {
      closeEggModal();
    }
  });

  // ---------------------------------------------------------------------------
  // 08. SELF-MEASURING CALIPER SECTION HEADERS
  // ---------------------------------------------------------------------------
  function updateSectionDimensions() {
    const sections = [
      { headerDimId: 'work-dim', containerId: 'work-container', label: '7 PRODUCTION SYSTEMS' },
      { headerDimId: 'services-dim', containerId: 'services-container', label: '4 CAPABILITY DOMAINS' },
      { headerDimId: 'journey-dim', containerId: 'journey-container', label: 'MAR 2024 → PRESENT' },
      { headerDimId: 'stack-dim', containerId: 'stack-container', label: '6 TECHNICAL GROUPS' },
      { headerDimId: 'about-dim', containerId: 'about-container', label: 'MADURAI, TAMIL NADU' },
      { headerDimId: 'contact-dim', containerId: 'contact-container', label: 'DIRECT COMMS' }
    ];

    sections.forEach(s => {
      const dimEl = document.getElementById(s.headerDimId);
      const containerEl = document.getElementById(s.containerId);
      if (dimEl && containerEl) {
        const w = Math.round(containerEl.getBoundingClientRect().width);
        dimEl.textContent = `[w: ${w}px · ${s.label}]`;
      }
    });
  }

  window.addEventListener('resize', updateSectionDimensions);
  updateSectionDimensions();

  // ---------------------------------------------------------------------------
  // 09. MAGNETIC BUTTON HOVER EFFECT
  // ---------------------------------------------------------------------------
  if (!isTouchDevice) {
    const magneticBtns = document.querySelectorAll('.magnetic-btn');
    magneticBtns.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  // ---------------------------------------------------------------------------
  // 10. COPY TO CLIPBOARD & TOAST NOTIFICATION
  // ---------------------------------------------------------------------------
  const copyBtns = document.querySelectorAll('.copy-btn');
  copyBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      try {
        await navigator.clipboard.writeText(textToCopy);
        const originalText = btn.querySelector('.copy-text')?.textContent || 'COPY';
        if (btn.querySelector('.copy-text')) {
          btn.querySelector('.copy-text').textContent = 'COPIED!';
        }
        showToast(`Copied to clipboard: ${textToCopy}`);
        setTimeout(() => {
          if (btn.querySelector('.copy-text')) {
            btn.querySelector('.copy-text').textContent = originalText;
          }
        }, 2000);
      } catch (err) {
        showToast('Direct copy failed. Please select manually.');
      }
    });
  });

  let toastTimeout = null;
  function showToast(message) {
    if (!toastNotice) return;
    toastNotice.textContent = message;
    toastNotice.removeAttribute('hidden');
    toastNotice.style.opacity = '1';
    toastNotice.style.transform = 'translateY(0)';

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toastNotice.style.opacity = '0';
      toastNotice.style.transform = 'translateY(10px)';
      setTimeout(() => toastNotice.setAttribute('hidden', ''), 300);
    }, 2800);
  }

  // ---------------------------------------------------------------------------
  // 11. NATIVE SMOOTH SCROLL & ANCHOR NAVIGATION
  // ---------------------------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerHeight = 64;
        const targetPos = targetEl.getBoundingClientRect().top + window.scrollY - headerHeight;
        window.scrollTo({
          top: Math.max(0, targetPos),
          behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });
      }
    });
  });

  // GSAP Scroll Animations
  if (window.gsap && window.ScrollTrigger && !prefersReducedMotion) {
    window.gsap.registerPlugin(window.ScrollTrigger);

    // Fade and slide reveals for project cards
    window.gsap.utils.toArray('.project-card').forEach((card) => {
      window.gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 35,
        duration: 0.8,
        ease: 'power2.out'
      });
    });

    // Services cards staggered reveal
    window.gsap.utils.toArray('.service-card').forEach((svc, idx) => {
      window.gsap.from(svc, {
        scrollTrigger: {
          trigger: svc,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 30,
        delay: idx * 0.1,
        duration: 0.7,
        ease: 'power2.out'
      });
    });

    // Timeline entry reveals
    window.gsap.utils.toArray('.timeline-entry').forEach((entry) => {
      window.gsap.from(entry, {
        scrollTrigger: {
          trigger: entry,
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        x: -25,
        duration: 0.7,
        ease: 'power2.out'
      });
    });
  }

  // ---------------------------------------------------------------------------
  // 12. INITIALIZATION ROUTINE
  // ---------------------------------------------------------------------------
  window.addEventListener('DOMContentLoaded', () => {
    // Check if intro should run
    if (prefersReducedMotion || sessionIntroSeen) {
      completeIntro();
    } else {
      startBuildIntro();
    }
  });

})();
