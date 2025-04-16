import { useUser } from "@/providers/user-provider"
import { Button } from "@/components/ui/button"
import { useChatHistory } from "@/lib/chat/chat-history-provider"
import { DEFAULT_DAILY_MESSAGE_LIMIT } from "@/lib/config"
import { SignOut, User } from "@phosphor-icons/react"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/toast"

export function AccountTab({ isMobile = false }: { isMobile?: boolean }) {
  const { user, signOut } = useUser()
  const { resetHistory } = useChatHistory()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await resetHistory()
      await signOut()
      router.push("/")
      toast({ title: "History cleared successfully", status: "success" })
    } catch (e) {
      console.error("Failed to clear history:", e)
      toast({ title: "Failed to clear history", status: "error" })
    }
  }

  if (!user) return null

  return (
    <div className={`space-y-6 ${isMobile ? 'px-4' : ''}`}>
      {/* User Info */}
      <div className={`${isMobile ? 'py-4' : 'pb-4'}`}>
        <div className="flex items-center space-x-4">
          <div className="bg-muted flex h-16 w-16 items-center justify-center overflow-hidden rounded-full">
            {user?.profile_image ? (
              <img
                src={user.profile_image || "/placeholder.svg"}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            ) : (
              <User className="text-muted-foreground size-8" />
            )}
          </div>
          <div>
            <h3 className="text-sm font-medium">{user?.display_name}</h3>
            <p className="text-muted-foreground text-sm">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Message Usage */}
      <div className="pt-4 mt-4">
        <h3 className="mb-3 text-sm font-medium">Message Usage</h3>
        <div className="bg-secondary rounded-lg p-3">
          <div className="mb-2 flex justify-between">
            <span className="text-secondary-foreground text-sm">Today</span>
            <span className="text-sm font-medium">
              {user?.daily_message_count} / {DEFAULT_DAILY_MESSAGE_LIMIT}{" "}
              messages
            </span>
          </div>
          <div className="bg-muted h-1.5 w-full rounded-full">
            <div
              className="bg-primary h-1.5 rounded-full"
              style={{
                width: `${
                  ((user?.daily_message_count || 0) /
                    DEFAULT_DAILY_MESSAGE_LIMIT) *
                  100
                }%`,
              }}
            ></div>
          </div>
          <p className="text-muted-foreground mt-2 text-xs">
            Limit of {DEFAULT_DAILY_MESSAGE_LIMIT} messages per day
          </p>
        </div>
      </div>

      {/* Clear History */}
      <div className="pt-4 mt-4">
        <Button
          variant="default"
          size="sm"
          onClick={handleSignOut}
          className="w-full cursor-pointer transition-all duration-300"
        >
          <SignOut className="mr-2 size-4" />
          Clear History
        </Button>
        <p className="text-muted-foreground mt-2 text-xs">
          This will clear all chat history and reset your data
        </p>
      </div>
    </div>
  )
} 