import Bagoodex from "@/components/icons/bagoodex";
import { BagoodexClient } from './bagoodex/client';
import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";
import { Model, FeatureId, UseCaseId, FEATURE_ICONS, USE_CASE_ICONS } from "./types";
import { detectBestEndpoint, createOptimizedQuery } from './bagoodex/utils';

// Create a Bagoodex model configuration that can be used in the UI
export const MODELS: Model[] = [
  {
    id: "bagoodex/bagoodex-search-v1",
    name: "Bagoodex Search",
    provider: "bagoodex",
    type: "search",
    description: "AI-powered search engine with comprehensive web results including links, images, videos, weather, and maps.",
    features: [
      {
        id: FeatureId.WEB_SEARCH,
        enabled: true,
        icon: FEATURE_ICONS[FeatureId.WEB_SEARCH],
      },
      {
        id: FeatureId.MULTIMODAL,
        enabled: true,
        icon: FEATURE_ICONS[FeatureId.MULTIMODAL],
      },
    ],
    use_cases: [
      {
        id: UseCaseId.QUICK_RESEARCH,
        enabled: true,
        icon: USE_CASE_ICONS[UseCaseId.QUICK_RESEARCH],
      },
      {
        id: UseCaseId.ADVANCED_RESEARCH,
        enabled: true,
        icon: USE_CASE_ICONS[UseCaseId.ADVANCED_RESEARCH],
      },
    ],
    icon: Bagoodex,
    featured: true,
    status: "experimental",
    api_sdk: async (query: string) => {
      const client = new BagoodexClient();
      const bestEndpoint = detectBestEndpoint(query);
      const optimizedQuery = createOptimizedQuery(query, bestEndpoint);
      return client.search(optimizedQuery, bestEndpoint);
    }
  }
];