# ThunderStorm — Algorithm Visualizer
## Unified Project Specification (v2)

---

## 1. OVERVIEW

A portfolio-grade web app that visualizes sorting, graph, pathfinding, tree, DP,
and greedy algorithms step-by-step, with GSAP-powered animations, multi-language
code panels synchronized to execution, and live performance metrics.

Installable as a PWA. Designed to demonstrate DSA depth, frontend engineering
maturity, and educational platform design.

---

## 2. TECH STACK

| Layer               | Choice                    | Why                                                              |
| ------------------- | ------------------------- | ---------------------------------------------------------------- |
| Framework           | Next.js 14 (App Router)   | Per-route code splitting, SSR-capable, zero-config Vercel deploy |
| Language            | TypeScript                | Type safety across algorithm step data and snippets              |
| UI Animation        | Framer Motion             | Page/control transitions                                         |
| Algorithm Animation | GSAP                      | Timeline control, elastic/bounce easing for swaps & node pulses  |
| State               | Zustand                   | Lightweight, no boilerplate, perfect for step playback state     |
| Graph Rendering     | SVG                       | Few elements, need individual interactivity                      |
| Sorting Rendering   | Canvas                    | Many elements, redrawn frequently — avoids DOM overhead          |
| Syntax Highlighting | react-syntax-highlighter  | Code panel with line-level glow, dark theme, auto-scroll         |
| PWA                 | next-pwa                  | Service worker + manifest, installable                           |
| Styling             | Tailwind CSS              | Matches existing portfolio workflow                              |

---

## 3. FOLDER STRUCTURE

```
thunderstorm/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                    # Landing/home
│   ├── sorting/page.tsx
│   ├── graphs/page.tsx
│   ├── pathfinding/page.tsx
│   ├── dp/page.tsx
│   ├── greedy/page.tsx
│   ├── trees/page.tsx              # Phase 2
│   └── compare/page.tsx            # Phase 4
│
├── components/
│   ├── visualizers/
│   │   ├── SortingCanvas.tsx
│   │   ├── GraphCanvas.tsx
│   │   ├── GridCanvas.tsx          # Dijkstra / A*
│   │   ├── DPTable.tsx
│   │   └── TreeCanvas.tsx          # Phase 2
│   ├── controls/
│   │   ├── SpeedSlider.tsx
│   │   ├── PlayPauseButton.tsx
│   │   ├── AlgorithmSelector.tsx
│   │   ├── ArraySizeInput.tsx
│   │   ├── MetricsPanel.tsx
│   │   └── TimelineScrubber.tsx    # Phase 1
│   ├── code/                       # Phase 1
│   │   ├── CodePanel.tsx
│   │   ├── LanguageSelector.tsx
│   │   └── LineHighlighter.tsx
│   ├── educational/                # Phase 3
│   │   └── AlgorithmExplanation.tsx
│   ├── charts/                     # Phase 3
│   │   └── ComplexityChart.tsx
│   └── layout/
│       ├── Navbar.tsx
│       └── ComplexityBadge.tsx
│
├── lib/
│   ├── algorithms/
│   │   ├── sorting/
│   │   │   ├── bubbleSort.ts
│   │   │   ├── mergeSort.ts
│   │   │   ├── quickSort.ts
│   │   │   └── heapSort.ts
│   │   ├── graphs/
│   │   │   ├── bfs.ts
│   │   │   ├── dfs.ts
│   │   │   ├── dijkstra.ts
│   │   │   └── astar.ts
│   │   ├── trees/                  # Phase 2
│   │   │   ├── bstInsert.ts
│   │   │   ├── bstDelete.ts
│   │   │   ├── avlInsert.ts
│   │   │   └── heapOperations.ts
│   │   ├── dp/
│   │   │   ├── fibonacci.ts
│   │   │   ├── knapsack.ts
│   │   │   └── lcs.ts
│   │   ├── greedy/
│   │   │   ├── activitySelection.ts
│   │   │   └── huffman.ts
│   │   └── metadata.ts             # Complexity info per algorithm
│   ├── generators/
│   │   ├── stepGenerator.ts
│   │   └── runWithMetrics.ts       # Timing + comparisons + swaps
│   ├── animations/
│   │   ├── swapAnimation.ts        # GSAP: bar swap
│   │   └── nodeAnimation.ts        # GSAP: node pulse
│   └── snippets/                   # Phase 1
│       ├── sorting/
│       │   ├── bubble/             # java.ts · python.ts · cpp.ts · javascript.ts
│       │   ├── merge/
│       │   ├── quick/
│       │   └── heap/
│       ├── graphs/
│       ├── pathfinding/
│       ├── trees/
│       ├── dp/
│       └── greedy/
│
├── store/
│   └── visualizerStore.ts          # Zustand store
│
├── public/
│   ├── manifest.json
│   └── icons/
│
└── types/
    └── algorithm.types.ts
```

