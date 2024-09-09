import Image from 'next/image';
import Link from 'next/link';

const Header = ({ logo, links }) => {
  console.log('Links:', links); // Log the links to check structure

  return (
    <header className="bg-gray-100 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        {/* Render the logo */}
        {logo && (
          <div className="flex-shrink-0">
            <Link href="/">
              <Image
                src={logo.filename}
                alt="Logo"
                width={100}
                height={40}
                className="h-12 w-auto object-contain" // Adjust size and make sure it fits
              />
            </Link>
          </div>
        )}

        {/* Render navigation links */}
        <nav>
          <ul className="flex space-x-8">
            {Array.isArray(links) &&
              links.slice(0, 3).map((link) => {
                const linkUrl =
                  link.Link.cached_url ||
                  link.Link.story?.url ||
                  link.Link.story?.full_slug
                    ? `/${link.Link.story.full_slug}`
                    : null;
                const linkName =
                  link.name || link.Link.story?.name || 'Unnamed Link';

                // Only display valid links
                return linkUrl ? (
                  <li key={link._uid}>
                    <Link href={linkUrl} className="text-gray-700 hover:text-blue-600 transition duration-300 ease-in-out">
                      {linkName}
                    </Link>
                  </li>
                ) : (
                  <li key={link._uid}>
                    <span className="text-red-600">Invalid Link</span>
                  </li>
                );
              })}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
