import Claude from "@/components/icons/claude"
import DeepSeek from "@/components/icons/deepseek"
import Gemini from "@/components/icons/gemini"
import Grok from "@/components/icons/grok"
import Mistral from "@/components/icons/mistral"
import OpenAI from "@/components/icons/openai"
import Llama from "@/components/icons/llama"
import Qwen from "@/components/icons/qwen"
import Deepgram from "@/components/icons/deepgram"
import Bagoodex from "@/components/icons/bagoodex"
import { Provider, Model } from "./types"
import { MODELS as OPENAI_MODELS } from "./openai"
import { MODELS as MISTRAL_MODELS } from "./mistral"
import { MODELS as GOOGLE_MODELS } from "./google"
import { MODELS as ANTHROPIC_MODELS } from "./anthropic"
import { MODELS as LLAMA_MODELS } from "./llama"
import { MODELS as XAI_MODELS } from "./xai"
import { MODELS as DEEPSEEK_MODELS } from "./deepseek"
import { MODELS as ALIBABA_MODELS } from "./alibaba"
import { MODELS as DEEPGRAM_MODELS } from "./deepgram"
import { MODELS as BAGOOD_MODELS } from "./bagoodex"
import { APP_NAME } from "@/lib/config"

export const ALL_MODELS = [
  ...OPENAI_MODELS,
  ...XAI_MODELS,
  ...GOOGLE_MODELS,
  ...ANTHROPIC_MODELS,
  ...LLAMA_MODELS,
  ...MISTRAL_MODELS,
  ...DEEPSEEK_MODELS,
  ...ALIBABA_MODELS,
  ...DEEPGRAM_MODELS,
  ...BAGOOD_MODELS,
] as Model[]

export const MODELS_OPTIONS = [
  ...ALL_MODELS.map((model) => ({
    ...model,
    available: true,
  })),
] as Model[]

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
  {
    id: "deepseek",
    name: "DeepSeek",
    icon: DeepSeek,
  },
  {
    id: "claude",
    name: "Claude",
    icon: Claude,
  },
  {
    id: "alibaba-cloud",
    name: "Alibaba Cloud",
    icon: Qwen,
  },
  {
    id: "deepgram",
    name: "Deepgram",
    icon: Deepgram,
  },
  {
    id: "bagoodex",
    name: "Bagoodex",
    icon: Bagoodex,
  },
] as Provider[]

export const PROVIDERS_OPTIONS = [
  ...PROVIDERS.map((provider) => ({
    ...provider,
    available: true,
  })),
] as Provider[]

export const MODEL_DEFAULT = "gpt-4o"

export const SYSTEM_PROMPT_DEFAULT = `You are ${APP_NAME}, a thoughtful and clear assistant. Your tone is calm, minimal, and human. You write with intention—never too much, never too little. You avoid clichés, speak simply, and offer helpful, grounded answers. When needed, you ask good questions. You don't try to impress—you aim to clarify. You may use metaphors if they bring clarity, but you stay sharp and sincere. You're here to help the user think clearly and move forward, not to overwhelm or overperform.`

export const MESSAGE_MAX_LENGTH = 2048

export const USER_PROMPT_EXAMPLE = "write dijkstar algo in python"

export const USER_PROMPT_EXAMPLE_AUDIO = "make this text into audio, use girls voice. text='hey guys, my name is Zarina. glad to be here!'"