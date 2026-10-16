# AuraClean Studio - AI Product Photo Studio 📸✨

A full-stack AI-powered product photo studio and commercial retouching application built with React, Vite, Express, and Google Gemini AI (`gemini-nano-banana-2.1` & `gemini-3.8-flash`).

Remove backgrounds, isolate commercial products, add realistic studio lighting and contact shadows, and clean up surface dust or imperfections just by typing natural language instructions.

---

## 🚀 Features

- **Prompt-Driven Retouching**: Type any natural language instruction (e.g., *"Remove background and place on white marble with soft morning sun"*, *"Isolate product on pure #FFFFFF white with drop shadow for Amazon"*).
- **Gemini AI Integration**: Server-side integration with `@google/genai` utilizing:
  - `gemini-nano-banana-2.1` / `gemini-3.1-flash-lite-image` for high-resolution image editing.
  - `gemini-3.8-flash` for automated product category detection, flaw inspection, and tailored suggestions.
- **Interactive Before / After Split Slider**: Draggable comparison divider, zoom (up to 300%), and pan controls.
- **Studio Surfaces & Lighting**: Switch between Transparent PNG, Studio Pure White, Luxury Travertine Stone, Dark Charcoal Slate, Natural Wood, and Studio Gradients.
- **Precision Shadow & Grounding Engine**: Soft contact shadows, occlusion shadows, and floor reflections.
- **Inpaint / Spot Retouch Brush**: Interactive brush to highlight and clean surface dust, scratches, or unwanted reflections.
- **Commercial E-Commerce Export**: Export to Transparent PNG, Amazon-compliant 2000×2000 px White JPG, WebP, or copy directly to clipboard.
- **Sample Product Library & Multi-Source Import**: 4 demo products included, plus Drag & Drop, Clipboard Paste (`Ctrl+V`), and Camera Snapshot.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Motion
- **Backend**: Node.js, Express, tsx
- **AI SDK**: `@google/genai`
- **Build Tool**: Vite

---

## 📦 Getting Started

### 1. Prerequisites
- Node.js 18+ installed on your machine.
- A Gemini API Key from [Google AI Studio](https://aistudio.google.com/).

### 2. Installation

Clone this repository and install dependencies:

```bash
git clone https://github.com/rahulkumbhakar62070-dotcom/AuraClean---AI-Product-Photo-Studio
cd auraclean-studio
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory (copy from `.env.example`):

```bash
cp .env.example .env
```

Add your Gemini API key:

```env
GEMINI_API_KEY="your_actual_gemini_api_key_here"
```

### 4. Running the Development Server

Start the full-stack server (Vite + Express):

```bash
npm run dev
```

Open your browser at `http://localhost:3000`.

### 5. Production Build

To build the static frontend bundle and run in production:

```bash
npm run build
npm start
```

---

## 📜 License

Apache-2.0