---

## 4. CORE ARCHITECTURE: GENERATOR-BASED STEP RECORDING

**Problem with the naive approach:** hardcoding `setTimeout` delays inside the
algorithm itself mixes logic with UI — no pause, no rewind, no reuse.

**Solution:** every algorithm is a generator function that yields pure data
("steps"). The UI consumes these steps independently, at any speed, in any
direction. Each step also carries a `line` field so the code panel can
highlight the currently executing line.

```ts
export function* bubbleSort(arr: number[]): Generator<SortStep> {
  const array = [...arr];
  for (let i = 0; i < array.length - 1; i++) {
    for (let j = 0; j < array.length - i - 1; j++) {
      yield { array: [...array], comparing: [j, j + 1], swapped: false, line: 3 };
      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        yield { array: [...array], comparing: [j, j + 1], swapped: true, line: 4 };
      }
    }
  }
}
```

**What this unlocks for free:**
- Play / Pause / Step Forward / Step Back / Timeline Scrub
- Comparison Mode (two generators, one dataset)
- Battle Mode (race two generators)
- Code panel line sync (just reads `step.line`)

GSAP only *reacts* to step changes via `useEffect` — animation logic stays
fully decoupled from algorithm logic.

---

## 5. METRICS SYSTEM

### A. Time & Space Complexity — Static metadata

Stored in `lib/algorithms/metadata.ts`:

```ts
bubbleSort: {
  timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
  spaceComplexity: 'O(1)'
}
```

### B. Execution Time — Real, measured via `performance.now()`

```ts
const start = performance.now();
for (const step of generator) { steps.push(step); }
const executionTimeMs = performance.now() - start;
```

Comparisons and swaps tracked as real counters during step collection.

### C. Memory — Labeled honestly

- `performance.memory.usedJSHeapSize` exists **only in Chrome**, measures the
  whole JS heap, not the algorithm specifically. Non-standard.
- Show theoretical Space Complexity (always accurate) **and** the Chrome heap
  reading clearly labeled as "approx, Chrome only" — never claim it's
  algorithm-specific measured memory.

### Metrics Panel Layout

```
┌─────────────────────────────────────┐
│  Bubble Sort                         │
│  Time:  O(n) best · O(n²) worst      │
│  Space: O(1)                         │
│  ⏱  Execution: 4.2ms                │
│  🔄 Comparisons: 45                  │
│  🔀 Swaps: 23                        │
│  📊 Heap (Chrome, approx): 11.8 MB   │
└─────────────────────────────────────┘
```

Numbers count up via:
```ts
gsap.to(target, { innerText: value, snap: 'innerText' })
```

---

## 6. ANIMATION SYSTEM

**Division of responsibility — never let two libraries fight over one node:**

| Library       | Owns                                                   |
| ------------- | ------------------------------------------------------ |
| Framer Motion | React UI transitions (panels, buttons, page routes)    |
| GSAP          | Algorithm animations (swaps, node pulses, path draws)  |

### Bar Swap (lightning flash + elastic snap)

```ts
gsap.timeline()
  .to([barI, barJ], { backgroundColor: '#facc15', duration: 0.15 })
  .to(barI, { x: deltaX, duration: 0.3, ease: 'elastic.out(1, 0.6)' }, '<')
  .to(barJ, { x: deltaY, duration: 0.3, ease: 'elastic.out(1, 0.6)' }, '<')
  .to([barI, barJ], { backgroundColor: '#1e293b', duration: 0.2 });
```

### Node Visit Pulse (graphs / trees)

```ts
gsap.timeline()
  .to(nodeEl, { scale: 1.4, fill: '#a78bfa', duration: 0.2, ease: 'power3.out' })
  .to(nodeEl, { scale: 1, duration: 0.3, ease: 'bounce.out' });
```

