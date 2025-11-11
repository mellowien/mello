"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";

const navLinks = [
  { name: "Über uns", href: "/about" },
  { name: "Team", href: "/team" },
  { name: "Mitgliedschaft", href: "/mitgliedschaft" },
  { name: "Minigames", href: "/minigames" },
  { name: "Kontakt", href: "/kontakt" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 w-full z-50 bg-black/60 backdrop-blur-md border-b border-[#0d9488]/30"
    >
      <div className="mx-auto flex items-center justify-between px-6 py-3 max-w-6xl">
        {/* Logo → Home */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Mello Logo"
            width={45}
            height={45}
            className="rounded-full transition-transform duration-300 hover:scale-110 drop-shadow-[0_0_12px_rgba(13,148,136,0.7)]"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <nav className="flex gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="relative group text-gray-300 hover:text-[#0d9488] transition"
              >
                {link.name}
                <span className="absolute bottom-[-4px] left-0 w-0 h-[2px] bg-[#0d9488] group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </nav>

          {/* Mello TV Button */}
          <Link
            href="/tv"
            className="ml-4 inline-block bg-[#0d9488] text-black font-semibold rounded-full px-4 py-1.5 text-sm transition-all duration-300 hover:scale-105 hover:bg-[#0b7d71] hover:shadow-[0_0_15px_3px_rgba(13,148,136,0.6)]"
          >
            Mello TV
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gray-300 text-2xl focus:outline-none hover:text-[#0d9488] transition"
        >
          <i className={`fas ${menuOpen ? "fa-times" : "fa-bars"}`} />
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden flex flex-col items-center bg-black/95 border-t border-[#0d9488]/20 pb-4"
        >
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="py-3 w-full text-center text-gray-300 hover:text-[#0d9488] transition"
            >
              {link.name}
            </Link>
          ))}

          {/* Mello TV Mobile Button */}
          <Link
            href="/tv"
            onClick={() => setMenuOpen(false)}
            className="mt-2 inline-block bg-[#0d9488] text-black font-semibold rounded-full px-6 py-2 transition-all duration-300 hover:scale-105 hover:bg-[#0b7d71] hover:shadow-[0_0_15px_3px_rgba(13,148,136,0.6)]"
          >
            Mello TV
          </Link>
        </motion.nav>
      )}
    </motion.header>
  );
}
