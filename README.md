# MedTwin

MedTwin is an AI-Powered Digital Twin platform for medical device development. It combines a 3D device model viewer with simulation, validation, and safety tooling in a single dashboard.

Built with [TanStack Start](https://tanstack.com/start), [three.js](https://threejs.org/), and [Tailwind CSS](https://tailwindcss.com), and originally scaffolded with [Lovable](https://lovable.dev).

## Features

- **Unified dashboard** — split-screen workspace: a live 3D model viewer on the left, and the Device Designer / Patient Simulator / Simulation Lab toolset on the right.
- **3D model viewer** — renders your device OBJ model (`public/models/`) with orbit controls, auto-rotation, and zone-based coloring. Each vertical zone of the model maps to a vital (SpO₂, temperature, heart rate, respiration) and re-colors continuously as patient vitals change.
- **Device Designer** — drag-and-drop block diagram canvas with a component properties editor.
- **Patient Simulator** — physiological sliders, condition presets (tachycardia, hypoxia, hypotension, fever), and live ECG/SpO₂/respiration charts. Changes flow directly into the 3D model colors.
- **Simulation Lab** — scenario management for the digital twin.
- **Scenario Generator** — AI-assisted simulation scenario creation.
- **Failure Injection** — inject component failures (sensor noise, drift, etc.) and watch the safety score react.
- **AI Safety Analysis, Test Results, Risk Assessment, Reports** — validation and safety workflow.
- **Dataset Explorer, Settings** — data and configuration management.

## Tech Stack

- **Framework**: TanStack Start (React + Vite + Nitro, SSR)
- **3D rendering**: three.js (OBJLoader, OrbitControls)
- **Styling**: Tailwind CSS with a custom design system (panels, badges, cards, charts)
- **State**: React Context store (`src/hooks/useAppStore.tsx`)
- **Icons**: lucide-react

## Development

Requires Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

### Scripts

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start the Vite dev server (with SSR) |
| `npm run build`   | Production build                     |
| `npm run preview` | Preview the production build         |
| `npm run lint`    | ESLint (includes Prettier rules)     |
| `npm run format`  | Prettier --write on the codebase     |

## Project Structure

```
src/
├── components/
│   ├── charts/        # Reusable chart components
│   ├── layout/        # AppLayout, unified Header
│   ├── shared/        # SectionHeader, Toaster, StatCard, etc.
│   ├── twin/          # ModelViewer (three.js OBJ viewer + zone coloring)
│   └── ui/            # Design-system primitives (Card, Badge, Slider, ...)
├── data/              # Mock data (devices, twins, patients, scenarios, ...)
├── hooks/             # useAppStore (global app state)
├── pages/             # Page content (Dashboard, DeviceDesigner, PatientSimulator, ...)
├── routes/            # TanStack Router routes (file-based)
├── services/          # deviceService, riskService, scenarioService, ...
├── types/             # Shared TypeScript types
└── utils/             # cn, format helpers
```

## Model Configuration

The default OBJ model is `public/models/maNO_CPP_approx.obj`. Drop in any OBJ file, update `DEFAULT_MODEL_URL` in `src/components/twin/ModelViewer.tsx`, and the viewer will split it into vertical color zones automatically.

## Lovable

This project was built with [Lovable](https://lovable.dev) and remains connected to the Lovable editor — changes pushed to `main` sync back into Lovable.
