export { default } from "next-auth/middleware"

export const config = {
  // 🧠 Only protect /admin sub-routes (not /admin itself)
  matcher: ["/admin/(posts|snippets)(.*)"],
}
