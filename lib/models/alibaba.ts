import Qwen from "@/components/icons/qwen"
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

const customQwen = createOpenAI({
  baseURL: AIML_API_BASE_URL,
  apiKey: process.env.AIML_API_KEY,
})

export const MODELS = [
  {
    id: "qwq-32b",
    name: "QwQ 32B",
    provider: "alibaba-cloud",
    description: INTELLIGENCE_TYPES[IntelligenceId.ADVANCED_INTELLIGENT].description,
    features: [
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
    api_sdk: customQwen("Qwen/QwQ-32B"),
    icon: Qwen,
  },
  {
    id: "qwen-turbo",
    name: "Qwen Turbo",
    description: INTELLIGENCE_TYPES[IntelligenceId.FAST_INTELLIGENT].description,
    provider: "alibaba-cloud",
    features: [
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
    api_sdk: customQwen("Qwen/Qwen-Turbo"),
    icon: Qwen,
  },
  {
    id: "qwen2.5-coder-32b-instruct",
    name: "Qwen 2.5 Coder",
    description: INTELLIGENCE_TYPES[IntelligenceId.FAST_INTELLIGENT].description,
    provider: "alibaba-cloud",
    features: [
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
    api_sdk: customQwen("Qwen/Qwen2.5-Coder-32B-Instruct"),
    icon: Qwen,
  },
] as Model[]