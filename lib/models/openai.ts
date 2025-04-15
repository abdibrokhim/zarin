import OpenAI from "@/components/icons/openai"
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

const customOpenAI = createOpenAI({
  baseURL: AIML_API_BASE_URL,
  apiKey: process.env.AIML_API_KEY,
})

export const MODELS = [
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "openai",
    description: INTELLIGENCE_TYPES[IntelligenceId.FAST_FLEXIBLE].description,
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
    api_sdk: customOpenAI("gpt-4o"),
    icon: OpenAI,
  },
  {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    provider: "openai",
    description: INTELLIGENCE_TYPES[IntelligenceId.FAST_AFFORDABLE].description,
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
    api_sdk: customOpenAI("gpt-4o-mini"),
    icon: OpenAI,
  },
  {
    id: "o1",
    name: "o1",
    provider: "openai",
    description: INTELLIGENCE_TYPES[IntelligenceId.HIGH_INTELLIGENCE].description,
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
    api_sdk: customOpenAI("o1"),
    icon: OpenAI,
  },
  {
    id: "o1-mini",
    name: "o1 Mini",
    provider: "openai",
    description: INTELLIGENCE_TYPES[IntelligenceId.HIGH_INTELLIGENCE].description,
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
    api_sdk: customOpenAI("o1-mini"),
    icon: OpenAI,
  },
  {
    id: "o3-mini",
    name: "o3 Mini",
    provider: "openai",
    description: INTELLIGENCE_TYPES[IntelligenceId.FAST_INTELLIGENT].description,
    features: [
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
    api_sdk: customOpenAI("o3-mini"),
    icon: OpenAI,
  },
  {
    id: "gpt-4.5-preview",
    name: "GPT-4.5 Preview",
    provider: "openai",
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
    api_sdk: customOpenAI("gpt-4.5-preview"),
    icon: OpenAI,
  },
] as Model[]