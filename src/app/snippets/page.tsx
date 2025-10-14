import snippets from "@/data/snippets.json";
import Link from "next/link";

export default function SnippetsPage() {
  console.log('Snippets data:', snippets); // Check if data is loading
  
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">片段 (Snippets)</h1>
      <p>Total snippets: {snippets.length}</p>
      <div className="grid gap-4 mt-4">
        {snippets.map(snippet => (
          <Link 
            key={snippet.id} 
            href={`/snippets/${snippet.slug}`}
            className="block border p-4 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <h2 className="text-xl font-semibold">{snippet.title}</h2>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Language: {snippet.language}</p>
            <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded mt-2 overflow-x-auto text-sm">
              {snippet.code.substring(0, 50)}...
            </pre>
          </Link>
        ))}
      </div>
    </div>
  );
}