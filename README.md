# Next.js with Storyblok CMS

A modern e-commerce boilerplate featuring Next.js 13+ with Storyblok CMS integration, following a provided Figma design.

## Features

- 🚀 Next.js 13+ with App Router
- 📝 Storyblok CMS Integration
- 🎨 Responsive Design with TailwindCSS
- 🔍 Built-in Search Functionality
- 📱 Mobile-First Approach
- 🌗 Light/Dark Theme Support
- 🔒 Type-Safe Development
- 📦 Component-Based Architecture

## Implementation Requirements

### Core Features (Required)
- ✅ All content managed through Storyblok
- ✅ Header navigation (single level) from Config story
- ✅ Footer content from Config story
- ✅ Robots.txt implementation
- ✅ Sitemap generation using Links API
- ✅ Vercel deployment
- ✅ Storyblok webhook integration

### Advanced Features
- ✅ Multi-level navigation menu
- ✅ Client-side product search
- ✅ Dynamic Hero background color


### Component Structure

```
Components/
├── content-types/
│   ├── Page
│   ├── ProductPage
│   └── Config
├── layout/
│   ├── Header
│   └── Footer
└── nestable/
    ├── ProductList
    ├── LatestProductsList
    ├── SearchBar
    ├── ImageBanner
    ├── Hero
    └── ImageWithText
```

## Quick Start

### Prerequisites

- Node.js 18.x or later
- npm 9.x or later
- A Storyblok account

### Installation

1. Clone the repository:
```bash
git clone [your-repo-url]
cd [your-project-name]
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Create .env.local and add:
NEXT_PUBLIC_PREVIEW_STORYBLOK_TOKEN="your_preview_token"
NEXT_PUBLIC_PRODUCTION_STORYBLOK_TOKEN="your_production_token"
```

4. Start the development server:
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your application.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── [...slug]/         # Dynamic routes
│   ├── api/               # API endpoints
│   └── layout.js          # Root layout
├── components/
│   ├── content-types/     # Page templates
│   ├── layout/           # Layout components
│   └── nestable/         # Reusable components
├── providers/            # Context providers
└── utils/               # Utility functions
```

## Implementation Guide

### 1. Storyblok Setup

```bash
# Config Story Structure
config/
├── header/
│   ├── logo
│   ├── navigation (multi-level)
│   └── search
└── footer/
    └── content
```

### 2. API Integration

```javascript
// robots.js
export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  }
}

// sitemap.js
export default async function sitemap() {
  // Implement Storyblok Links API
  // Return formatted sitemap
}
```

### 3. Search Implementation

```typescript
// Client-side search using Storyblok API
const searchProducts = async (query: string) => {
  // Implement search logic
}
```

### 4. Deployment Steps

1. Push to GitHub repository
2. Connect to Vercel
3. Configure environment variables
4. Set up Storyblok webhook:
   - Webhook URL: `[your-vercel-url]/api/revalidate`
   - Events: `story.published`, `story.unpublished`

## Best Practices

### Component Development

- Use TypeScript for type safety
- Implement "use client" directive for interactive components
- Follow Atomic Design principles
- Maintain consistent naming conventions
- Keep components focused and single-responsibility

### Storyblok Integration

- Create reusable content types
- Implement proper content modeling
- Use nested components for flexibility
- Maintain consistent field naming
- Cache API calls appropriately

### Performance

- Implement image optimization
- Use proper loading strategies
- Minimize client-side JavaScript
- Optimize for Core Web Vitals
- Enable proper caching strategies

### Styling

- Use CSS Modules for component-specific styles
- Follow mobile-first approach
- Implement responsive design patterns
- Maintain consistent spacing system
- Use design tokens for theming

## Development Workflow

1. **Content Modeling**
   - Plan your content structure in Storyblok
   - Create reusable components
   - Define clear content relationships

2. **Component Development**
   - Create components in `src/components`
   - Register in `StoryblokProvider.jsx`
   - Add corresponding Storyblok schemas

3. **Testing**
   - Test components in isolation
   - Verify responsive behavior
   - Check content integration
   - Validate user interactions

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Content not appearing | Verify content is published in Storyblok |
| Styling inconsistencies | Check CSS module imports and class names |
| Type errors | Ensure proper TypeScript definitions |
| Build errors | Verify all dependencies are installed |

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Storyblok Documentation](https://www.storyblok.com/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)