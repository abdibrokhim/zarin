import { FeatureId, UseCaseId } from "@/lib/models/types"
import { Star } from "@phosphor-icons/react"

// Define features for filtering based on the types.ts file
export const FEATURE_FILTERS = [
  { id: FeatureId.FILE_UPLOAD, label: "File Upload" },
  { id: FeatureId.IMAGE_UPLOAD, label: "Vision" },
  { id: FeatureId.WEB_SEARCH, label: "Web Search" },
  { id: FeatureId.REASONING, label: "Reasoning" },
  { id: FeatureId.DEEP_REASONING, label: "Deep Reasoning" },
  { id: FeatureId.DEEPER_REASONING, label: "Advanced Reasoning" },
  { id: FeatureId.MULTIMODAL, label: "Multimodal" },
  { id: FeatureId.CONVERSATIONAL, label: "Conversational" },
]

// Define use cases for filtering based on the types.ts file
export const USE_CASE_FILTERS = [
  { id: "all", label: "All Use Cases", icon: Star },
  { id: UseCaseId.QUICK_RESEARCH, label: "Quick Research" },
  { id: UseCaseId.ADVANCED_RESEARCH, label: "Advanced Research" },
  { id: UseCaseId.ADVANCED_ACADEMIC_RESEARCH, label: "Academic Research" },
  { id: UseCaseId.IMAGE_GENERATION, label: "Image Generation" },
  { id: UseCaseId.AUDIO_GENERATION, label: "Audio Generation" },
  { id: UseCaseId.VIDEO_GENERATION, label: "Video Generation" },
  { id: UseCaseId.THREE_D_GENERATION, label: "3D Generation" },
  { id: UseCaseId.MUSIC_GENERATION, label: "Music Generation" },
]

// Sort options
export const SORT_OPTIONS = [
  { value: "relevance", label: "Relevance" },
  { value: "featured", label: "Featured First" },
]

// Color mappings for feature badges
export const FEATURE_COLORS: Record<string, string> = {
  [FeatureId.FILE_UPLOAD]: "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300 border-pink-200 dark:border-pink-800",
  [FeatureId.IMAGE_UPLOAD]: "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300 border-pink-200 dark:border-pink-800",
  [FeatureId.WEB_SEARCH]: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300 border-sky-200 dark:border-sky-800",
  [FeatureId.REASONING]: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300 border-violet-200 dark:border-violet-800",
  [FeatureId.DEEP_REASONING]: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800",
  [FeatureId.DEEPER_REASONING]: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
  [FeatureId.MULTIMODAL]: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
  [FeatureId.CONVERSATIONAL]: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200 dark:border-purple-800",
  default: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-800",
} 