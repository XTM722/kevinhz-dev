import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"
import { NextResponse } from "next/server"

// 🧠 Get all posts
export async function GET() {
  const posts = await prisma.post.findMany({
    include: { author: true },
    orderBy: { createdAt: "desc" },
  })
  return NextResponse.json(posts)
}

// 🧠 Create a new post (only if logged in)
export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const data = await req.json()
  const post = await prisma.post.create({
    data: {
      title: data.title,
      content: data.content,
      author: { connect: { email: session.user.email } },
    },
  })

  return NextResponse.json(post)
}
