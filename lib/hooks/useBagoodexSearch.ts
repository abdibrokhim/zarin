'use client';

import { useState } from 'react';
import { bagoodexClient } from '@/lib/models/bagoodex/index';
import { BagoodexLink, BagoodexImage, BagoodexVideo, BagoodexWeather, BagoodexLocalMap } from '@/lib/models/bagoodex/types';
import { detectBestEndpoint } from '@/lib/models/bagoodex/utils';

interface UseBagoodexSearchResult {
  searchResults: {
    links?: BagoodexLink[];
    images?: BagoodexImage[];
    videos?: BagoodexVideo[];
    weather?: BagoodexWeather;
    localMap?: BagoodexLocalMap;
  };
  isLoading: boolean;
  error: Error | null;
  searchQuery: string;
  search: (query: string, searchAll?: boolean) => Promise<void>;
}

/**
 * A hook to easily search using the Bagoodex API
 * @param initialQuery Optional initial query to search
 * @param searchAllEndpoints Whether to search all endpoints or just the most appropriate one
 * @returns Search results, loading state, and search function
 */
export function useBagoodexSearch(
  initialQuery: string = '',
  searchAllEndpoints: boolean = false
): UseBagoodexSearchResult {
  const [searchResults, setSearchResults] = useState<{
    links?: BagoodexLink[];
    images?: BagoodexImage[];
    videos?: BagoodexVideo[];
    weather?: BagoodexWeather;
    localMap?: BagoodexLocalMap;
  }>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);

  const search = async (query: string, searchAll: boolean = searchAllEndpoints): Promise<void> => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setSearchQuery(query);
    
    try {
      if (searchAll) {
        // Search all endpoints
        const results = await bagoodexClient.searchAll(query);
        setSearchResults(results);
      } else {
        // Search only the most appropriate endpoint
        const bestEndpoint = detectBestEndpoint(query);
        const results = await bagoodexClient.search(query, bestEndpoint);
        
        // Map the results to the appropriate property
        switch (bestEndpoint) {
          case 'links':
            setSearchResults({ links: results as BagoodexLink[] });
            break;
          case 'images':
            setSearchResults({ images: results as BagoodexImage[] });
            break;
          case 'videos':
            setSearchResults({ videos: results as BagoodexVideo[] });
            break;
          case 'weather':
            setSearchResults({ weather: results as BagoodexWeather });
            break;
          case 'local-map':
            setSearchResults({ localMap: results as BagoodexLocalMap });
            break;
        }
      }
    } catch (err) {
      console.error('Error searching Bagoodex:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  // Perform initial search if initialQuery is provided
  if (initialQuery && Object.keys(searchResults).length === 0 && !isLoading && !error) {
    search(initialQuery);
  }

  return {
    searchResults,
    isLoading,
    error,
    searchQuery,
    search
  };
} 