### Storm Completion Burst

Play a radial burst animation from the last active element when an algorithm
finishes. Use GSAP `stagger` on surrounding particles with a short `scale`
→ `opacity 0` sequence. Keep it under 600ms so it doesn't feel slow.

---

## 7. DESIGN SYSTEM

### 7.1 Storm Design Tokens

| Purpose          | Token Name        | Color     |
| ---------------- | ----------------- | --------- |
| Comparison       | `--color-compare` | `#3B82F6` |
| Swap             | `--color-swap`    | `#FACC15` |
| Traversal        | `--color-traverse`| `#A78BFA` |
| Success / Path   | `--color-success` | `#22C55E` |
| Error            | `--color-error`   | `#EF4444` |
| Active Code Line | `--color-code`    | `#60A5FA` |

Background: dark navy/charcoal (`#0f172a` / `#1e293b`).
Font (monospace): Geist Mono.

### 7.2 ThunderStorm Visual Language

| Event       | Effect                     |
| ----------- | -------------------------- |
| Comparison  | Electric blue pulse        |
| Swap        | Lightning yellow flash     |
| Traversal   | Storm violet ripple        |
| Path found  | Green energy trail         |
| Completion  | Thunder burst animation    |
| Tree rotate | Lightning flash on arc     |

### 7.3 Design Governance Rules

**The visualization is the hero. Never sacrifice readability for effects.**

Glass/blur effects are **NOT** allowed on:
- Sorting bars
- Graph nodes
- Tree nodes
- DP cells
- Grid/pathfinding tiles

Glass is allowed **only** on:
- Command palette
- Floating HUD
- Settings modal
- Overlay panels

Visualization rules:
- High contrast at all times
- Performance first — drop ambient effects if they hurt FPS
- Minimal visual noise
- Consistent color semantics across all algorithm types
- Every animation must communicate state, not just look good

---

## 8. MULTI-LANGUAGE CODE PANEL

The code panel stays synchronized with algorithm execution and highlights the
currently executing line in real time.

### Supported Languages (V1)
Java · Python · C++ · JavaScript

Future: TypeScript · C# · Go · Rust

### Step-to-Line Mapping

Each generator step carries a `line` number:

```ts
yield {
  array: [...array],
  comparing: [j, j + 1],
  swapped: false,
  line: 3              // highlights line 3 in the code panel
}
```

### Layout

```
┌─────────────────────┬──────────────────────┐
│                     │ [ Java ] [ Python ]   │
│  Visualization      │ [ C++ ] [ JS ]        │
│                     │                       │
│  ███████            │  1  for(int i=0; ...) │
│  █████              │  2    for(int j=0;...) │
│  ███                │▶ 3    if(arr[j] > ...) │  ← active line glow
│                     │  4      swap(...)      │
└─────────────────────┴──────────────────────┘
```

Desktop: split view. Mobile: tab switching between Visualization and Code.

### Active Line Styling

```css
border-left: 3px solid var(--color-code);
background: rgba(59, 130, 246, 0.12);
```

Code panel reacts to Play / Pause / Step / Timeline Scrub simultaneously
with the visualization — same step index drives both.

### V2 Upgrade (Post-Launch)

Add a Pseudocode tab alongside language tabs, for beginners who want
language-agnostic understanding first.

---

## 9. TIMELINE SCRUBBER

Since all steps are precomputed into an array, timeline scrubbing is nearly free.

```
◀  ⏸  ▶

━━━━━━━━━━━━━━━━━━━━━━━●──────
Step 243 / 512  (47%)
```

**Styling:**
- Track: 6px height, `border-strong` color
- Progress fill: electric blue (`--color-compare`)
- Handle: 16px circle with glow shadow
- Drag state: scale 1.15 + lightning glow

---

## 10. COMPARISON & BATTLE MODES

### Comparison Mode (`/compare`)

Run two algorithms on the **identical** input dataset simultaneously.

```
┌────────────────┬────────────────┐
│  Bubble Sort   │  Quick Sort    │
│  ███████       │  ███████       │
│  █████         │  ███           │
│  ███           │  █             │
│                │                │
│  Comparisons:  │  Comparisons:  │
│  4,950         │  673           │
│  Swaps: 2,412  │  Swaps: 412    │
└────────────────┴────────────────┘
```

