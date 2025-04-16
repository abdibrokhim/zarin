'use client';

import { readFromIndexedDB } from '@/lib/chat/persist';
import { Suggestion } from '@/components/common/artifacts/create-artifact';

export async function getSuggestions({ documentId }: { documentId: string }): Promise<Suggestion[]> {
  try {
    const suggestions = await readFromIndexedDB('suggestions', documentId);
    return suggestions ? [suggestions as Suggestion] : [];
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return [];
  }
}
