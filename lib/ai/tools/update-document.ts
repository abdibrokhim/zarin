import { z } from 'zod';
import { DataStreamWriter, tool } from 'ai';
import { readFromIndexedDB, writeToIndexedDB } from '@/lib/chat/persist';
import { Document } from '@/components/common/artifacts/artifact';

interface UpdateDocumentProps {
  dataStream: DataStreamWriter;
}

export const updateDocument = ({ dataStream }: UpdateDocumentProps) =>
  tool({
    description: 'Update a document',
    parameters: z.object({
      documentId: z.string().describe('The ID of the document to update'),
      description: z.string().describe('The description of the changes to make'),
    }),
    execute: async ({ documentId, description }) => {
      // Read document from IndexedDB instead of database
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

      dataStream.writeData({
        type: 'clear',
        content: '',
      });

      // Create a new version of the document (copy with new createdAt)
      const updatedDocument: Document = {
        ...document,
        createdAt: new Date(),
      };

      // Save to IndexedDB
      await writeToIndexedDB('documents', updatedDocument);

      return {
        id: documentId,
        title: document.title,
        kind: document.kind,
        message: 'Document has been updated',
      };
    },
  });
