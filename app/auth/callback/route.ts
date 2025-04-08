import { MODEL_DEFAULT } from "@/lib/config"
import { createClient } from "@/lib/supabase/server"
import { createGuestServerClient } from "@/lib/supabase/server-guest"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get("next") ?? "/"

  if (code) {
    const supabase = await createClient()
    const supabaseAdmin = await createGuestServerClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // If successful authentication and we have user data, upsert to users table
      if (data?.user && data.user.email) {
        try {
          const { error: upsertError } = await supabaseAdmin
            .from("users")
            .upsert(
              {
                id: data.user.id,
                email: data.user.email,
                premium: false,
                message_count: 0,
                created_at: new Date().toISOString(),
                preferred_model: MODEL_DEFAULT,
              },
              { onConflict: "id" }
            )

          if (upsertError) {
            console.error("Error upserting user:", upsertError)
            // Continue with redirect even if user upsert fails
          }
        } catch (err) {
          console.error("Error in user upsert:", err)
          // Continue with redirect even if there's an error
        }
      }

      const forwardedHost = request.headers.get("x-forwarded-host") // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === "development"
      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    } else {
      console.error("Auth error:", error)
      return NextResponse.redirect(
        `${origin}/auth/error?message=${encodeURIComponent(error.message)}`
      )
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(
    `${origin}/auth/error?message=${encodeURIComponent(
      "Missing authentication code"
    )}`
  )
}
