import { z } from 'zod';
import { DataStreamWriter, streamObject, tool } from 'ai';
import { readFromIndexedDB, writeToIndexedDB } from '@/lib/chat/persist';
import { Suggestion } from '@/components/common/artifacts/create-artifact';
import { Document } from '@/components/common/artifacts/artifact';
import { generateUUID } from '@/lib/utils';
import { myProvider } from '@/lib/ai/providers';

interface RequestSuggestionsProps {
  dataStream: DataStreamWriter;
}

export const requestSuggestions = ({ dataStream }: RequestSuggestionsProps) =>
  tool({
    description: 'Request suggestions for a document',
    parameters: z.object({
      documentId: z
        .string()
        .describe('The ID of the document to request edits'),
    }),
    execute: async ({ documentId }) => {
      const docResult = await readFromIndexedDB<Document | Document[]>('documents');
      let document: Document | undefined;
      
      if (Array.isArray(docResult)) {
        const foundDoc = docResult.find(doc => 
          doc && typeof doc === 'object' && 'id' in doc && doc.id === documentId
        );
        if (foundDoc) {
          document = foundDoc as Document;
        }
      } else if (docResult && typeof docResult === 'object' && 'id' in docResult && docResult.id === documentId) {
        document = docResult as Document;
      }

      if (!document || !document.content) {
        return {
          error: 'Document not found',
        };
      }

      const suggestions: Array<Suggestion> = [];

      const { elementStream } = streamObject({
        model: myProvider.languageModel('artifact-model'),
        system:
          'You are a help writing assistant. Given a piece of writing, please offer suggestions to improve the piece of writing and describe the change. It is very important for the edits to contain full sentences instead of just words. Max 5 suggestions.',
        prompt: document.content,
        output: 'array',
        schema: z.object({
          originalSentence: z.string().describe('The original sentence'),
          suggestedSentence: z.string().describe('The suggested sentence'),
          description: z.string().describe('The description of the suggestion'),
        }),
      });

      for await (const element of elementStream) {
        const suggestion = {
          originalText: element.originalSentence,
          suggestedText: element.suggestedSentence,
          content: element.description,
          id: generateUUID(),
          documentId: documentId,
          isSelected: false,
        };

        dataStream.writeData({
          type: 'suggestion',
          content: suggestion,
        });

        suggestions.push(suggestion);
      }

      for (const suggestion of suggestions) {
        await writeToIndexedDB('suggestions', suggestion);
      }

      return {
        id: documentId,
        title: document.title,
        kind: document.kind,
        message: 'Suggestions have been added to the document',
      };
    },
  });
