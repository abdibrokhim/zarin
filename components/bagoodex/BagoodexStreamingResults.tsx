'use client';

import React, { useState, useEffect } from 'react';
import { bagoodexClient } from '@/lib/models/bagoodex/index';
import BagoodexResults from './BagoodexResults';
import { detectBestEndpoint } from '@/lib/models/bagoodex/utils';
import { BagoodexSearchResultType } from '@/lib/models/bagoodex/types';
import { Skeleton } from '@/components/ui/skeleton';
import { MOCK_LINKS_RESPONSE, MOCK_IMAGES_RESPONSE, MOCK_VIDEOS_RESPONSE, MOCK_LOCAL_MAP_RESPONSE, MOCK_WEATHER_RESPONSE } from '@/lib/models/bagoodex/simulation';

type BagoodexStreamingResultsProps = {
  query: string;
  onComplete?: () => void;
}

// Order of endpoints to fetch in sequence
const ENDPOINT_SEQUENCE: BagoodexSearchResultType[] = [
  'weather',    // Weather is high priority and quick
  'local-map',  // Maps are also high priority
  'images',     // Images next for visual context
  'videos',     // Videos for more detailed info
  'links'       // Links last as they're usually text-heavy
];

export function BagoodexStreamingResults({ query, onComplete }: BagoodexStreamingResultsProps) {
  const [followupId, setFollowupId] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [loadingEndpoint, setLoadingEndpoint] = useState<BagoodexSearchResultType | null>(null);
  const [currentEndpointIndex, setCurrentEndpointIndex] = useState(0);
  const [results, setResults] = useState<{
    links?: any[];
    images?: any[];
    videos?: any[];
    weather?: any;
    localMap?: any;
  }>({});
  const [error, setError] = useState<string | null>(null);

  // simulate the search
  useEffect(() => {
    setResults({
      links: MOCK_LINKS_RESPONSE.map(link => ({ url: link })),
      images: MOCK_IMAGES_RESPONSE,
      videos: MOCK_VIDEOS_RESPONSE,
      weather: MOCK_WEATHER_RESPONSE,
      localMap: MOCK_LOCAL_MAP_RESPONSE
    });
    setIsInitializing(false);
    setIsCompleted(true);
  }, [query]);

  // Initialize search by getting the followupId
  // useEffect(() => {
  //   const initialize = async () => {
  //     try {
  //       // Create chat completion to get followupId
  //       console.log("Initializing search for query:", query);
  //       const id = await bagoodexClient.createChatCompletion(query);
  //       console.log("Received followupId:", id);
        
  //       // If the ID is the same as the query, it means the API call failed
  //       // but the client returned the query as a fallback
  //       if (id === query) {
  //         console.warn("API returned query as fallback, but we'll continue with search");
  //       }
        
  //       setFollowupId(id);
  //       setIsInitializing(false);
  //     } catch (err) {
  //       console.error('Error initializing Bagoodex search:', err);
  //       setError('Failed to initialize search. Please try again later.');
  //       setIsInitializing(false);
  //     }
  //   };

  //   if (query) {
  //     initialize();
  //   }
  // }, [query]);

  // Once we have a followupId, start fetching endpoints in sequence
  // useEffect(() => {
  //   if (!followupId || isCompleted || currentEndpointIndex >= ENDPOINT_SEQUENCE.length) {
  //     return;
  //   }

  //   const fetchCurrentEndpoint = async () => {
  //     const endpoint = ENDPOINT_SEQUENCE[currentEndpointIndex];
  //     setLoadingEndpoint(endpoint);

  //     try {
  //       let result: any;
  //       switch (endpoint) {
  //         case 'links':
  //           result = await bagoodexClient.getLinks(followupId);
  //           setResults(prev => ({ ...prev, links: result }));
  //           break;
  //         case 'images':
  //           result = await bagoodexClient.getImages(followupId);
  //           setResults(prev => ({ ...prev, images: result }));
  //           break;
  //         case 'videos':
  //           result = await bagoodexClient.getVideos(followupId);
  //           setResults(prev => ({ ...prev, videos: result }));
  //           break;
  //         case 'weather':
  //           try {
  //             result = await bagoodexClient.getWeather(followupId);
  //             setResults(prev => ({ ...prev, weather: result }));
  //           } catch (err) {
  //             // Weather might not be available for all queries
  //             console.log('Weather data not available for this query');
  //           }
  //           break;
  //         case 'local-map':
  //           try {
  //             result = await bagoodexClient.getLocalMap(followupId);
  //             setResults(prev => ({ ...prev, localMap: result }));
  //           } catch (err) {
  //             // Map might not be available for all queries
  //             console.log('Map data not available for this query');
  //           }
  //           break;
  //       }

  //       // Move to next endpoint
  //       setCurrentEndpointIndex(prev => prev + 1);
  //     } catch (err) {
  //       console.error(`Error fetching ${endpoint}:`, err);
  //       // Continue to next endpoint even if one fails
  //       setCurrentEndpointIndex(prev => prev + 1);
  //     } finally {
  //       setLoadingEndpoint(null);
  //     }
  //   };

  //   fetchCurrentEndpoint();
  // }, [followupId, currentEndpointIndex, isCompleted]);

  // // Check if we've completed all endpoints
  // useEffect(() => {
  //   if (followupId && currentEndpointIndex >= ENDPOINT_SEQUENCE.length && !isCompleted) {
  //     setIsCompleted(true);
  //     onComplete?.();
  //   }
  // }, [followupId, currentEndpointIndex, isCompleted, onComplete]);

  // Helper to determine if we have any results
  const hasAnyResults = Object.values(results).some(value => 
    value !== undefined && 
    (Array.isArray(value) ? value.length > 0 : Object.keys(value || {}).length > 0)
  );

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="w-full space-y-4">
      {/* Show loading indicator during initialization */}
      {isInitializing && (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-32 w-full" />
        </div>
      )}

      {/* Show results as they become available */}
      {!isInitializing && hasAnyResults && (
        <BagoodexResults 
          data={results} 
          isLoading={!isCompleted} 
          query={query}
        />
      )}

      {/* Show loading indicators for the current loading endpoint */}
      {loadingEndpoint && (
        <div className="flex items-center space-x-2 text-sm text-muted-foreground animate-pulse">
          <div className="size-2 rounded-full bg-primary"></div>
          <span>Loading {loadingEndpoint === 'local-map' ? 'map' : loadingEndpoint}...</span>
        </div>
      )}

      {/* Show completion message if no results found */}
      {isCompleted && !hasAnyResults && (
        <div className="text-muted-foreground text-sm">
          No relevant search results found for "{query}"
        </div>
      )}
    </div>
  );
} 