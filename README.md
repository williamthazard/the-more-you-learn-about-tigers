# the more you learn about tigers the more obvious tigers become and you start to see stripes everywhere

An interactive web viewer for Robert David Carey's multimedia art piece featuring a series of animated GIFs with an accompanying audio track.

## About the Work

*the more you learn about tigers the more obvious tigers become and you start to see stripes everywhere* is a visual and audio piece by **Robert David Carey**. The work consists of 15 animated GIFs that can be navigated sequentially, accompanied by an audio track that loops continuously.

## Live Demo

[View the project](https://williamthazard.github.io/the-more-you-learn-about-tigers/)

## Features

- Full-screen GIF viewer with smooth crossfade transitions
- Background audio with play/pause control
- Keyboard navigation (arrow keys to navigate, spacebar for audio)
- Loading screen with progress indicator
- Responsive design

## Controls

| Action | Input |
|--------|-------|
| Previous GIF | Left Arrow or click ‹ button |
| Next GIF | Right Arrow or click › button |
| Play/Pause Audio | Spacebar or click ▶/⏸ button |

## Technical Stack

- **React 19** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Ionicons** for UI icons
- **Cloudflare R2** for asset hosting
- **GitHub Pages** for deployment

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## Project Structure

```
src/
├── App.tsx        # Main GIF viewer component
├── main.tsx       # React entry point
├── index.css      # Tailwind styles
├── icons.ts       # Ionicons setup
└── ionicons.d.ts  # TypeScript declarations
```

## Credits

- **Artwork & Audio**: Robert David Carey
- **Web Development**: Built by William Hazard with React and TypeScript
