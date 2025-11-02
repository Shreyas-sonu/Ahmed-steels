import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src="/logo.svg"
                  alt="Ahmed Steels & Cement Logo"
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-white">
                Ahmed Steels & Cement
              </h3>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Your trusted partner in steel & cement. Supplying quality
              construction materials for every project since years.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#home"
                  className="text-gray-400 hover:text-primary-400 transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#products"
                  className="text-gray-400 hover:text-primary-400 transition-colors"
                >
                  Products
                </a>
              </li>
              <li>
                <a
                  href="#gallery"
                  className="text-gray-400 hover:text-primary-400 transition-colors"
                >
                  Gallery
                </a>
              </li>
              <li>
                <a
                  href="#enquiry"
                  className="text-gray-400 hover:text-primary-400 transition-colors"
                >
                  Enquiry
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-primary-400 mt-0.5 flex-shrink-0" />
                <a
                  href="tel:+919972394416"
                  className="text-gray-400 hover:text-primary-400 transition-colors"
                >
                  +91 9972394416
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-primary-400 mt-0.5 flex-shrink-0" />
                <a
                  href="mailto:mohammedtahirsteel@gmail.com"
                  className="text-gray-400 hover:text-primary-400 transition-colors break-all"
                >
                  mohammedtahirsteel@gmail.com
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-400">
                  Bangalore, Karnataka, India
                </span>
              </li>
            </ul>
          </div>

          {/* Business Hours & Social */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Business Hours
            </h4>
            <div className="space-y-2 text-sm text-gray-400 mb-6">
              <p>Monday - Saturday</p>
              <p className="font-semibold text-white">9:00 AM - 7:00 PM</p>
              <p className="mt-2">Sunday: Closed</p>
            </div>

            {/* Social Media */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">
                Follow Us
              </h4>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p className="text-sm text-gray-400">
              © {currentYear} Ahmed Steels & Cement. All rights reserved.
            </p>
            <p className="text-sm text-gray-400">
              Built with precision and quality
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
