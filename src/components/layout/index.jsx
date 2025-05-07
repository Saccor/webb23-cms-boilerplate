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
    
    // Extract footer data - the first item in the footer array
    const footerData = config?.content?.footer?.[0] || {};
    
    // Map the Storyblok structure to our Header component props
    const headerProps = {
        logo_text: navbar.logo_text || '',
        nav_links: navbar.nav_links?.map(item => ({
            text: item.text || '',
            url: item.url?.cached_url || item.url?.url || item.url || '/' 
        })) || [],
        search_placeholder: navbar.search_placeholder || ''
    };
    
    // Create footer props from the footer structure
    const footerProps = {
        newsletter: footerData.newsletter?.[0] || {},
        columns: footerData.columns || []
    };
    
    return (
        <div className="flex flex-col min-h-screen">
            <Header {...headerProps} />
            <main className={`flex-grow ${isProductPage ? '' : 'container mx-auto px-4 py-8'}`}>
                {children}
            </main>
            <Footer {...footerProps} />
        </div>
    );
}