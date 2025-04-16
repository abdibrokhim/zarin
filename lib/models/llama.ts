import Llama from "@/components/icons/llama"
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

const customLlama = createOpenAI({
  baseURL: AIML_API_BASE_URL,
  apiKey: process.env.AIML_API_KEY,
})

export const MODELS = [
  {
    id: "Llama-3.3",
    name: "Llama 3.3",
    provider: "llama",
    type: "text",
    description: INTELLIGENCE_TYPES[IntelligenceId.FAST_FLEXIBLE].description,
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
    api_sdk: customLlama("meta-llama/Llama-3.3-70B-Instruct-Turbo"),
    icon: Llama,
  },
  {
    id: "llama-4-maverick",
    name: "Llama 4 Maverick",
    provider: "llama",
    type: "text",
    description: INTELLIGENCE_TYPES[IntelligenceId.ADVANCED_INTELLIGENT].description,
    features: [
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
    api_sdk: customLlama("meta-llama/llama-4-maverick"),
    icon: Llama,
    featured: true,
  },
  {
    id: "llama-4-scout",
    name: "Llama 4 Scout",
    provider: "llama",
    type: "text",
    description: INTELLIGENCE_TYPES[IntelligenceId.FAST_INTELLIGENT].description,
    features: [
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
    api_sdk: customLlama("meta-llama/llama-4-scout"),
    icon: Llama,
    featured: true,
  },
] as Model[]