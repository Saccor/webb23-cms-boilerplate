import Image from 'next/image';
import Link from 'next/link';

const Header = ({ logo, links }) => {
  console.log('Links:', links); // Log the links to check structure

  return (
    <div className="flex justify-between items-center p-4 bg-gray-100">
      {/* Render the logo */}
      {logo && (
        <div className="logo">
          <Image src={logo.filename} alt="Logo" width={100} height={50} />
        </div>
      )}

      {/* Render navigation links */}
      <nav>
        <ul className="flex space-x-4">
          {Array.isArray(links) && links.map((link) => (
            <li key={link._uid}>
              {/* Check for both internal and external link URLs */}
              {link.cached_url || link.url ? (
                <Link href={link.cached_url || link.url}>
                  <a className="text-blue-600 hover:text-blue-800">{link.name || 'Unnamed Link'}</a>
                </Link>
              ) : (
                <span>Invalid Link</span>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Header;
