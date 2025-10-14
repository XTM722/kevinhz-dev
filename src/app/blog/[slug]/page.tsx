import { notFound } from "next/navigation";
import type { Metadata } from "next";
import blogPosts from "@/data/blogPosts.json";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Tell Next.js all slugs for static generation
export async function generateStaticParams() {
  return blogPosts.map(post => ({ slug: post.slug }));
}

// Generate metadata (optional)
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find(p => p.slug === slug);
  
  if (!post) {
    return {
      title: "Post Not Found"
    };
  }
  
  return {
    title: post.title,
    description: post.summary,
  };
}

// ✅ Async server component
export default async function BlogPost({ params }: PageProps) {
  const { slug } = await params;
  const post = blogPosts.find(p => p.slug === slug);

  if (!post) return notFound();

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">{post.date}</p>
      <p className="text-lg">{post.summary}</p>
    </div>
  );
}