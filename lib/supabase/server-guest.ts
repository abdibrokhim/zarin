import type { Database } from "@/app/types/database.types"
import { createServerClient } from "@supabase/ssr"

export async function createGuestServerClient() {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE!,
    {
      cookies: {
        getAll: () => [],
        setAll: () => {},
      },
    }
  )
}
