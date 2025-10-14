import blogPosts from "@/data/blogPosts.json";
import Link from "next/link";

export default function Blog() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">博客 (Blog)</h1>
      <ul className="space-y-4">
        {blogPosts.map(post => (
          <li key={post.id} className="border p-4 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
            <Link href={`/blog/${post.slug}`}>
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <p className="text-gray-600 dark:text-gray-300">{post.summary}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
