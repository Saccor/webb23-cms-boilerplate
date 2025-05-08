/**
 * CSS Classnames used across the site
 */
export const cssClasses = [
  /* Header/Navbar classes */
  'navbar',                 // Main header container with white/dark background
  'navbar.darkTheme',       // Dark theme variant for product pages
  'navbar .nav',            // Navigation links container
  'navbar .logo',           // Site logo
  'navbar .nav-link',       // Individual navigation links
  'navbar .nav-item',       // Navigation item with dropdown
  'navbar .dropdown',       // Dropdown container
  'navbar .dropdown-link',  // Dropdown menu links
  'navbar .search-link',    // Search field in navigation
  'navbar .search-expanded', // Expanded search field
  'navbar .search-results', // Search results dropdown
  'navbar .expanded-search', // Container for expanded search
  'navbar .search-input',   // Search input field
  'navbar .close-button',   // Close button for search
  'navbar .separator',      // Bottom border - thin black separator line (50% opacity)
  'navbar .icon',           // Icon container on the right 
  'navbar.border-b',        // Tailwind class for bottom border
  
  /* Footer classes */
  'footer',                   // Main footer container with light gray background
  'footer .grid',             // 4-column grid layout
  'footer .newsletter-section', // Newsletter section (1.8fr width)
  'footer .newsletter-title',  // Newsletter section title
  'footer .newsletter-desc',   // Newsletter section description
  'footer .newsletter-form',   // Newsletter form container
  'footer .input',            // Newsletter input field
  'footer .button',           // Newsletter submit button
  'footer .column',           // Footer column container
  'footer .column-title',     // Column heading
  'footer .column-list',      // List of links in column
  'footer .link',             // Individual footer link

  /* Shop Page classes */
  'shop-page',                // Main shop page container
  'shop-page .hero h1',       // Shop page title
  'shop-page .hero p',        // Shop page introduction text
  'shop-page .filter-bar',    // Category filter container
  'shop-page .filter',        // Individual category filter
  'shop-page .filter.active', // Active/selected filter
  'shop-page .product-grid',  // Product grid container
  'shop-page .product-card',  // Individual product card
  'shop-page .product-card .image', // Product image container
  'shop-page .product-card .title', // Product title
  'shop-page .product-card .price', // Product price
  
  /* Product Detail Page classes */
  'product-detail-page',      // Main product detail page
  'hero-image',               // Main product image
  'detail-title',             // Product title
  'detail-price',             // Product price
  'detail-description',       // Product description
  'fit-guide',                // Fit information
  'model-info',               // Model information
  'color-options',            // Color options container
  'size-options',             // Size options container
  'option',                   // Option item (color/size)
  'option.active',            // Selected option
  
  /* About Page classes */
  'about-page',              // Main about page container
  'about-top',               // Top section of about page
  'banner',                  // Full-width banner component
  'hero3'                    // Hero section with 3-column layout
];

/**
 * Storyblok schema definitions for "Shop List Page"
 */
export const storyblokSchema = {
  contentType: 'shop-list-page',
  fields: {
    title:            'story.content.title',           // Page title
    introText:        'story.content.introText',       // Above filters
    categories:       'story.content.categories',      // Array of Category blocks
    products_top:     'story.content.products_top',    // First grid
    description:      'story.content.description',     // Single‐line text
    products_bottom:  'story.content.products_bottom', // Second grid
  },
  components: {
    category: {
      component: 'category',
      props: {
        name:   'name',   // e.g. "Sweaters"
        slug:   'slug',   // e.g. "sweaters"
        active: 'active', // boolean
      }
    },
    productCard: {
      component: 'product-card',
      props: {
        title: 'title',  // e.g. "Men's Winter Jacket"
        price: 'price',  // e.g. "$99"
        size:  'size',   // e.g. "M"
        image: 'image',  // asset object
      }
    }
  }
};

/**
 * Storyblok schema definitions for "NavLink" component (multi-level menu)
 */
export const navLinkSchema = {
  component: 'navlink',
  props: {
    text: 'text',         // Link text (required)
    url: 'url',           // Storyblok link (required)
    children: 'children', // Array of nested navlink components (optional)
  }
};

/**
 * Storyblok schema definitions for "Navbar" component
 */
