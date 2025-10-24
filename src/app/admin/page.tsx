"use client"

import { useState } from "react"
import { signIn, signOut, useSession } from "next-auth/react"

export default function AdminPage() {
  const { data: session, status } = useSession()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  // Handle loading state
  if (status === "loading") return <p className="p-6">Loading...</p>

  // Not logged in → show login form
  if (!session) {
    return (
      <div className="flex flex-col items-center mt-20">
        <h1 className="text-2xl font-semibold mb-4">Admin Login</h1>
        <form
          onSubmit={async (e) => {
            e.preventDefault()
            setError("")

            const res = await signIn("credentials", {
              redirect: false, // ✅ prevents auto redirect
              email,
              password,
            })

            if (res?.error) {
              console.error("❌ Login error:", res.error)
              setError("Invalid email or password.")
            } else {
              window.location.href = "/admin/posts" // ✅ manual redirect
            }
          }}
          className="flex flex-col gap-3 w-72"
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded"
          />
          <button type="submit" className="bg-blue-600 text-white rounded p-2">
            Login
          </button>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </form>
      </div>
    )
  }

  // Logged in → show admin panel
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">
        Welcome, {session.user?.email}
      </h1>
      <button
        onClick={() => signOut()}
        className="mt-4 bg-gray-300 p-2 rounded"
      >
        Logout
      </button>
      <div className="mt-6 space-y-3">
        <a href="/admin/posts" className="text-blue-600">Manage Posts</a><br />
        <a href="/admin/snippets" className="text-blue-600">Manage Snippets</a>
      </div>
    </div>
  )
}
  