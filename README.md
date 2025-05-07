# Next.js with Storyblok CMS - Developer Guide

This project is a boilerplate for WEBB23 CMS Course, featuring Next.js with Storyblok CMS integration. This guide covers setup, configuration, and development workflows.

## Getting Started

### 1. Setup Environment Variables

1. Create a `.env.local` file in the root directory
2. Add the following variables from your Storyblok account:
   ```
   NEXT_PUBLIC_PREVIEW_STORYBLOK_TOKEN="your_preview_token"
   NEXT_PUBLIC_PRODUCTION_STORYBLOK_TOKEN="your_production_token"
   ```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

This will start the Next.js development server at [http://localhost:3000](http://localhost:3000).

## Storyblok Structure

### Config Setup

The site uses a global "Config" story in Storyblok with the slug "config". This story must contain:

1. **Navbar** (Block field with component "navbar")
   - `logo_text` - Text for the site logo
   - `nav_links` - Array of navigation links (component "navlink")
     - `text` - Link text
     - `url` - Link URL (Storyblok link)
   - `search_placeholder` - Text for the search box

2. **Footer** (Block field with component "footer")
   - `newsletter` - Newsletter signup block
     - `title` - Newsletter title
     - `description` - Newsletter description
     - `placeholder` - Input placeholder text
     - `button_text` - Button text
   - `columns` - Array of footer columns
     - `heading` - Column heading
     - `links` - Array of links in the column

Make sure to publish your config story after making changes.

## Project Structure

```
├── src/
│   ├── app/                   # Next.js 13+ App Router
│   │   ├── [...slug]/         # Dynamic routes for Storyblok pages
│   │   ├── page.js            # Home page 
│   │   ├── layout.js          # Root layout
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── content-types/     # Content type components
│   │   │   └── Page.jsx       # Main page component
│   │   ├── layout/            # Layout components
│   │   │   ├── index.jsx      # Main layout wrapper
│   │   │   ├── Header.jsx     # Header component
│   │   │   ├── Footer.jsx     # Footer component
│   │   │   ├── Header.module.css  # Header styles
│   │   │   └── Footer.module.css  # Footer styles
│   │   └── nestable/          # Nestable Storyblok components
│   │       ├── Teaser.jsx     # Teaser component
│   │       ├── RichText.jsx   # Rich text component
│   │       ├── Newsletter.jsx # Newsletter component
│   │       └── FooterColumn.jsx # Footer column component
│   ├── providers/
│   │   └── StoryblokProvider.jsx  # Storyblok context provider
│   └── utils/
│       └── cms.js             # Storyblok API utilities
├── .env.local                 # Environment variables (you need to create this)
├── .env-example               # Example environment variables
```

## Component Structure

### Layout System

The layout system consists of three main components:

1. **Layout (index.jsx)**
   - Main wrapper component that receives the config data
   - Extracts navbar and footer data and passes it to respective components
   - Wraps the page content in a flex container to ensure footer is at the bottom

2. **Header (Header.jsx)**
   - Displays the logo, navigation links and search
   - Uses absolute positioning for precise placement
   - The separator line spans the full width of the viewport

3. **Footer (Footer.jsx)**
   - Displays newsletter signup and footer columns
   - Uses CSS grid for responsive layout
   - Automatically stays at the bottom of the screen with flexbox

### CSS Structure

We use CSS Modules for component-specific styling:

- **Header.module.css**: Controls header layout with absolute positioning
- **Footer.module.css**: Manages footer grid layout
- **globals.css**: Contains site-wide styles and flexbox setup for sticky footer

## Storyblok Components

The project includes the following Storyblok components:

1. **Content Types**:
   - `Page` - Main content type for all pages

2. **Nestable Components**:
   - `Teaser` - A simple teaser component
   - `RichText` - Rich text component
   - `Newsletter` - Newsletter signup component
   - `FooterColumn` - Footer column component

## Adding New Components

To add a new Storyblok component:

1. Create the component in `src/components/nestable/`
2. If it's client-side interactive, add `"use client"` at the top
3. Register it in `src/providers/StoryblokProvider.jsx`
4. Create the corresponding Storyblok content type in your Storyblok space

Example:
```javascript
// In StoryblokProvider.jsx
const components = {
  "page": Page,
  "teaser": Teaser,
  "richtext": RichTextDefault,
  "your-new-component": YourNewComponent
}
```

## Data Flow

1. **Config Data**:
   - `layout.js` fetches the global config story
   - The config contains Navbar and Footer data
   - Data is passed to the Layout component, which distributes it

2. **Page Data**:
   - The home page fetches the "home" story
   - Dynamic pages fetch stories based on their slug
   - Page content is rendered within the Layout

## Responsive Design

- Header has media queries for different screen sizes
- Footer uses CSS grid with responsive breakpoints
- The main layout uses flexbox for a sticky footer

## Development Best Practices

1. **Case Sensitivity**: Storyblok field names are case-sensitive (e.g., "Navbar" vs "navbar")
2. **Client Components**: Add `"use client"` directive to components with interactive elements
3. **URL Handling**: Use `cached_url` or `url` from Storyblok link objects
4. **Error Handling**: Always provide fallbacks for missing data
5. **Debugging**: Use console logs to debug data structures (see existing code for examples)

## Troubleshooting

- **Content not appearing**: Check browser console logs for data structure
- **Case sensitivity**: Ensure Storyblok field names match exactly what your code expects
- **Missing content**: Verify that you've published your content in Storyblok
- **Styling issues**: Check CSS modules and class names
- **Link issues**: Verify URL structure from Storyblok link objects

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Storyblok Documentation](https://www.storyblok.com/docs)
- [Storyblok React SDK](https://github.com/storyblok/storyblok-react)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)

## Storyblok Visual Editor Setup

A file named `editor.html` has been added to the project. This provides a way to use the Storyblok Visual Editor with your local development server.

To use the visual editor:
1. Make sure your local development server is running (`npm run dev`)
2. Open the `editor.html` file in your browser or navigate to it from your localhost
3. This will open a connection between your local development server and Storyblok's visual editor
