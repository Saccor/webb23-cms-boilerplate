"use client";

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

//Uses config set global components for the layout
export default function Layout({ config, children }) {
    const pathname = usePathname();
    const isProductPage = pathname?.startsWith('/products/');
    
    // Extract navbar data from config using the structure in Storyblok
    const navbar = config?.content?.Navbar?.[0] || {};
    
    console.log("Navbar from Storyblok:", navbar);
    
    // Extract footer data - the first item in the footer array
    const footerData = config?.content?.footer?.[0] || {};
    
    // Transform the flat nav_links from Storyblok into a nested structure
    // This is a temporary solution until you update your Storyblok structure
    const createNestedNavLinks = () => {
        const navLinks = navbar.nav_links || [];
        
        // Clone the original nav_links to avoid modifying the original data
        const processedLinks = navLinks.map(item => ({
            text: item.text || '',
            url: item.url?.cached_url || item.url?.url || item.url || '/',
            children: []
        }));
        
        // Find the "Products" link and add children to it
        const productsLink = processedLinks.find(link => link.text === 'Products');
        if (productsLink) {
            // Add men's and women's categories as children
            productsLink.children = [
                {
                    text: "Men's",
                    url: "/products/mens",
                    children: []
                },
                {
                    text: "Women's",
                    url: "/products/womens",
                    children: []
                }
            ];
        }
        
        return processedLinks;
    };
    
    // Map the Storyblok structure to our Header component props with nested nav
    const headerProps = {
        logo_text: navbar.logo_text || '',
        nav_links: createNestedNavLinks(),
        search_placeholder: navbar.search_placeholder || '',
        theme: isProductPage ? 'dark' : 'light'
    };
    
    // Create footer props from the footer structure
    const footerProps = {
        newsletter: footerData.newsletter?.[0] || {},
        columns: footerData.columns || []
    };
    
    return (
        <div className="flex flex-col min-h-screen">
            <div className="w-full">
                <Header {...headerProps} />
            </div>
            <main className="flex-grow">
                {children}
            </main>
            <Footer {...footerProps} />
        </div>
    );
}
