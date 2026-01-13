import { handlers } from "@/auth" 
export const runtime = "nodejs"; // 👈 Forces Node.js (Fixes database connection issues)
export const dynamic = "force-dynamic";
export const { GET, POST } = handlers

