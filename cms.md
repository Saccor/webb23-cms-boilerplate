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
