# Image Storage Platform

A modern, dark-themed image storage and query platform built with React, TypeScript, and Vite.

## Features

- 🎨 **Dark Theme** - Sleek dark aesthetic with teal/cyan gradient accents
- 📤 **Drag & Drop Upload** - Intuitive image upload with visual feedback
- 🔍 **Search Functionality** - Search images by keywords, filenames, or tags
- 🖼️ **Gallery Grid** - Responsive image gallery with smooth hover effects
- ✨ **Smooth Animations** - Fade-in, scale, and transition animations throughout
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile

## Tech Stack

- React 18
- TypeScript
- Vite
- CSS3 (with animations)

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/
│   ├── Upload.tsx          # Upload component with drag-and-drop
│   ├── Upload.css
│   ├── Search.tsx          # Search component
│   ├── Search.css
│   ├── Gallery.tsx         # Gallery grid component
│   └── Gallery.css
├── types/
│   └── index.ts            # TypeScript type definitions
├── App.tsx                 # Main app component
├── App.css
├── main.tsx                # Entry point
└── index.css               # Global styles
```

## API Integration

The components include placeholder API calls that log to the console. To integrate with your backend:

1. **Upload API**: Update the fetch URL in `src/components/Upload.tsx` (line ~45)
2. **Search API**: Update the fetch URL in `src/components/Search.tsx` (line ~30)

### Expected API Responses

**Upload Response:**
```typescript
{
  success: boolean;
  image?: {
    id: string;
    url: string;
    filename: string;
    uploadedAt: string;
    size?: number;
  };
  error?: string;
}
```

**Search Response:**
```typescript
{
  success: boolean;
  images?: Array<{
    id: string;
    url: string;
    filename: string;
    uploadedAt: string;
    size?: number;
  }>;
  error?: string;
}
```

## Future Enhancements

- Image preview lightbox modal
- Batch operations (select multiple images)
- Image categories and tagging
- Pagination or infinite scroll
- Filter options (date, size, relevance)
- User authentication
- Image editing tools

## License

MIT

