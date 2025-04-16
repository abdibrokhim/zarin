import Mistral from "@/components/icons/mistral"
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

const customMistral = createOpenAI({
  baseURL: AIML_API_BASE_URL,
  apiKey: process.env.AIML_API_KEY,
})

export const MODELS = [
    {
        id: "mistralai/mistral-nemo",
        name: "Mistral Nemo",
        provider: "mistral",
        type: "text",
        description: INTELLIGENCE_TYPES[IntelligenceId.FAST_FLEXIBLE].description,
        features: [
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
        api_sdk: customMistral("mistralai/mistral-nemo"),
        icon: Mistral,
      },
      {
        id: "mistralai/Mistral-7B-Instruct-v0.3",
        name: "Mistral 7B",
        provider: "mistral",
        type: "text",
        description: INTELLIGENCE_TYPES[IntelligenceId.FAST_FLEXIBLE].description,
        features: [
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
        api_sdk: customMistral("mistralai/Mistral-7B-Instruct-v0.3"),
        icon: Mistral,
      },
      {
        id: "mistralai/mistral-tiny",
        name: "Mistral Tiny",
        provider: "mistral",
        type: "text",
        description: INTELLIGENCE_TYPES[IntelligenceId.FAST_FLEXIBLE].description,
        features: [
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
        api_sdk: customMistral("mistralai/mistral-tiny"),
        icon: Mistral,
      },
      {
        id: "mistral-large-latest",
        name: "Mistral Large",
        provider: "mistral",
        type: "text",
        description: INTELLIGENCE_TYPES[IntelligenceId.FAST_FLEXIBLE].description,
        features: [
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
        api_sdk: customMistral("mistral-large-latest"),
        icon: Mistral,
      },
] as Model[]