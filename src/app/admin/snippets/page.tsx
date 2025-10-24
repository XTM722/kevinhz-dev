"use client"

import { useState, useEffect } from "react"

interface Snippet {
  id: number
  title: string
  code: string
  language: string
  createdAt: string
  updatedAt: string
}

export default function ManageSnippets() {
  const [snippets, setSnippets] = useState<Snippet[]>([]) // ✅ typed
  const [title, setTitle] = useState("")
  const [code, setCode] = useState("")
  const [language, setLanguage] = useState("")

  useEffect(() => {
    fetch("/api/snippets")
      .then((res) => res.json())
      .then((data: Snippet[]) => setSnippets(data))
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch("/api/snippets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, code, language }),
    })
    if (res.ok) {
      const newSnippet: Snippet = await res.json()
      setSnippets([newSnippet, ...snippets])
      setTitle("")
      setCode("")
      setLanguage("")
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Manage Snippets</h1>
      <form onSubmit={handleSubmit} className="mb-6 space-y-3">
        <input
          className="border p-2 w-full"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="border p-2 w-full"
          placeholder="Language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        />
        <textarea
          className="border p-2 w-full"
          placeholder="Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Snippet
        </button>
      </form>

      <div className="space-y-3">
        {snippets.map((snippet) => (
          <div key={snippet.id} className="border p-4 rounded">
            <h2 className="text-lg font-semibold">{snippet.title}</h2>
            <pre className="bg-gray-900 text-white p-2 rounded overflow-x-auto">
              <code>{snippet.code}</code>
            </pre>
            <p className="text-sm text-gray-400 mt-1">{snippet.language}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
