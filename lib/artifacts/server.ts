import { codeDocumentHandler } from '@/artifacts/code/server';
import { imageDocumentHandler } from '@/artifacts/image/server';
import { sheetDocumentHandler } from '@/artifacts/sheet/server';
import { textDocumentHandler } from '@/artifacts/text/server';
import { ArtifactKind, Document } from '@/components/common/artifacts/artifact';
import { DataStreamWriter } from 'ai';
import { writeToIndexedDB } from '@/lib/chat/persist';

export interface SaveDocumentProps {
  id: string;
  title: string;
  kind: ArtifactKind;
  content: string;
  userId: string;
}

export interface CreateDocumentCallbackProps {
  id: string;
  title: string;
  dataStream: DataStreamWriter;
  userId: string;
}

export interface UpdateDocumentCallbackProps {
  document: Document;
  description: string;
  dataStream: DataStreamWriter;
}

export interface DocumentHandler<T = ArtifactKind> {
  kind: T;
  onCreateDocument: (args: CreateDocumentCallbackProps) => Promise<void>;
  onUpdateDocument: (args: UpdateDocumentCallbackProps) => Promise<void>;
}

export function createDocumentHandler<T extends ArtifactKind>(config: {
  kind: T;
  onCreateDocument: (params: CreateDocumentCallbackProps) => Promise<string>;
  onUpdateDocument: (params: UpdateDocumentCallbackProps) => Promise<string>;
}): DocumentHandler<T> {
  return {
    kind: config.kind,
    onCreateDocument: async (args: CreateDocumentCallbackProps) => {
      const draftContent = await config.onCreateDocument({
        id: args.id,
        title: args.title,
        dataStream: args.dataStream,
        userId: args.userId,
      });

      await writeToIndexedDB('documents', {
        id: args.id,
        title: args.title,
        content: draftContent,
        kind: config.kind,
        userId: args.userId,
        createdAt: new Date()
      });

      return;
    },
    onUpdateDocument: async (args: UpdateDocumentCallbackProps) => {
      const draftContent = await config.onUpdateDocument({
        document: args.document,
        description: args.description,
        dataStream: args.dataStream,
      });

      await writeToIndexedDB('documents', {
        id: args.document.id,
        title: args.document.title,
        content: draftContent,
        kind: config.kind,
        userId: args.document.userId,
        createdAt: new Date()
      });

      return;
    },
  };
}

/*
 * Use this array to define the document handlers for each artifact kind.
 */
export const documentHandlersByArtifactKind: Array<DocumentHandler> = [
  textDocumentHandler,
  codeDocumentHandler,
  imageDocumentHandler,
  sheetDocumentHandler,
];

export const artifactKinds = ['text', 'code', 'image', 'sheet'] as const;
