"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Logo from "../../public/Assets/logo/logo.svg";
import Image from "next/image";


export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


  return (
    <header className="sticky top-0 z-50 bg-white shadow-lg px-6 lg:px-20 py-4 flex justify-between items-center border-b border-gray-100">
      {/* Logo */}
      <Link href="/">
      <Image
          src={Logo}          
          alt="ZYRAH Logo"
          width={0}
          height={0}
          className="h-10 w-auto object-contain"
          priority
        />
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center space-x-8">   
          <>
            <a
              href="/"
              className={`block text-sm text-[#2d2d2d] uppercase font-medium transition duration-300 py-2 hover:text-[#B89C60] ${
                pathname === "/" ? "text-[#B89C60]" : "hover:text-gray-700"
              }`}
            >
              Home
            </a>
            <a
              href="/about"
              className={`block text-sm text-[#2d2d2d] uppercase font-medium transition duration-300 py-2 hover:text-[#B89C60] ${
                pathname === "/about" ? "text-[#B89C60]" : "hover:text-gray-700"
              }`}
            >
              Our Story
            </a>
            <a
              href="/collections"
              className={`block text-sm text-[#2d2d2d] uppercase font-medium transition duration-300 py-2 hover:text-[#B89C60] ${
                pathname === "/collections" ? "text-[#B89C60]" : "hover:text-gray-700"
              }`}
            >
              Collections
            </a>
            <a
              href="/lookbook"
              className={`block text-sm text-[#2d2d2d] uppercase font-medium transition duration-300 py-2 hover:text-[#B89C60] ${
                pathname === "/lookbook" ? "text-[#B89C60]" : "hover:text-gray-700"
              }`}
            >
              Lookbook
            </a>
            <a
              href="/contact"
              className={`block text-sm text-[#2d2d2d] uppercase font-medium transition duration-300 py-2 hover:text-[#B89C60] ${
                pathname === "/contact" ? "text-[#B89C60]" : "hover:text-gray-700"
              }`}
            >
              Boutique
            </a>
          </>  
      </nav>

      {/* Utility Icons */}
      <div className="flex items-center ">
        {/* WhatsApp Icon */}
        <a
          href="https://wa.me/+971547081910"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xl p-1 transition duration-300 hover:opacity-80"
          style={{ color: "#25D366" }}
          aria-label="Connect with WhatsApp"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
        </a>

        {/* User Icon */}
        {/* <button className="text-xl p-1 transition duration-300 hover:opacity-80" style={{ color: "#2D2D2D" }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </button> */}

        {/* Shopping Bag Icon */}
        {/* <button className="text-xl p-1 transition duration-300 hover:opacity-80" style={{ color: "#2D2D2D" }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <path d="M3 6h18" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
        </button> */}

        {/* Mobile Menu Icon - Right Side */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden text-2xl p-1 transition duration-300 hover:opacity-80" 
          style={{ color: "#2D2D2D" }}
          aria-label="Toggle menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
            {isMobileMenuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu - Slides from Right */}
      {isMobileMenuOpen && (
        <>
          {/* Overlay */}
          <div 
            className="lg:hidden fixed inset-0 bg-opacity-50 backdrop-blur-sm z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Mobile Menu - Right Side */}
          <nav className="lg:hidden fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out">
            <div className="px-6 py-8 space-y-4">
              <div className="flex justify-between items-center mb-8">
                <Link href="/">
                  <Image
                    src={Logo}          
                    alt="ZYRAH Logo"
                    width={120}
                    height={40}
                    className="h-10 w-auto object-contain"
                    priority
                  />
                </Link>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-2xl text-gray-600"
                >
                  ×
                </button>
              </div>
                <>
                  <Link
                    href="/"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block text-sm text-[#2d2d2d] uppercase font-medium transition duration-300 py-2 ${
                      pathname === "/" ? "text-[#B89C60]" : "hover:text-gray-700"
                    }`}
                  >
                    Home
                  </Link>
                  <Link
                    href="/about"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block text-sm text-[#2d2d2d] uppercase font-medium transition duration-300 py-2 ${
                      pathname === "/about" ? "text-[#B89C60]" : "hover:text-gray-700"
                    }`}
                  >
                    Our Story
                  </Link>
                  <Link
                    href="/collections"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block text-sm text-[#2d2d2d] uppercase font-medium transition duration-300 py-2 ${
                      pathname === "/collections" ? "text-[#B89C60]" : "hover:text-gray-700"
                    }`}
                  >
                    Collections
                  </Link>
                  <Link
                    href="/lookbook"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block text-sm text-[#2d2d2d] uppercase font-medium transition duration-300 py-2 ${
                      pathname === "/lookbook" ? "text-[#B89C60]" : "hover:text-gray-700"
                    }`}
                  >
                    Lookbook
                  </Link>
                  <Link
                    href="/contact"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block text-sm text-[#2d2d2d] uppercase font-medium transition duration-300 py-2 ${
                      pathname === "/contact" ? "text-[#B89C60]" : "hover:text-gray-700"
                    }`}
                  >
                    Boutique
                  </Link>
                </>
              {/* )} */}
            </div>
          </nav>
        </>
      )}
    </header>
  );
}

