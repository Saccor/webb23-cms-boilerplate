/**
 * CSS Classnames used across the site
 */
export const cssClasses = [
  'navbar',
  'navbar .nav',
  'navbar .logo',
  'navbar .nav-link',
  'navbar .nav-link.search',
  'navbar .separator',
  'navbar .icon',

  'footer',
  'footer .newsletter-title',
  'footer .newsletter-text',
  'footer .newsletter-input',
  'footer .newsletter-button',
  'footer .col',
  'footer .col-shop',
  'footer .col-help',
  'footer .col-about',
  'footer .col-list',

  'shop-page',
  'shop-page .hero h1',
  'shop-page .hero p',
  'shop-page .filter-bar',
  'shop-page .filter',
  'shop-page .filter.active',
  'shop-page .product-grid',
  'shop-page .product-card',
  'shop-page .product-card .image',
  'shop-page .product-card .title',
  'shop-page .product-card .price',

  'product-detail-page',
  'hero-image',
  'detail-title',
  'detail-price',
  'detail-description',
  'fit-guide',
  'model-info',
  'color-options',
  'size-options',
  'option',
  'option.active',
  
  'about-page',
  'about-top',
  'banner',
  'hero3'
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
