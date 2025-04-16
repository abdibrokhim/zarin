import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from 'ai';
import { openai } from '@ai-sdk/openai';

export const myProvider = customProvider({
  languageModels: {
    'chat-model': openai('gpt-4o'),
    'chat-model-reasoning': wrapLanguageModel({
      model: openai('o1'),
      middleware: extractReasoningMiddleware({ tagName: 'think' }),
    }),
    'title-model': openai('gpt-4o'),
    'artifact-model': openai('o3-mini'),
  },
  imageModels: {
    'small-model': openai.image('dall-e-3'),
  },
});
