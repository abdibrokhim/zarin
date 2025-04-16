import type { Tables } from "@/types/database.types"

export type UserProfile = {
  profile_image: string
  display_name: string
} & Tables<"users">
