export { default } from "next-auth/middleware"

export const config = { matcher: ["/send-email", "/moments", "/new", "/privacy-policy", "/settings", "/reservations"] }