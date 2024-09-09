import Hero from '@/components/content-types/Hero';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const Page = ({ config, children }) => {
  return (
    <>
      <Header logo={config.content.logo} links={config.content.links} />
      {config.content.hero && <Hero hero={config.content.hero} />}
      <main>{children}</main>
      <Footer links={config.content.footer_links} />
    </>
  );
};

export default Page;
