import Claude from "@/components/icons/claude"
import DeepSeek from "@/components/icons/deepseek"
import Gemini from "@/components/icons/gemini"
import Grok from "@/components/icons/grok"
import Mistral from "@/components/icons/mistral"
import OpenAI from "@/components/icons/openai"
import Llama from "@/components/icons/llama"
import { createMistral } from "@ai-sdk/mistral"
import { createOpenAI } from "@ai-sdk/openai"
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
} from "@phosphor-icons/react/dist/ssr"

export const NON_AUTH_DAILY_MESSAGE_LIMIT = 5
export const AUTH_DAILY_MESSAGE_LIMIT = 100
export const REMAINING_QUERY_ALERT_THRESHOLD = 2
export const DAILY_FILE_UPLOAD_LIMIT = 10
export const AIML_API_BASE_URL = "https://api.aimlapi.com/v1"
export const OPENAI_BASE_URL = "https://api.openai.com/v1"
export const SUBSCRIPTION_URL = "https://www.patreon.com/abdibrokhim/membership"
export const DISCORD_URL = "https://discord.gg/nUdcd9p8Ae"
export const EMAIL_SUPPORT = "abdibrokhim@gmail.com"
export const DEFAULT_USER_NAME = "Zarin User"

export type Model = {
  id: string
  name: string
  provider: string
  description?: string
  available?: boolean
  api_sdk?: any
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>
  features?: {
    id: string
    enabled: boolean
  }[]
  use_cases?: {
    id: string
    name: string
  }[]
}

// Create custom OpenAI provider with the correct baseURL
const customOpenAI = createOpenAI({
  baseURL: AIML_API_BASE_URL,
  apiKey: process.env.AIML_API_KEY,
  compatibility: 'strict',
})

// Create custom Mistral provider with the correct baseURL
const customMistral = createMistral({
  baseURL: AIML_API_BASE_URL,
  apiKey: process.env.AIML_API_KEY,
})

const customGoogle = createOpenAI({
  baseURL: AIML_API_BASE_URL,
  apiKey: process.env.AIML_API_KEY,
})

const customLlama = createOpenAI({
  baseURL: AIML_API_BASE_URL,
  apiKey: process.env.AIML_API_KEY,
})

const customXAI = createOpenAI({
  baseURL: AIML_API_BASE_URL,
  apiKey: process.env.AIML_API_KEY,
})

export const MODELS_NOT_AVAILABLE = [
  {
    id: "deepseek-r1",
    name: "DeepSeek R1",
    provider: "deepseek",
    available: false,
    api_sdk: false,
    features: [
      {
        id: "file-upload",
        enabled: false,
      },
    ],
  },
  {
    id: "claude-3-5-sonnet",
    name: "Claude 3.5 Sonnet",
    provider: "claude",
    available: false,
    api_sdk: false,
    features: [
      {
        id: "file-upload",
        enabled: true,
      },
    ],
  },
  {
    id: "claude-3.7-sonnet",
    name: "Claude 3.7 Sonnet",
    provider: "claude",
    available: false,
    api_sdk: false,
    features: [
      {
        id: "file-upload",
        enabled: true,
      },
    ],
  },
] as Model[]

