# ThunderStorm — Feature Map & Codebase Audit

This document provides a comprehensive audit of the **ThunderStorm** repository. It outlines the structural layout of the codebase, lists the responsibilities of each module, and details the technical implementation of all features currently present in the system.

---

## Codebase Directory Structure & Responsibilities

The codebase follows a modular architecture separating presentation (React + Tailwind CSS), animation pipelines (GSAP + Framer Motion), state management (Zustand stores), and algorithmic solvers (JavaScript generators).

```
thunderstorm/
├── app/                          # Page Routing & Entrypoints (Next.js App Router)
├── components/                   # Presentation & UI Components
│   ├── code/                     # Syntax highlighting & line sync panels
│   ├── controls/                 # Playback, scrubber, and parameter sliders
│   ├── educational/              # Academic tabs & explanations
│   ├── layout/                   # Navbar, Sidebar, and common grid dividers
│   └── visualizers/              # Renderers (HTML Canvas, SVGs, CSS grids)
├── lib/                          # Business Logic & Core Solvers
│   ├── algorithms/               # DSA Step generators (function*)
│   ├── animations/               # GSAP tween pipelines
│   ├── codeVisualizer/           # Custom user-code interpreter & sandbox simulator
│   ├── hooks/                    # Reusable React state hooks
│   └── snippets/                 # Predefined multi-language source templates
├── store/                        # Zustand Global State Managers
├── types/                        # TypeScript Interfaces & Types
└── public/                       # Manifest files, service workers, and app assets
```

---

## 1. Directory Audit

### `/app`
Next.js App Router root containing page layouts, global style sheets, and individual page view entrypoints.
* **`layout.tsx`**: Defines the global HTML wrapping, viewport tags, metadata headers, and sets up fonts (Geist Sans & Geist Mono).
* **`template.tsx`**: Injects page transition wrappers using Framer Motion to animate page routing dynamically.
* **`globals.css`**: Configures Tailwind directive extensions, keyframe variables, code editor glow states, custom scrollbars, and PWA focus states.
* **`page.tsx`**: The homepage dashboard featuring the storm landing hero, feature overview tiles, and navigation hooks.
* **`code-visualizer/page.tsx`**: The main page view for the custom user-code analysis, sandbox simulator, and synchronization canvas.
* **`sorting/`, `graphs/`, `pathfinding/`, `dp/`, `greedy/`, `trees/`, `compare/`**: Individual route pages that render visualizer canvases.

### `/components`
Re-usable visual components divided by technical layer.
* **`PWARegister.tsx`**: A client-side hook component that registers the offline service worker when the page boots.
* **`/components/visualizers`**: The core rendering engine of the project.
  * **`SortingCanvas.tsx`**: Uses double-buffered HTML Canvas redrawing to render array elements. Avoids DOM overhead, supporting up to 150 elements at 60 FPS.
  * **`GraphCanvas.tsx`**: Renders node-link models using SVGs. Includes mouse event handlers for creating, editing, and dragging nodes and connections.
  * **`GridCanvas.tsx`**: A clickable 2D grid used for pathfinding algorithms (Dijkstra, A*). Supports wall painting and dragging start/end points.
  * **`DPTable.tsx`**: Renders 2D dynamic tables for tabulation matrices. Highlights subproblem lookup cells and back-pointer dependencies.
  * **`TreeCanvas.tsx`**: Specialized SVG tree renderer supporting Binary Search Trees, AVL balance balancing, and Heap binary trees.
  * **`GreedyCanvas.tsx`**: Renders timeline intervals for Activity Selection and Huffman coding trees.
  * **`DPDependencyGrid.tsx`**: Visualizes state dependency vectors in 1D/2D arrays.
  * **`CallStackTreeVisualizer.tsx`**: Renders recursive call stacks as a tree hierarchy in real-time.
  * **`CompareCanvas.tsx`**: Splitted layout rendering two sorting arrays simultaneously on shared state.
  * **`ThunderBurst.tsx`**: A GSAP stagger particle burst playing at the end of an algorithm run.
  * **`GenericArrayVisualizer.tsx`, `GenericGraphVisualizer.tsx`, `GenericTreeVisualizer.tsx`**: Dynamic fallback renderers used by the code visualizer to display simulation traces of custom user code.
* **`/components/controls`**:
  * **`PlayPauseButton.tsx`**, `SpeedSlider.tsx`, `ArraySizeInput.tsx`: Playback adjustments.
  * **`TimelineScrubber.tsx`**: Drag-and-drop step scrubber.
  * **`MetricsPanel.tsx`**: Stat boxes (Comparisons, Swaps, Nodes Visited, Execution Time, Heap Memory).
* **`/components/code`**:
  * **`CodePanel.tsx`**: Renders source files using `react-syntax-highlighter` and applies styling classes to active executing lines.
  * **`LanguageSelector.tsx`**: Language selectors (Java, Python, C++, Javascript).
* **`/components/educational`**:
  * **`AlgorithmExplanation.tsx`**: Tabbed panels showing Intuition, How it Works, and Use Cases.

