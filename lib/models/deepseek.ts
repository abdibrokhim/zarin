import DeepSeek from "@/components/icons/deepseek"
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

const customDeepSeek = createOpenAI({
  baseURL: AIML_API_BASE_URL,
  apiKey: process.env.AIML_API_KEY,
})

export const MODELS = [
  {
    id: "deepseek-r1",
    name: "DeepSeek R1",
    provider: "deepseek",
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
    api_sdk: customDeepSeek("deepseek/deepseek-r1"),
    icon: DeepSeek,
    featured: true,
  },
  {
    id: "deepseek-chat",
    name: "DeepSeek V3",
    description: INTELLIGENCE_TYPES[IntelligenceId.FAST_INTELLIGENT].description,
    provider: "deepseek",
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
    api_sdk: customDeepSeek("deepseek/deepseek-chat"),
    icon: DeepSeek,
  },
] as Model[]