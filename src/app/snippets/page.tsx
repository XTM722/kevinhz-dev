import Link from "next/link";
import snippets from "@/data/snippets.json";

export default function SnippetsPage() {
  return (
    <div className="px-4 sm:px-6 md:px-8 py-10 max-w-3xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center md:text-left">
        片段 (Snippets)
      </h1>

      <p className="text-gray-600 dark:text-gray-400 mb-8 text-center md:text-left">
        Total snippets: {snippets.length}
      </p>

      <ul className="space-y-4">
        {snippets.map((snippet) => (
          <li
            key={snippet.id}
            className="border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <Link href={`/snippets/${snippet.slug}`}>
              <h2 className="text-xl font-semibold mb-1 text-gray-900 dark:text-gray-100">
                {snippet.title}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Language: {snippet.language}
              </p>
              <div className="bg-gray-100 dark:bg-gray-900 p-2 rounded overflow-x-auto">
                <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">
                  <code>
                    {snippet.code.length > 80
                      ? snippet.code.slice(0, 80) + "..."
                      : snippet.code}
                  </code>
                </pre>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
