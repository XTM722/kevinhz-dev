"use client";

import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { isValidElement } from "react";
import Link from "next/link";

const roles: ReactNode[] = [
  <>Statistics Student .</>,
  <>Aspiring <span className="text-blue-500">&lt;Data Analyst /&gt;</span> .</>,
  <>Web <span className="text-green-500">&lt;Developer /&gt;</span> .</>,
];

// Extract visible text out of ReactNode (no `any`)
function extractText(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (isValidElement(node)) return extractText(node.props.children);
  return "";
}

export default function Home() {
  const [displayedIndex, setDisplayedIndex] = useState(0);
  const [visibleChars, setVisibleChars] = useState(0);
  const [deleting, setDeleting] = useState(false);

  const currentRole = roles[displayedIndex];
  const textContent = extractText(currentRole);
  const displayedText = textContent.slice(0, visibleChars);

  useEffect(() => {
    // Use browser-safe timeout type
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && visibleChars === textContent.length) {
      timeout = setTimeout(() => setDeleting(true), 1200);
    } else {
      const speed = deleting ? 50 : 100;
      timeout = setTimeout(() => {
        if (!deleting) {
          if (visibleChars < textContent.length) setVisibleChars((v) => v + 1);
        } else {
          if (visibleChars > 0) {
            setVisibleChars((v) => v - 1);
          } else {
            setDeleting(false);
            setDisplayedIndex((prev) => (prev + 1) % roles.length);
          }
        }
      }, speed);
    }

    return () => clearTimeout(timeout);
  }, [visibleChars, deleting, textContent.length, displayedIndex]);

  return (
    <div className="flex items-center justify-center min-h-screen px-6">
      <div className="text-left max-w-2xl">
        <h2 className="text-3xl md:text-4xl mb-2 font-semibold">Hello, I am</h2>
        <h1 className="text-5xl md:text-6xl font-bold mb-4">Kevin Hou</h1>
        <h3 className="text-2xl md:text-3xl mb-6 font-mono">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
            {displayedText}
          </span>
          <span className="border-r-2 border-gray-500 animate-pulse ml-1" />
        </h3>
        <p className="text-lg md:text-xl mb-6 text-gray-700 dark:text-gray-300 max-w-lg">
          On this site, I document my growth and explore projects in data analysis and web development.
        </p>
        <div className="flex space-x-4">
          <Link
            href="/blog"
            className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-200 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors"
          >
            My Blog
          </Link>
          <Link
            href="/about"
            className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-200 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors"
          >
            About Me
          </Link>
        </div>
      </div>
    </div>
  );
}
