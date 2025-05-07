# Next.js with Storyblok CMS - Student Guide

This project is a boilerplate for the WEBB23 CMS Course, featuring Next.js with Storyblok CMS integration. This guide will help you understand how to set up and work with this project.

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

## Storyblok Visual Editor Setup

A file named `editor.html` has been added to the project. This provides a way to use the Storyblok Visual Editor with your local development server.

To use the visual editor:
1. Make sure your local development server is running (`npm run dev`)
2. Open the `editor.html` file in your browser or navigate to it from your localhost
3. This will open a connection between your local development server and Storyblok's visual editor

## Project Structure

```
├── src/
│   ├── app/                   # Next.js 13+ App Router
│   │   ├── [...slug]/         # Dynamic routes for Storyblok pages
│   │   ├── page.js            # Home page
│   │   └── layout.js          # Root layout
│   ├── components/
│   │   ├── content-types/     # Storyblok content type components (Page)
│   │   ├── layout/            # Layout components
│   │   └── nestable/          # Nestable Storyblok components (Teaser, RichText)
│   ├── providers/
│   │   └── StoryblokProvider.jsx  # Storyblok context provider
│   └── utils/
│       └── cms.js             # Storyblok API utilities
├── .env.local                 # Environment variables (you need to create this)
├── .env-example               # Example environment variables
└── editor.html               # Storyblok visual editor bridge
```

## Storyblok Components

The project is set up with some initial components:

1. **Content Types**:
   - `Page` - Main content type for all pages

2. **Nestable Components**:
   - `Teaser` - A simple teaser component
   - `RichText` - Rich text component

## Adding New Components

To add a new Storyblok component:

1. Create the component in `src/components/nestable/`
2. Register it in `src/providers/StoryblokProvider.jsx`
3. Create the corresponding Storyblok content type in your Storyblok space

Example of registering a new component:
```javascript
// In StoryblokProvider.jsx
const components = {
  "page": Page,
  "teaser": Teaser,
  "richtext": RichTextDefault,
  "your-new-component": YourNewComponent  // Add your component here
}
```

## How Content Is Fetched

1. The home page at `/` fetches the "home" story from Storyblok
2. Dynamic pages at `/[...slug]` fetch stories based on the URL path
3. The `StoryblokCMS` utility in `src/utils/cms.js` handles all API calls

## Development Tips

1. **Preview Mode**: Use the Storyblok visual editor to see changes in real-time
2. **Static Generation**: The site uses static generation for production but dynamic rendering in development
3. **Component Structure**: Follow the existing patterns when creating new components
4. **TailwindCSS**: The project uses TailwindCSS for styling

## Deploying Your Project

For production deployment, use Vercel:

1. Push your code to a Git repository
2. Connect your repository to Vercel
3. Ensure you add the environment variables to your Vercel project
4. Deploy

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Storyblok Documentation](https://www.storyblok.com/docs)
- [Storyblok React SDK](https://github.com/storyblok/storyblok-react)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)

## Troubleshooting

- If content isn't loading, check your `.env.local` file and make sure the tokens are correct
- Make sure you've created the necessary content types in your Storyblok space
- Check the browser console for any API errors
