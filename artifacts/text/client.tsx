import { Artifact, ArtifactToolbarContext } from '@/components/common/artifacts/create-artifact';
import { Editor } from '@/components/common/artifacts/text-editor';
import { DocumentSkeleton } from '@/components/common/artifacts/document-skeleton';
import {
  Clock as ClockIcon,
  Copy as CopyIcon,
  ChatCenteredDots as MessageIcon,
  PencilLine as PenIcon,
  ArrowClockwise as RedoIcon,
  ArrowCounterClockwise as UndoIcon,
} from '@phosphor-icons/react/dist/ssr';
import { Suggestion } from '@/components/common/artifacts/create-artifact';
import { toast } from 'sonner';
import { getSuggestions } from '@/artifacts/actions';
import { DataStreamDelta } from '@/components/common/artifacts/data-stream-handler';
import { UIArtifact } from '@/components/common/artifacts/artifact';
import { Dispatch, SetStateAction } from 'react';
import { Message } from 'ai';

// Simple diff view component since we don't have the original
const DiffView = ({ oldContent, newContent }: { oldContent: string, newContent: string }) => (
  <div className="flex flex-col gap-4">
    <div className="border p-4 rounded-md bg-red-50 dark:bg-red-950">
      <h3 className="text-sm font-medium mb-2">Previous Version</h3>
      <p className="whitespace-pre-wrap">{oldContent}</p>
    </div>
    <div className="border p-4 rounded-md bg-green-50 dark:bg-green-950">
      <h3 className="text-sm font-medium mb-2">Current Version</h3>
      <p className="whitespace-pre-wrap">{newContent}</p>
    </div>
  </div>
);

interface TextArtifactMetadata {
  suggestions: Array<Suggestion>;
}

export const textArtifact = new Artifact<'text', TextArtifactMetadata>({
  kind: 'text',
  description: 'Useful for text content, like drafting essays and emails.',
  initialize: async ({ 
    documentId, 
    setMetadata 
  }: { 
    documentId: string, 
    setMetadata: Dispatch<SetStateAction<TextArtifactMetadata>> 
  }) => {
    const suggestions = await getSuggestions({ documentId });

    setMetadata({
      suggestions,
    });
  },
  onStreamPart: ({ 
    streamPart, 
    setMetadata, 
    setArtifact 
  }: { 
    streamPart: DataStreamDelta, 
    setMetadata: Dispatch<SetStateAction<TextArtifactMetadata>>,
    setArtifact: Dispatch<SetStateAction<UIArtifact>>
  }) => {
    if (streamPart.type === 'suggestion') {
      setMetadata((metadata: TextArtifactMetadata) => {
        return {
          suggestions: [
            ...metadata.suggestions,
            streamPart.content as Suggestion,
          ],
        };
      });
    }

    if (streamPart.type === 'text-delta') {
      setArtifact((draftArtifact: UIArtifact) => {
        return {
          ...draftArtifact,
          content: draftArtifact.content + (streamPart.content as string),
          isVisible:
            draftArtifact.status === 'streaming' &&
            draftArtifact.content.length > 400 &&
            draftArtifact.content.length < 450
              ? true
              : draftArtifact.isVisible,
          status: 'streaming',
        };
      });
    }
  },
  content: ({
    mode,
    status,
    content,
    isCurrentVersion,
    currentVersionIndex,
    onSaveContent,
    getDocumentContentById,
    isLoading,
    metadata,
  }: {
    mode: 'edit' | 'diff',
    status: 'streaming' | 'idle',
    content: string,
    isCurrentVersion: boolean,
    currentVersionIndex: number,
    onSaveContent: (updatedContent: string, debounce: boolean) => void,
    getDocumentContentById: (index: number) => string,
    isLoading: boolean,
    metadata: TextArtifactMetadata,
  }) => {
    if (isLoading) {
      return <DocumentSkeleton artifactKind="text" />;
    }

    if (mode === 'diff') {
      const oldContent = getDocumentContentById(currentVersionIndex - 1);
      const newContent = getDocumentContentById(currentVersionIndex);

      return <DiffView oldContent={oldContent} newContent={newContent} />;
    }

    return (
      <>
        <div className="flex flex-row py-8 md:p-20 px-4">
          <Editor
            content={content}
            suggestions={metadata ? metadata.suggestions : []}
            isCurrentVersion={isCurrentVersion}
            currentVersionIndex={currentVersionIndex}
            status={status}
            onSaveContent={onSaveContent}
          />

          {metadata &&
          metadata.suggestions &&
          metadata.suggestions.length > 0 ? (
            <div className="md:hidden h-dvh w-12 shrink-0" />
          ) : null}
        </div>
      </>
    );
  },
  actions: [
    {
      icon: <ClockIcon size={18} />,
      description: 'View changes',
      onClick: ({ 
        handleVersionChange 
      }: { 
        handleVersionChange: (type: 'next' | 'prev' | 'toggle' | 'latest') => void 
      }) => {
        handleVersionChange('toggle');
      },
      isDisabled: ({ 
        currentVersionIndex 
      }: { 
        currentVersionIndex: number,
        setMetadata: any
      }) => {
        if (currentVersionIndex === 0) {
          return true;
        }

        return false;
      },
    },
    {
      icon: <UndoIcon size={18} />,
      description: 'View Previous version',
      onClick: ({ 
        handleVersionChange 
      }: { 
        handleVersionChange: (type: 'next' | 'prev' | 'toggle' | 'latest') => void 
      }) => {
        handleVersionChange('prev');
      },
      isDisabled: ({ 
        currentVersionIndex 
      }: { 
        currentVersionIndex: number 
      }) => {
        if (currentVersionIndex === 0) {
          return true;
        }

        return false;
      },
    },
    {
      icon: <RedoIcon size={18} />,
      description: 'View Next version',
      onClick: ({ 
        handleVersionChange 
      }: { 
        handleVersionChange: (type: 'next' | 'prev' | 'toggle' | 'latest') => void 
      }) => {
        handleVersionChange('next');
      },
      isDisabled: ({ 
        isCurrentVersion 
      }: { 
        isCurrentVersion: boolean 
      }) => {
        if (isCurrentVersion) {
          return true;
        }

        return false;
      },
    },
    {
      icon: <CopyIcon size={18} />,
      description: 'Copy to clipboard',
      onClick: ({ 
        content 
      }: { 
        content: string 
      }) => {
        navigator.clipboard.writeText(content);
        toast.success('Copied to clipboard!');
      },
    },
  ],
  toolbar: [
    {
      icon: <PenIcon />,
      description: 'Add final polish',
      onClick: (context: ArtifactToolbarContext) => {
        context.appendMessage({
          role: 'user',
          content:
            'Please add final polish and check for grammar, add section titles for better structure, and ensure everything reads smoothly.',
        });
      },
    },
    {
      icon: <MessageIcon />,
      description: 'Request suggestions',
      onClick: (context: ArtifactToolbarContext) => {
        context.appendMessage({
          role: 'user',
          content:
            'Please add suggestions you have that could improve the writing.',
        });
      },
    },
  ],
});
