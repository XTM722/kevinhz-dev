import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"
import { NextResponse } from "next/server"

export async function GET() {
  const snippets = await prisma.snippet.findMany({
    include: { author: true },
    orderBy: { createdAt: "desc" },
  })
  return NextResponse.json(snippets)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const data = await req.json()
  const snippet = await prisma.snippet.create({
    data: {
      title: data.title,
      code: data.code,
      language: data.language,
      author: { connect: { email: session.user.email } },
    },
  })
  return NextResponse.json(snippet)
}
