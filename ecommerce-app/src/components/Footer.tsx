import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, CreditCard } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Shop',
      links: [
        { name: 'All Products', href: '/products' },
        { name: 'New Arrivals', href: '/new-arrivals' },
        { name: 'Best Sellers', href: '/best-sellers' },
        { name: 'Today\'s Deals', href: '/deals' },
        { name: 'Gift Cards', href: '/gift-cards' },
      ],
    },
    {
      title: 'Customer Service',
      links: [
        { name: 'Contact Us', href: '/contact' },
        { name: 'Track Order', href: '/track-order' },
        { name: 'Returns & Refunds', href: '/returns' },
        { name: 'Shipping Info', href: '/shipping' },
        { name: 'Size Guide', href: '/size-guide' },
        { name: 'FAQs', href: '/faq' },
      ],
    },
    {
      title: 'About',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Careers', href: '/careers' },
        { name: 'Press', href: '/press' },
        { name: 'Sustainability', href: '/sustainability' },
        { name: 'Investors', href: '/investors' },
      ],
    },
    {
      title: 'Sell on LuxMart',
      links: [
        { name: 'Start Selling', href: '/seller/register' },
        { name: 'Seller Dashboard', href: '/seller/dashboard' },
        { name: 'Seller Support', href: '/seller/support' },
        { name: 'Seller Fees', href: '/seller/fees' },
        { name: 'Success Stories', href: '/seller/stories' },
      ],
    },
  ];

  const paymentMethods = [
    { name: 'Visa', icon: '💳' },
    { name: 'Mastercard', icon: '💳' },
    { name: 'UPI', icon: '📱' },
    { name: 'PayTM', icon: '💰' },
    { name: 'Net Banking', icon: '🏦' },
    { name: 'Cash on Delivery', icon: '💵' },
  ];

  const socialLinks = [
    { icon: 'f', href: '#', label: 'Facebook' },
    { icon: '𝕏', href: '#', label: 'Twitter' },
    { icon: '📷', href: '#', label: 'Instagram' },
    { icon: '▶', href: '#', label: 'YouTube' },
  ];

  return (
    <footer className="bg-black-900 border-t border-black-700">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-gold-500 to-gold-600 py-6 sm:py-8">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <h3 className="text-xl sm:text-2xl font-luxury text-black-900 mb-1 sm:mb-2">
                Stay in the Loop
              </h3>
              <p className="text-black-800 text-sm sm:text-base">
                Get exclusive offers and be the first to know about new products
              </p>
            </div>
            <form className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-black-900/20 border border-black-700/50 text-black-900 placeholder-black-700 focus:outline-none focus:border-black-900 focus:bg-black-900/30 transition-all duration-200"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-black-900 text-gold-500 rounded-lg font-semibold hover:bg-black-800 transform hover:scale-105 transition-all duration-200"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <img 
                  src="/assets/logo.png" 
                  alt="Footers" 
                  className="h-10 sm:h-12 w-auto object-contain"
                />
              </div>
              <p className="text-black-400 mb-4 sm:mb-6 text-sm sm:text-base">
                Your premium destination for luxury footwear. Discover exclusive traditional Kolhapuri chappals and premium footwear from top brands.
              </p>
              
              {/* Social Links */}
              <div className="flex space-x-3 mb-4 sm:mb-6">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="w-9 h-9 sm:w-10 sm:h-10 bg-black-800 border border-black-600 rounded-lg flex items-center justify-center text-black-400 hover:text-gold-500 hover:border-gold-500 transition-all duration-200"
                    aria-label={social.label}
                  >
                    <span className="text-xs sm:text-sm">{social.icon}</span>
                  </a>
                ))}
              </div>

              {/* App Download */}
              <div className="space-y-2">
                <p className="text-black-400 text-xs sm:text-sm">Download our app</p>
                <div className="flex space-x-2">
                  <button className="bg-black-800 border border-black-600 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:border-gold-500 transition-colors text-xs">
                    <span className="text-black-300">App Store</span>
                  </button>
                  <button className="bg-black-800 border border-black-600 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:border-gold-500 transition-colors text-xs">
                    <span className="text-black-300">Google Play</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Footer Links */}
            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="text-gold-500 font-semibold mb-3 sm:mb-4 text-sm sm:text-base">{section.title}</h3>
                <ul className="space-y-1.5 sm:space-y-2">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="text-black-400 hover:text-gold-500 transition-colors duration-200 text-sm sm:text-base"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-black-800">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gold-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-gold-500" />
              </div>
              <div>
                <p className="text-gold-500 font-semibold">Call Us</p>
                <p className="text-black-400">+91 98765 43210</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gold-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-gold-500" />
              </div>
              <div>
                <p className="text-gold-500 font-semibold text-sm sm:text-base">Email Us</p>
                <p className="text-black-400 text-sm sm:text-base">support@footers.com</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gold-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gold-500" />
              </div>
              <div>
                <p className="text-gold-500 font-semibold text-sm sm:text-base">Visit Us</p>
                <p className="text-black-400 text-sm sm:text-base">Kolhapur, Maharashtra</p>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-black-800">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-2">
                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-gold-500" />
                <span className="text-black-400 text-xs sm:text-sm">Secure Payment Methods:</span>
              </div>
              <div className="flex space-x-2 sm:space-x-3">
                {paymentMethods.map((method) => (
                  <div
                    key={method.name}
                    className="w-10 h-7 sm:w-12 sm:h-8 bg-black-800 border border-black-600 rounded flex items-center justify-center text-xs sm:text-sm hover:border-gold-500 transition-colors"
                    title={method.name}
                  >
                    {method.icon}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-black-950 border-t border-black-800">
        <div className="container-custom py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
            <div className="text-black-400 text-xs sm:text-sm">
              © {currentYear} Footers. All rights reserved.
            </div>
            
            <div className="flex flex-wrap justify-center gap-3 sm:gap-6 text-xs sm:text-sm">
              <Link to="/privacy" className="text-black-400 hover:text-gold-500 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-black-400 hover:text-gold-500 transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-black-400 hover:text-gold-500 transition-colors">
                Cookie Policy
              </Link>
              <Link to="/accessibility" className="text-black-400 hover:text-gold-500 transition-colors">
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
