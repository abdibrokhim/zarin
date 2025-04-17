import { OpenAI } from 'openai';
import { AIML_API_BASE_CHAT_URL, AIML_API_BASE_URL } from '../../config';
import {
  BagoodexSearchParams,
  BagoodexLink,
  BagoodexImage,
  BagoodexVideo,
  BagoodexWeather,
  BagoodexLocalMap,
  BagoodexSearchResultType
} from './types';
import { BAGOODEX_SYSTEM_PROMPT_BASE } from '../prompts';
import { SYSTEM_PROMPT_DEFAULT } from '../config';

export class BagoodexClient {
  private baseUrl: string;
  private apiKey: string;

  constructor(baseUrl: string = AIML_API_BASE_CHAT_URL, apiKey: string = process.env.AIML_API_KEY || '') {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
    
    // Debug logging to help identify auth issues
    console.log("Bagoodex client initialized with API URL:", this.baseUrl);
    console.log("API key exists:", !!this.apiKey);
    
  }

  /**
   * Create a chat completion for Bagoodex search
   * @param query The search query
   * @returns A promise resolving to the chat completion response
   */
  async createChatCompletion(query: string): Promise<string> {
    const requestBody = {
        model: "bagoodex/bagoodex-search-v1",
        messages: [
            {
                role: "assistant",
                content: SYSTEM_PROMPT_DEFAULT
            },
            {
                role: "user",
                content: query
            }
        ]
    };

    try {
        console.log("Sending API request to:", this.baseUrl);
        console.log("Request body:", JSON.stringify(requestBody));
        
        const response = await fetch(AIML_API_BASE_CHAT_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.AIML_API_KEY}`
            },
            body: JSON.stringify(requestBody)
        });

        // Check if response is ok
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`API Error (${response.status}):`, errorText);
            throw new Error(`API returned ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        
        // Log the complete response structure for debugging
        console.log("Complete API response:", JSON.stringify(data));
        
        // Handle the response differently based on its structure
        
        // Case 1: If we have choices with messages (standard OpenAI format)
        if (data.choices && data.choices.length > 0 && data.choices[0].message) {
            return data.choices[0].message.content;
        }
        
        // Case 2: If we have a direct message property
        if (data.message && typeof data.message === 'string') {
            return data.message;
        }
        
        // Case 3: If we have an id property (could be used as followupId)
        if (data.id && typeof data.id === 'string') {
            return data.id;
        }
        
        // Case 4: If we have a content property
        if (data.content && typeof data.content === 'string') {
            return data.content;
        }
        
        // Case 5: If we have a text property
        if (data.text && typeof data.text === 'string') {
            return data.text;
        }
        
        // Case 6: If we have any usable string property
        for (const key in data) {
            if (typeof data[key] === 'string' && data[key].length > 0) {
                console.log(`Using '${key}' property as followupId:`, data[key]);
                return data[key];
            }
        }
        
        console.error("Unexpected API response format:", data);
        
        // Last resort: return the query itself as a fallback
        console.warn("Using query as fallback ID:", query);
        return query;
    } catch (error) {
        console.error("Error fetching completion:", error);
        
        // Return the query as a fallback to avoid breaking the application flow
        console.warn("Using query as fallback ID due to error:", query);
        return query;
    }
  }

