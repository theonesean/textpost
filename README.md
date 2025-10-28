# textpost - Instagram post generator

A modern, brutalist-designed web app for creating beautiful Instagram posts with Markdown support. Write, preview, and export your posts as high-quality PNG images or JSON data.

## Features

- **Markdown Support**: Full markdown rendering with support for headings, lists, code blocks, blockquotes, and more
- **Live Preview**: Real-time preview of your Instagram post as you type
- **Brutalist Design**: Clean, modern aesthetic with a dark blue and teal color palette
- **Multiple Export Formats**: Export posts as PNG images or save markdown content
- **Local Storage**: Your posts are automatically saved to browser storage
- **Responsive Layout**: Editor on the left, preview on the right (adapts to mobile)
- **Rich Text Toolbar**: Quick buttons for formatting (bold, italic, lists, code, images)
- **Syntax Highlighting**: Beautiful code block rendering with syntax highlighting
- **Google Fonts**: Professional typography using Space Grotesk and Inter fonts

## Tech Stack

- **React 19**: Modern UI library with hooks
- **TypeScript**: Type-safe development
- **Vite**: Lightning-fast build tool and dev server
- **Emotion**: CSS-in-JS styling solution
- **React Markdown**: Markdown parsing and rendering
- **React Syntax Highlighter**: Code block syntax highlighting
- **html-to-image**: PNG export functionality
- **React Icons**: Beautiful icon library

## Getting Started

### Prerequisites

- Node.js 18+ (v20.18.0 or higher recommended)
- npm or yarn

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Open in browser**:
   Navigate to `http://localhost:5173` (or the URL shown in your terminal)

## Usage

### Writing Posts

1. **Editor Panel (Left Side)**:
   - Type or paste your content in the text area
   - Use the toolbar buttons for quick formatting:
     - **Bold**: `**text**`
     - **Italic**: `*text*`
     - **List**: Creates numbered list items
     - **Code**: Wraps text in code block
     - **Image**: Click to upload a local image file - it will be cached for the session and displayed in preview

2. **Preview Panel (Right Side)**:
   - See a live preview of your post as you type
   - Preview shows exactly how your post will look when exported

### Markdown Syntax

```markdown
# Heading 1
## Heading 2
### Heading 3

**Bold text**
*Italic text*
==Highlighted text==

- Bullet point
- Another point

1. Numbered item
2. Another item

> Blockquote text

`inline code`

\`\`\`javascript
// Code block with syntax highlighting
function hello() {
  console.log('Hello, world!');
}
\`\`\`

[Link text](https://example.com)

![Alt text](image-url)
```

**Highlighting:** Use `==text==` to highlight text with the theme's accent color. The highlight adapts to each theme automatically.

### Multiple Posts

Create multiple posts in a single document by separating them with `===`:

```markdown
# First Post
Your content here...

===

# Second Post
Your content here...

===

# Third Post
Your content here...
```

Use the **Prev/Next** buttons in the preview to navigate between posts. The counter shows your current position (e.g., "2/3").

### Post Metadata

Customize each post with metadata using YAML frontmatter at the top:

```markdown
---
theme: forest
imagePosition: bottom
---

# My Post
Your content here...

![image](blob:...)
```

**Available Options:**

- **theme**: `default`, `dark`, `light`, `forest`, `sunset`
- **imagePosition**: `top` (default) or `bottom`

**Example with multiple posts:**

```markdown
---
theme: default
imagePosition: top
---

# First Post
Content...

===

---
theme: sunset
imagePosition: bottom
---

# Second Post
Content...
```

### Exporting

- **Save**: Automatically saves your content to browser storage. Click "Save" to confirm.
- **Export MD**: Downloads your markdown file with a timestamp (e.g., `instagram-post-2025-10-27T15-28-07.md`)
- **Export as PNG**: Downloads all posts as PNG images with timestamps:
  - Single post: `instagram-post-2025-10-27T15-28-07.png`
  - Multiple posts: `instagram-post-2025-10-27T15-28-07-1.png`, `instagram-post-2025-10-27T15-28-07-2.png`, etc.

All exports include ISO timestamps in the filename for easy organization and version tracking.

## Project Structure

```
insta-post-generator/
├── src/
│   ├── components/
│   │   ├── PostEditor.jsx      # Text editor with formatting toolbar
│   │   └── PostPreview.jsx     # Live preview component
│   ├── App.jsx                 # Main application component
│   ├── theme.js                # Design system and color palette
│   ├── index.css               # Global styles
│   └── main.jsx                # React entry point
├── index.html                  # HTML template
├── vite.config.ts              # Vite configuration
├── package.json                # Dependencies and scripts
└── README.md                   # This file
```

## Design System

### Color Palette

- **Background**: `#0a192f` (Dark Blue)
- **Secondary**: `#112240` (Darker Blue)
- **Primary Accent**: `#64ffda` (Teal)
- **Text**: `#ccd6f6` (Light Blue)
- **Text Secondary**: `#8892b0` (Muted)
- **Border**: `#233554` (Dark Border)

### Typography

- **Primary Font**: Space Grotesk (headings, UI)
- **Secondary Font**: Inter (body text)
- Both loaded from Google Fonts for optimal performance

## Available Scripts

- `npm run dev` - Start development server with hot module replacement
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check code quality

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory. The build includes:
- Minified JavaScript and CSS
- Optimized images
- Source maps for debugging

To preview the production build locally:
```bash
npm run preview
```

## Tips & Tricks

- **Templates**: Start with the default content and modify it for your use case
- **Keyboard Shortcuts**: Use the toolbar buttons or type markdown directly
- **Persistence**: Your last post is automatically saved in browser storage
- **High Quality Exports**: PNG exports use 2x pixel ratio for crisp images on retina displays
- **Code Blocks**: Use triple backticks with language identifier for syntax highlighting:
  ```markdown
  \`\`\`python
  print("Hello")
  \`\`\`
  ```

## Customization

### Changing Colors

Edit `src/theme.js` to modify the color palette:

```javascript
export const theme = {
  colors: {
    background: '#0a192f',  // Change background color
    primary: '#64ffda',     // Change accent color
    // ... other colors
  },
  // ...
};
```

### Changing Fonts

Update the Google Fonts link in `src/App.jsx` and modify `src/theme.js`:

```javascript
fonts: {
  primary: '"Your Font Name", sans-serif',
  secondary: '"Another Font", sans-serif',
}
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- **Fast Development**: Vite provides instant HMR (Hot Module Replacement)
- **Optimized Exports**: PNG generation uses web workers for smooth performance
- **Minimal Bundle**: Tree-shaking and code splitting for optimal production builds

## Troubleshooting

**PNG export not working?**
- Ensure your content doesn't have external images that fail to load
- Try refreshing the page and trying again

**Fonts not loading?**
- Check your internet connection (Google Fonts requires online access)
- Clear browser cache and reload

**Content not saving?**
- Check browser storage settings (localStorage must be enabled)
- Try a different browser if issues persist

## License

MIT

## Contributing

Feel free to fork, modify, and use this project for your own Instagram post creation needs!
