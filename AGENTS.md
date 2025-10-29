# AGENTS.md - AI Assistant Guidelines

## Project Overview

**textpost** is a modern, brutalist-designed web app for creating beautiful Instagram posts with Markdown support. Users can write, preview, and export posts as high-quality PNG images or JSON data.

### Key Features
- Full Markdown rendering with syntax highlighting
- Live preview of Instagram posts
- Multiple export formats (PNG, Markdown)
- Local browser storage persistence
- Responsive editor/preview layout
- Rich text toolbar with formatting options
- Multiple theme support (default, dark, light, forest, sunset)

### Tech Stack
- **React 19** - UI library with hooks
- **TypeScript** - Type-safe development
- **Vite** - Build tool and dev server
- **Emotion** - CSS-in-JS styling
- **React Markdown** - Markdown parsing and rendering
- **React Syntax Highlighter** - Code block syntax highlighting
- **html-to-image** - PNG export functionality
- **React Icons** - Icon library

## Project Structure

```
src/
├── components/
│   ├── PostEditor.jsx      # Text editor with formatting toolbar
│   └── PostPreview.jsx     # Live preview component with theme support
├── App.jsx                 # Main application component
├── theme.js                # Design system and color palette
├── index.css               # Global styles
└── main.jsx                # React entry point
```

## Key Components

### PostEditor.jsx
- Manages markdown text input
- Provides formatting toolbar (bold, italic, lists, code, images)
- Handles image uploads and caching
- Manages multiple posts (separated by `===`)

### PostPreview.jsx
- Renders markdown with `react-markdown`
- Supports syntax highlighting with `highlight.js`
- Handles theme switching and YAML frontmatter metadata
- Manages image positioning and vertical alignment
- Provides PNG export functionality via `html-to-image`

### App.jsx
- Main component orchestrating editor and preview
- Manages application state and local storage
- Handles export functionality (PNG, Markdown)

## Important Patterns & Architecture

### Multiple Posts
Posts are separated by `===` delimiter. The app parses the markdown into individual posts and allows navigation with Prev/Next buttons.

### YAML Frontmatter Metadata
Each post can have metadata at the top:
```yaml
---
theme: forest
imagePosition: bottom
verticalAlign: middle
---
```

**Available options:**
- `theme`: `default`, `dark`, `light`, `forest`, `sunset`
- `imagePosition`: `top`, `bottom`, `left`, `right`
- `verticalAlign`: `top`, `middle`, `bottom`

### Theme System
Themes are defined in `PostPreview.jsx` with `themeStyles` object containing:
- `background` - Background color
- `text` - Text color
- `accent` - Accent/highlight color

### Image Handling
- Images are uploaded and converted to blob URLs
- Cached in component state during session
- Positioned based on `imagePosition` metadata
- Exported with PNG at 2x pixel ratio for retina displays

## Development Setup

### Prerequisites
- Node.js 18+ (v20.18.0 or higher recommended)
- npm or yarn

### Getting Started
```bash
npm install
npm run dev
```
Dev server runs on `http://localhost:5173`

### Available Scripts
- `npm run dev` - Start development server with HMR
- `npm run build` - Build for production
- `npm run generate-og` - Generate OG image for social sharing
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Common Tasks for AI Assistance

### Adding a New Theme
1. Add theme colors to `themeStyles` object in `PostPreview.jsx`
2. Update theme options documentation in README.md
3. Test with sample posts using the new theme

### Fixing PNG Export Issues
- Check that external images load properly
- Verify `html-to-image` configuration
- Test with different content types (code blocks, images, etc.)

### Modifying the Editor Toolbar
- Edit toolbar buttons in `PostEditor.jsx`
- Add new markdown formatting helpers as needed
- Update documentation for new features

### Styling Changes
- Global styles in `src/index.css`
- Component styles use Emotion CSS-in-JS
- Theme colors defined in `PostPreview.jsx` and `theme.js`

## Code Style & Conventions

- **Components**: Functional components with hooks
- **Styling**: Emotion `styled` components for scoped CSS
- **State Management**: React hooks (useState, useEffect, useCallback)
- **Markdown**: Use `react-markdown` with `remark-gfm` for GitHub Flavored Markdown
- **File Naming**: PascalCase for components (e.g., `PostEditor.jsx`)

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Considerations

- PNG export uses web workers to avoid blocking UI
- Vite provides instant HMR for fast development
- Tree-shaking and code splitting for optimized production builds
- Images cached in session to avoid re-uploading

## Troubleshooting Guide

**PNG export not working?**
- Ensure content doesn't have external images that fail to load
- Try refreshing the page
- Check browser console for errors

**Fonts not loading?**
- Check internet connection (Google Fonts requires online access)
- Clear browser cache and reload

**Content not saving?**
- Verify localStorage is enabled in browser
- Try a different browser if issues persist

## Areas for AI Assistance

Feel free to ask for help with:
- Bug fixes and debugging
- Feature additions and enhancements
- Code refactoring and optimization
- Performance improvements
- Testing and validation
- Documentation updates
