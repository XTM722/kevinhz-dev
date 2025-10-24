"use client"

import { useState, useEffect } from "react"

interface Post {
  id: number
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

export default function ManagePosts() {
  const [posts, setPosts] = useState<Post[]>([]) // ✅ explicitly typed
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")

  useEffect(() => {
    fetch("/api/posts")
      .then((res) => res.json())
      .then((data: Post[]) => setPosts(data))
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    })
    if (res.ok) {
      const newPost: Post = await res.json()
      setPosts([newPost, ...posts])
      setTitle("")
      setContent("")
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Manage Posts</h1>
      <form onSubmit={handleSubmit} className="mb-6 space-y-3">
        <input
          className="border p-2 w-full"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="border p-2 w-full"
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Post
        </button>
      </form>

      <div className="space-y-3">
        {posts.map((post) => (
          <div key={post.id} className="border p-4 rounded">
            <h2 className="text-lg font-semibold">{post.title}</h2>
            <p className="text-gray-700 dark:text-gray-300">{post.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
