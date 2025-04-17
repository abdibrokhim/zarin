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
  ChatCenteredText,
  Translate,
  Waveform
} from "@phosphor-icons/react/dist/ssr"

import { AC, AD, AE, AF, AG, AI, AL, AM, AO, AQ, AR, AS, AT, AU, AW, AX, AZ, BA, BB, BD, BE, BF, BG, BH, BI, BJ, BL, BM, BN, BO, BQ, BR, BS, BT, BV, BW, BY, BZ, CA, CC, CD, CF, CG, CH, CI, CK, CL, CM, CN, CO, CR, CU, CV, CW, CX, CY, CZ, DE, DJ, DK, DM, DO, DZ, EC, EE, EG, EH, ER, ES, ET, EU, FI, FJ, FK, FM, FO, FR, GA, GB, GD, GE, GF, GG, GH, GI, GL, GM, GN, GP, GQ, GR, GS, GT, GU, GW, GY, HK, HM, HN, HR, HT, HU, IC, ID, IE, IL, IM, IN, IO, IQ, IR, IS, IT, JE, JM, JO, JP, KE, KG, KH, KI, KM, KN, KP, KR, KW, KY, KZ, LA, LB, LC, LI, LK, LR, LS, LT, LU, LV, LY, MA, MC, MD, ME, MF, MG, MH, MK, ML, MM, MN, MO, MP, MQ, MR, MS, MT, MU, MV, MW, MX, MY, MZ, NA, NC, NE, NF, NG, NI, NL, NO, NP, NR, NU, NZ, OM, PA, PE, PF, PG, PH, PK, PL, PM, PN, PR, PS, PT, PW, PY, QA, RE, RO, RS, RU, RW, SA, SB, SC, SD, SE, SG, SH, SI, SJ, SK, SL, SM, SN, SO, SR, SS, ST, SV, SX, SY, SZ, TA, TC, TD, TF, TG, TH, TJ, TK, TL, TM, TN, TO, TR, TT, TV, TW, TZ, UA, UG, UM, US, UY, UZ, VA, VC, VE, VG, VI, VN, VU, WF, WS, XK, YE, YT, ZA, ZM, ZW } from 'country-flag-icons/react/3x2'
import { FlagComponent } from 'country-flag-icons/react/3x2'

export type ModelType = "text" | "audio" | "image" | "video" | "3d" | "music" | "search"

export type Provider = {
  id: string
  name: string
  available: boolean
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  status?: "new" | "experimental" | "idk"
}

export type Model = {
  id: string
  name: string
  type: ModelType
  provider: string
  description?: string
  available?: boolean
  api_sdk?: any
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>
  features?: Feature[]
  use_cases?: UseCase[]
  featured?: boolean
  languages?: LanguageMetadata[]
  status?: "new" | "experimental" | "idk"
}

export enum FeatureId {
  FILE_UPLOAD = "file-upload",
  IMAGE_UPLOAD = "image-upload", 
  WEB_SEARCH = "web-search",
  THINKING = "thinking",
  REASONING = "reasoning",
  DEEP_REASONING = "deep-reasoning",
  DEEPER_REASONING = "deeper-reasoning",
  SUPER_DEEP_REASONING = "super-deep-reasoning",
  MULTIMODAL = "multimodal",
  CONVERSATIONAL = "conversational",
  LANGUAGE_TRANSLATION = "language-translation",
  HUMAN_LIKE_VOICE = "human-like-voice",
}

export const FEATURE_ICONS: Record<FeatureId, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  [FeatureId.FILE_UPLOAD]: FileText,
  [FeatureId.IMAGE_UPLOAD]: Image,
  [FeatureId.WEB_SEARCH]: Globe,
  [FeatureId.THINKING]: CircleWavyQuestion,
  [FeatureId.REASONING]: Brain,
  [FeatureId.DEEP_REASONING]: Gear,
  [FeatureId.DEEPER_REASONING]: LightbulbFilament,
  [FeatureId.SUPER_DEEP_REASONING]: Sparkle,
  [FeatureId.MULTIMODAL]: Cube,
  [FeatureId.CONVERSATIONAL]: ChatCenteredText,
  [FeatureId.LANGUAGE_TRANSLATION]: Translate,
  [FeatureId.HUMAN_LIKE_VOICE]: Waveform
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
  ADVANCED_INTELLIGENT = "advanced-intelligent",
  HIGH_INTELLIGENCE_FAST_AFFORDABLE = "high-intelligence-fast-affordable"
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
  },
  [IntelligenceId.HIGH_INTELLIGENCE_FAST_AFFORDABLE]: {
    id: IntelligenceId.HIGH_INTELLIGENCE_FAST_AFFORDABLE,
    description: "Advanced, intelligent, fast, affordable model"
  }
}

export enum MusicIntelligenceId {
  FAST_FLEXIBLE = "fast-flexible",
  FAST_AFFORDABLE = "fast-affordable",
  HIGH_INTELLIGENCE = "high-intelligence",
}

export const AUDIO_MODELS_INTELLIGENCE_TYPES: Record<MusicIntelligenceId, Intelligence> = {
  [IntelligenceId.FAST_FLEXIBLE]: {
    id: IntelligenceId.FAST_FLEXIBLE,
    description: "Human-like voice quality with unparalleled speed and efficiency"
  },
  [IntelligenceId.FAST_AFFORDABLE]: {
    id: IntelligenceId.FAST_AFFORDABLE,
    description: "Human-like voice quality with unparalleled speed and efficiency"
  },
  [IntelligenceId.HIGH_INTELLIGENCE]: {
    id: IntelligenceId.HIGH_INTELLIGENCE,
    description: "Human-like voice quality with unparalleled speed and efficiency"
  },
}

export type LanguageCode = "en" | "zh" | "es" | "fr" | "de"

export type LanguageMetadata = {
  language: string, 
  language_code: string,
  language_flag: FlagComponent
}

export const AUDIO_MODELS_SUPPORTED_LANGUAGES: Record<LanguageCode, LanguageMetadata> = {
  "en": {
    language: "English",
    language_code: "en",
    language_flag: US
  },
  "zh": {
    language: "Chinese",
    language_code: "zh",
    language_flag: CN
  },
  "es": {
    language: "Spanish",
    language_code: "es",
    language_flag: ES
  },
  "fr": {
    language: "French",
    language_code: "fr",
    language_flag: FR
  },
  "de": {
    language: "German",
    language_code: "de",
    language_flag: DE
  }
}