export const navbarSchema = {
  component: 'navbar',
  props: {
    logo_text: 'logo_text',                 // Site logo text (required)
    nav_links: 'nav_links',                 // Array of navlink components (required)
    search_placeholder: 'search_placeholder', // Text for search field (optional)
    theme: 'theme',                         // Theme setting (light/dark) (optional)
  }
};

/**
 * Storyblok schema definitions for "Footer" component
 */
export const footerSchema = {
  component: 'footer',
  props: {
    newsletter: {
      component: 'newsletter',
      props: {
        title: 'title',           // Newsletter title (required)
        description: 'description', // Newsletter description (required)
        placeholder: 'placeholder', // Input placeholder (optional)
        button_text: 'button_text', // Button text (optional)
      }
    },
    columns: {
      component: 'footer_column',
      isListField: true,
      props: {
        heading: 'heading',       // Column heading (required)
        links: {                  // Array of links (required)
          component: 'link',
          props: {
            text: 'text',         // Link text
            url: 'url',           // Link URL
          }
        }
      }
    }
  }
};

/**
 * Storyblok schema definitions for "Product"
 */
export const productSchema = {
  contentType: 'product',
  fields: {
    slug:         'story.content.slug',          // Auto-generated from title
    title:        'story.content.title',         // Product title
    heroImage:    'story.content.heroImage',     // Main product image
    price:        'story.content.price',         // Product price
    description:  'story.content.description',   // Product description
    fitGuide:     'story.content.fitGuide',      // Fit information
    modelInfo:    'story.content.modelInfo',     // Model information
    colors:       'story.content.colors',        // Array of color options
    sizes:        'story.content.sizes',         // Array of size options
  },
  components: {
    colorOption: {
      component: 'color-option',
      props: {
        colorHex: 'colorHex',  // e.g. "#000000"
        active:   'active',    // boolean
      }
    },
    sizeOption: {
      component: 'size-option',
      props: {
        label:  'label',       // e.g. "M"
        active: 'active',      // boolean
      }
    }
  }
};

/**
 * Storyblok schema definitions for "About Page"
 */
export const aboutPageSchema = {
  contentType: 'about_page',
  fields: {
    sections: 'story.content.sections',  // Array of block components
  }
};

/**
 * Storyblok schema definitions for "AboutTop" component
 */
export const aboutTopSchema = {
  component: 'about_top',
  props: {
    title: 'title',         // Heading text (required)
    subtitle: 'subtitle',   // Descriptive subtitle (optional)
    body: 'body',           // Rich text content (required)
  },
  styling: {
    layout: 'Clean, centered layout with generous spacing',
    typography: {
      title: 'font-public, text-4xl/5xl/6xl, font-semibold, text-center',
      subtitle: 'text-xl, text-gray-600, text-center',
      body: 'font-public, text-lg, tracking-[-0.4px], leading-[1.4], text-[#979797]'
    },
    spacing: {
      top: 'pt-32 md:pt-36',
      bottom: 'pb-16 md:pb-24',
      title_to_body: 'mt-[61px]'
    }
  }
};

/**
 * Storyblok schema definitions for "Banner" component
 */
export const bannerSchema = {
  component: 'banner',
  props: {
    image: 'image',               // Asset (image) (required)
    alt: 'alt',                   // Alt text for accessibility (optional)
    overlay_text: 'overlay_text'  // Optional overlay headline (optional)
  },
  styling: {
    layout: 'Full-width edge-to-edge image with responsive height',
    dimensions: {
      mobile: 'h-[316px]',
      desktop: 'md:h-[400px]'
    },
    overlay: 'Semi-transparent black background (30% opacity) with centered white text',
    technical: 'Uses negative margin technique for full-width display'
  }
};

/**
 * Storyblok schema definitions for "Hero3" component
 */
export const hero3Schema = {
  component: 'hero3',
  props: {
    title: 'title',               // Heading text (required)
    subtitle: 'subtitle',         // Sub-heading text (optional)
    cta: 'cta',                   // Call-to-action button (array)
    products: 'products',         // Product images (array)
  },
  styling: {
    layout: 'Centered content with specific spacing and 3-column product grid',
    typography: {
      title: 'font-public, text-[56px], leading-[62px], tracking-[-2.4px], text-center',
      subtitle: 'text-[20px], leading-[28px], text-[#979797], tracking-[-0.4px], text-center'
    },
    spacing: {
      top: 'pt-[126px]',
      title_to_subtitle: 'mt-4 md:mt-6',
      subtitle_to_button: 'mt-4 md:mt-6',
      button_to_products: 'mt-[151px]'
    },
    products: {
      grid: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
      middle_offset: 'md:-mt-[85px] on middle product',
      dimensions: 'w-full max-w-[368px] aspect-[368/521]'
    }
  }
};