Each side has its own: Visualizer · Metrics · Code Panel · Controls.
Both run from the same step clock (shared Play/Pause).

### Battle Mode

Extends Comparison Mode into a race. Winner determined by lowest score across:
- Execution time
- Comparisons
- Swaps / nodes visited

```
🏆 Merge Sort Wins

Execution:   Bubble 4.2ms  →  Merge 0.9ms
Comparisons: Bubble 4,950  →  Merge 756
```

Winner revealed with a Thunder Burst animation on the winning panel.

---

## 11. TREE VISUALIZATIONS (`/trees`)

### Supported Algorithms

**Binary Search Tree:** Insert · Search · Delete

**AVL Tree:** LL Rotation · RR Rotation · LR Rotation · RL Rotation

**Heap:** Insert · Extract Max · Extract Min · Heapify

### Styling

- Nodes: surface elevated, `border-strong`, shadow brutal
- Visited: Storm Violet (`--color-traverse`)
- Root: blue glow (`--color-compare`)
- Rotation arcs: lightning flash animation (`--color-swap`)

All tree algorithms follow the same generator + step architecture as sorting.

---

## 12. EDUCATIONAL EXPLANATION PANEL

Displayed alongside the visualizer for each algorithm.

**Contains:**
- Intuition
- Working Principle
- Time Complexity (links to static metadata)
- Space Complexity
- Advantages & Disadvantages
- Real-World Applications

Example (Bubble Sort):

```
Bubble Sort repeatedly compares adjacent elements
and swaps them when they are in the wrong order.
Larger values gradually move toward the end of
the array with each pass.

Real-world use: rarely used in production; valuable
as a teaching tool and for nearly-sorted datasets.
```

---

## 13. COMPLEXITY VISUALIZATION (`ComplexityChart`)

Animated chart comparing growth rates as input size *n* increases:

```
      ↑
 ops  │         O(n²)
      │        /
      │      O(n log n)
      │    O(n)
      │  O(log n)
      │ O(1)
      └──────────────→ n
```

Built with a lightweight Canvas or SVG renderer (no heavy chart library needed).
Animate the curves growing left-to-right when the component mounts.

---

## 14. SHAREABLE RUN URLS

URL state encoding for specific visualizations:

```
/sorting?algo=quick&size=100&speed=2
/compare?a=bubble&b=merge&size=80
/pathfinding?algo=astar&grid=preset-maze
```

Implemented via Next.js `useSearchParams`. On mount, read params and
pre-configure the store. Share button copies the current URL to clipboard.

---

## 15. DEPENDENCIES

```bash
# Core
npm install next@latest react@latest typescript zustand gsap framer-motion

# Code panel
npm install react-syntax-highlighter
npm install --save-dev @types/react-syntax-highlighter

# Styling
npm install -D tailwindcss postcss autoprefixer

# PWA
npm install next-pwa
```

---

## 16. BUILD PHASES

---

### PHASE 1 — Engine · Sorting · Code Panel · Timeline (Week 1)

**Goal: nail the core engine — every later phase reuses it.**

- [ ] Next.js 14 + TypeScript + Tailwind scaffold
- [ ] Zustand store: `steps`, `currentStepIndex`, `isPlaying`, `speed`, `language`
- [ ] Generator pattern with `line` field: Bubble, Merge, Quick, Heap Sort
- [ ] SortingCanvas (Canvas-based) wired to store
- [ ] Controls: Play/Pause · Step Forward/Back · Speed Slider · Array Size Input
- [ ] **TimelineScrubber** — drag to any step, instant jump, step counter
- [ ] GSAP swap animation (lightning flash + elastic snap)
- [ ] Metrics Panel: complexity (static) + real execution time + comparisons/swaps
- [ ] **Multi-Language Code Panel** — Java, Python, C++, JavaScript; highlights `step.line`
- [ ] Storm design tokens applied (colors, fonts)
- [ ] Basic storm theme on hero background

**Deliverable:** fully playable sorting visualizer with synced code panel and
timeline scrubber.

---

### PHASE 2 — Graphs · Pathfinding · Trees (Week 2)

