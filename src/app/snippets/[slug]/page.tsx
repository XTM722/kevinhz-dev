import { notFound } from "next/navigation";
import type { Metadata } from "next";
import snippets from "@/data/snippets.json";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Tell Next.js all slugs for static generation
export async function generateStaticParams() {
  return snippets.map((s) => ({ slug: s.slug }));
}

// Generate metadata (optional)
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const snippet = snippets.find((s) => s.slug === slug);

  if (!snippet) {
    return {
      title: "Snippet Not Found",
    };
  }

  return {
    title: snippet.title,
    description: `${snippet.language} code snippet`,
  };
}

// ✅ Async server component (same as blog)
export default async function SnippetPage({ params }: PageProps) {
  const { slug } = await params;
  const snippet = snippets.find((s) => s.slug === slug);

  if (!snippet) return notFound();

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-4">{snippet.title}</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        Language: <span className="font-medium">{snippet.language}</span>
      </p>
      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded text-sm overflow-x-auto">
        <code>{snippet.code}</code>
      </pre>
    </div>
  );
}
