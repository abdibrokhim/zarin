import { 
  BagoodexSearchResultType, 
  BagoodexLink, 
  BagoodexImage, 
  BagoodexVideo, 
  BagoodexWeather, 
  BagoodexLocalMap 
} from './types';

/**
 * Determine the most appropriate search endpoint based on the query
 * @param query The search query
 * @returns The most appropriate endpoint type
 */
export function detectBestEndpoint(query: string): BagoodexSearchResultType {
  query = query.toLowerCase();
  
  // Check for weather-related queries
  if (
    query.includes('weather') || 
    query.includes('temperature') || 
    query.includes('forecast') ||
    query.includes('rain') ||
    query.includes('sunny') ||
    query.includes('cloudy') ||
    query.includes('humidity')
  ) {
    return 'weather';
  }
  
  // Check for location/map-related queries
  if (
    query.includes('where is') || 
    query.includes('location of') || 
    query.includes('map of') ||
    query.includes('directions to') ||
    query.includes('find on map')
  ) {
    return 'local-map';
  }
  
  // Check for image-related queries
  if (
    query.includes('image') || 
    query.includes('picture') || 
    query.includes('photo') ||
    query.includes('show me') ||
    query.includes('what does') ||
    query.includes('how does') ||
    query.includes('look like')
  ) {
    return 'images';
  }
  
  // Check for video-related queries
  if (
    query.includes('video') || 
    query.includes('watch') || 
    query.includes('how to') ||
    query.includes('tutorial') ||
    query.includes('youtube')
  ) {
    return 'videos';
  }
  
  // Default to links for general information queries
  return 'links';
}

/**
 * Format URLs to ensure they are properly formatted
 * @param url The URL to format
 * @returns The formatted URL
 */
export function formatUrl(url: string): string {
  try {
    // Check if URL is valid
    new URL(url);
    return url;
  } catch (error) {
    // If not a valid URL, try to fix it
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`;
    }
    return url;
  }
}

/**
 * Extract domain name from URL
 * @param url The URL to extract domain from
 * @returns The extracted domain name
 */
export function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch (error) {
    return url;
  }
}

/**
 * Check if the response contains useful data
 * @param response The response to check
 * @returns True if the response contains useful data, false otherwise
 */
export function hasUsefulData(
  response: BagoodexLink[] | BagoodexImage[] | BagoodexVideo[] | BagoodexWeather | BagoodexLocalMap | undefined
): boolean {
  if (!response) return false;
  
  if (Array.isArray(response)) {
    return response.length > 0;
  }
  
  // For weather and local-map, check if they have expected properties
  if ('type' in response && response.type === 'weather_result') {
    return true;
  }
  
  if ('link' in response && 'image' in response) {
    return Boolean(response.link && response.image);
  }
  
  return false;
}

/**
 * Create a query for a specific search type
 * @param baseQuery The base search query
 * @param searchType The type of search to perform
 * @returns A modified query optimized for the search type
 */
export function createOptimizedQuery(baseQuery: string, searchType: BagoodexSearchResultType): string {
  switch (searchType) {
    case 'images':
      return `${baseQuery} images`;
    case 'videos':
      return `${baseQuery} video tutorials`;
    case 'weather':
      return `weather ${baseQuery}`;
    case 'local-map':
      return `location of ${baseQuery}`;
    case 'links':
    default:
      return baseQuery;
  }
} 