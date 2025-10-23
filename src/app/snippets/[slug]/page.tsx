import { notFound } from "next/navigation";
import type { Metadata } from "next";
import snippets from "@/data/snippets.json";

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  return snippets.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = params;
  const snippet = snippets.find((s) => s.slug === slug);

  if (!snippet) {
    return { title: "Snippet Not Found" };
  }

  return {
    title: snippet.title,
    description: `${snippet.language} code snippet`,
  };
}

export default function SnippetPage({ params }: PageProps) {
  const { slug } = params;
  const snippet = snippets.find((s) => s.slug === slug);

  if (!snippet) return notFound();

  return (
    <div className="px-4 sm:px-6 md:px-8 py-10 max-w-3xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center md:text-left">
        {snippet.title}
      </h1>

      <p className="text-gray-500 dark:text-gray-400 mb-4 text-center md:text-left">
        Language: {snippet.language}
      </p>

      <div className="overflow-x-auto rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 shadow-sm">
        <pre className="p-4 text-sm font-mono whitespace-pre-wrap break-words">
          <code>{snippet.code}</code>
        </pre>
      </div>
    </div>
  );
}
