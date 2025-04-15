import Claude from "@/components/icons/claude"
import { createOpenAI } from "@ai-sdk/openai"
import { AIML_API_BASE_URL } from "../config"
import { 
    Model, 
    FeatureId, 
    UseCaseId, 
    FEATURE_ICONS, 
    USE_CASE_ICONS, 
    IntelligenceId, 
    INTELLIGENCE_TYPES 
} from "./types"

const customClaude = createOpenAI({
  baseURL: AIML_API_BASE_URL,
  apiKey: process.env.AIML_API_KEY,
})

export const MODELS = [
  {
    id: "claude-3-7-sonnet-20250219",
    name: "Claude 3.7 Sonnet",
    provider: "claude",
    description: INTELLIGENCE_TYPES[IntelligenceId.ADVANCED_INTELLIGENT].description,
    features: [
      {
        id: FeatureId.FILE_UPLOAD,
        enabled: true,
        icon: FEATURE_ICONS[FeatureId.FILE_UPLOAD],
      },
      {
        id: FeatureId.IMAGE_UPLOAD,
        enabled: true,
        icon: FEATURE_ICONS[FeatureId.IMAGE_UPLOAD],
      },
      {
        id: FeatureId.WEB_SEARCH,
        enabled: true,
        icon: FEATURE_ICONS[FeatureId.WEB_SEARCH],
      },
      {
        id: FeatureId.DEEPER_REASONING,
        enabled: true,
        icon: FEATURE_ICONS[FeatureId.DEEPER_REASONING],
      },
    ],
    use_cases: [
      {
        id: UseCaseId.ADVANCED_ACADEMIC_RESEARCH,
        enabled: true,
        icon: USE_CASE_ICONS[UseCaseId.ADVANCED_ACADEMIC_RESEARCH],
      },
    ],
    api_sdk: customClaude("claude-3-7-sonnet-20250219"),
    icon: Claude,
    featured: true,
  },
  {
    id: "claude-3-5-haiku-20241022",
    name: "Claude 3.5 Haiku",
    description: INTELLIGENCE_TYPES[IntelligenceId.ADVANCED_INTELLIGENT].description,
    provider: "claude",
    features: [
      {
        id: FeatureId.FILE_UPLOAD,
        enabled: true,
        icon: FEATURE_ICONS[FeatureId.FILE_UPLOAD],
      },
      {
        id: FeatureId.IMAGE_UPLOAD,
        enabled: true,
        icon: FEATURE_ICONS[FeatureId.IMAGE_UPLOAD],
      },
      {
        id: FeatureId.WEB_SEARCH,
        enabled: true,
        icon: FEATURE_ICONS[FeatureId.WEB_SEARCH],
      },
      {
        id: FeatureId.DEEPER_REASONING,
        enabled: true,
        icon: FEATURE_ICONS[FeatureId.DEEPER_REASONING],
      },
    ],
    use_cases: [
      {
        id: UseCaseId.ADVANCED_ACADEMIC_RESEARCH,
        enabled: true,
        icon: USE_CASE_ICONS[UseCaseId.ADVANCED_ACADEMIC_RESEARCH],
      },
    ],
    api_sdk: customClaude("claude-3-5-haiku-20241022"),
    icon: Claude,
  },
  {
    id: "claude-3-5-sonnet-20240620",
    name: "Claude 3.5 Sonnet",
    description: INTELLIGENCE_TYPES[IntelligenceId.ADVANCED_INTELLIGENT].description,
    provider: "claude",
    features: [
      {
        id: FeatureId.FILE_UPLOAD,
        enabled: true,
        icon: FEATURE_ICONS[FeatureId.FILE_UPLOAD],
      },
      {
        id: FeatureId.IMAGE_UPLOAD,
        enabled: true,
        icon: FEATURE_ICONS[FeatureId.IMAGE_UPLOAD],
      },
      {
        id: FeatureId.WEB_SEARCH,
        enabled: true,
        icon: FEATURE_ICONS[FeatureId.WEB_SEARCH],
      },
      {
        id: FeatureId.DEEPER_REASONING,
        enabled: true,
        icon: FEATURE_ICONS[FeatureId.DEEPER_REASONING],
      },
    ],
    use_cases: [
      {
        id: UseCaseId.ADVANCED_ACADEMIC_RESEARCH,
        enabled: true,
        icon: USE_CASE_ICONS[UseCaseId.ADVANCED_ACADEMIC_RESEARCH],
      },
    ],
    api_sdk: customClaude("claude-3-5-sonnet-20240620"),
    icon: Claude,
  },
  {
    id: "claude-3-haiku-20240307",
    name: "Claude 3 Haiku",
    description: INTELLIGENCE_TYPES[IntelligenceId.FAST_INTELLIGENT].description,
    provider: "claude",
    features: [
      {
        id: FeatureId.FILE_UPLOAD,
        enabled: true,
        icon: FEATURE_ICONS[FeatureId.FILE_UPLOAD],
      },
      {
        id: FeatureId.IMAGE_UPLOAD,
        enabled: true,
        icon: FEATURE_ICONS[FeatureId.IMAGE_UPLOAD],
      },
      {
        id: FeatureId.WEB_SEARCH,
        enabled: true,
        icon: FEATURE_ICONS[FeatureId.WEB_SEARCH],
      },
      {
        id: FeatureId.DEEP_REASONING,
        enabled: true,
        icon: FEATURE_ICONS[FeatureId.DEEP_REASONING],
      },
    ],
    use_cases: [
      {
        id: UseCaseId.ADVANCED_RESEARCH,
        enabled: true,
        icon: USE_CASE_ICONS[UseCaseId.ADVANCED_RESEARCH],
      },
    ],
    api_sdk: customClaude("claude-3-haiku-20240307"),
    icon: Claude,
  },
  {
    id: "claude-3-sonnet-20240229",
    name: "Claude 3 Sonnet",
    description: INTELLIGENCE_TYPES[IntelligenceId.FAST_INTELLIGENT].description,
    provider: "claude",
    features: [
      {
        id: FeatureId.FILE_UPLOAD,
        enabled: true,
        icon: FEATURE_ICONS[FeatureId.FILE_UPLOAD],
      },
      {
        id: FeatureId.IMAGE_UPLOAD,
        enabled: true,
        icon: FEATURE_ICONS[FeatureId.IMAGE_UPLOAD],
      },
      {
        id: FeatureId.WEB_SEARCH,
        enabled: true,
        icon: FEATURE_ICONS[FeatureId.WEB_SEARCH],
      },
      {
        id: FeatureId.DEEP_REASONING,
        enabled: true,
        icon: FEATURE_ICONS[FeatureId.DEEP_REASONING],
      },
    ],
    use_cases: [
      {
        id: UseCaseId.ADVANCED_RESEARCH,
        enabled: true,
        icon: USE_CASE_ICONS[UseCaseId.ADVANCED_RESEARCH],
      },
    ],
    api_sdk: customClaude("claude-3-sonnet-20240229"),
    icon: Claude,
  },
  {
    id: "claude-3-opus-20240229",
    name: "Claude 3 Opus",
    description: INTELLIGENCE_TYPES[IntelligenceId.HIGH_INTELLIGENCE].description,
    provider: "claude",
    features: [
      {
        id: FeatureId.FILE_UPLOAD,
        enabled: true,
        icon: FEATURE_ICONS[FeatureId.FILE_UPLOAD],
      },
      {
        id: FeatureId.IMAGE_UPLOAD,
        enabled: true,
        icon: FEATURE_ICONS[FeatureId.IMAGE_UPLOAD],
      },
      {
        id: FeatureId.WEB_SEARCH,
        enabled: true,
        icon: FEATURE_ICONS[FeatureId.WEB_SEARCH],
      },
      {
        id: FeatureId.REASONING,
        enabled: true,
        icon: FEATURE_ICONS[FeatureId.REASONING],
      },
    ],
    use_cases: [
      {
        id: UseCaseId.ADVANCED_RESEARCH,
        enabled: true,
        icon: USE_CASE_ICONS[UseCaseId.ADVANCED_RESEARCH],
      },
    ],
    api_sdk: customClaude("claude-3-opus-20240229"),
    icon: Claude,
  },
] as Model[]