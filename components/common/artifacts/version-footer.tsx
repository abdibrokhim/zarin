'use client';

import { isAfter } from 'date-fns';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useSWRConfig } from 'swr';
import { useWindowSize } from 'usehooks-ts';

import { Document } from '@/components/common/artifacts/artifact';
import { getDocumentTimestampByIndex } from '@/lib/utils';

import { SpinnerGap } from '@phosphor-icons/react/dist/ssr';
import { Button } from '@/components/ui/button';
import { useArtifact } from '@/hooks/use-artifact';

interface VersionFooterProps {
  handleVersionChange: (type: 'next' | 'prev' | 'toggle' | 'latest') => void;
  documents: Array<Document> | undefined;
  currentVersionIndex: number;
}

export const VersionFooter = ({
  handleVersionChange,
  documents,
  currentVersionIndex,
}: VersionFooterProps) => {
  const { artifact } = useArtifact();

  const { width } = useWindowSize();
  const isMobile = width < 768;

  const { mutate } = useSWRConfig();
  const [isMutating, setIsMutating] = useState(false);

  if (!documents) return;

  return (
    <motion.div
      className="absolute flex flex-col gap-4 lg:flex-row bottom-0 bg-background p-4 w-full border-t z-50 justify-between"
      initial={{ y: isMobile ? 200 : 77 }}
      animate={{ y: 0 }}
      exit={{ y: isMobile ? 200 : 77 }}
      transition={{ type: 'spring', stiffness: 140, damping: 20 }}
    >
      <div>
        <div>You are viewing a previous version</div>
        <div className="text-muted-foreground text-sm">
          Restore this version to make edits
        </div>
      </div>

      <div className="flex flex-row gap-4">
        <Button
          disabled={isMutating}
          onClick={async () => {
            setIsMutating(true);
            
            try {
              if (!documents || currentVersionIndex < 0) return;
              
              // Use the current selected document as the latest version
              const selectedDocument = documents[currentVersionIndex];
              
              // Import the writeToIndexedDB function from persist.ts
              const { writeToIndexedDB } = await import('@/lib/chat/persist');
              
              // Create a new document based on the selected version
              await writeToIndexedDB('documents', {
                ...selectedDocument,
                createdAt: new Date(),
              });
              
              // Force a reload of the documents
              mutate(`/api/artifacts?id=${artifact.documentId}`);
              
              // Go back to latest version
              handleVersionChange('latest');
            } catch (error) {
              console.error('Error restoring version:', error);
            } finally {
              setIsMutating(false);
            }
          }}
        >
          <div>Restore this version</div>
          {isMutating && (
            <div className="animate-spin">
              <SpinnerGap className='size-4' />
            </div>
          )}
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            handleVersionChange('latest');
          }}
        >
          Back to latest version
        </Button>
      </div>
    </motion.div>
  );
};
