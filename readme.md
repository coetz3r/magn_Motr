# 3D viewer Engine

<p align="center">
  <img src="assets/3D-viewer.png" alt="3D viewer Logo" width="380" />
</p>

<p align="center">
  <a href="https://coetz3r.github.io/portfolio" target="_blank"><strong>🚀 Live Interactive Demo</strong></a>
</p>

[![Interactive 3D model viewport screenshot](assets/screenshot.png)](https://github.com/coetz3r/3D-viewer)

A lightweight, zero-build, plug-and-play 3D WebGL model viewer built with Three.js ES Modules. Download, customize, and use it to bring interactive 3D models to your own web projects.

**Repository:** https://github.com/coetz3r/3D-viewer

---

## Overview

**3D viewer** is a lightweight, zero-build starter template for adding interactive 3D models to websites using Three.js ES Modules.

Download the repository, replace the example model, and customize the controls, styling, and interactions to create your own 3D product viewer, mechanical demonstration, engineering model, educational visualization, or interactive presentation.

No npm, bundler, build process, or framework is required. The viewer runs directly in the browser using native ES Modules and Import Maps.

The included Magna'Motr model is a demonstration of what the viewer can do. It can be replaced with your own `.glb` or `.gltf` model.

---

## What's Included

- Interactive 3D model viewer
- GLB/GLTF model loading
- Orbit, pan, and zoom camera controls
- Automatic model centering and scaling
- Configurable mesh transparency
- Optional mechanical motion / kinematics
- Responsive WebGL canvas
- Lightweight loading indicator
- Plain HTML, CSS, and JavaScript
- Three.js loaded through ES Modules
- No build tools or package installation required

---

## Features

- **Plug-and-Play Mesh Loading**: Automatically centers and scales any `.glb` or `.gltf` 3D model within the camera viewport.
- **Automated Shell Transparency**: Scans component names and dynamically applies semi-transparent physical materials to outer casings or frames.
- **Customizable Kinematics Engine**: Built-in math routines linking rotational motion to linear translation (e.g., swashplate to axial piston displacement).
- **Minimalist Blue Progress Indicator**: Lightweight, zero-dependency loading bar with visual glow feedback.
- **Zero-Build Architecture**: Runs natively in all modern web browsers using ES Modules.
- **Responsive WebGL Canvas**: Auto-resizes smoothly across screen resolutions.

---

## Interactive Controls

| Input / Gesture | Action |
| :--- | :--- |
| **Left Click + Drag** | Orbit / rotate camera around the model center |
| **Right Click + Drag** | Pan camera position across the viewport plane |
| **Ctrl + Right Click + Drag** | Fine-tuned vertical and lateral camera adjustment |
| **Scroll Wheel** | Zoom camera in / out relative to focal target |

---

## Technologies

- HTML5 & CSS3
- JavaScript (ES6+ Modules)
- Three.js (r160+ via ES Import Maps)
- WebGL
- Git / GitHub

---

## Customization & Tweaking Guide

The viewer is designed to be adapted to your own project. The Magna'Motr files are provided as the working example; you can replace the model and adjust the viewer without rebuilding the application.

All configuration options live inside `js/3D-viewer.js`.

### 1. Swapping the 3D Model File
Place your exported `.glb` file into `assets/` and update the file path in `js/3D-viewer.js`:

```javascript
const modelPath = (typeof viewerData !== "undefined" && viewerData.modelUrl)
  ? viewerData.modelUrl
  : "assets/your_model.glb";
```

### 2. Auto-Transparency Keywords & Opacity
Set keywords to match your CAD or Blender mesh names so the engine knows which outer housings to make transparent:

```javascript
const outerHousingTerms = ["frame", "block", "carrier", "output", "housing", "casing", "cover"];

// Modify opacity inside loader loop (0.0 = fully clear, 1.0 = solid)
mat.transparent = true;
mat.opacity = 0.35;
```

### 3. Camera Perspective (FOV)
Adjust wide-angle depth distortion versus a flatter, CAD-style isometric view in Section 1:

```javascript
// Lower value (e.g. 35 - 45) = Flatter CAD look
// Higher value (e.g. 65 - 75) = Stronger depth perspective
const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
```

### 4. Customizing Progress Bar Colors
Tweak the loading bar color scheme to match your branding:

```javascript
progressBarFill.style.background = "#0088ff";           // Main color
progressBarFill.style.boxShadow  = "0 0 8px #0088ff";   // Glow radius & color
```

---

## Quick Start

1. Download or clone this repository.
2. Replace `assets/3D-viewer.glb` with your own `.glb` or `.gltf` model.
3. Update the model path in `js/3D-viewer.js` if necessary.
4. Adjust the viewer settings to match your model.
5. Serve the folder with a local HTTP server.
6. Open the viewer in your browser.

The goal is simple: **download → replace the model → customize → serve.**

---

## Local Development

Due to modern browser security policies (CORS) regarding ES Modules (`type="module"`) and external 3D file requests, opening `index.html` directly via `file:///...` will cause cross-origin errors. **The project must be served over a local HTTP server.**

### Option A: VSCodium / VS Code Live Server
1. Install the **Live Server** extension in VSCodium.
2. Right-click `index.html` in the file explorer and select **Open with Live Server**.
3. Firefox/Chrome will open `http://127.0.0.1:5500/index.html`.

### Option B: Terminal via Python HTTP Server
Open your terminal in the project directory and run:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000` in your web browser.

---

## Repository Structure

```text
assets/
├── 3D-viewer.glb       # Default 3D model asset
├── 3D-viewer.png       # Header logo
└── screenshot.png      # Viewport showcase screenshot

css/
└── style.css           # Viewport & canvas layout styles

js/
└── 3D-viewer.js        # Core engine, OrbitControls, & loader logic

index.html              # HTML mount point & ES import map
LICENSE                 # Open source license text
README.md               # Documentation
```

---

## Design Goals

- Fast asset loading and zero build complexity
- Clean, maintainable vanilla JavaScript architecture
- Modular structure for easy integration into existing sites or CMS platforms
- Responsive full-screen WebGL presentation

---

## License

Copyright © 2026 Pieter Coetzer

Distributed under the **MIT License**. Free for personal, academic, and commercial usage. See `LICENSE` for details.