  /**
   * Generic method to fetch data from a Bagoodex endpoint
   * @param endpoint The endpoint path
   * @param followupId The ID returned from chat completion
   * @returns A promise resolving to the response data
   */
  private async fetchFromEndpoint<T>(endpoint: BagoodexSearchResultType, followupId: string): Promise<T> {
    try {
      const params = new URLSearchParams({ followup_id: followupId });
      const response = await fetch(`${AIML_API_BASE_URL}/bagoodex/${endpoint}?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.AIML_API_KEY}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error fetching ${endpoint}`);
      }

      return await response.json() as T;
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Get links related to a query
   * @param followupId The ID returned from chat completion
   * @returns A promise resolving to an array of links
   */
  async getLinks(followupId: string): Promise<BagoodexLink[]> {
    return this.fetchFromEndpoint<BagoodexLink[]>('links', followupId);
  }

  /**
   * Get images related to a query
   * @param followupId The ID returned from chat completion
   * @returns A promise resolving to an array of images
   */
  async getImages(followupId: string): Promise<BagoodexImage[]> {
    return this.fetchFromEndpoint<BagoodexImage[]>('images', followupId);
  }

  /**
   * Get videos related to a query
   * @param followupId The ID returned from chat completion
   * @returns A promise resolving to an array of videos
   */
  async getVideos(followupId: string): Promise<BagoodexVideo[]> {
    return this.fetchFromEndpoint<BagoodexVideo[]>('videos', followupId);
  }

  /**
   * Get weather information related to a query
   * @param followupId The ID returned from chat completion
   * @returns A promise resolving to weather information
   */
  async getWeather(followupId: string): Promise<BagoodexWeather> {
    return this.fetchFromEndpoint<BagoodexWeather>('weather', followupId);
  }

  /**
   * Get local map information related to a query
   * @param followupId The ID returned from chat completion
   * @returns A promise resolving to local map information
   */
  async getLocalMap(followupId: string): Promise<BagoodexLocalMap> {
    return this.fetchFromEndpoint<BagoodexLocalMap>('local-map', followupId);
  }

  /**
   * Unified method to search and get results from a specific endpoint
   * @param query The search query
   * @param endpoint The endpoint to get results from
   * @returns A promise resolving to the search results
   */
  async search<T>(query: string, endpoint: BagoodexSearchResultType): Promise<T> {
    // First create a chat completion to get the followupId
    const followupId = await this.createChatCompletion(query);
    
    // Then fetch from the specific endpoint
    switch (endpoint) {
      case 'links':
        return this.getLinks(followupId) as unknown as T;
      case 'images':
        return this.getImages(followupId) as unknown as T;
      case 'videos':
        return this.getVideos(followupId) as unknown as T;
      case 'weather':
        return this.getWeather(followupId) as unknown as T;
      case 'local-map':
        return this.getLocalMap(followupId) as unknown as T;
      default:
        throw new Error(`Unknown endpoint: ${endpoint}`);
    }
  }

  /**
   * Search all available endpoints and return combined results
   * @param query The search query
   * @returns A promise resolving to an object with results from all endpoints
   */
  async searchAll(query: string): Promise<{
    links?: BagoodexLink[];
    images?: BagoodexImage[];
    videos?: BagoodexVideo[];
    weather?: BagoodexWeather;
    localMap?: BagoodexLocalMap;
  }> {
    // First create a chat completion to get the followupId
    const followupId = await this.createChatCompletion(query);
    
    // Create an object to store the results
    const results: {
      links?: BagoodexLink[];
      images?: BagoodexImage[];
      videos?: BagoodexVideo[];
      weather?: BagoodexWeather;
      localMap?: BagoodexLocalMap;
    } = {};

    // Define all the endpoints to fetch from
    const endpoints: Array<{
      key: string;
      endpoint: BagoodexSearchResultType;
      fetchFn: (id: string) => Promise<any>;
    }> = [
      { key: 'links', endpoint: 'links', fetchFn: this.getLinks.bind(this) },
      { key: 'images', endpoint: 'images', fetchFn: this.getImages.bind(this) },
      { key: 'videos', endpoint: 'videos', fetchFn: this.getVideos.bind(this) },
      { key: 'weather', endpoint: 'weather', fetchFn: this.getWeather.bind(this) },
      { key: 'localMap', endpoint: 'local-map', fetchFn: this.getLocalMap.bind(this) },
    ];

    // Fetch from all endpoints in parallel
    await Promise.allSettled(
      endpoints.map(async ({ key, fetchFn }) => {
        try {
          const result = await fetchFn(followupId);
          results[key as keyof typeof results] = result;
        } catch (error) {
          console.error(`Error fetching ${key}:`, error);
          // If an endpoint fails, we continue with the others
        }
      })
    );

    return results;
  }
} 