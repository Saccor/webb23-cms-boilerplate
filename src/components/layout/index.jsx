import Header from './Header'; // Ensure the correct path to Header

export default function Layout({ config, children }) {
  console.log('Config:', config); // Add this line to log the config object

  return (
    <>
      <header>
        {/* Pass config to Header */}
        {config && <Header logo={config.content.logo} links={config.content.links} />}
      </header>
      <main>{children}</main>
      <footer>Footer Placeholder</footer>
    </>
  );
}
