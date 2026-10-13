# Jeyesh Vishnu S — Senior Software Engineer Portfolio

A technical editorial portfolio website engineered for **Jeyesh Vishnu S**, Senior Software Engineer specializing in AI/ML, document intelligence, graph neural networks, and Python/C# backend architecture, based in Madurai, India.

---

## 1. Quick Start

This project is 100% self-contained and requires **no build tools or package managers**.

### Option A: Direct Browser Launch
Simply double-click or open `index.html` in any modern web browser (Chrome, Edge, Firefox, Safari).

### Option B: Local Development Server
Run any lightweight static server in this folder:
```bash
# Python 3
python -m http.server 3000

# or Node.js (npx)
npx serve .
```
Then visit `http://localhost:3000` in your browser.

---

## 2. Key Architectural Features

- **"The Build" Animated Intro (12–15s)**:
  - Assembles the homepage in 7 stages from raw coordinate guidelines, 12-column blueprint grid, OCR token Graph Attention Network (GAT), typographic specification, palette swatches, wireframe boxes, and solidifies into the finished hero.
  - Large faint progress counter (`001% → 100%`) in the top right.
  - Monospace status caption (`01 — 07`) with live stage descriptions.
  - "Skip the build ↓" link always visible for immediate access.
  - Stores playback state in `sessionStorage` (with `try/catch` guard) to avoid repeating on page reloads, with **Replay** buttons in the header and footer.
  - Respects `prefers-reduced-motion` by automatically skipping the intro for users requesting reduced motion.

- **Interactive GAT Canvas Visualization**:
  - Live spatial document intelligence simulation in the hero card displaying document tokens ("VENDOR", "LINE_ITEMS", "TOTAL", etc.) linked by attention weights ($\alpha_{ij}$) and responsive to mouse perturbation.

- **Technical Design System**:
  - Warm Paper (`#F4F4F1`), Ink (`#121214`), and Signal Red (`#E8203A`).
  - Google Fonts: **Bricolage Grotesque** (editorial headlines) & **JetBrains Mono** (technical annotations).
  - Self-measuring section caliper bars that calculate layout bounding widths in real-time.

- **Blueprint X-Ray Mode**:
  - Click the **X-RAY** button or press the keyboard key `X` to activate a full-screen 12-column engineering grid, guide lines, and container outlines.

- **8 Easter Egg System Nodes**:
  - 8 small red nodes hidden across technical markers (location tag, hero caliper, AnyDoc card, nd-sdk header, GenAI service, timeline milestone, Apache AGE stack item, and academic card).
  - Tracked in the header HUD (`X/8 NODES`). Finding all 8 unlocks a celebratory engineering dialog.

---

## 3. How to Customize

- **Contact & Links**:
  - Update email in `index.html`: search for `jeyeshjv32@gmail.com`.
  - Update phone in `index.html`: search for `+91 8428430032`.
  - Replace the `TODO` placeholders in the contact section with your actual GitHub and LinkedIn URLs:
    ```html
    <a href="https://github.com/your-username" class="cell-link" target="_blank" rel="noopener">GitHub</a>
    <a href="https://linkedin.com/in/your-username" class="cell-link" target="_blank" rel="noopener">LinkedIn</a>
    ```

- **Projects & Highlights**:
  - Edit project cards inside `<section class="section section-work" id="work">` in `index.html`.
  - Adjust timing or intro steps in `STAGES_DATA` within `main.js`.
