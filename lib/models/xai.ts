import Grok from "@/components/icons/grok"
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

const customXAI = createOpenAI({
  baseURL: AIML_API_BASE_URL,
  apiKey: process.env.AIML_API_KEY,
})

export const MODELS = [
    {
        id: "grok-beta",
        name: "Grok",
        provider: "xai",
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
        api_sdk: customXAI("x-ai/grok-beta"),
        icon: Grok,
    },
    {
        id: "grok-3-mini-beta",
        name: "Grok 3 Mini",
        provider: "xai",
        description: INTELLIGENCE_TYPES[IntelligenceId.HIGH_INTELLIGENCE].description,
        features: [
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
        api_sdk: customXAI("x-ai/grok-3-mini-beta"),
        icon: Grok,
        featured: true,
    },
    {
        id: "grok-3-beta",
        name: "Grok 3",
        provider: "xai",
        description: INTELLIGENCE_TYPES[IntelligenceId.HIGH_INTELLIGENCE].description,
        features: [
          {
            id: FeatureId.DEEP_REASONING,
            enabled: true,
            icon: FEATURE_ICONS[FeatureId.DEEP_REASONING],
          },
        ],
        use_cases: [
          {
            id: UseCaseId.ADVANCED_ACADEMIC_RESEARCH,
            enabled: true,
            icon: USE_CASE_ICONS[UseCaseId.ADVANCED_ACADEMIC_RESEARCH],
          },
        ],
        api_sdk: customXAI("x-ai/grok-3-beta"),
        icon: Grok,
        featured: true,
    },
] as Model[]