- [ ] GraphCanvas (SVG): BFS, DFS generators + visualization
- [ ] GridCanvas: Dijkstra, A* with clickable grid (walls / start / end)
- [ ] GSAP node-pulse animation (graph + tree reuse same animation)
- [ ] Extend Metrics Panel: nodes visited, path length
- [ ] Code panel snippets for all graph/pathfinding algorithms
- [ ] **TreeCanvas** (SVG): BST Insert/Search/Delete, AVL Rotations, Heap operations
- [ ] Tree node styling per design tokens (visited violet, root blue glow, rotation flash)
- [ ] Code panel snippets for tree algorithms
- [ ] Storm violet ripple on traversal, green trail on path found

**Deliverable:** graphs, pathfinding grid, and tree visualizer — all with
synced code panels and metrics.

---

### PHASE 3 — DP · Greedy · Educational Features (Week 3)

- [ ] DPTable component: 2D grid for Knapsack, LCS, Fibonacci
- [ ] Greedy visualizers: Activity Selection, Huffman Coding
- [ ] Step generators for all DP and greedy algorithms (same playback machinery)
- [ ] Code panel snippets for DP and greedy
- [ ] **AlgorithmExplanation panel**: intuition, principles, pros/cons, real-world use
- [ ] **ComplexityChart**: animated O(1) → O(n²) growth visualization
- [ ] Educational panel wired to algorithm selector (swaps content per selection)

**Deliverable:** DP and greedy visualizers with educational context panels
and complexity charts.

---

### PHASE 4 — Advanced Modes · Shareable URLs (Week 4)

- [ ] `/compare` route: side-by-side comparison of two algorithms on shared data
- [ ] Shared Play/Pause clock across both panels
- [ ] Metrics comparison table (comparisons, swaps, execution time)
- [ ] **Battle Mode**: winner declaration with Thunder Burst animation
- [ ] **Shareable URLs**: `useSearchParams` encoding for algo, size, speed, grid preset
- [ ] Share button copies URL to clipboard
- [ ] Deep-link support (on mount, restore store state from URL params)

**Deliverable:** comparison mode, battle mode, and shareable visualization links.

---

### PHASE 5 — Polish · PWA · Deploy (Week 5)

- [ ] `next-pwa` setup: `manifest.json`, icons, offline caching strategy
- [ ] Framer Motion page transitions (route-level)
- [ ] Memory metrics with honest Chrome-only labeling
- [ ] GSAP number count-up on metrics panel after run completes
- [ ] Thunder Burst completion animation on all visualizers
- [ ] Responsive design pass: mobile tab switching for code panel,
      touch-friendly grid interactions
- [ ] Ambient storm effects on hero (slow cloud drift, occasional lightning flash) —
      skip or reduce if FPS impact detected
- [ ] Performance audit (Lighthouse PWA + Performance scores)
- [ ] Deploy to Vercel (zero-config for Next.js)
- [ ] README + GitHub polish (demo GIF, feature list, tech stack badges)

**Deliverable:** production-ready, installable PWA deployed to Vercel.

---

## 17. KEY PRINCIPLES

1. **Algorithm logic never touches animation code.** Generators yield pure data;
   GSAP only reacts to step changes via `useEffect`.

2. **GSAP and Framer Motion own different layers.** Never apply both to the
   same DOM node.

3. **Memory metrics must always be labeled honestly.** "approx, Chrome only" —
   never claim algorithm-specific heap measurement.

4. **The `line` field is the single bridge between algorithm and code panel.**
   Every generator step carries it; no other coupling is needed.

5. **Build Phase 1's engine well.** Phases 2–4 are mostly "new algorithm +
   reuse existing playback/metrics/code-panel machinery."

6. **The visualization is the hero.** Drop ambient effects before sacrificing
   readability or frame rate.

---

## 18. FINAL PRODUCT VISION

ThunderStorm is not just an algorithm visualizer.

It is a premium educational platform combining:

- Interactive DSA visualization across 6 algorithm categories
- Multi-language code panel synchronized to execution
- Real-time performance metrics (honest about what is and isn't measurable)
- Advanced playback: timeline scrubber, step-by-step, variable speed
- Comparison and battle modes for algorithm trade-off analysis
- Educational explanation panels and complexity growth charts
- Shareable URLs for portfolio demos and classroom sharing
- Storm-themed visual identity reinforced through every interaction

Designed to showcase algorithmic understanding and frontend engineering
excellence in a single deployable artifact.
