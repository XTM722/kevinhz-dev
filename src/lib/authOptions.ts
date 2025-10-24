import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })
        if (!user) return null

        const isValid = await bcrypt.compare(credentials.password, user.password)
        if (!isValid) return null

        return { id: user.id.toString(), email: user.email, name: user.name }
      },
    }),
  ],

  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: "/admin",
    error: "/admin", // ✅ handle login errors gracefully
  },

  callbacks: {
    async redirect({ url, baseUrl }) {
      // ✅ Prevent infinite callbackUrl chains to /admin
      if (url.includes("/admin")) {
        return `${baseUrl}/admin/posts`
      }
      return url.startsWith(baseUrl) ? url : baseUrl
    },
  },
}
