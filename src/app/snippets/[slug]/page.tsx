import { notFound } from "next/navigation";
import type { Metadata } from "next";
import snippets from "@/data/snippets.json";

// ---------- Types ----------
interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

type Snippet = {
  id: number;
  slug: string;
  title: string;
  language: string;
  code: string;
};

// ---------- Static Params ----------
export async function generateStaticParams() {
  return snippets.map((s) => ({ slug: s.slug }));
}

// ---------- Metadata ----------
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const snippet = snippets.find((s) => s.slug === slug);

  if (!snippet) {
    return { title: "Snippet Not Found" };
  }

  return {
    title: snippet.title,
    description: `${snippet.language} code snippet`,
  };
}

// ---------- Page Component ----------
export default async function SnippetPage({ params }: PageProps) {
  const { slug } = await params;
  const snippet = snippets.find((s) => s.slug === slug);

  if (!snippet) return notFound();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">{snippet.title}</h1>
      <div className="flex items-center gap-2 mb-4">
        <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-sm">
          {snippet.language}
        </span>
      </div>
      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-x-auto text-sm border">
        <code>{snippet.code}</code>
      </pre>
    </div>
  );
}