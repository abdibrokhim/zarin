import {
  AUTH_DAILY_MESSAGE_LIMIT,
  NON_AUTH_DAILY_MESSAGE_LIMIT,
} from "@/lib/config"

// This API endpoint is simplified since we're no longer using Supabase
// It works on an honor system where the client will track its own usage
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get("userId")
  const isAuthenticated = searchParams.get("isAuthenticated") === "true"
  
  if (!userId) {
    return new Response(JSON.stringify({ error: "Missing userId" }), {
      status: 400,
    })
  }

  // Set limit based on authentication status (though all users are unauthenticated now)
  const dailyLimit = isAuthenticated
    ? AUTH_DAILY_MESSAGE_LIMIT
    : NON_AUTH_DAILY_MESSAGE_LIMIT
  
  // In a real app, we'd track this in a database. For our simplified version,
  // we're returning max limits and letting the client track the rest.
  return new Response(
    JSON.stringify({ 
      dailyCount: 0, 
      dailyLimit, 
      remaining: dailyLimit 
    }), 
    { status: 200 }
  )
} 