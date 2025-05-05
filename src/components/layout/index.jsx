import Hero from '@/components/content-types/Hero';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const Page = ({ config, children }) => {
  // Ensure config and config.content exist to prevent errors
  const content = config?.content || {};
  
  return (
    <>
      <Header logo={content.logo} links={content.links || []} />
      {content.hero && <Hero hero={content.hero} />}
      <main>{children}</main>
      <Footer links={content.footer_links || []} />
    </>
  );
};

export default Page;
