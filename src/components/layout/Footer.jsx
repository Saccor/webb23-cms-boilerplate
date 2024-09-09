import Link from 'next/link';

const Footer = ({ links }) => {
  // You can add more sections like company info or social media links if you want
  const footerLinks = links?.slice(0, 4) || []; // Modify this depending on how many footer links you want

  return (
    <footer className="bg-gray-100 py-4 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
          {/* Footer Links */}
          <nav className="space-y-2">
            <h3 className="text-gray-700 font-semibold">Quick Links</h3>
            <ul className="space-y-1">
              {Array.isArray(footerLinks) && footerLinks.map((link) => {
                const linkUrl = link.Link.cached_url || link.Link.story?.url || link.Link.story?.full_slug ? `/${link.Link.story.full_slug}` : null;
                const linkName = link.name || link.Link.story?.name || 'Unnamed Link';

                return linkUrl ? (
                  <li key={link._uid}>
                    <Link href={linkUrl} className="text-gray-600 hover:text-gray-800">
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

          {/* Company Info */}
          <div className="space-y-2">
            <h3 className="text-gray-700 font-semibold">Company</h3>
            <ul className="space-y-1">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-gray-800">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-gray-800">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Privacy & Legal */}
          <div className="space-y-2">
            <h3 className="text-gray-700 font-semibold">Legal</h3>
            <ul className="space-y-1">
              <li>
                <Link href="/privacy-policy" className="text-gray-600 hover:text-gray-800">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-gray-800">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom Section */}
        <div className="mt-4 text-gray-400 text-xs text-center">
          <p>© 2023 Your Company. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
