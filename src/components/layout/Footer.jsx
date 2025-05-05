import Link from 'next/link';

const Footer = ({ links }) => {
  // Ensure links is always an array
  const footerLinks = Array.isArray(links) ? links : [];
  
  return (
    <footer className="bg-gray-100 w-full py-10 text-gray-900">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Sign-up Section */}
          <div className="col-span-1">
            <h3 className="text-xl font-bold mb-2">
              Sign up for our newsletter
            </h3>
            <p className="text-base mb-4">
              Be the first to know about our special offers, new product launches, and events.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Email Address"
                className="px-4 py-2 w-full border border-gray-300 rounded-l"
              />
              <button className="bg-black text-white px-6 py-2 rounded-r">Sign Up</button>
            </div>
          </div>

          {/* Shop Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Shop</h3>
            <ul className="space-y-2">
              {footerLinks.length > 0 ? (
                footerLinks.map((link, index) => (
                  <li key={index}>
                    <Link href={link.url || '#'}>{link.title || 'Shop Link'}</Link>
                  </li>
                ))
              ) : (
                <>
                  <li><Link href="/">Women&apos;s</Link></li>
                  <li><Link href="/">Men&apos;s</Link></li>
                  <li><Link href="/">Kids&apos;</Link></li>
                  <li><Link href="/">Shoes</Link></li>
                  <li><Link href="/">Equipment</Link></li>
                  <li><Link href="/">By Activity</Link></li>
                  <li><Link href="/">Gift Cards</Link></li>
                  <li><Link href="/">Sale</Link></li>
                </>
              )}
            </ul>
          </div>

          {/* Help Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Help</h3>
            <ul className="space-y-2">
              <li><Link href="/">Help Center</Link></li>
              <li><Link href="/">Order Status</Link></li>
              <li><Link href="/">Size Chart</Link></li>
              <li><Link href="/">Returns &amp; Warranty</Link></li>
              <li><Link href="/">Contact Us</Link></li>
            </ul>
          </div>

          {/* About Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">About</h3>
            <ul className="space-y-2">
              <li><Link href="/">About Us</Link></li>
              <li><Link href="/">Responsibility</Link></li>
              <li><Link href="/">Technology &amp; Innovation</Link></li>
              <li><Link href="/">Explore our stories</Link></li>
            </ul>
          </div>

          {/* Copyright and additional info can be added here */}
          <div className="col-span-1 md:col-span-2 mt-8 md:mt-0">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} Your Company Name. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
