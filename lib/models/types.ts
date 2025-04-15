import {
  BookOpenText,
  Brain,
  ChalkboardTeacher,
  ChatTeardropText,
  Code,
  CookingPot,
  Heartbeat,
  Lightbulb,
  MagnifyingGlass,
  Notepad,
  PaintBrush,
  PenNib,
  Sparkle,
  Crown,
  Image,
  Rocket,
  WifiHigh,
  LightbulbFilament,
  GlobeSimple,
  FileText,
  Camera,
  Globe,
  CircleWavyQuestion,
  Gear,
  Cube,
  Microphone,
  VideoCamera,
  Cube as Cube3D,
  MusicNote,
  ChatCenteredText
} from "@phosphor-icons/react/dist/ssr"

export type Provider = {
  id: string
  name: string
  available: boolean
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

export type Model = {
  id: string
  name: string
  provider: string
  description?: string
  available?: boolean
  api_sdk?: any
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>
  features?: Feature[]
  use_cases?: UseCase[]
  featured?: boolean
}

export enum FeatureId {
  FILE_UPLOAD = "file-upload",
  IMAGE_UPLOAD = "image-upload", 
  WEB_SEARCH = "web-search",
  THINKING = "thinking",
  REASONING = "reasoning",
  DEEP_REASONING = "deep-reasoning",
  DEEPER_REASONING = "deeper-reasoning",
  MULTIMODAL = "multimodal",
  CONVERSATIONAL = "conversational",
}

export const FEATURE_ICONS: Record<FeatureId, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  [FeatureId.FILE_UPLOAD]: FileText,
  [FeatureId.IMAGE_UPLOAD]: Image,
  [FeatureId.WEB_SEARCH]: Globe,
  [FeatureId.THINKING]: CircleWavyQuestion,
  [FeatureId.REASONING]: Brain,
  [FeatureId.DEEP_REASONING]: Gear,
  [FeatureId.DEEPER_REASONING]: LightbulbFilament,
  [FeatureId.MULTIMODAL]: Cube,
  [FeatureId.CONVERSATIONAL]: ChatCenteredText
}

export enum UseCaseId {
  QUICK_RESEARCH = "quick-research",
  ADVANCED_RESEARCH = "advanced-research", 
  ADVANCED_ACADEMIC_RESEARCH = "advanced-academic-research",
  IMAGE_GENERATION = "image-generation",
  AUDIO_GENERATION = "audio-generation",
  VIDEO_GENERATION = "video-generation",
  THREE_D_GENERATION = "3d-generation",
  MUSIC_GENERATION = "music-generation",
}

export const USE_CASE_ICONS: Record<UseCaseId, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  [UseCaseId.QUICK_RESEARCH]: MagnifyingGlass,
  [UseCaseId.ADVANCED_RESEARCH]: BookOpenText,
  [UseCaseId.ADVANCED_ACADEMIC_RESEARCH]: Sparkle,
  [UseCaseId.IMAGE_GENERATION]: Image,
  [UseCaseId.AUDIO_GENERATION]: Microphone,
  [UseCaseId.VIDEO_GENERATION]: VideoCamera,
  [UseCaseId.THREE_D_GENERATION]: Cube3D,
  [UseCaseId.MUSIC_GENERATION]: MusicNote
}

export type Feature = {
  id: FeatureId
  enabled: boolean
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

export type UseCase = {
  id: UseCaseId
  enabled: boolean
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

export enum IntelligenceId {
  FAST_FLEXIBLE = "fast-flexible",
  FAST_AFFORDABLE = "fast-affordable",
  HIGH_INTELLIGENCE = "high-intelligence",
  FAST_INTELLIGENT = "fast-intelligent",
  ADVANCED_INTELLIGENT = "advanced-intelligent"
}

export type Intelligence = {
  id: IntelligenceId
  description: string
}

export const INTELLIGENCE_TYPES: Record<IntelligenceId, Intelligence> = {
  [IntelligenceId.FAST_FLEXIBLE]: {
    id: IntelligenceId.FAST_FLEXIBLE,
    description: "Fast, intelligent, flexible model"
  },
  [IntelligenceId.FAST_AFFORDABLE]: {
    id: IntelligenceId.FAST_AFFORDABLE,
    description: "Fast, affordable small model for focused tasks"
  },
  [IntelligenceId.HIGH_INTELLIGENCE]: {
    id: IntelligenceId.HIGH_INTELLIGENCE,
    description: "High-intelligence reasoning model"
  },
  [IntelligenceId.FAST_INTELLIGENT]: {
    id: IntelligenceId.FAST_INTELLIGENT,
    description: "Fast, flexible, intelligent reasoning model"
  },
  [IntelligenceId.ADVANCED_INTELLIGENT]: {
    id: IntelligenceId.ADVANCED_INTELLIGENT,
    description: "Advanced, intelligent, reasoning model"
  }
}
