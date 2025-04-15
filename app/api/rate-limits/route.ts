import {
  DEFAULT_DAILY_MESSAGE_LIMIT,
} from "@/lib/config"
import { getUserData } from "@/lib/api"

// This API endpoint now retrieves actual usage data from localStorage
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get("userId")
  
  if (!userId) {
    return new Response(JSON.stringify({ error: "Missing userId" }), {
      status: 400,
    })
  }

  try {
    // Get actual user data including message counts
    const userData = await getUserData(userId)
    
    // We use the same limit for all users now
    const dailyLimit = DEFAULT_DAILY_MESSAGE_LIMIT
    const dailyCount = userData.daily_message_count || 0
    const remaining = dailyLimit - dailyCount
    
    return new Response(
      JSON.stringify({ 
        dailyCount, 
        dailyLimit, 
        remaining 
      }), 
      { status: 200 }
    )
  } catch (error) {
    console.error("Error fetching rate limits:", error)
    return new Response(
      JSON.stringify({ 
        error: "Failed to fetch rate limits",
        dailyCount: 0,
        dailyLimit: DEFAULT_DAILY_MESSAGE_LIMIT,
        remaining: DEFAULT_DAILY_MESSAGE_LIMIT
      }), 
      { status: 500 }
    )
  }
} 