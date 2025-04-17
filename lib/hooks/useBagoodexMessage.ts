'use client';

import { useState } from 'react';
import { createBagoodexMessage, updateMessageWithBagoodex } from '@/lib/chat/create-bagoodex-message';
import { ExtendedMessage } from '@/lib/chat/message';
import { bagoodexClient } from '@/lib/models/bagoodex/index';
import { detectBestEndpoint } from '@/lib/models/bagoodex/utils';

interface UseBagoodexMessageProps {
  onMessageCreated?: (message: ExtendedMessage) => void;
  onMessageUpdated?: (message: ExtendedMessage) => void;
}

export function useBagoodexMessage({
  onMessageCreated,
  onMessageUpdated
}: UseBagoodexMessageProps = {}) {
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Create a message with Bagoodex search results
   * @param query The search query
   * @param content Optional custom content for the message
   * @returns The created message
   */
  const createMessage = async (
    query: string, 
    content: string = `Search results for "${query}"`
  ): Promise<ExtendedMessage> => {
    setIsSearching(true);
    setError(null);
    
    try {
      // Log the search request
      console.log("Creating Bagoodex message for query:", query);
      
      // Create the message
      const message = createBagoodexMessage(content, query);
      console.log("Bagoodex message created:", message);
      
      // Notify about the created message
      if (onMessageCreated) {
        onMessageCreated(message);
      }
      
      return message;
    } catch (err) {
      console.error("Error creating Bagoodex message:", err);
      setError(err as Error);
      throw err;
    } finally {
      setIsSearching(false);
    }
  };

  /**
   * Update a message with Bagoodex search results
   * @param message The message to update
   * @param query The search query
   * @param content Optional custom content for the message
   * @returns The updated message
   */
  const updateMessage = (
    message: ExtendedMessage,
    query: string,
    content?: string
  ): ExtendedMessage => {
    try {
      // Create an updated message
      const updatedMessage = updateMessageWithBagoodex(
        content ? { ...message, content } : message,
        query
      );
      
      // Notify about the updated message
      if (onMessageUpdated) {
        onMessageUpdated(updatedMessage);
      }
      
      return updatedMessage;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  return {
    createMessage,
    updateMessage,
    isSearching,
    error
  };
} 