'use client';

import { useCallback, useState } from 'react';
import { BagoodexClient } from '@/lib/models/bagoodex/client';
import { useMutation } from '@tanstack/react-query';
import { BagoodexLink, BagoodexImage, BagoodexVideo, BagoodexWeather, BagoodexLocalMap } from '@/lib/models/bagoodex/types';
import { detectBestEndpoint } from '@/lib/models/bagoodex/utils';
import { bagoodexClient } from '@/lib/models/bagoodex/index';
// import BagoodexResults from '@/components/bagoodex/BagoodexResults';

// Type for search results
type SearchResultsType = {
  links?: BagoodexLink[];
  images?: BagoodexImage[];
  videos?: BagoodexVideo[];
  weather?: BagoodexWeather;
  localMap?: BagoodexLocalMap;
};

export interface UseBagoodexSearchOptions {
  onSuccess?: (results: any) => void;
  onError?: (error: Error) => void;
  initialQuery?: string;
  searchAllEndpoints?: boolean;
}

/**
 * A hook to easily search using the Bagoodex API
 * @param options Configuration options for the search
 * @returns Search results, loading state, and search function
 */
export function useBagoodexSearch(options: UseBagoodexSearchOptions = {}): {
  search: (query: string, searchAll?: boolean) => Promise<void>;
  isSearching: boolean;
  results: any | null;
  clearResults: () => void;
  searchResults?: SearchResultsType;
  error?: Error | null;
  searchQuery?: string;
} {
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>(options.initialQuery || '');
  const [searchResults, setSearchResults] = useState<SearchResultsType>({});
  
  const client = new BagoodexClient();

  const search = async (query: string, searchAll: boolean = options.searchAllEndpoints || false): Promise<void> => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    setError(null);
    setSearchQuery(query);
    
    try {
      if (searchAll) {
        // Search all endpoints
        const searchResults = await bagoodexClient.searchAll(query);
        setResults(searchResults);
        setSearchResults(searchResults);
        options.onSuccess?.(searchResults);
        return;
      } else {
        // Search only the most appropriate endpoint
        const bestEndpoint = detectBestEndpoint(query);
        const results = await bagoodexClient.search(query, bestEndpoint);
        
        // Map the results to the appropriate property
        let formattedResults = {};
        switch (bestEndpoint) {
          case 'links':
            formattedResults = { links: results as BagoodexLink[] };
            break;
          case 'images':
            formattedResults = { images: results as BagoodexImage[] };
            break;
          case 'videos':
            formattedResults = { videos: results as BagoodexVideo[] };
            break;
          case 'weather':
            formattedResults = { weather: results as BagoodexWeather };
            break;
          case 'local-map':
            formattedResults = { localMap: results as BagoodexLocalMap };
            break;
        }
        
        setResults(formattedResults);
        setSearchResults(formattedResults as SearchResultsType);
        options.onSuccess?.(formattedResults);
      }
    } catch (err) {
      console.error('Error searching Bagoodex:', err);
      setError(err as Error);
      options.onError?.(err as Error);
    } finally {
      setIsSearching(false);
    }
  };

  const clearResults = useCallback(() => {
    setResults(null);
    setSearchResults({});
  }, []);

  // Perform initial search if initialQuery is provided
  if (options.initialQuery && Object.keys(searchResults).length === 0 && !isSearching && !error) {
    search(options.initialQuery);
  }

  return {
    search,
    isSearching,
    results,
    clearResults,
    searchResults,
    error,
    searchQuery
  };
}