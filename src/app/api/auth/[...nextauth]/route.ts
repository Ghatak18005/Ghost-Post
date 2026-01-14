import { handlers } from "@/auth";

// 1. Force Node.js runtime (avoids Edge/Serverless conflicts)
export const runtime = "nodejs"; 

// 2. Prevent static generation (Fixes "Failed to collect page data")
export const dynamic = "force-dynamic";

export const { GET, POST } = handlers;