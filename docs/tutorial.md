# Building "The More You Learn About Tigers" — A Complete Tutorial

*A step-by-step guide to building a full-screen animated GIF viewer with audio, crossfade transitions, and automatic deployment to the web.*

---

## Table of Contents

1. [What We're Building](#1-what-were-building)
2. [Tools and Prerequisites](#2-tools-and-prerequisites)
3. [Creating the Project](#3-creating-the-project)
4. [Understanding the File Structure](#4-understanding-the-file-structure)
5. [Configuring Vite — `vite.config.ts`](#5-configuring-vite--viteconfigts)
6. [The HTML Shell — `index.html`](#6-the-html-shell--indexhtml)
7. [Global Styles — `src/index.css`](#7-global-styles--srcindexcss)
8. [TypeScript Configuration](#8-typescript-configuration)
9. [Setting Up Icons — `src/icons.ts` and `src/ionicons.d.ts`](#9-setting-up-icons--srciconstss-and-srcionicondts)
10. [The Entry Point — `src/main.tsx`](#10-the-entry-point--srcmaintsx)
11. [Your Assets — The `public/` Folder](#11-your-assets--the-public-folder)
12. [The Main Component — `src/App.tsx`](#12-the-main-component--srcapptsx)
    - [12.1 Imports and Setup](#121-imports-and-setup)
    - [12.2 Data: the GIF list and audio file](#122-data-the-gif-list-and-audio-file)
    - [12.3 Constants: timeouts and retries](#123-constants-timeouts-and-retries)
    - [12.4 State: teaching React what to remember](#124-state-teaching-react-what-to-remember)
    - [12.5 Refs: reaching outside of React](#125-refs-reaching-outside-of-react)
    - [12.6 Loading images with retry logic](#126-loading-images-with-retry-logic)
    - [12.7 Preloading all images on startup](#127-preloading-all-images-on-startup)
    - [12.8 Navigation: moving between GIFs](#128-navigation-moving-between-GIFs)
    - [12.9 Audio: play and pause](#129-audio-play-and-pause)
    - [12.10 Keyboard shortcuts](#1210-keyboard-shortcuts)
    - [12.11 The Loading Screen UI](#1211-the-loading-screen-ui)
    - [12.12 The Main Viewer UI](#1212-the-main-viewer-ui)
    - [12.13 The complete file](#1213-the-complete-file)
13. [Running the App Locally](#13-running-the-app-locally)
14. [Deploying to GitHub Pages](#14-deploying-to-github-pages)
15. [What You've Learned](#15-what-youve-learned)

---

## 1. What We're Building

This is an interactive web viewer for *the more you learn about tigers the more obvious tigers become and you start to see stripes everywhere*, a poem by Robert David Carey.

The finished application does the following:

- Displays a **loading screen** that preloads all 15 animated GIFs and shows a progress bar as they load. Once loading is complete, a "begin" button appears.
- After clicking "begin," the viewer shows each GIF full-screen on a black background.
- **Navigation controls** in the bottom corner let you move between GIFs with smooth crossfade transitions.
- A **looping audio track** can be toggled on and off.
- **Keyboard shortcuts**: left/right arrows to navigate, spacebar for audio.
- The whole thing is deployed to the web automatically via GitHub Pages whenever you push a change.

Here is the technology stack — we'll explain each piece as we encounter it:

| Tool | What it does |
|------|-------------|
| **Node.js / npm** | Runs JavaScript outside a browser; manages packages |
| **Vite** | Builds and serves the project during development |
| **React** | UI library — describes what the screen should look like |
| **TypeScript** | A layer on top of JavaScript that adds type safety |
| **Tailwind CSS** | Styling via utility classes directly in HTML/JSX |
| **Ionicons** | A library of clean, consistent icons |
| **GitHub Actions** | Runs automated tasks (like deploying) in the cloud |
| **GitHub Pages** | Free hosting for static websites from a GitHub repo |

---

## 2. Tools and Prerequisites

Before writing a single line of code, you need a few things installed on your computer.

### Node.js and npm

**Node.js** lets you run JavaScript on your computer (not just in a browser). When you install Node.js, you also get **npm** — the Node Package Manager — which lets you install open-source libraries and tools.

Download the **LTS** (Long-Term Support) version from [nodejs.org](https://nodejs.org). After installing, open a terminal and verify it worked:

```bash
node --version   # something like v20.x.x
npm --version    # something like 10.x.x
```

> **What is a terminal?** A terminal (also called a command line or shell) is a text-based interface for your computer. On macOS, it's called Terminal; on Windows, you can use PowerShell or Git Bash. Most of our work will happen here.

### A Code Editor

We recommend **Visual Studio Code** (VS Code), which is free and has excellent support for TypeScript and React. Download it from [code.visualstudio.com](https://code.visualstudio.com).

### A GitHub Account

To deploy the site, you'll need a free account at [github.com](https://github.com) and `git` installed on your computer. If you've ever run `git` in a terminal, you have it. If not, download it from [git-scm.com](https://git-scm.com).

### Your Media Files

You'll need:
- **15 GIF files**, named `0 [SIGNAL].gif` through `14 [WALKING].gif`
- **1 MP3 audio file**: `0001_gran (1).mp3`

We'll place them in the right folder in [Chapter 11](#11-your-assets--the-public-folder). For now, set them aside.

---

## 3. Creating the Project

Open your terminal and navigate to the folder where you want the project to live. For example:

```bash
cd ~/Desktop
```

Now run this command:

```bash
npm create vite@latest the-more-you-learn-about-tigers-react -- --template react-ts
```

Let's break this command down piece by piece:

- `npm create vite@latest` — This tells npm to run a "create" script from the `vite` package (using the latest version). It's a project generator that sets up boilerplate files for you.
- `the-more-you-learn-about-tigers-react` — This is the name of the folder that will be created for your project.
- `-- --template react-ts` — The `--` separates npm's options from Vite's options. `--template react-ts` tells Vite to use the React + TypeScript template.

> **Why React?** React is a JavaScript library created by Facebook/Meta that makes it easy to build complex user interfaces. Instead of manually updating the page when data changes, you describe *what* the UI should look like given certain data, and React figures out *how* to update the page efficiently.

> **Why TypeScript?** TypeScript is a "superset" of JavaScript — it's JavaScript with types added. A *type* tells you what kind of data a variable holds (a string? a number? an array of objects?). This catches mistakes before your code even runs, saving a lot of debugging time.

After the command finishes, move into the new folder and install its dependencies:

```bash
cd the-more-you-learn-about-tigers-react
npm install
```

`npm install` reads the `package.json` file that Vite generated and downloads all the libraries listed there into a folder called `node_modules`.

Now install the additional libraries this project needs:

```bash
npm install ionicons
npm install --save-dev @tailwindcss/vite tailwindcss gh-pages
```

- `ionicons` — The icon library we'll use for the navigation buttons.
- `@tailwindcss/vite` and `tailwindcss` — Tailwind CSS and its Vite plugin. `--save-dev` means these are only needed during development/building, not at runtime.
- `gh-pages` — A tool that makes deploying to GitHub Pages easy.

> **What is `node_modules`?** This folder contains all the code for every library you've installed. It can be enormous (hundreds of megabytes) because libraries depend on other libraries. You should never edit files inside it, and you should never commit it to git — that's why `.gitignore` lists it. Anyone who clones your project just runs `npm install` to recreate it.

---

## 4. Understanding the File Structure

After setup, your project should look like this:

```
the-more-you-learn-about-tigers-react/
├── .gitignore
├── eslint.config.js
├── index.html
├── node_modules/        ← installed libraries (don't touch)
├── package.json         ← project metadata and scripts
├── package-lock.json    ← exact versions of every installed library
├── public/              ← static assets (images, audio) served as-is
│   └── favicon.svg
├── src/                 ← your source code lives here
│   ├── App.tsx          ← the main component (most of our code)
│   ├── icons.ts         ← icon registration
│   ├── index.css        ← global styles
│   ├── ionicons.d.ts    ← TypeScript type declarations
│   └── main.tsx         ← entry point
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts       ← Vite configuration
```

Here's a quick summary of each important piece:

- **`index.html`** — The single HTML page. React will attach itself to a `<div>` inside it.
- **`src/`** — All the TypeScript/React code you write.
- **`public/`** — Files placed here are copied directly to the output. Images, audio, and fonts go here. Unlike files in `src/`, these are not processed by Vite — they're served exactly as-is.
- **`package.json`** — Lists your dependencies and the scripts you can run (`npm run dev`, `npm run build`, etc.).
- **`vite.config.ts`** — Configuration for Vite.
- **`tsconfig.*.json`** — Configuration for TypeScript.

---

## 5. Configuring Vite — `vite.config.ts`

Open `vite.config.ts` and replace its contents with:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/the-more-you-learn-about-tigers/',
})
```

### What's happening here?

**`defineConfig`** is a helper function from Vite. You pass it a configuration object. Using `defineConfig` (rather than just exporting a plain object) gives you TypeScript autocompletion in your editor.

**`plugins: [react(), tailwindcss()]`** tells Vite to use two plugins:
- `@vitejs/plugin-react` — Makes Vite understand JSX (the HTML-in-JavaScript syntax React uses) and enables React's fast refresh in development.
- `@tailwindcss/vite` — Processes Tailwind's CSS utility classes.

**`base: '/the-more-you-learn-about-tigers/'`** — This is the URL path where your site will live. When deployed to GitHub Pages, the URL will be something like `https://yourusername.github.io/the-more-you-learn-about-tigers/`. Without setting `base`, all your asset paths would be broken because they'd start from `/` instead of from your subdirectory.

> **How do imports work?** The lines at the top (`import ... from '...'`) use ES Module syntax to bring in code from other files or installed packages. `'vite'` refers to the `vite` package in `node_modules`; `'./icons'` would refer to a local file in the same directory.

> **Why `.ts` not `.js`?** Files ending in `.ts` are TypeScript. Files ending in `.tsx` are TypeScript with JSX (React's HTML-like syntax). Config files are typically `.ts`, and React components are `.tsx`.

---

## 6. The HTML Shell — `index.html`

Replace the contents of `index.html` with:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;700&display=swap" rel="stylesheet">
    <title>the more you learn about tigers the more obvious tigers become and you start to see stripes everywhere</title>
    <script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>
    <script nomodule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"></script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### What is this file doing?

In a React app, `index.html` is the one and only HTML file. It's the *shell* that the browser loads first. React then takes over and builds the rest of the interface in JavaScript.

**`<!doctype html>`** — Tells the browser this is a modern HTML5 document.

**`<meta charset="UTF-8" />`** — Sets the character encoding so special characters display correctly.

**`<link rel="icon" ...>`** — Sets the browser tab icon (favicon).

**`<meta name="viewport" ...>`** — Makes the page display correctly on mobile devices. Without this, mobile browsers zoom out to show a desktop-sized layout.

**The Google Fonts links** — These load the Roboto Mono font from Google's servers. `rel="preconnect"` tells the browser to start connecting to those servers early, before actually requesting the font file, which speeds things up.

**The Ionicons `<script>` tags** — Ionicons are used as *web components* — custom HTML elements like `<ion-icon name="play">`. Loading these scripts registers those custom elements in the browser. There are two scripts:
- The `type="module"` one is for modern browsers (using ES Modules).
- The `nomodule` one is a fallback for older browsers that don't support ES Modules. The browser automatically uses the right one.

**`<div id="root"></div>`** — This is the "mounting point" for your React app. It starts empty; React will fill it with your entire UI.

**`<script type="module" src="/src/main.tsx"></script>`** — This is what starts your React app. Vite intercepts this request during development, transpiles your TypeScript, and serves it. During a production build, Vite bundles everything into optimized JavaScript files.

---

## 7. Global Styles — `src/index.css`

Replace the contents of `src/index.css` with:

```css
@import "tailwindcss";

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #root {
  height: 100%;
  width: 100%;
  overflow: hidden;
}

body {
  background-color: #000;
}
```

### Breaking this down

**`@import "tailwindcss"`** — This one line activates Tailwind CSS. It tells the `@tailwindcss/vite` plugin to inject all of Tailwind's utility classes into your stylesheet. With Tailwind v4, this is all you need — no `tailwind.config.js` required.

> **What is Tailwind CSS?** Tailwind is a "utility-first" CSS framework. Instead of writing CSS in separate files, you add pre-made class names directly to your HTML elements. For example, `className="text-white text-xl font-bold"` gives you white, extra-large, bold text. This keeps styling close to the element it applies to and avoids the headache of inventing class names.

**The CSS reset (`* { margin: 0; padding: 0; box-sizing: border-box; }`)** — Browsers have built-in default styles (margins around `<h1>`, padding on `<body>`, etc.). This "reset" removes them so you start with a clean slate. `box-sizing: border-box` is a nearly universal best practice: it makes the `width` and `height` you set on an element *include* its padding and border, rather than being added on top of them.

**Making things full-height** — By default, `height: 100%` on a child element means 100% of its parent's height. But if no ancestor has an explicit height, the browser has nothing to reference and the element collapses to zero. Setting `height: 100%` on `html`, `body`, *and* `#root` creates a chain so your React app can fill the full screen.

**`overflow: hidden`** — Prevents scrollbars from appearing. Since this is a fullscreen GIF viewer, we never want the user to scroll.

**`background-color: #000`** — Makes the default background black. GIFs on a black background give the piece a cinematic quality.

---

## 8. TypeScript Configuration

Vite generated three TypeScript config files. You should update them to match exactly. They work together:

**`tsconfig.json`** — The root config. It doesn't set compiler options directly; it just points to the other two files as "references."

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

**`tsconfig.app.json`** — TypeScript settings for your `src/` code (your React app):

```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "types": ["vite/client"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["src"]
}
```

**`tsconfig.node.json`** — TypeScript settings for Node.js config files like `vite.config.ts`:

```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
    "target": "ES2023",
    "lib": ["ES2023"],
    "module": "ESNext",
    "types": ["node"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["vite.config.ts"]
}
```

### Key settings explained

**`"target": "ES2022"`** — TypeScript compiles your code to this version of JavaScript. ES2022 is supported by all modern browsers.

**`"lib": ["ES2022", "DOM", "DOM.Iterable"]`** — Tells TypeScript which built-in APIs exist. `"DOM"` makes it aware of browser APIs like `document`, `window`, `HTMLImageElement`, `HTMLAudioElement`, etc.

**`"jsx": "react-jsx"`** — Enables JSX compilation using React's new transform. Without this, TypeScript wouldn't understand the HTML-like syntax in `.tsx` files.

**`"strict": true`** — Enables all of TypeScript's strictest type-checking rules. This catches more bugs but requires you to be more explicit about types. It's a good habit to keep this on.

**`"noEmit": true`** — TypeScript won't produce JavaScript output files — Vite handles that. TypeScript's job here is only type-checking.

**`"moduleResolution": "bundler"`** — Tells TypeScript to resolve modules the same way a bundler (like Vite) does. This is the modern way.

---

## 9. Setting Up Icons — `src/icons.ts` and `src/ionicons.d.ts`

We're using Ionicons for the previous, next, play, and pause icons. Ionicons works in two ways: as web components (via CDN in `index.html`, which we already set up), and as an npm package. We're using the npm package to register just the icons we need, which keeps things organized.

### `src/icons.ts`

Create this file:

```typescript
// Icon setup for the application
// Uses Ionicons - https://ionic.io/ionicons
import { addIcons } from 'ionicons'
import { chevronBackOutline, chevronForwardOutline, play, pause } from 'ionicons/icons'

export const setupIcons = () => {
  addIcons({
    'chevron-back-outline': chevronBackOutline,
    'chevron-forward-outline': chevronForwardOutline,
    'play': play,
    'pause': pause,
  })
}
```

**`import { addIcons } from 'ionicons'`** — Imports the `addIcons` function from the Ionicons library. This function registers icon data so the `<ion-icon>` web component knows what SVG shapes to draw.

**`import { chevronBackOutline, ... } from 'ionicons/icons'`** — Imports the actual SVG data for the four icons we'll use. By importing only what we need (rather than all hundreds of icons), we keep the bundle size small.

**`export const setupIcons`** — The `export` keyword makes this function available to other files via `import`. We'll call it once at the top of `App.tsx`.

> **What is a function?** A function is a reusable block of code. `const setupIcons = () => { ... }` defines a function called `setupIcons` using "arrow function" syntax. The `() =>` part means it takes no arguments. Everything between `{ }` runs when you call `setupIcons()`.

### `src/ionicons.d.ts`

Create this file:

```typescript
import 'react'

// Type declarations for Ionicons web components
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'ion-icon': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & { name: string },
        HTMLElement
      >
    }
  }
}
```

This file looks intimidating, but its purpose is simple. TypeScript knows about standard HTML elements like `<div>`, `<button>`, `<img>`, etc. But `<ion-icon>` is a custom element — TypeScript doesn't know it exists, and would show an error if you tried to use it in JSX.

This `.d.ts` file (a "declaration file") tells TypeScript: "Hey, `<ion-icon>` is a valid element, and it accepts a `name` attribute (which is a string), plus all the normal HTML attributes." Now TypeScript is satisfied.

The `declare module 'react'` syntax is called "module augmentation" — you're adding new declarations to the existing `react` module's type definitions without changing any of its code.

---

## 10. The Entry Point — `src/main.tsx`

Replace the contents of `src/main.tsx` with:

```typescript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

This is the file that starts everything. It runs first when the browser loads your app.

**`import { StrictMode } from 'react'`** — `StrictMode` is a special React component that activates extra warnings during development. It doesn't affect the production build — it just helps you catch potential bugs early.

**`import { createRoot } from 'react-dom/client'`** — `createRoot` is the function that "mounts" React onto a DOM element. `react-dom` is the bridge between React's virtual world and the actual browser DOM.

**`import './index.css'`** — Importing a CSS file in JavaScript? In Vite, this works! Vite processes the import and injects the styles into the page. This is one of the things a build tool does for you.

**`import App from './App.tsx'`** — Imports your main component. The `default` import (no curly braces) corresponds to the `export default` at the bottom of `App.tsx`.

**`document.getElementById('root')!`** — `document.getElementById('root')` looks up the `<div id="root">` element in `index.html`. The `!` at the end is a TypeScript "non-null assertion" — it tells TypeScript "trust me, this element definitely exists, it's not null." (TypeScript is cautious: `getElementById` might return `null` if the element doesn't exist. We know it exists because we put it in `index.html`.)

**`createRoot(...).render(<StrictMode><App /></StrictMode>)`** — Creates a React root at the `#root` div and renders your `App` component inside `StrictMode`. From this point on, React manages everything inside that div.

> **What is JSX?** The `<StrictMode>`, `<App />` syntax inside a `.tsx` file is called JSX (JavaScript XML). It looks like HTML but it compiles down to regular JavaScript function calls. It's how React lets you write your UI in a familiar, readable way. Self-closing tags like `<App />` mean the component has no children.

---

## 11. Your Assets — The `public/` Folder

Inside your project, create the directory `public/assets/`. This is where the GIFs and audio file will live.

```bash
mkdir -p public/assets
```

Copy your 15 GIF files and the MP3 file into `public/assets/`. The filenames must match *exactly* what's referenced in `App.tsx`:

```
public/assets/
├── 0 [SIGNAL].gif
├── 1 [MAINSTREAM].gif
├── 2 [RUSSIA].gif
├── 3 [ASK].gif
├── 4 [BOARD].gif
├── 5 [MEDIA].gif
├── 6 [SABOTEUR].gif
├── 7 [NO CHOICE].gif
├── 8 [PROBLEM].gif
├── 9 [YEARS].gif
├── 10 [INFLUENCE].gif
├── 11 [SAD].gif
├── 12 [ANGRY].gif
├── 13 [UTTER].gif
├── 14 [WALKING].gif
└── 0001_gran (1).mp3
```

> **Why `public/` and not `src/`?** Files in `src/` get processed by Vite — they might be bundled, hashed, or transformed. Files in `public/` are served exactly as-is, with the same filenames. Since our GIF filenames contain spaces and brackets (which are awkward for Vite's module system), `public/` is the right place for them. They'll be accessible at `/assets/filename.gif` during development and at `/the-more-you-learn-about-tigers/assets/filename.gif` when deployed.

---

## 12. The Main Component — `src/App.tsx`

This is the heart of the application — about 340 lines of TypeScript and JSX. We'll build it piece by piece so every line makes sense. Create `src/App.tsx` and we'll fill it in section by section.

---

### 12.1 Imports and Setup

At the very top of `App.tsx`:

```typescript
import { useState, useRef, useEffect, useCallback } from 'react'
import { setupIcons } from './icons'

// Initialize icons
setupIcons()
```

**`import { useState, useRef, useEffect, useCallback } from 'react'`** — These are React's built-in "hooks." We'll explain each one in detail as we use it. For now, know that hooks are functions that give your component access to React features like state, side effects, and optimization.

**`import { setupIcons } from './icons'`** — Imports our icon setup function from the file we created.

**`setupIcons()`** — Calls the function immediately when this module loads. This registers the icons so that `<ion-icon name="play">` etc. will work in our JSX.

---

### 12.2 Data: the GIF list and audio file

```typescript
const LOCAL_BASE_URL = `${import.meta.env.BASE_URL}assets`

const GIFS = [
  { file: '0 [SIGNAL].gif', label: 'SIGNAL' },
  { file: '1 [MAINSTREAM].gif', label: 'MAINSTREAM' },
  { file: '2 [RUSSIA].gif', label: 'RUSSIA' },
  { file: '3 [ASK].gif', label: 'ASK' },
  { file: '4 [BOARD].gif', label: 'BOARD' },
  { file: '5 [MEDIA].gif', label: 'MEDIA' },
  { file: '6 [SABOTEUR].gif', label: 'SABOTEUR' },
  { file: '7 [NO CHOICE].gif', label: 'NO CHOICE' },
  { file: '8 [PROBLEM].gif', label: 'PROBLEM' },
  { file: '9 [YEARS].gif', label: 'YEARS' },
  { file: '10 [INFLUENCE].gif', label: 'INFLUENCE' },
  { file: '11 [SAD].gif', label: 'SAD' },
  { file: '12 [ANGRY].gif', label: 'ANGRY' },
  { file: '13 [UTTER].gif', label: 'UTTER' },
  { file: '14 [WALKING].gif', label: 'WALKING' },
]

const AUDIO_FILE = `${LOCAL_BASE_URL}/0001_gran (1).mp3`
```

**`import.meta.env.BASE_URL`** — Vite injects this special variable at build time. It equals whatever you set `base` to in `vite.config.ts`. Locally during development, it's just `/`. In the deployed build, it's `/the-more-you-learn-about-tigers/`. Using this variable means asset URLs work correctly in both environments — you never hardcode the path prefix.

**`GIFS`** — An array of objects. Each object has a `file` property (the filename) and a `label` property (a short name used for logging and accessibility). The `const` keyword means this variable will never be reassigned. Because it's defined outside the component function, it's only created once, not recreated every time the component re-renders.

> **What is an array?** An array is an ordered list. `[item1, item2, item3]` creates an array. You access items by index (starting at 0), so `GIFS[0]` is `{ file: '0 [SIGNAL].gif', label: 'SIGNAL' }`.

> **What is an object?** An object is a collection of key-value pairs. `{ file: '0 [SIGNAL].gif', label: 'SIGNAL' }` is an object with two properties. You access them with dot notation: `GIFS[0].file` gives you `'0 [SIGNAL].gif'`.

---

### 12.3 Constants: timeouts and retries

```typescript
const LOAD_TIMEOUT_MS = 30000 // 30 second timeout per attempt
const MAX_RETRIES = 3
```

These are named constants for the loading logic. Using named constants rather than "magic numbers" scattered through your code makes it easy to find and change these values later, and makes the code self-documenting.

---

### 12.4 State: teaching React what to remember

Now we define the `App` function — the React component itself:

```typescript
function App() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [displayIndex, setDisplayIndex] = useState(0)
  const [fadeIn, setFadeIn] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [loadingComplete, setLoadingComplete] = useState(false)
  const [loadedCount, setLoadedCount] = useState(0)
  const [failedAssets, setFailedAssets] = useState<string[]>([])
```

**`useState`** is the most fundamental React hook. It creates a piece of **state** — data that React watches. When state changes, React automatically re-renders the component with the new values.

`useState` returns an array with exactly two items:
1. The current value
2. A setter function to update it

The argument to `useState(...)` is the initial value.

Let's look at each piece of state:

| State variable | Type | Initial value | What it tracks |
|---|---|---|---|
| `currentIndex` | number | `0` | Which GIF is the "active" one (used for navigation logic) |
| `displayIndex` | number | `0` | Which GIF is currently *displayed* (may lag slightly during transition) |
| `fadeIn` | boolean | `true` | Whether the GIF is fading in (controls CSS opacity) |
| `isTransitioning` | boolean | `false` | Whether a crossfade is in progress (prevents double-clicking) |
| `isPlaying` | boolean | `false` | Whether audio is currently playing |
| `isLoading` | boolean | `true` | Whether we're on the loading screen |
| `loadingComplete` | boolean | `false` | Whether all assets have attempted to load |
| `loadedCount` | number | `0` | How many assets have finished loading (for the progress bar) |
| `failedAssets` | `string[]` | `[]` | Names of any GIFs that failed to load |

> **Why `currentIndex` AND `displayIndex`?** During a crossfade, we need a brief window where `currentIndex` has already moved to the new GIF (so navigation logic is updated) but `displayIndex` is still the old one (so the image stays visible while fading out). Then `displayIndex` updates to show the new GIF as it fades in.

> **`useState<string[]>([])`** — The `<string[]>` in angle brackets is a TypeScript *generic*. It tells TypeScript that this state variable holds an array of strings. TypeScript could often infer this, but being explicit is clearer.

---

### 12.5 Refs: reaching outside of React

```typescript
  const audioRef = useRef<HTMLAudioElement>(null)
  const preloadedImages = useRef<HTMLImageElement[]>([])
```

**`useRef`** creates a *ref* — a mutable container that persists across re-renders but does *not* cause a re-render when changed.

**`audioRef`** — Gives us a direct handle to the `<audio>` DOM element so we can call `.play()` and `.pause()` on it. React normally manages the DOM for us, but for controlling audio, we need to reach in and call browser API methods directly.

**`preloadedImages`** — Stores the array of preloaded `HTMLImageElement` objects. We use a ref rather than state because we don't want to trigger a re-render when images load — we handle that separately with `loadedCount`. The images just need to be stored somewhere so the browser keeps them in memory.

> **What is the DOM?** The DOM (Document Object Model) is the browser's internal representation of your HTML as a tree of objects. When React renders JSX, it updates the DOM. `useRef` lets you grab a direct reference to one of those DOM nodes.

> **`useRef<HTMLAudioElement>(null)`** — The generic `<HTMLAudioElement>` is the TypeScript type for an `<audio>` element. The initial value `null` means "no element yet" (the element doesn't exist until React renders it).

---

### 12.6 Loading images with retry logic

This is one of the more complex functions in the app. It loads a single image, and if it fails, retries with increasing delays.

```typescript
  const loadImageWithRetry = useCallback((
    gif: { file: string; label: string },
    attempt: number,
    onSuccess: (img: HTMLImageElement) => void,
    onFailure: () => void
  ) => {
    const img = new Image()
    let timeoutId: ReturnType<typeof setTimeout> | null = null
    let settled = false

    const cleanup = () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
        timeoutId = null
      }
    }

    const handleSuccess = () => {
      if (settled) return
      settled = true
      cleanup()
      console.log(`Loaded: ${gif.label}${attempt > 1 ? ` (attempt ${attempt})` : ''}`)
      onSuccess(img)
    }

    const handleFailure = (reason: string) => {
      if (settled) return
      settled = true
      cleanup()

      if (attempt < MAX_RETRIES) {
        console.warn(`${reason}: ${gif.label} (attempt ${attempt}/${MAX_RETRIES}), retrying...`)
        // Exponential backoff: 1s, 2s, 4s
        setTimeout(() => {
          loadImageWithRetry(gif, attempt + 1, onSuccess, onFailure)
        }, Math.pow(2, attempt - 1) * 1000)
      } else {
        console.error(`Failed to load after ${MAX_RETRIES} attempts: ${gif.label}`)
        onFailure()
      }
    }

    img.onload = handleSuccess
    img.onerror = () => handleFailure('Load error')

    timeoutId = setTimeout(() => {
      handleFailure('Timeout')
    }, LOAD_TIMEOUT_MS)

    img.src = `${LOCAL_BASE_URL}/${gif.file}`
    return img
  }, [])
```

Let's walk through this carefully:

**`useCallback`** — This hook memoizes (caches) a function so it's not recreated every time the component re-renders. The empty array `[]` as the second argument means "never recreate this function" — it has no dependencies that could change.

**Why memoize?** Later, we use `loadImageWithRetry` inside a `useEffect`. If the function was recreated on every render, the effect would re-run on every render, causing infinite loading loops. `useCallback` prevents that.

**Function parameters:**
- `gif` — The GIF to load (an object with `file` and `label`)
- `attempt` — Which attempt number we're on (starts at 1)
- `onSuccess(img)` — A callback function to call if loading succeeds, receiving the loaded `HTMLImageElement`
- `onFailure()` — A callback function to call if all retries are exhausted

**`const img = new Image()`** — Creates a new `HTMLImageElement` in memory. This is the standard browser API for loading an image programmatically. When you set `img.src`, the browser starts fetching that image. The `img.onload` callback fires when it's ready.

**`let settled = false`** — A guard variable. Because we have both an `onerror` handler and a timeout, we need to ensure we only respond to whichever fires first. Once `settled` is `true`, subsequent calls to `handleSuccess` or `handleFailure` exit immediately.

**`const cleanup`** — Clears the timeout if we don't need it anymore. If the image loaded successfully, there's no point in waiting for the timeout to fire.

**`handleFailure`:**
- Checks if we've used up all retries (`attempt < MAX_RETRIES`)
- If not: waits, then calls `loadImageWithRetry` again with `attempt + 1`
- If yes: calls `onFailure()` and gives up

**Exponential backoff: `Math.pow(2, attempt - 1) * 1000`** — This is a standard technique for retry logic. Instead of retrying immediately (which might just fail again for the same reason), we wait increasingly longer:
- Attempt 1 fails → wait `2^0 * 1000 = 1000ms` (1 second)
- Attempt 2 fails → wait `2^1 * 1000 = 2000ms` (2 seconds)
- Attempt 3 fails → wait `2^2 * 1000 = 4000ms` (4 seconds, but we've already hit MAX_RETRIES by now)

**`img.onload = handleSuccess`** — When the image loads, call `handleSuccess`.

**`img.onerror = () => handleFailure('Load error')`** — If there's a network error, call `handleFailure` with the reason.

**`timeoutId = setTimeout(..., LOAD_TIMEOUT_MS)`** — Sets a timer. If the image hasn't loaded within 30 seconds, call `handleFailure('Timeout')`. This handles slow connections that stall without erroring.

**`img.src = ...`** — This line *actually starts the download*. Setting the `src` property is what triggers the browser to fetch the image. Everything before this is setup.

---

### 12.7 Preloading all images on startup

```typescript
  useEffect(() => {
    let loadedSuccessfully = 0
    let loadedTotal = 0
    const failed: string[] = []
    const images: HTMLImageElement[] = []

    const checkComplete = () => {
      if (loadedTotal === GIFS.length) {
        preloadedImages.current = images
        setFailedAssets(failed)
        setLoadingComplete(true)
      }
    }

    GIFS.forEach((gif, index) => {
      const img = loadImageWithRetry(
        gif,
        1,
        (loadedImg) => {
          images[index] = loadedImg
          loadedSuccessfully++
          loadedTotal++
          setLoadedCount(loadedTotal)
          checkComplete()
        },
        () => {
          failed.push(gif.label)
          loadedTotal++
          setLoadedCount(loadedTotal)
          checkComplete()
        }
      )
      images[index] = img
    })
  }, [loadImageWithRetry])
```

**`useEffect`** — The hook for "side effects." A *side effect* is anything that reaches outside React's rendering system — like fetching data, setting timers, or (here) preloading images. `useEffect` runs *after* React has rendered the component to the screen.

The second argument `[loadImageWithRetry]` is the **dependency array**. React runs the effect once when the component first mounts, and again any time the listed values change. Since `loadImageWithRetry` is memoized with `useCallback([])`, it never changes, so this effect only runs once.

**What this effect does:**
1. Creates local tracking variables: `loadedTotal` (how many have completed, success or failure), `failed` (names of failed GIFs), `images` (array of loaded `HTMLImageElement` objects)
2. For each GIF, calls `loadImageWithRetry` with:
   - A **success callback**: stores the loaded image, increments counters, updates state, checks if all are done
   - A **failure callback**: records the failure, increments counters, updates state, checks if all are done
3. `checkComplete` checks if `loadedTotal === GIFS.length`. When every GIF has either loaded or definitively failed, loading is done.

> **Why preload?** If we waited until the user navigated to a GIF to load it, there'd be a delay and a flash of empty content. By loading all GIFs upfront, transitions are instant and smooth.

> **`setLoadedCount(loadedTotal)`** — Updating state here is what causes the progress bar to update in real time. Each time an image loads (or fails), we call this setter, React re-renders, and the bar moves forward.

---

### 12.8 Navigation: moving between GIFs

```typescript
  const navigateTo = useCallback((newIndex: number) => {
    if (isTransitioning || newIndex === currentIndex) return

    console.log(GIFS[newIndex].label)
    setIsTransitioning(true)
    setFadeIn(false)

    // First fade out current image
    setTimeout(() => {
      setDisplayIndex(newIndex)
      setCurrentIndex(newIndex)
      // Trigger fade in after a frame
      requestAnimationFrame(() => {
        setFadeIn(true)
      })
    }, 300)

    // Allow next navigation after full transition
    setTimeout(() => {
      setIsTransitioning(false)
    }, 600)
  }, [currentIndex, isTransitioning])
```

**`navigateTo(newIndex)`** orchestrates the crossfade:

1. **Guard clause**: If we're already mid-transition, or trying to navigate to the current GIF, do nothing.
2. Set `isTransitioning = true` to lock navigation.
3. Set `fadeIn = false` — the `<img>` element's CSS `opacity` transitions to 0, causing the fade-out. (This works because of the `transition-opacity duration-300` Tailwind class we'll add later.)
4. After 300ms (the fade-out duration), update `displayIndex` and `currentIndex` to the new GIF, then set `fadeIn = true`. The image swaps while it's invisible.
5. `requestAnimationFrame` — Before setting `fadeIn = true`, we wait for one animation frame. Without this, React might batch the `setDisplayIndex` and `setFadeIn(true)` updates together, skipping the invisible state entirely. `requestAnimationFrame` ensures the image swap renders first, then the fade-in begins.
6. After 600ms total, unlock navigation by setting `isTransitioning = false`.

> **`useCallback([currentIndex, isTransitioning])`** — This function is recreated when `currentIndex` or `isTransitioning` changes. That's necessary because the function uses them in its logic. If we used `[]`, it would "close over" stale values and navigation would break.

```typescript
  const goToPrevious = useCallback(() => {
    const newIndex = currentIndex === 0 ? GIFS.length - 1 : currentIndex - 1
    navigateTo(newIndex)
  }, [currentIndex, navigateTo])

  const goToNext = useCallback(() => {
    const newIndex = currentIndex === GIFS.length - 1 ? 0 : currentIndex + 1
    navigateTo(newIndex)
  }, [currentIndex, navigateTo])
```

These are simple wrappers:
- `goToPrevious`: If we're at index 0 (the first GIF), wrap around to the last. Otherwise, go to `currentIndex - 1`.
- `goToNext`: If we're at the last GIF, wrap around to 0. Otherwise, go to `currentIndex + 1`.

The `? :` syntax is a *ternary operator* — a compact if/else: `condition ? valueIfTrue : valueIfFalse`.

---

### 12.9 Audio: play and pause

```typescript
  const toggleAudio = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        console.log('Audio off')
      } else {
        audioRef.current.play()
        console.log('Audio on')
      }
      setIsPlaying(!isPlaying)
    }
  }, [isPlaying])
```

**`audioRef.current`** — The actual `<audio>` DOM element. We check it's not null before using it.

**`.pause()` and `.play()`** — These are native browser methods on `HTMLAudioElement`. They're not React — they're the browser's built-in audio API.

**`setIsPlaying(!isPlaying)`** — Flips the boolean. If it was `true`, set to `false`; if `false`, set to `true`. This updates React's state so the play/pause button icon updates.

---

### 12.10 Keyboard shortcuts

```typescript
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLoading) return
      if (e.key === 'ArrowLeft') {
        goToPrevious()
      } else if (e.key === 'ArrowRight') {
        goToNext()
      } else if (e.key === ' ') {
        e.preventDefault()
        toggleAudio()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [goToPrevious, goToNext, toggleAudio, isLoading])
```

**`window.addEventListener('keydown', handleKeyDown)`** — Attaches a listener to the global `window` object. Every time the user presses any key, `handleKeyDown` is called with a `KeyboardEvent` object that has a `.key` property describing which key was pressed.

**The `return () => ...`** — This is the effect's **cleanup function**. React calls it when the component unmounts (is removed from the page) or before the effect re-runs. Without cleanup, you'd add a new event listener every time the effect re-ran, stacking up duplicates and causing memory leaks.

**`e.preventDefault()`** — For the spacebar, we call this to prevent the browser's default behavior (scrolling down the page).

**`if (isLoading) return`** — Keyboard navigation is disabled during the loading screen. No point navigating before anything is loaded.

**Dependency array `[goToPrevious, goToNext, toggleAudio, isLoading]`** — The effect must re-run whenever any of these change, because `handleKeyDown` captures them via closure. If you forgot to list a dependency here, you'd end up calling a stale version of the function.

---

### 12.11 The Loading Screen UI

React components return JSX — a description of what to render. Our `App` component has two possible outputs depending on state.

First, compute some values:

```typescript
  const displayGif = GIFS[displayIndex]
  const loadProgress = (loadedCount / GIFS.length) * 100
```

`loadProgress` is a number from 0 to 100, used to set the width of the progress bar.

Now, the loading screen. If `isLoading` is `true`, we return this:

```typescript
  if (isLoading) {
    return (
      <div className="h-full w-full bg-black flex flex-col items-center justify-center gap-8 px-6 text-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-white text-xl md:text-3xl font-normal tracking-wide lowercase" style={{ fontFamily: "'Roboto Mono', monospace" }}>
            the more you learn about tigers the more obvious tigers become and you start to see stripes everywhere
          </h1>
          <p className="text-white/60 text-sm md:text-base" style={{ fontFamily: "'Roboto Mono', monospace" }}>
            Robert David Carey
          </p>
        </div>

        {loadingComplete ? (
          failedAssets.length > 0 ? (
            <div className="flex flex-col items-center gap-6">
              <div className="flex flex-col gap-2 text-center">
                <p className="text-red-400 text-base" style={{ fontFamily: "'Roboto Mono', monospace" }}>
                  {failedAssets.length} asset{failedAssets.length > 1 ? 's' : ''} failed to load
                </p>
                <p className="text-white/60 text-sm max-w-sm" style={{ fontFamily: "'Roboto Mono', monospace" }}>
                  This may be due to a slow or unstable connection. Please refresh the page to try again.
                </p>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="bg-white/10 hover:bg-white/20 border border-white/30 rounded-full text-white text-lg tracking-widest lowercase transition-colors"
                style={{ fontFamily: "'Roboto Mono', monospace", padding: '0.5rem 2rem' }}
              >
                refresh
              </button>
              <div className="relative">
                <details className="text-white/40 text-xs" style={{ fontFamily: "'Roboto Mono', monospace" }}>
                  <summary className="cursor-pointer hover:text-white/60 transition-colors">
                    show failed assets
                  </summary>
                  <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-max max-w-[90vw] z-10 bg-black/90 p-3 rounded border border-white/10">
                    <ul className="space-y-1">
                      {failedAssets.map((label) => (
                        <li key={label}>{label}</li>
                      ))}
                    </ul>
                  </div>
                </details>
              </div>
            </div>
          ) : (
            <button
              onClick={() => { console.log(GIFS[0].label); setIsLoading(false) }}
              className="bg-white/10 hover:bg-white/20 border border-white/30 rounded-full text-white text-lg tracking-widest lowercase transition-colors"
              style={{ fontFamily: "'Roboto Mono', monospace", padding: '0.5rem 2rem' }}
            >
              begin
            </button>
          )
        ) : (
          <>
            <div className="w-64 md:w-96 h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-300 ease-out"
                style={{ width: `${loadProgress}%` }}
              />
            </div>
            <p className="text-white/60 font-mono text-sm">
              {loadedCount} / {GIFS.length}
            </p>
          </>
        )}
      </div>
    )
  }
```

This looks like a lot, but the structure is straightforward:

```
<div> (full-screen, centered, black background)
  <div> (title and author)
    <h1>the title</h1>
    <p>Robert David Carey</p>
  </div>

  {loadingComplete ? (
    // Loading is done. Did anything fail?
    failedAssets.length > 0 ? (
      // Some failed: show error message, refresh button, failed list
    ) : (
      // All succeeded: show "begin" button
    )
  ) : (
    // Still loading: show progress bar and count
  )}
</div>
```

Let's explain some key concepts seen here:

**Tailwind class breakdown (on the outer div):**
- `h-full w-full` — Full height and width (100% of the parent, which is `<html>/<body>/#root` — the full viewport)
- `bg-black` — Black background
- `flex flex-col items-center justify-center` — Flexbox layout, stacked vertically, centered horizontally and vertically
- `gap-8` — 2rem gap between flex children
- `px-6` — Horizontal padding of 1.5rem
- `text-center` — Center-aligned text

**`{loadingComplete ? ... : ...}`** — In JSX, you use curly braces `{}` to embed JavaScript expressions. A ternary operator here switches between two different sections of UI based on a boolean. Nested ternaries (like `failedAssets.length > 0 ? ... : ...` inside) are fine for simple two-branch logic.

**`<>...</>`** — This is a React Fragment. When `useEffect` is still running, we want to render both the progress bar *and* the count text side by side, but JSX requires a single root element. A Fragment lets you group multiple elements without adding an extra `<div>` to the DOM.

**`{failedAssets.map((label) => (<li key={label}>{label}</li>))}`** — `.map()` transforms an array into a new array. Here it transforms `['SIGNAL', 'RUSSIA']` into `[<li>SIGNAL</li>, <li>RUSSIA</li>]`. The `key={label}` prop is required by React when rendering lists — it helps React track which items are which if the list changes.

**The progress bar:**
```jsx
<div className="w-64 md:w-96 h-2 bg-white/20 rounded-full overflow-hidden">
  <div
    className="h-full bg-white transition-all duration-300 ease-out"
    style={{ width: `${loadProgress}%` }}
  />
</div>
```
The outer div is the "track" (semi-transparent, fixed width). The inner div is the "fill." Its `width` is set as an inline style because it's dynamic — we can't know which Tailwind class to use for an arbitrary percentage. `transition-all duration-300 ease-out` makes the fill animate smoothly as it grows.

**`md:w-96`** — Tailwind's responsive prefix. `md:` means "apply this only on medium screens and larger." So on mobile it's `w-64` (16rem); on tablet/desktop it's `w-96` (24rem).

**`bg-white/20`** — Tailwind's opacity modifier. `bg-white/20` is white at 20% opacity. `/60`, `/30`, etc. work similarly.

**The "begin" button:**
```jsx
<button
  onClick={() => { console.log(GIFS[0].label); setIsLoading(false) }}
  ...
>
  begin
</button>
```
`onClick` is an event handler. It receives a function. When clicked, it logs the first GIF's label (a deliberate artistic choice — the labels are visible in the browser console) and sets `isLoading` to `false`, switching to the main viewer.

---

### 12.12 The Main Viewer UI

If `isLoading` is false, we return the main viewer. Add this after the loading screen `if` block:

```typescript
  return (
    <div className="relative h-full w-full bg-black flex items-center justify-center overflow-hidden">
      {/* GIF with crossfade */}
      <img
        src={`${LOCAL_BASE_URL}/${displayGif.file}`}
        alt={displayGif.label}
        title={displayGif.label}
        className="absolute h-full w-auto object-contain transition-opacity duration-300 ease-in-out"
        style={{ opacity: fadeIn ? 1 : 0 }}
      />

      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={AUDIO_FILE}
        loop
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Floating Controls - Bottom Right */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-6 flex items-center gap-3 bg-black/70 backdrop-blur-sm px-5 py-3 rounded-full border border-white/20">
        {/* Previous Button */}
        <button
          onClick={goToPrevious}
          disabled={isTransitioning}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white disabled:opacity-50"
          aria-label="Previous GIF"
        >
          <ion-icon name="chevron-back-outline" style={{ fontSize: '20px' }} />
        </button>

        {/* GIF Counter */}
        <div className="text-white/80 text-sm font-mono min-w-[60px] text-center">
          {currentIndex + 1} / {GIFS.length}
        </div>

        {/* Play/Pause Audio Button */}
        <button
          onClick={toggleAudio}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white"
          aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
        >
          <ion-icon name={isPlaying ? 'pause' : 'play'} style={{ fontSize: '24px' }} />
        </button>

        {/* Next Button */}
        <button
          onClick={goToNext}
          disabled={isTransitioning}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white disabled:opacity-50"
          aria-label="Next GIF"
        >
          <ion-icon name="chevron-forward-outline" style={{ fontSize: '20px' }} />
        </button>
      </div>
    </div>
  )
```

Let's walk through each element:

**The `<img>` tag:**
```jsx
<img
  src={`${LOCAL_BASE_URL}/${displayGif.file}`}
  alt={displayGif.label}
  title={displayGif.label}
  className="absolute h-full w-auto object-contain transition-opacity duration-300 ease-in-out"
  style={{ opacity: fadeIn ? 1 : 0 }}
/>
```
- `src` — The URL of the GIF to display. Because we preloaded it, the browser serves it from cache instantly.
- `alt` — Alternative text for screen readers. Important for accessibility.
- `title` — Shown as a tooltip on hover. A subtle way to display the GIF's label.
- `absolute` — Positions the image absolutely within the container (the parent div has `relative`), so it fills the space without affecting layout flow.
- `h-full w-auto` — Full height, width scales proportionally.
- `object-contain` — Scales the image to fit within its container without cropping.
- `transition-opacity duration-300 ease-in-out` — Animates the opacity property over 300ms with an ease-in-out curve. This is what makes the crossfade smooth.
- `style={{ opacity: fadeIn ? 1 : 0 }}` — The key to the crossfade. When `fadeIn` is `true`, opacity is 1 (fully visible). When `false`, opacity is 0 (invisible). Combined with the CSS transition, this creates the fade effect.

**The `<audio>` element:**
```jsx
<audio
  ref={audioRef}
  src={AUDIO_FILE}
  loop
  onPlay={() => setIsPlaying(true)}
  onPause={() => setIsPlaying(false)}
/>
```
- `ref={audioRef}` — Connects this DOM element to our `audioRef` ref. Now `audioRef.current` gives us the actual `HTMLAudioElement` object.
- `loop` — A boolean attribute (just its presence means `true`). Makes the audio loop continuously.
- `onPlay` / `onPause` — React event handlers for the audio's play and pause events. These keep `isPlaying` state in sync if the user (or browser) pauses audio through some other means.

**The controls panel:**
```jsx
<div className="fixed bottom-6 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-6 ...">
```
- `fixed` — Positions this relative to the viewport, not the page. It always stays in the bottom corner no matter what.
- `bottom-6` — 1.5rem from the bottom edge.
- `left-1/2 -translate-x-1/2` — Centers horizontally on mobile: move the left edge to 50%, then shift left by half the element's own width. This is a classic CSS centering trick.
- `md:left-auto md:translate-x-0 md:right-6` — On medium screens and up, override the centering and stick to the right instead.
- `bg-black/70 backdrop-blur-sm` — Semi-transparent black with a frosted-glass blur effect.
- `rounded-full` — Fully rounded (pill shape).
- `border border-white/20` — A subtle semi-transparent border.

**The `disabled` attribute:**
```jsx
<button disabled={isTransitioning} ...>
```
When `isTransitioning` is `true`, the button is disabled — it can't be clicked, and `disabled:opacity-50` makes it appear faded to give visual feedback.

**`aria-label`** — Accessibility attribute. Screen readers announce this text when the user focuses the button. Since our buttons only contain icons (no text), this label is essential for accessibility.

**Dynamic icon name:**
```jsx
<ion-icon name={isPlaying ? 'pause' : 'play'} />
```
The icon changes based on state. When audio is playing, show a pause icon. When paused, show play. This is conditional rendering in its simplest form.

**The counter:**
```jsx
{currentIndex + 1} / {GIFS.length}
```
`currentIndex` is zero-based, so we add 1 to show a human-friendly "1 / 15" instead of "0 / 15".

---

### 12.13 The complete file

Here is `src/App.tsx` in full, for reference:

```typescript
import { useState, useRef, useEffect, useCallback } from 'react'
import { setupIcons } from './icons'

// Initialize icons
setupIcons()

const LOCAL_BASE_URL = `${import.meta.env.BASE_URL}assets`

const GIFS = [
  { file: '0 [SIGNAL].gif', label: 'SIGNAL' },
  { file: '1 [MAINSTREAM].gif', label: 'MAINSTREAM' },
  { file: '2 [RUSSIA].gif', label: 'RUSSIA' },
  { file: '3 [ASK].gif', label: 'ASK' },
  { file: '4 [BOARD].gif', label: 'BOARD' },
  { file: '5 [MEDIA].gif', label: 'MEDIA' },
  { file: '6 [SABOTEUR].gif', label: 'SABOTEUR' },
  { file: '7 [NO CHOICE].gif', label: 'NO CHOICE' },
  { file: '8 [PROBLEM].gif', label: 'PROBLEM' },
  { file: '9 [YEARS].gif', label: 'YEARS' },
  { file: '10 [INFLUENCE].gif', label: 'INFLUENCE' },
  { file: '11 [SAD].gif', label: 'SAD' },
  { file: '12 [ANGRY].gif', label: 'ANGRY' },
  { file: '13 [UTTER].gif', label: 'UTTER' },
  { file: '14 [WALKING].gif', label: 'WALKING' },
]

const AUDIO_FILE = `${LOCAL_BASE_URL}/0001_gran (1).mp3`

const LOAD_TIMEOUT_MS = 30000 // 30 second timeout per attempt
const MAX_RETRIES = 3

function App() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [displayIndex, setDisplayIndex] = useState(0)
  const [fadeIn, setFadeIn] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [loadingComplete, setLoadingComplete] = useState(false)
  const [loadedCount, setLoadedCount] = useState(0)
  const [failedAssets, setFailedAssets] = useState<string[]>([])
  const audioRef = useRef<HTMLAudioElement>(null)
  const preloadedImages = useRef<HTMLImageElement[]>([])

  // Log title and author on mount
  useEffect(() => {
    console.log('the more you learn about tigers the more obvious tigers become and you start to see stripes everywhere')
    console.log('Robert David Carey')
  }, [])

  // Load a single image with retry and timeout
  const loadImageWithRetry = useCallback((
    gif: { file: string; label: string },
    attempt: number,
    onSuccess: (img: HTMLImageElement) => void,
    onFailure: () => void
  ) => {
    const img = new Image()
    let timeoutId: ReturnType<typeof setTimeout> | null = null
    let settled = false

    const cleanup = () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
        timeoutId = null
      }
    }

    const handleSuccess = () => {
      if (settled) return
      settled = true
      cleanup()
      console.log(`Loaded: ${gif.label}${attempt > 1 ? ` (attempt ${attempt})` : ''}`)
      onSuccess(img)
    }

    const handleFailure = (reason: string) => {
      if (settled) return
      settled = true
      cleanup()

      if (attempt < MAX_RETRIES) {
        console.warn(`${reason}: ${gif.label} (attempt ${attempt}/${MAX_RETRIES}), retrying...`)
        // Exponential backoff: 1s, 2s, 4s
        setTimeout(() => {
          loadImageWithRetry(gif, attempt + 1, onSuccess, onFailure)
        }, Math.pow(2, attempt - 1) * 1000)
      } else {
        console.error(`Failed to load after ${MAX_RETRIES} attempts: ${gif.label}`)
        onFailure()
      }
    }

    img.onload = handleSuccess
    img.onerror = () => handleFailure('Load error')

    // Set timeout for slow connections
    timeoutId = setTimeout(() => {
      handleFailure('Timeout')
    }, LOAD_TIMEOUT_MS)

    img.src = `${LOCAL_BASE_URL}/${gif.file}`
    return img
  }, [])

  // Preload all images with retry logic
  useEffect(() => {
    let loadedSuccessfully = 0
    let loadedTotal = 0
    const failed: string[] = []
    const images: HTMLImageElement[] = []

    const checkComplete = () => {
      if (loadedTotal === GIFS.length) {
        preloadedImages.current = images
        setFailedAssets(failed)
        setLoadingComplete(true)
      }
    }

    GIFS.forEach((gif, index) => {
      const img = loadImageWithRetry(
        gif,
        1,
        (loadedImg) => {
          images[index] = loadedImg
          loadedSuccessfully++
          loadedTotal++
          setLoadedCount(loadedTotal)
          checkComplete()
        },
        () => {
          failed.push(gif.label)
          loadedTotal++
          setLoadedCount(loadedTotal)
          checkComplete()
        }
      )
      images[index] = img
    })
  }, [loadImageWithRetry])

  const navigateTo = useCallback((newIndex: number) => {
    if (isTransitioning || newIndex === currentIndex) return

    console.log(GIFS[newIndex].label)
    setIsTransitioning(true)
    setFadeIn(false)

    // First fade out current image
    setTimeout(() => {
      setDisplayIndex(newIndex)
      setCurrentIndex(newIndex)
      // Trigger fade in after a frame
      requestAnimationFrame(() => {
        setFadeIn(true)
      })
    }, 300)

    // Allow next navigation after full transition
    setTimeout(() => {
      setIsTransitioning(false)
    }, 600)
  }, [currentIndex, isTransitioning])

  const goToPrevious = useCallback(() => {
    const newIndex = currentIndex === 0 ? GIFS.length - 1 : currentIndex - 1
    navigateTo(newIndex)
  }, [currentIndex, navigateTo])

  const goToNext = useCallback(() => {
    const newIndex = currentIndex === GIFS.length - 1 ? 0 : currentIndex + 1
    navigateTo(newIndex)
  }, [currentIndex, navigateTo])

  const toggleAudio = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        console.log('Audio off')
      } else {
        audioRef.current.play()
        console.log('Audio on')
      }
      setIsPlaying(!isPlaying)
    }
  }, [isPlaying])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLoading) return
      if (e.key === 'ArrowLeft') {
        goToPrevious()
      } else if (e.key === 'ArrowRight') {
        goToNext()
      } else if (e.key === ' ') {
        e.preventDefault()
        toggleAudio()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [goToPrevious, goToNext, toggleAudio, isLoading])

  const displayGif = GIFS[displayIndex]
  const loadProgress = (loadedCount / GIFS.length) * 100

  // Loading screen
  if (isLoading) {
    return (
      <div className="h-full w-full bg-black flex flex-col items-center justify-center gap-8 px-6 text-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-white text-xl md:text-3xl font-normal tracking-wide lowercase" style={{ fontFamily: "'Roboto Mono', monospace" }}>
            the more you learn about tigers the more obvious tigers become and you start to see stripes everywhere
          </h1>
          <p className="text-white/60 text-sm md:text-base" style={{ fontFamily: "'Roboto Mono', monospace" }}>
            Robert David Carey
          </p>
        </div>

        {loadingComplete ? (
          failedAssets.length > 0 ? (
            <div className="flex flex-col items-center gap-6">
              <div className="flex flex-col gap-2 text-center">
                <p className="text-red-400 text-base" style={{ fontFamily: "'Roboto Mono', monospace" }}>
                  {failedAssets.length} asset{failedAssets.length > 1 ? 's' : ''} failed to load
                </p>
                <p className="text-white/60 text-sm max-w-sm" style={{ fontFamily: "'Roboto Mono', monospace" }}>
                  This may be due to a slow or unstable connection. Please refresh the page to try again.
                </p>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="bg-white/10 hover:bg-white/20 border border-white/30 rounded-full text-white text-lg tracking-widest lowercase transition-colors"
                style={{ fontFamily: "'Roboto Mono', monospace", padding: '0.5rem 2rem' }}
              >
                refresh
              </button>
              <div className="relative">
                <details className="text-white/40 text-xs" style={{ fontFamily: "'Roboto Mono', monospace" }}>
                  <summary className="cursor-pointer hover:text-white/60 transition-colors">
                    show failed assets
                  </summary>
                  <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-max max-w-[90vw] z-10 bg-black/90 p-3 rounded border border-white/10">
                    <ul className="space-y-1">
                      {failedAssets.map((label) => (
                        <li key={label}>{label}</li>
                      ))}
                    </ul>
                  </div>
                </details>
              </div>
            </div>
          ) : (
            <button
              onClick={() => { console.log(GIFS[0].label); setIsLoading(false) }}
              className="bg-white/10 hover:bg-white/20 border border-white/30 rounded-full text-white text-lg tracking-widest lowercase transition-colors"
              style={{ fontFamily: "'Roboto Mono', monospace", padding: '0.5rem 2rem' }}
            >
              begin
            </button>
          )
        ) : (
          <>
            <div className="w-64 md:w-96 h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-300 ease-out"
                style={{ width: `${loadProgress}%` }}
              />
            </div>
            <p className="text-white/60 font-mono text-sm">
              {loadedCount} / {GIFS.length}
            </p>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="relative h-full w-full bg-black flex items-center justify-center overflow-hidden">
      {/* GIF with crossfade */}
      <img
        src={`${LOCAL_BASE_URL}/${displayGif.file}`}
        alt={displayGif.label}
        title={displayGif.label}
        className="absolute h-full w-auto object-contain transition-opacity duration-300 ease-in-out"
        style={{ opacity: fadeIn ? 1 : 0 }}
      />

      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={AUDIO_FILE}
        loop
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Floating Controls - Bottom Right */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-6 flex items-center gap-3 bg-black/70 backdrop-blur-sm px-5 py-3 rounded-full border border-white/20">
        {/* Previous Button */}
        <button
          onClick={goToPrevious}
          disabled={isTransitioning}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white disabled:opacity-50"
          aria-label="Previous GIF"
        >
          <ion-icon name="chevron-back-outline" style={{ fontSize: '20px' }} />
        </button>

        {/* GIF Counter */}
        <div className="text-white/80 text-sm font-mono min-w-[60px] text-center">
          {currentIndex + 1} / {GIFS.length}
        </div>

        {/* Play/Pause Audio Button */}
        <button
          onClick={toggleAudio}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white"
          aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
        >
          <ion-icon name={isPlaying ? 'pause' : 'play'} style={{ fontSize: '24px' }} />
        </button>

        {/* Next Button */}
        <button
          onClick={goToNext}
          disabled={isTransitioning}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white disabled:opacity-50"
          aria-label="Next GIF"
        >
          <ion-icon name="chevron-forward-outline" style={{ fontSize: '20px' }} />
        </button>
      </div>
    </div>
  )
}

export default App
```

**`export default App`** — Makes this component the "default export" of the file, so other files can import it with `import App from './App.tsx'`.

---

## 13. Running the App Locally

With all files in place, start the development server:

```bash
npm run dev
```

You should see output like:

```
  VITE v7.x.x  ready in 300 ms

  ➜  Local:   http://localhost:5173/the-more-you-learn-about-tigers/
  ➜  Network: use --host to expose
```

Open that URL in your browser. You should see the loading screen, the progress bar filling up, and then the "begin" button. Click it to enter the viewer.

**What `npm run dev` does:** It runs the `"dev"` script from `package.json`, which runs `vite`. Vite starts a local web server, processes your TypeScript and CSS on the fly, and hot-reloads the browser whenever you save a file.

Try making a change — edit the title text in the loading screen and save `App.tsx`. The browser should update instantly without a full reload.

To stop the server, press `Ctrl+C` in the terminal.

---

## 14. Deploying to GitHub Pages

### Setting up your GitHub repository

1. Go to [github.com](https://github.com) and create a new repository. Name it `the-more-you-learn-about-tigers` (this becomes the URL path, and it must match the `base` in `vite.config.ts`).

2. Make it **Public** (required for free GitHub Pages hosting).

3. **Don't** initialize it with a README — you'll push your existing code.

4. In your terminal, initialize git and push:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/the-more-you-learn-about-tigers.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

### Setting up GitHub Pages with GitHub Actions

GitHub Actions is a system that runs automated tasks — called *workflows* — in response to events like pushes to your repository. We'll use it to automatically build and deploy our site.

Create the directory and file:

```bash
mkdir -p .github/workflows
```

Create `.github/workflows/deploy.yml` with this content:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - run: npm ci
      - run: npm run build

      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

Let's read this file:

**`on: push: branches: [main]`** — The workflow triggers whenever code is pushed to the `main` branch.

**`workflow_dispatch`** — Also lets you trigger it manually from the GitHub web interface.

**`permissions`** — The workflow needs permission to write to Pages and verify its identity.

**`concurrency`** — If two deploys are triggered rapidly, this cancels the in-progress one and runs the new one.

**`jobs`** — The workflow has two jobs:

**`build` job:**
1. `actions/checkout@v4` — Checks out your repository code
2. `actions/setup-node@v4` — Installs Node.js 20
3. `npm ci` — Like `npm install`, but faster and stricter — uses exact versions from `package-lock.json`
4. `npm run build` — Runs `tsc -b && vite build`, producing the `dist/` folder
5. `actions/upload-pages-artifact@v3` — Packages the `dist/` folder as a "pages artifact" for the deploy job

**`deploy` job:**
- `needs: build` — Waits for the build job to finish
- `actions/deploy-pages@v4` — Takes the artifact from the build job and deploys it to GitHub Pages

### Enabling GitHub Pages

After pushing the workflow file:

1. Go to your repository on GitHub.
2. Click **Settings** → **Pages** (in the left sidebar).
3. Under **Source**, select **GitHub Actions**.
4. Save.

Now push a change to `main`:

```bash
git add .
git commit -m "Add GitHub Actions workflow"
git push
```

Go to the **Actions** tab on your repository to watch the workflow run. When it finishes, your site will be live at:

```
https://YOUR_USERNAME.github.io/the-more-you-learn-about-tigers/
```

Every future `git push` to `main` will automatically rebuild and redeploy.

---

## 15. What You've Learned

Congratulations — you've built and deployed a real web application. Let's take stock of what you now understand:

### Tooling
- **npm and Node.js** — How JavaScript runs outside the browser, how to manage packages, and what `package.json` is for.
- **Vite** — A modern build tool that transforms TypeScript, bundles code, and serves your project during development.
- **TypeScript** — Why types help, how to configure the TypeScript compiler, and how to declare types for external libraries.
- **GitHub Actions** — How to automate build and deploy tasks that run in the cloud on every push.

### React Concepts
- **Components** — Functions that return JSX and represent pieces of UI.
- **JSX** — The HTML-like syntax in `.tsx` files that describes what the UI should look like.
- **`useState`** — How React remembers data and re-renders when it changes.
- **`useRef`** — How to hold a value or DOM reference that doesn't trigger re-renders.
- **`useEffect`** — How to run side effects (data loading, event listeners, timers) and clean them up properly.
- **`useCallback`** — How to memoize functions to prevent unnecessary re-renders and stale closures.
- **Conditional rendering** — How to show different UI based on state.
- **List rendering** — How to use `.map()` to render arrays of elements.

### Browser APIs
- **`HTMLImageElement`** — Creating and loading images programmatically.
- **`HTMLAudioElement`** — Playing and pausing audio via the DOM.
- **Event listeners** — Attaching and cleaning up keyboard event handlers.
- **`requestAnimationFrame`** — Synchronizing state updates with the browser's paint cycle.

### Design Patterns
- **Exponential backoff** — A robust pattern for retrying failed network requests.
- **Optimistic preloading** — Loading all assets before showing the UI, with a progress indicator.
- **Crossfade transitions** — Using CSS `opacity` + `transition` to animate between states.
- **Responsive design with Tailwind** — Using `md:` prefixes to adapt layout for different screen sizes.

### What you could build next

With these foundations, you could:

- **Add a slideshow mode** — A `setInterval` that automatically calls `goToNext` every few seconds
- **Add touch/swipe support** — Handle `touchstart` and `touchend` events for mobile navigation
- **Make it work with any media** — Adapt the GIFS array to load videos, images, or audio tracks
- **Add a thumbnail strip** — A row of small previews at the bottom that let you jump directly to any GIF
- **Animate the loading screen differently** — Try a spinning indicator, or fade in the title word by word

The core patterns — state, effects, refs, preloading, transitions — scale to far more complex applications. You now have the vocabulary and the intuition to keep going.

---

*Built with React, Vite, Tailwind CSS, and Ionicons. Artwork and audio by Robert David Carey.*