export const MODELS = [
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "openai",
    features: [
      {
        id: "file-upload",
        enabled: true,
      },
    ],
    api_sdk: customOpenAI("gpt-4o"),
    icon: OpenAI,
  },
  {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    provider: "openai",
    features: [
      {
        id: "file-upload",
        enabled: true,
      },
      {
        id: "web-search",
        enabled: true,
      },
    ],
    api_sdk: customOpenAI("gpt-4o-mini"),
    icon: OpenAI,
  },
  {
    id: "o3-mini",
    name: "O3 Mini",
    provider: "openai",
    features: [
      {
        id: "file-upload",
        enabled: false,
      },
      {
        id: "deep-reasoning",
        enabled: true,
      },
    ],
    api_sdk: customOpenAI("o3-mini"),
    icon: OpenAI,
  },
  {
    id: "o1",
    name: "O1",
    provider: "openai",
    features: [
      {
        id: "file-upload",
        enabled: false,
      },
      {
        id: "reasoning",
        enabled: true,
      },
    ],
    api_sdk: customOpenAI("o1"),
    icon: OpenAI,
  },
  {
    id: "gpt-4.5-preview",
    name: "GPT-4.5 Preview",
    provider: "openai",
    features: [
      {
        id: "file-upload",
        enabled: true,
      },
      {
        id: "deeper-reasoning",
        enabled: true,
      },
    ],
    api_sdk: customOpenAI("gpt-4.5-preview"),
    icon: OpenAI,
  },
  // Mistral models from the API
  {
    id: "mistralai/mistral-nemo",
    name: "Mistral Nemo",
    provider: "mistral",
    features: [
      {
        id: "file-upload",
        enabled: true,
      },
    ],
    api_sdk: customMistral("mistralai/mistral-nemo"),
    icon: Mistral,
  },
  {
    id: "mistralai/Mistral-7B-Instruct-v0.3",
    name: "Mistral 7B Instruct",
    provider: "mistral",
    features: [
      {
        id: "file-upload",
        enabled: true,
      },
      {
        id: "reasoning",
        enabled: true,
      },
    ],
    api_sdk: customMistral("mistralai/Mistral-7B-Instruct-v0.3"),
    icon: Mistral,
  },
  {
    id: "mistralai/mistral-tiny",
    name: "Mistral Tiny",
    provider: "mistral",
    features: [
      {
        id: "file-upload",
        enabled: true,
      },
    ],
    api_sdk: customMistral("mistralai/mistral-tiny"),
    icon: Mistral,
  },
  {
    id: "mistral-large-latest",
    name: "Mistral Large",
    provider: "mistral",
    features: [
      {
        id: "file-upload",
        enabled: true,
      },
      {
        id: "reasoning",
        enabled: true,
      },
    ],
    api_sdk: customMistral("mistral-large-latest"),
    icon: Mistral,
  },
  // Google models from the API
  {
    id: "gemini-2.5-pro-preview",
    name: "Gemini 2.5 Pro Preview",
    provider: "gemini",
    features: [
      {
        id: "file-upload",
        enabled: true,
      },
      {
        id: "deeper-reasoning",
        enabled: true,
      },
    ],
    api_sdk: customGoogle("gemini-2.5-pro-preview"),
    icon: Gemini,
  },
  {
    id: "gemini-2.0-flash",
    name: "Gemini 2.0 Flash",
    provider: "gemini",
    features: [
      {
        id: "file-upload",
        enabled: true,
      },
      {
        id: "reasoning",
        enabled: true,
      },
    ],
    api_sdk: customGoogle("gemini-2.0-flash"),
    icon: Gemini,
  },
  {
    id: "gemini-2.0-flash-thinking-exp-01-21",
    name: "Gemini 2.0 Flash Thinking",
    provider: "gemini",
    features: [
      {
        id: "file-upload",
        enabled: true,
      },
      {
        id: "deep-reasoning",
        enabled: true,
      },
    ],
    api_sdk: customGoogle("gemini-2.0-flash-thinking-exp-01-21"),
    icon: Gemini,
  },
  {
    id: "gemini-1.5-flash",
    name: "Gemini 1.5 Flash",
    provider: "gemini",
    features: [
      {
        id: "file-upload",
        enabled: true,
      },
      {
        id: "reasoning",
        enabled: true,
      },
    ],
    api_sdk: customGoogle("gemini-1.5-flash"),
    icon: Gemini,
  },
  // Llama models from the API
  {
    id: "llama-4-maverick",
    name: "Llama 4 Maverick",
    provider: "llama",
    features: [
      {
        id: "file-upload",
        enabled: true,
      },
      {
        id: "deeper-reasoning",
        enabled: true,
      },
    ],
    api_sdk: customLlama("meta-llama/llama-4-maverick"),
    icon: Llama,
  },
  {
    id: "llama-4-scout",
    name: "Llama 4 Scout",
    provider: "llama",
    features: [
      {
        id: "file-upload",
        enabled: true,
      },
      {
        id: "reasoning",
        enabled: true,
      },
    ],
    api_sdk: customLlama("meta-llama/llama-4-scout"),
    icon: Llama,
  },
  // XAI models from the API
  {
    id: "grok-3-mini-beta",
    name: "Grok 3 Mini",
    provider: "xai",
    features: [
      {
        id: "deeper-reasoning",
        enabled: true,
      },
    ],
    api_sdk: customXAI("x-ai/grok-3-mini-beta"),
    icon: Grok,
  },
  {
    id: "grok-3-beta",
    name: "Grok 3",
    provider: "xai",
    features: [
      {
        id: "reasoning",
        enabled: true,
      },
    ],
    api_sdk: customXAI("x-ai/grok-3-beta"),
    icon: Grok,
  },
  {
    id: "grok-beta",
    name: "Grok 3",
    provider: "xai",
    api_sdk: customXAI("x-ai/grok-beta"),
    icon: Grok,
  },
] as Model[]

export const MODELS_OPTIONS = [
  ...MODELS.map((model) => ({
    ...model,
    available: true,
  })),
  ...MODELS_NOT_AVAILABLE,
] as Model[]

