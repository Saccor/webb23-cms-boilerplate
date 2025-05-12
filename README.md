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
  // Search both ShopListPage products and standalone products
  const allProducts = [];
  
  // Add products from ShopListPages
  const shopListPages = await fetchShopListPages();
  shopListPages.forEach(page => {
    if (page.content?.products) {
      allProducts.push(...page.content.products);
    }
  });
  
  // Add standalone products
  const standaloneProducts = await fetchStandaloneProducts();
  allProducts.push(...standaloneProducts);
  
  // Filter products by search query
  return allProducts.filter(product => 
    product.name.toLowerCase().includes(query.toLowerCase())
  );
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
| Category filtering issues | Use regex word boundary matching (`\b`) to prevent partial matches (e.g., "men's" in "women's") |
| Incorrect navigation links | Ensure all URLs start with a forward slash (`/`) for consistent absolute paths |
| Search not finding all products | Implement comprehensive search across both ShopListPage products and standalone products |
| Duplicate/missing category items | Add detailed logging and category validation in product filtering logic |

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

## Recent Updates

### E-commerce Content and Navigation Enhancements
- Fixed category page filtering with improved regex word boundary matching to distinguish between "men's" and "women's" products
- Implemented absolute path URLs in navigation to ensure consistent routing from any page
- Enhanced search functionality to include both ShopListPage products and standalone products
- Added category badges and improved styling for search result display
- Ensured consistent product detail page linking across the application

### Sitemap Implementation Enhancements
- Switched from Links API to Stories API for more comprehensive sitemap generation
- Added dual sitemap implementation with improved caching strategy
- Enhanced error handling and fallback methods for production environment
- Fixed date handling in sitemap and robots files
- Simplified sitemap route handler for better Next.js 14 compatibility

### API Integration Improvements
- Refactored search and sitemap routes to utilize StoryblokCMS for consistent API access
- Streamlined token handling for improved security
- Enhanced debugging capabilities for API calls
- Removed direct Next.js imports to avoid build warnings

### Performance Optimizations
- Improved error handling for API requests
- Enhanced revalidation mechanisms for content updates
- Standardized API access patterns across components