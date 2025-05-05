# Webb23 CMS Course Boilerplate

A Next.js project with Storyblok CMS integration, designed as a boilerplate for the WEBB23 CMS Course.

## Features

- Next.js 14 with App Router
- Storyblok CMS integration
- Tailwind CSS for styling
- Dynamic routing and static site generation
- Component-based architecture
- SEO optimization with metadata support

## Project Structure

- `src/app`: Next.js App Router pages
- `src/components`: Reusable components organized by type (layout, content-types, nestable)
- `src/providers`: Storyblok integration providers
- `src/utils`: Utility functions, including CMS helper methods

## Storyblok Components

The following components are configured for use with Storyblok:
- Page: Main content type for pages
- Teaser: Content block component
- RichText: Rich text editor component

## Styling

The project uses Tailwind CSS with a custom configuration:

### Colors
- Primary: `#0D0D0D`
- Secondary: `#979797`
- Background: `#EFF2F6`
- Black: `#000000`

### Fonts
- Public Sans: Main font for headings and body text
- Inter: Secondary font

### Typography
Custom font sizes are configured for consistent typography:
- h1: 4.5rem (72px)
- h2: 3.5rem (56px)
- h3: 2.25rem (36px)
- h4: 1.375rem (22px)
- h5: 1rem (16px)
- base: 1.125rem (18px)
- lg: 1.25rem (20px)
- sm: 0.875rem (14px)

### Breakpoints
Standard Tailwind breakpoints plus:
- 2xl: 1400px

## Getting Started

### Prerequisites

- Node.js (LTS version recommended)
- Storyblok account with API access

### Installation

1. Clone this repository:
```bash
git clone <repository-url>
cd webb23-cms-boilerplate
```

2. Install dependencies:
```bash
npm install
```

3. Environment Setup:

Create a `.env` file based on the provided `.env-example`:
```
NEXT_PUBLIC_PREVIEW_STORYBLOK_TOKEN=""
NEXT_PUBLIC_PRODUCTION_STORYBLOK_TOKEN=""
STORYBLOK_SPACE_ID=""
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Storyblok Setup

1. Create a Storyblok space and get your API tokens
2. Add your API tokens to the `.env` file
3. Start creating content using the predefined components

## Development Workflow

1. Create or modify components in the `src/components` directory
2. Register new components in `src/providers/StoryblokProvider.jsx`
3. Create corresponding content types in Storyblok

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new) from the creators of Next.js.

Check out [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
