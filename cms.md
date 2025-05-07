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
    title: 'title',  // Heading text
    subtitle: 'subtitle', // Descriptive subtitle (optional)
    body: 'body',    // Rich text content
  }
};

/**
 * Storyblok schema definitions for "Banner" component
 */
export const bannerSchema = {
  component: 'banner',
  props: {
    image: 'image',  // Asset (image)
    alt: 'alt',      // Alt text (optional)
    overlay_text: 'overlay_text'  // Optional overlay headline
  }
};

/**
 * Storyblok schema definitions for "Hero3" component
 */
export const hero3Schema = {
  component: 'hero3',
  props: {
    title: 'title',        // Heading text
    subtitle: 'subtitle',  // Sub-heading text
    cta: 'cta',            // Call-to-action blocks
    products: 'products',  // Product blocks
  }
};
