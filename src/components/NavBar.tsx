"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import { HiMenu, HiX } from "react-icons/hi";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { href: "/", label: "首页" },
    { href: "/blog", label: "博客" },
    { href: "/snippets", label: "片段" },
    { href: "/about", label: "About" },
  ];

  return (
    <header className="bg-gray-100 dark:bg-gray-900 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
        {/* Logo / Brand */}
        <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
          kevinhz.dev
        </div>

        {/* Desktop Links */}
        <nav className="hidden md:flex space-x-6">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-2 py-1 rounded-md transition-colors duration-200 ${
                  isActive
                    ? "text-black dark:text-white"
                    : "text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white"
                }`}
              >
                {link.label}
                {/* Hover underline */}
                {!isActive && (
                  <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-black dark:bg-white transition-all duration-300 group-hover:w-full"></span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right: Theme toggle & Mobile menu button */}
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <button
            className="md:hidden text-gray-800 dark:text-gray-200 focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle mobile menu"
          >
            {isOpen ? <HiX size={28} /> : <HiMenu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-20 z-40"
            onClick={() => setIsOpen(false)}
          />

          <nav className="fixed top-0 right-0 w-64 h-full bg-gray-100 dark:bg-gray-900 px-6 py-8 z-50 flex flex-col space-y-4 transition-transform transform duration-300 ease-in-out">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`px-3 py-2 rounded-md transition-colors duration-200 ${
                    isActive
                      ? "text-black dark:text-white"
                      : "text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </>
      )}
    </header>
  );
}
