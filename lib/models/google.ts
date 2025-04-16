import Gemini from "@/components/icons/gemini"
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

const customGoogle = createOpenAI({
  baseURL: AIML_API_BASE_URL,
  apiKey: process.env.AIML_API_KEY,
})

export const MODELS = [
  {
    id: "gemini-2.5-pro-preview",
    name: "Gemini 2.5 Pro Preview",
    provider: "gemini",
    type: "text",
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
    api_sdk: customGoogle("gemini-2.5-pro-preview"),
    icon: Gemini,
    featured: true,
  },
  {
    id: "gemini-2.0-flash",
    name: "Gemini 2.0 Flash",
    description: INTELLIGENCE_TYPES[IntelligenceId.FAST_INTELLIGENT].description,
    provider: "gemini",
    type: "text",
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
        id: UseCaseId.QUICK_RESEARCH,
        enabled: true,
        icon: USE_CASE_ICONS[UseCaseId.QUICK_RESEARCH],
      },
    ],
    api_sdk: customGoogle("gemini-2.0-flash"),
    icon: Gemini,
  },
  {
    id: "gemini-2.0-flash-thinking-exp-01-21",
    name: "Gemini 2.0 Flash Thinking",
    description: INTELLIGENCE_TYPES[IntelligenceId.HIGH_INTELLIGENCE].description,
    provider: "gemini",
    type: "text",
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
        id: UseCaseId.QUICK_RESEARCH,
        enabled: true,
        icon: USE_CASE_ICONS[UseCaseId.QUICK_RESEARCH],
      },
    ],
    api_sdk: customGoogle("gemini-2.0-flash-thinking-exp-01-21"),
    icon: Gemini,
  },
  {
    id: "gemini-1.5-flash",
    name: "Gemini 1.5 Flash",
    description: INTELLIGENCE_TYPES[IntelligenceId.FAST_INTELLIGENT].description,
    provider: "gemini",
    type: "text",
    features: [
      {
        id: FeatureId.FILE_UPLOAD,
        enabled: true,
        icon: FEATURE_ICONS[FeatureId.FILE_UPLOAD],
      },
      {
        id: FeatureId.THINKING,
        enabled: true,
        icon: FEATURE_ICONS[FeatureId.THINKING],
      },
    ],
    use_cases: [
      {
        id: UseCaseId.QUICK_RESEARCH,
        enabled: true,
        icon: USE_CASE_ICONS[UseCaseId.QUICK_RESEARCH],
      },
    ],
    api_sdk: customGoogle("gemini-1.5-flash"),
    icon: Gemini,
  },
] as Model[]