### `/lib`
The core business logic layer.
* **`/lib/algorithms`**: Holds step generator functions (`function*`).
  * **`/sorting`**: Bubble Sort, Merge Sort, Quick Sort, Heap Sort.
  * **`/graphs`**: Breadth-First Search, Depth-First Search.
  * **`/pathfinding`**: Dijkstra's Solver, A* Search Solver.
  * **`/trees`**: BST Insertion/Deletion, AVL insertion rotations, Min/Max Heap Heapify.
  * **`/dp`**: Fibonacci Series, 0/1 Knapsack, Longest Common Subsequence.
  * **`/greedy`**: Activity Selection Scheduler, Huffman encoder.
  * **`metadata.ts`**: Static computational characteristics (Time/Space complexities, Stability, In-place behavior).
* **`/lib/animations`**: GSAP timeline configurations.
  * **`swapAnimation.ts`**: Handles electric bar swaps with elastic easing.
  * **`nodeAnimation.ts`**: Controls graph node visit pulses and link flashes.
* **`/lib/codeVisualizer`**: The custom user-code analysis engine.
  * **`analysis.ts`**: Code preprocessor (strips comments), language detector (heuristic regex patterns), and structures parser.
  * **`classifier.ts`**: Classifies code snippets into DSA visual categories based on syntax characteristics.
  * **`simulator.ts`**: Simulates the execution of user-written algorithms, outputs traces, and tracks reads, writes, and comparisons.
  * **`lineMapper.ts`**: Maps execution states to line numbers in the user code.
  * **`timeline.ts`**: Manages step buffers for custom simulated traces.
* **`/lib/snippets`**: Built-in source templates loaded by default when selecting an algorithm.

### `/store`
Zustand stores that manage the application state.
* **`visualizerStore.ts`**: Controls default arrays, speed, array size, current step index, playing states, and timeline steps.
* **`graphStore.ts`**: Manages node positions, graph weights, adjacencies, traversal queues, and solvers.
* **`pathfindingStore.ts`**: Manages grid states, start/target nodes, walls, and search logs.
* **`treeStore.ts`**: Tracks binary search trees, node layout coordinates, and active balance factors.
* **`dpStore.ts`**: Stores dynamic programming grids, knapsack item weights, capacity metrics, and matrices.
* **`greedyStore.ts`**: Manages schedule durations and Huffman tree creation frequencies.
* **`compareStore.ts`**: Handles side-by-side run clocks, comparator configs, and battle results.
* **`codeVisualizerStore.ts`**: Holds the custom user-code input, detected language, intermediate representations, and simulated traces.

---

## 2. Feature Map Audit

### A. Playback & Engine Control
* **Timeline Scrubber**: Precomputes steps using generator functions, allowing users to scrub back and forth to examine complex loops.
* **Variable Speed**: Tracks speed factors from `0.1x` (for slow, line-by-line inspection) up to `5x` (for fast completion runs).
* **Synchronized Clocks**: Supports play, pause, step forward, and step backward operations.

### B. High-Performance Renderers
* **Double-Buffered Canvas**: Sorting visualizer drawing cycle operates on an offscreen buffer before displaying changes, preventing screen flicker during high-frequency array rendering.
* **Interactive SVG Graph Engine**: Renders graphs as XML elements, enabling click-to-add nodes, node drag-and-drop, path calculations, and node weights.
* **Dynamic CSS Grid Table**: Renders 2D DP grids using CSS grids, supporting real-time updates and back-pointers.

### C. synchronized Code Sync Panel
* **Language Switcher**: Switch between Java, Python, C++, and JavaScript code styles mid-execution.
* **Syntax Highlighter**: Integrates `react-syntax-highlighter` to highlight the currently executing line based on step data.

### D. Comparison & Battle Modes
* **Comparison Mode**: Runs two selected algorithms side-by-side on identical input data.
* **Battle Mode**: Races two algorithms on a shared dataset, comparing time, comparison count, and swaps to declare a winner with a particle burst animation.

### E. User-Code Visualizer & Sandbox Simulator
* **Language Heuristic Detector**: Automatically detects the programming language of pasted code snippets using keyword matching.
* **Structural Classifier**: Classifies custom code into algorithm categories (Sorting, Graphs, Trees, DP) based on syntax analysis.
* **Simulation Sandbox**: Tracks variable modifications and reads to simulate execution, generating visualization traces from user code.
* **Line Mapping Sync**: Synchronizes the simulated execution state with line highlights in the user's code editor.

### F. Progressive Web App (PWA)
* **Offline Caching**: Uses service workers via `next-pwa` to cache core assets, allowing offline access.
* **App Installation**: Provides metadata and icons to make the app installable on desktop and mobile home screens.

### G. Performance & Accessibility
* **Lighthouse Standards**: Designed to maintain high Performance, Accessibility, Best Practices, and SEO scores.
* **Keyboard Shortcuts**: Spacebar toggles playback, arrow keys control steps and speed, and `Ctrl+K` launches command search.
* **Reduced Motion Compliance**: Detects system preferences (`prefers-reduced-motion: reduce`) and disables animations when active.
