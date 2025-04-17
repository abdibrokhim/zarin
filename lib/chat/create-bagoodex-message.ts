import { ExtendedMessage, BagoodexAttachment } from './message';

/**
 * Create a new assistant message with Bagoodex search results
 * @param content The text content of the message
 * @param query The search query used for Bagoodex
 * @returns A formatted ExtendedMessage object with Bagoodex attachment
 */
export function createBagoodexMessage(content: string, query: string): ExtendedMessage {
  const bagoodexAttachment: BagoodexAttachment = {
    query,
    modelType: 'search'
  };

  return {
    id: crypto.randomUUID(),
    role: 'assistant',
    content,
    createdAt: new Date(),
    bagoodex: bagoodexAttachment,
    modelType: 'search',
    timestamp: Date.now()
  };
}

/**
 * Creates a placeholder assistant message while waiting for response
 * @param query The search query being processed
 * @returns A placeholder message
 */
export function createBagoodexPlaceholderMessage(query: string): ExtendedMessage {
  return {
    id: crypto.randomUUID(),
    role: 'assistant',
    content: `Searching for "${query}"...`,
    createdAt: new Date(),
    timestamp: Date.now()
  };
}

/**
 * Updates a message with Bagoodex attachment
 * @param message The message to update
 * @param query The search query to add
 * @returns The updated message with Bagoodex attachment
 */
export function updateMessageWithBagoodex(
  message: ExtendedMessage, 
  query: string
): ExtendedMessage {
  return {
    ...message,
    bagoodex: {
      query,
      modelType: 'search'
    },
    modelType: 'search'
  };
} 