// Bagoodex API response types

// Link search result
export interface BagoodexLink {
  url: string;
}

// Image search result
export interface BagoodexImage {
  source: string;
  original: string;
  title: string;
  source_name: string;
}

// Video search result
export interface BagoodexVideo {
  link: string;
  thumbnail: string;
  title: string;
}

// Weather forecast item
export interface WeatherForecastItem {
  day: string;
  temperature: {
    high: string;
    low: string;
  };
  thumbnail: string;
  weather: string;
  humidity: string;
  precipitation: string;
  wind: string;
}

// Weather hourly forecast item
export interface WeatherHourlyForecastItem {
  time: string;
  thumbnail: string;
  weather: string;
  temperature: string;
  precipitation: string;
  humidity: string;
  wind: string;
}

// Weather search result
export interface BagoodexWeather {
  type: string;
  temperature: string;
  unit: string;
  precipitation: string;
  humidity: string;
  wind: string;
  location: string;
  date: string;
  weather: string;
  thumbnail: string;
  forecast: WeatherForecastItem[];
  hourly_forecast: WeatherHourlyForecastItem[];
}

// Local map search result
export interface BagoodexLocalMap {
  link: string;
  image: string;
}

// Bagoodex search result types
export type BagoodexSearchResultType = 'links' | 'images' | 'videos' | 'weather' | 'local-map';

// Combined response type for all Bagoodex API responses
export type BagoodexResponse = 
  | BagoodexLink[]
  | BagoodexImage[]
  | BagoodexVideo[]
  | BagoodexWeather
  | BagoodexLocalMap;

// Request parameters
export interface BagoodexSearchParams {
  followup_id: string;
} 