/**
 * Storyblok schema definitions for "Button" component
 */
export const buttonSchema = {
  component: 'button',
  props: {
    text: 'text',       // Button text (required)
    link: 'link',       // Storyblok link object (required)
  },
  styling: {
    dimensions: 'w-[194px] h-[50px]',
    typography: 'font-public font-semibold text-[16px] leading-[22px] tracking-[-0.4px]',
    appearance: 'Border with transparent background, centered text',
    hover: 'Black background with white text on hover'
  }
};

/**
 * Storyblok schema definitions for "Image" component
 */
export const imageSchema = {
  component: 'image',
  props: {
    image: 'image',     // Product image (asset) (required)
    alt: 'alt',         // Alt text (optional)
    link: 'link',       // Storyblok link object (optional)
  },
  styling: {
    dimensions: 'aspect-[368/521], max-h-[521px]',
    background: 'bg-[#C4C4C4]',
    appearance: 'Object-cover fit for proper image display'
  }
};

/**
 * Storyblok schema definitions for "Hero1" component
 */
export const hero1Schema = {
  component: 'hero1',
  props: {
    title: 'title',               // Heading text (required)
    subtitle: 'subtitle',         // Sub-heading text (optional)
    image: 'image',               // Hero image (required)
    elements: 'elements',         // Additional content blocks (array, optional)
    backgroundColor: 'backgroundColor', // Background color (optional, default: white)
  },
  styling: {
    layout: 'Side-by-side content and image on desktop, stacked on mobile',
    typography: {
      title: 'font-public, text-[32px-56px], tracking-[-1px], font-semibold',
      subtitle: 'text-[18px-20px], text-[#4A4A4A], tracking-[-0.4px]'
    },
    spacing: {
      top: 'pt-[80px]',
      bottom: 'pb-16 md:pb-24',
      title_to_subtitle: 'mb-6',
      subtitle_to_elements: 'mb-8'
    },
    image: {
      dimensions: 'h-[300px] md:h-[400px]',
      style: 'rounded-lg overflow-hidden'
    },
    responsive: 'Flexible layout that adapts to all screen sizes with column stacking on mobile'
  }
};

/**
 * Storyblok schema definitions for "ProductList" component
 */
export const productListSchema = {
  component: 'product-list',
  props: {
    title: 'title',               // Section title (optional)
    category_filter: 'category_filter', // Enable category filtering (boolean)
    products: {                   // Array of products
      component: 'product-card',
      props: {
        title: 'title',          // Product title
        price: 'price',          // Product price
        image: 'image',          // Product image
        category: 'category',    // Product category
        link: 'link'            // Product link
      }
    }
  }
};

/**
 * Storyblok schema definitions for "LatestProductsList" component
 */
export const latestProductsListSchema = {
  component: 'latest-products-list',
  props: {
    title: 'title',              // Section title (e.g., "New Arrivals")
    description: 'description',   // Section description
    products: {                  // Array of featured products
      component: 'product-card',
      props: {
        title: 'title',         // Product title
        price: 'price',         // Product price
        image: 'image',         // Product image
        isNew: 'isNew',        // New product flag
        link: 'link'           // Product link
      }
    },
    max_products: 'max_products' // Maximum products to display
  }
};

/**
 * Storyblok schema definitions for "ImageWithText" component
 */
export const imageWithTextSchema = {
  component: 'image-with-text',
  props: {
    image: 'image',              // Asset field for image
    image_position: 'image_position', // left/right
    title: 'title',              // Section title
    content: 'content',          // Rich text content
    cta: {                       // Optional CTA button
      component: 'button',
      props: {
        text: 'text',           // Button text
        link: 'link',           // Button link
        style: 'style'          // Button style
      }
    }
  }
};

/**
 * Storyblok schema definitions for "ImageBanner" component
 */
export const imageBannerSchema = {
  component: 'image-banner',
  props: {
    image: 'image',              // Asset field for banner image
    overlay_text: 'overlay_text', // Text to display over image
    text_position: 'text_position', // Text positioning
    link: 'link',                // Optional banner link
    overlay_opacity: 'overlay_opacity' // Opacity of text background
  }
};
