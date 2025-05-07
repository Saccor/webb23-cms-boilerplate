"use client";

import Header from './Header';
import Footer from './Footer';

//Uses config set global components for the layout
export default function Layout({ config, children }) {
    // Log the entire config to see its structure
    console.log("Config data:", config);
    
    // Extract navbar data from config using the structure in Storyblok
    // Note: Using 'Navbar' with capital N to match Storyblok's field name
    const navbar = config?.content?.Navbar?.[0] || {};
    console.log("Navbar data:", navbar);
    
    // Log more details about the structure
    console.log("Navbar logo_text:", navbar.logo_text);
    console.log("Navbar nav_links:", navbar.nav_links);
    console.log("Navbar search_placeholder:", navbar.search_placeholder);
    
    // Extract footer data - the first item in the footer array
    const footerData = config?.content?.footer?.[0] || {};
    console.log("Footer data:", footerData);
    
    // Map the Storyblok structure to our Header component props
    const headerProps = {
        logo_text: navbar.logo_text || '',
        nav_links: navbar.nav_links?.map(item => {
            console.log("NavLink item:", item);
            return {
                text: item.text || '',
                url: item.url?.cached_url || item.url?.url || item.url || '/' 
            };
        }) || [],
        search_placeholder: navbar.search_placeholder || ''
    };
    
    // Create footer props from the footer structure
    const footerProps = {
        newsletter: footerData.newsletter?.[0] || {},
        columns: footerData.columns || []
    };
    
    console.log("Header props:", headerProps);
    console.log("Footer props:", footerProps);
    
    return (
        <>
            <Header {...headerProps} />
            <main className="container mx-auto px-4 py-8">{children}</main>
            <Footer {...footerProps} />
        </>
    );
}