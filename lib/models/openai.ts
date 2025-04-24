import OpenAI from "@/components/icons/openai"
import { createOpenAI } from "@ai-sdk/openai"
import { AIML_API_BASE_IMAGE_URL, AIML_API_BASE_URL } from "../config"
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

const customOpenAiImage = createOpenAI({
  baseURL: AIML_API_BASE_IMAGE_URL,
  apiKey: process.env.AIML_API_KEY,
})

export const MODELS = [
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "openai",
    type: "text",
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
    type: "text",
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
    type: "text",
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
    type: "text",
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
    type: "text",
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
    featured: true,
  },
  {
    id: "gpt-4.5-preview",
    name: "GPT-4.5 Preview",
    provider: "openai",
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
    api_sdk: customOpenAI("gpt-4.5-preview"),
    icon: OpenAI,
    featured: true,
  },
  {
    id: "gpt-4.1-2025-04-14",
    name: "GPT-4.1",
    provider: "openai",
    type: "text",
    description: INTELLIGENCE_TYPES[IntelligenceId.HIGH_INTELLIGENCE_FAST_AFFORDABLE].description,
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
    featured: true,
    status: "new",
  },
  {
    id: "gpt-4.1-nano-2025-04-14",
    name: "GPT-4.1 Nano",
    provider: "openai",
    type: "text",
    description: INTELLIGENCE_TYPES[IntelligenceId.HIGH_INTELLIGENCE_FAST_AFFORDABLE].description,
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
    api_sdk: customOpenAI("openai/gpt-4.1-nano-2025-04-14"),
    icon: OpenAI,
    featured: true,
    status: "new",
  },
  {
    id: "gpt-4.1-mini-2025-04-14",
    name: "GPT-4.1 Mini",
    provider: "openai",
    type: "text",
    description: INTELLIGENCE_TYPES[IntelligenceId.HIGH_INTELLIGENCE_FAST_AFFORDABLE].description,
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
    api_sdk: customOpenAI("openai/gpt-4.1-mini-2025-04-14"),
    icon: OpenAI,
    featured: true,
    status: "new",
  },
  {
    id: "dall-e-2",
    name: "Dall-E 2",
    provider: "openai",
    type: "image",
    description: INTELLIGENCE_TYPES[IntelligenceId.FAST_AFFORDABLE].description,
    features: [
      {
        id: FeatureId.MULTIMODAL,
        enabled: true,
        icon: FEATURE_ICONS[FeatureId.MULTIMODAL],
      },
    ],
    use_cases: [
      {
        id: UseCaseId.IMAGE_GENERATION,
        enabled: true,
        icon: USE_CASE_ICONS[UseCaseId.IMAGE_GENERATION],
      },
    ],
    api_sdk: customOpenAiImage("dall-e-2"),
    icon: OpenAI,
    featured: true,
    status: "new",
  },
  {
    id: "dall-e-3",
    name: "Dall-E 3",
    provider: "openai",
    type: "image",
    description: INTELLIGENCE_TYPES[IntelligenceId.FAST_AFFORDABLE].description,
    features: [
      {
        id: FeatureId.MULTIMODAL,
        enabled: true,
        icon: FEATURE_ICONS[FeatureId.MULTIMODAL],
      },
    ],
    use_cases: [
      {
        id: UseCaseId.IMAGE_GENERATION,
        enabled: true,
        icon: USE_CASE_ICONS[UseCaseId.IMAGE_GENERATION],
      },
    ],
    api_sdk: customOpenAiImage("dall-e-3"),
    icon: OpenAI,
    featured: true,
    status: "new",
  },
] as Model[]