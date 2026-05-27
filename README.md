# 🚀 ABC Corp: Enterprise Context Engineering Sandbox

A high-performance, visually stunning interactive presentation platform and grounding simulator designed for delivering technical talks on **Context Engineering** and Large Language Model (LLM) system architectures.

Built using **React 19**, **Vite 8**, **Lucide Icons**, and custom **Vanilla CSS** obsidian glow layout.

---

## 🌟 Visual Preview & Aesthetics
*   **Obsidian Dark Mode**: Curated deep-toned color palettes with floating radial neon backdrops.
*   **Performance-Optimized Token Grid**: A 576-cell token mapping canvas memoized using React `useMemo` to eliminate rendering lag during live playground inputs.
*   **Attention Map Overlay**: Dynamic color layers visually demonstrating attention recall drops (the "Lost in the Middle" phenomenon) with interactive cell hovering.
*   **Grounded Streaming Terminal**: Replaces generic console outputs with word-by-word streaming, safe citation bubbles (`[Source: operations-runbook.md]`), and styled parameters.
*   **Fullscreen Presenter Mode**: Click any slide or press F11 to launch a high-scale projection view readable from the back of a large auditorium.

---

## 📂 Project Architecture

The application is decomposed into clean, modular components:

```
src/
├── main.jsx              # Application mount point
├── App.jsx               # High-level state orchestrator and keyboard nav controller
├── index.css             # Unified obsidian glow design system & micro-animations
├── data/
│   ├── presets.js        # Configured slide-sandbox simulation presets (None, Messy, Ops, Auth)
│   └── vectorDocs.js     # Mock enterprise vector database (similarity scoring indexes)
└── components/
    ├── Header.jsx        # Navigation toolbar and view state toggles
    ├── SlidesDeck.jsx    # Smoothly-transitioning speaker slides and presenter overlay
    ├── Playground.jsx    # Central orchestration cockpit for grounding controls
    ├── TokenGrid.jsx     # Memoized visual token layout and type legend
    ├── VectorSearch.jsx  # Interactive search bar simulating embedding lookups
    ├── StreamingTerminal.jsx # Secure terminal renderer with streaming controls & stop utility
    └── Tooltip.jsx       # Clamped absolute coordinate details hovercard
```

---

## ⚡ Quick Start

### 1. Requirements
Ensure you have **Node.js** (v18+) installed.

### 2. Installation
Install project dependencies:
```bash
npm install
```

### 3. Launch Development Server
To launch a live local hot-reloading development server:
```bash
npm run dev
```
Open your browser and navigate to:  
🌐 **`http://localhost:5173/`**

### 4. Build Production Bundle
To compile and optimize the assets for production deployment:
```bash
npm run build
```
The optimized bundle will be generated under the `dist/` directory.

---

## 🎤 Tech Talk Speaker Script

For a complete step-by-step speaker guide on how to deliver a flawless, high-impact talk using this app, please refer to the dedicated speaker manual:  
📄 **[Playground Speaker Script Guide](file:///C:/Users/Kash%20Moulik/.gemini/antigravity/brain/18704ee7-37e3-4568-a4fa-6d5f4369e5a9/playground_speaker_script.md)**

### Key Presentation Acts:
1.  **Act 1 (Slides 1 & 2)**: *Prompt Only* - Ask a private corporate query and watch the model politely refuse.
2.  **Act 2 (Slide 3)**: *RAG Vector Injection* - Query the vector database, inject matching XML documents, and watch the model deliver perfect, cited, grounded answers.
3.  **Act 3 (Slide 4)**: *Lost in the Middle* - Dump a messy log scrape and see how important commands get ignored in the attention valley.
4.  **Act 4 (Slide 5)**: *Prompt Caching* - Enable prefix caching and observe a 90% latency and cost reduction in real-time.
5.  **Act 5 (Slide 6)**: *The Context Playbook* - Summarize the golden rules of context formatting with interactive code compare diffs.
