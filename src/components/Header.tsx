"use client";

import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="flex justify-between items-center p-4 bg-gray-200 dark:bg-gray-800">
      {/* Left: Navigation Links */}
      <nav className="flex space-x-4">
        <Link href="/">首页</Link>
        <Link href="/blog">博客</Link>
        <Link href="/snippets">片段</Link>
        <Link href="/about">About</Link>
      </nav>

      {/* Right: Dark/Light Mode Toggle */}
      <ThemeToggle />
    </header>
  );
}