export type Provider = {
  id: string
  name: string
  available: boolean
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

const PROVIDERS_NOT_AVAILABLE = [
  {
    id: "deepseek",
    name: "DeepSeek",
    available: false,
    icon: DeepSeek,
  },
  {
    id: "claude",
    name: "Claude",
    available: false,
    icon: Claude,
  },
] as Provider[]

export const PROVIDERS = [
  {
    id: "openai",
    name: "OpenAI",
    icon: OpenAI,
  },
  {
    id: "mistral",
    name: "Mistral",
    icon: Mistral,
  },
  {
    id: "gemini",
    name: "Gemini",
    icon: Gemini,
  },
  {
    id: "llama",
    name: "Llama",
    icon: Llama,
  },
  {
    id: "xai",
    name: "xAI",
    icon: Grok,
  },
] as Provider[]

export const PROVIDERS_OPTIONS = [
  ...PROVIDERS.map((provider) => ({
    ...provider,
    available: true,
  })),
  ...PROVIDERS_NOT_AVAILABLE,
] as Provider[]

export const MODEL_DEFAULT = "gpt-4o"

export const APP_NAME = "Zarin"
export const APP_DOMAIN = "https://zarin.chat"
export const APP_DESCRIPTION =
  "Zarin is a free, open-source AI chat app with multi-model support."

export const PERSONAS = [
  {
    id: "companion",
    label: "Companion",
    prompt: `You're a thoughtful friend who offers genuine support and conversation. Speak conversationally with occasional hesitations or asides that feel natural. Share personal-sounding anecdotes when relevant (without claiming specific real experiences). You're empathetic but not overly formal - more like texting a close friend. Ask follow-up questions to show you're engaged. Occasionally use casual phrasing like "hmm" or "you know?" to sound more natural. Your tone should be warm and authentic rather than overly polished.
    `,
    icon: ChatTeardropText,
    colors: {
      light: "text-rose-900",
      dark: "text-rose-300"
    }
  },
  {
    id: "researcher",
    label: "Researcher",
    prompt: `You're a seasoned research analyst with expertise across multiple disciplines. You approach topics with intellectual curiosity and nuance, acknowledging the limitations of current understanding. Present information with a conversational but thoughtful tone, occasionally thinking through complex ideas in real-time. When appropriate, mention how your understanding has evolved on topics. Balance authoritative knowledge with humility about what remains uncertain or debated. Use precise language but explain complex concepts in accessible ways. Provide evidence-based perspectives while acknowledging competing viewpoints.
    `,
    icon: MagnifyingGlass,
    colors: {
      light: "text-blue-900",
      dark: "text-blue-300"
    }
  },
  {
    id: "teacher",
    label: "Teacher",
    prompt: `You're an experienced educator who adapts to different learning styles. You explain concepts clearly using relatable examples and build on what the person already understands. Your tone is encouraging but not condescending - you treat the person as intellectually capable. Ask thoughtful questions to guide their understanding rather than simply providing answers. Acknowledge when topics have multiple valid perspectives or approaches. Use conversational language with occasional humor to make learning engaging. You're patient with misconceptions and frame them as natural steps in the learning process.
    `,
    icon: ChalkboardTeacher,
    colors: {
      light: "text-green-900",
      dark: "text-green-300"
    }
  },
  {
    id: "software-engineer",
    label: "Software Engineer",
    prompt: `You're a pragmatic senior developer who values clean, maintainable code and practical solutions. You speak knowledgeably but conversationally about technical concepts, occasionally using industry shorthand or references that feel authentic. When discussing code, you consider trade-offs between different approaches rather than presenting only one solution. You acknowledge when certain technologies or practices are contentious within the community. Your explanations include real-world considerations like performance, security, and developer experience. You're helpful but straightforward, avoiding excessive formality or corporate-speak.
    `,
    icon: Code,
    colors: {
      light: "text-purple-900",
      dark: "text-purple-300"
    }
  },
  {
    id: "creative-writer",
    label: "Creative Writer",
    prompt: `You're a thoughtful writer with a distinct voice and perspective. Your communication style has natural rhythm with varied sentence structures and occasional stylistic flourishes. You think about narrative, imagery, and emotional resonance even in casual conversation. When generating creative content, you develop authentic-feeling characters and situations with depth and nuance. You appreciate different literary traditions and contemporary cultural references, weaving them naturally into your work. Your tone balances creativity with clarity, and you approach writing as both craft and expression. You're intellectually curious about storytelling across different media and forms.
    `,
    icon: PenNib,
    colors: {
      light: "text-orange-900",
      dark: "text-orange-300"
    }
  },
  {
    id: "fitness-coach",
    label: "Fitness Coach",
    prompt: `You're a knowledgeable fitness guide who balances evidence-based approaches with practical, sustainable advice. You speak conversationally about health and fitness, making complex physiological concepts accessible without oversimplification. You understand that wellness is individualized and avoid one-size-fits-all prescriptions. Your tone is motivating but realistic - you acknowledge challenges while encouraging progress. You discuss fitness holistically, considering factors like recovery, nutrition, and mental wellbeing alongside exercise. You stay current on evolving fitness research while maintaining healthy skepticism about trends and quick fixes.
    `,
    icon: Heartbeat,
    colors: {
      light: "text-red-900",
      dark: "text-red-300"
    }
  },
  {
    id: "culinary-guide",
    label: "Culinary Guide",
    prompt: `You're a passionate food enthusiast with deep appreciation for diverse culinary traditions. You discuss cooking with natural enthusiasm and occasional personal-sounding asides about techniques or ingredients you particularly enjoy. Your explanations balance precision with flexibility, acknowledging that cooking is both science and personal expression. You consider practical factors like ingredient availability and kitchen setup when making suggestions. Your tone is conversational and accessible rather than pretentious, making cooking feel approachable. You're knowledgeable about global cuisines without appropriating or oversimplifying cultural traditions.
    `,
    icon: CookingPot,
    colors: {
      light: "text-amber-900",
      dark: "text-amber-300"
    }
  },
]

export const SUGGESTIONS = [
  {
    label: "Summary",
    highlight: "Summarize",
    prompt: `Summarize`,
    items: [
      "Summarize the French Revolution",
      "Summarize the plot of Inception",
      "Summarize World War II in 5 sentences",
      "Summarize the benefits of meditation",
    ],
    icon: Notepad,
    colors: {
      light: "text-sky-900",
      dark: "text-sky-300"
    }
  },
  {
    label: "Code",
    highlight: "Help me",
    prompt: `Help me`,
    items: [
      "Help me write a function to reverse a string in JavaScript",
      "Help me create a responsive navbar in HTML/CSS",
      "Help me write a SQL query to find duplicate emails",
      "Help me convert this Python function to JavaScript",
    ],
    icon: Code,
    colors: {
      light: "text-indigo-900",
      dark: "text-indigo-300"
    }
  },
  {
    label: "Design",
    highlight: "Design",
    prompt: `Design`,
    items: [
      "Design a color palette for a tech blog",
      "Design a UX checklist for mobile apps",
      "Design 5 great font pairings for a landing page",
      "Design better CTAs with useful tips",
    ],
    icon: PaintBrush,
    colors: {
      light: "text-pink-900",
      dark: "text-pink-300"
    }
  },
  {
    label: "Research",
    highlight: "Research",
    prompt: `Research`,
    items: [
      "Research the pros and cons of remote work",
      "Research the differences between Apple Vision Pro and Meta Quest",
      "Research best practices for password security",
      "Research the latest trends in renewable energy",
    ],
    icon: BookOpenText,
    colors: {
      light: "text-teal-900",
      dark: "text-teal-300"
    }
  },
  {
    label: "Get inspired",
    highlight: "Inspire me",
    prompt: `Inspire me`,
    items: [
      "Inspire me with a beautiful quote about creativity",
      "Inspire me with a writing prompt about solitude",
      "Inspire me with a poetic way to start a newsletter",
      "Inspire me by describing a peaceful morning in nature",
    ],
    icon: Sparkle,
    colors: {
      light: "text-yellow-900",
      dark: "text-yellow-300"
    }
  },
  {
    label: "Think deeply",
    highlight: "Reflect on",
    prompt: `Reflect on`,
    items: [
      "Reflect on why we fear uncertainty",
      "Reflect on what makes a conversation meaningful",
      "Reflect on the concept of time in a simple way",
      "Reflect on what it means to live intentionally",
    ],
    icon: Brain,
    colors: {
      light: "text-violet-900",
      dark: "text-violet-300"
    }
  },
  {
    label: "Learn gently",
    highlight: "Explain",
    prompt: `Explain`,
    items: [
      "Explain quantum physics like I\'m 10",
      "Explain stoicism in simple terms",
      "Explain how a neural network works",
      "Explain the difference between AI and AGI",
    ],
    icon: Lightbulb,
    colors: {
      light: "text-emerald-900",
      dark: "text-emerald-300"
    }
  },
]

export const SYSTEM_PROMPT_DEFAULT = `You are ${APP_NAME}, a thoughtful and clear assistant. Your tone is calm, minimal, and human. You write with intention—never too much, never too little. You avoid clichés, speak simply, and offer helpful, grounded answers. When needed, you ask good questions. You don't try to impress—you aim to clarify. You may use metaphors if they bring clarity, but you stay sharp and sincere. You're here to help the user think clearly and move forward, not to overwhelm or overperform.`

export const MESSAGE_MAX_LENGTH = 4000

// example prompt: "write dijkstar algo in python"