import { memo } from 'react';
import { X } from '@phosphor-icons/react/dist/ssr';
import { Button } from '@/components/ui/button';
import { initialArtifactData, useArtifact } from '@/hooks/use-artifact';

function PureArtifactCloseButton() {
  const { setArtifact } = useArtifact();

  return (
    <Button
      data-testid="artifact-close-button"
      variant="outline"
      className="h-fit p-2 dark:hover:bg-zinc-700"
      onClick={() => {
        setArtifact((currentArtifact) =>
          currentArtifact.status === 'streaming'
            ? {
                ...currentArtifact,
                isVisible: false,
              }
            : { ...initialArtifactData, status: 'idle' },
        );
      }}
    >
      <X className="size-4" />
    </Button>
  );
}

export const ArtifactCloseButton = memo(PureArtifactCloseButton, () => true);
