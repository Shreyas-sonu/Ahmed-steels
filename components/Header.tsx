"use client";

import { Mail, Menu, Phone, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "Products", href: "#products" },
    { name: "Gallery", href: "#gallery" },
    { name: "Enquiry", href: "#enquiry" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white shadow-lg py-3"
          : "bg-white/95 backdrop-blur-sm py-4"
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-14 h-14 rounded-lg overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow flex-shrink-0">
              <Image
                src="/logo.png"
                alt="Ahmed Steels & Cement Logo"
                width={120}
                height={120}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <div className="hidden md:block">
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900 leading-tight">
                Ahmed Steels & Cement
              </h1>
              <p className="text-xs text-gray-600">
                Quality Construction Materials
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map(link => (
              <a
                key={link.name}
                href={link.href}
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors relative group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}
          </nav>

          {/* Contact Info - Desktop */}
          <div className="hidden xl:flex items-center space-x-6">
            <a
              href="tel:+919972394416"
              className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="text-sm font-medium">+91 9972394416</span>
            </a>
            <a
              href="mailto:mohammedtahirsteel@gmail.com"
              className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span className="text-sm font-medium">Email Us</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-gray-700 hover:text-primary-600 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-200 pt-4 animate-fade-in">
            <nav className="flex flex-col space-y-3">
              {navLinks.map(link => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-700 hover:text-primary-600 font-medium transition-colors py-2 px-4 hover:bg-gray-100 rounded-lg"
                >
                  {link.name}
                </a>
              ))}
              <div className="border-t border-gray-200 pt-3 mt-3 space-y-3">
                <a
                  href="tel:+919972394416"
                  className="flex items-center space-x-2 text-gray-700 py-2 px-4"
                >
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">+91 9972394416</span>
                </a>
                <a
                  href="mailto:mohammedtahirsteel@gmail.com"
                  className="flex items-center space-x-2 text-gray-700 py-2 px-4"
                >
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">mohammedtahirsteel@gmail.com</span>
                </a>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
