import Deepgram from "@/components/icons/deepgram"
import { AIML_API_BASE_URL } from "../config"
import { 
    Model, 
    FeatureId, 
    UseCaseId, 
    FEATURE_ICONS, 
    USE_CASE_ICONS, 
    IntelligenceId, 
    AUDIO_MODELS_INTELLIGENCE_TYPES,
    AUDIO_MODELS_SUPPORTED_LANGUAGES
} from "./types"

function customDeepgram(modelId: string) {
  return async function(text: string) {
    try {
      const response = await fetch(`${AIML_API_BASE_URL}/tts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.AIML_API_KEY}`,
        },
        body: JSON.stringify({
          model: modelId,
          text: text
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to generate audio');
      }

      return response.blob();

    } catch (error: any) {
      console.error('Error generating audio:', error);
      throw error;
    }
  }
}

const deepgramModels = [
  "g1_aura-angus-en",
  "g1_aura-arcas-en", 
  "g1_aura-asteria-en",
  "g1_aura-athena-en",
  "g1_aura-helios-en",
  "g1_aura-hera-en",
  "g1_aura-luna-en",
  "g1_aura-orion-en",
  "g1_aura-orpheus-en",
  "g1_aura-perseus-en",
  "g1_aura-stella-en",
  "g1_aura-zeus-en",
]

export const MODELS = deepgramModels.map(modelId => {
  const parts = modelId.split("-")
  const voiceName = parts[1].charAt(0).toUpperCase() + parts[1].slice(1)
  
  return {
    id: `deepgram-${modelId.split('-')[1]}`,
    name: `Deepgram ${voiceName}`,
    provider: "deepgram",
    type: "audio",
    description: AUDIO_MODELS_INTELLIGENCE_TYPES[IntelligenceId.FAST_FLEXIBLE].description,
    features: [
      {
        id: FeatureId.CONVERSATIONAL,
        enabled: true,
        icon: FEATURE_ICONS[FeatureId.CONVERSATIONAL],
      },
      {
        id: FeatureId.HUMAN_LIKE_VOICE,
        enabled: true,
        icon: FEATURE_ICONS[FeatureId.HUMAN_LIKE_VOICE],
      },
    ],
    use_cases: [
      {
        id: UseCaseId.AUDIO_GENERATION,
        enabled: true,
        icon: USE_CASE_ICONS[UseCaseId.AUDIO_GENERATION],
      },
    ],
    languages: [
      AUDIO_MODELS_SUPPORTED_LANGUAGES["en"],
    ],
    api_sdk: customDeepgram(modelId),
    icon: Deepgram,
    featured: true,
    status: "experimental",
  }
}) as Model[]