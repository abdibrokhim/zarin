'use client';

import { create } from 'zustand';
import { UIArtifact } from '@/components/common/artifacts/artifact';
import { writeArtifactToIndexedDB, readArtifactFromIndexedDB } from '@/lib/chat/persist';

export const initialArtifactData: UIArtifact = {
  documentId: 'init',
  content: '',
  kind: 'text',
  title: '',
  status: 'idle',
  isVisible: false,
  boundingBox: {
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  },
};

// Create a Zustand store for artifact state
interface ArtifactState {
  artifact: UIArtifact;
  metadata: Record<string, any> | null;
  setArtifact: (updater: UIArtifact | ((currentArtifact: UIArtifact) => UIArtifact)) => void;
  setMetadata: (updater: Record<string, any> | ((currentMetadata: Record<string, any> | null) => Record<string, any> | null)) => void;
  toggleVisibility: () => void;
  saveArtifact: () => Promise<void>;
  loadArtifact: (id: string) => Promise<void>;
}

export const useArtifactStore = create<ArtifactState>((set, get) => ({
  artifact: initialArtifactData,
  metadata: null,
  
  setArtifact: (updater: UIArtifact | ((currentArtifact: UIArtifact) => UIArtifact)) => set((state: ArtifactState) => {
    const updatedArtifact = typeof updater === 'function' ? updater(state.artifact) : updater;
    return { artifact: updatedArtifact };
  }),
  
  setMetadata: (updater: Record<string, any> | ((currentMetadata: Record<string, any> | null) => Record<string, any> | null)) => set((state: ArtifactState) => {
    const updatedMetadata = typeof updater === 'function' ? updater(state.metadata) : updater;
    return { metadata: updatedMetadata };
  }),
  
  toggleVisibility: () => set((state: ArtifactState) => ({
    artifact: {
      ...state.artifact,
      isVisible: !state.artifact.isVisible
    }
  })),
  
  saveArtifact: async () => {
    const { artifact } = get();
    
    if (artifact.documentId === 'init') {
      // Generate a new ID for the artifact if it's new
      const newArtifact = {
        ...artifact,
        documentId: crypto.randomUUID()
      };
      
      set({ artifact: newArtifact });
      await writeArtifactToIndexedDB('documents', newArtifact);
    } else {
      await writeArtifactToIndexedDB('documents', artifact);
    }
  },
  
  loadArtifact: async (id: string) => {
    if (!id) return;
    
    try {
      // Use the readFromIndexedDB function correctly with just the key
      const loadedArtifact = await readArtifactFromIndexedDB<UIArtifact>('documents');
      if (loadedArtifact) {
        // Find the artifact with the matching ID
        const foundArtifact = Array.isArray(loadedArtifact) 
          ? loadedArtifact.find(a => a.documentId === id)
          : loadedArtifact;
          
        if (foundArtifact) {
          set({ artifact: foundArtifact });
        }
      }
    } catch (error) {
      console.error('Failed to load artifact:', error);
    }
  }
}));

// Selector hook
export function useArtifactSelector<T>(selector: (state: UIArtifact) => T): T {
  return useArtifactStore(state => selector(state.artifact));
}

// Main hook for accessing the full artifact state and functions
export function useArtifact() {
  return useArtifactStore();
}
