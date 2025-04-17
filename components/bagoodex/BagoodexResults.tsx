'use client';

import React from 'react';
import Image from 'next/image';
import { 
  BagoodexLink, 
  BagoodexImage, 
  BagoodexVideo, 
  BagoodexWeather, 
  BagoodexLocalMap 
} from '@/lib/models/bagoodex/types';
import { extractDomain, formatUrl, hasUsefulData } from '@/lib/models/bagoodex/utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Globe, Image as ImageIcon, Play, CloudRain, MapPin } from '@phosphor-icons/react';

interface BagoodexResultsProps {
  data: {
    links?: BagoodexLink[];
    images?: BagoodexImage[];
    videos?: BagoodexVideo[];
    weather?: BagoodexWeather;
    localMap?: BagoodexLocalMap;
  };
  isLoading?: boolean;
  query?: string;
}

const BagoodexResults: React.FC<BagoodexResultsProps> = ({ data, isLoading, query }) => {
  // Determine which tab should be active initially based on available data
  const determineDefaultTab = (): string => {
    if (hasUsefulData(data.weather)) return 'weather';
    if (hasUsefulData(data.localMap)) return 'map';
    if (hasUsefulData(data.images)) return 'images';
    if (hasUsefulData(data.videos)) return 'videos';
    if (hasUsefulData(data.links)) return 'links';
    return 'links';
  };

  const [activeTab, setActiveTab] = React.useState<string>(determineDefaultTab());

  // Count available tabs
  const availableTabs = [
    { id: 'links', label: 'Links', icon: <Globe className="size-4" />, available: hasUsefulData(data.links) },
    { id: 'images', label: 'Images', icon: <ImageIcon className="size-4" />, available: hasUsefulData(data.images) },
    { id: 'videos', label: 'Videos', icon: <Play className="size-4" />, available: hasUsefulData(data.videos) },
    { id: 'weather', label: 'Weather', icon: <CloudRain className="size-4" />, available: hasUsefulData(data.weather) },
    { id: 'map', label: 'Map', icon: <MapPin className="size-4" />, available: hasUsefulData(data.localMap) },
  ].filter(tab => tab.available);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse flex flex-col space-y-4 w-full">
          <div className="h-8 bg-secondary rounded w-1/3"></div>
          <div className="h-32 bg-secondary rounded"></div>
          <div className="h-32 bg-secondary rounded"></div>
        </div>
      </div>
    );
  }

  if (availableTabs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-muted-foreground mb-4">No search results found for "{query}"</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Search Results</h3>
          <TabsList>
            {availableTabs.map(tab => (
              <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-1">
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        
        {/* Links Tab */}
        <TabsContent value="links" className="w-full">
          {data.links && data.links.length > 0 ? (
            <div className="grid gap-3">
              {data.links.map((link, index) => (
                <Card key={index} className="overflow-hidden hover:bg-accent/50 transition-colors">
                  <CardHeader className="p-4">
                    <CardTitle className="text-sm font-medium">
                      <a 
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {link.url}
                      </a>
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {extractDomain(link.url)}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">No links available</p>
          )}
        </TabsContent>
        
        {/* Images Tab */}
        <TabsContent value="images" className="w-full">
          {data.images && data.images.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {data.images.map((image, index) => (
                <Card key={index} className="overflow-hidden hover:bg-accent/50 transition-colors">
                  <div className="aspect-square relative overflow-hidden">
                    <Image
                      src={image.original}
                      alt={image.title || 'Image result'}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />
                  </div>
                  <CardFooter className="p-2 text-xs">
                    {image.title ? (
                      <a 
                        href={image.source || image.original} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline truncate w-full"
                      >
                        {image.title}
                      </a>
                    ) : (
                      <span className="text-muted-foreground">
                        {image.source_name || extractDomain(image.original)}
                      </span>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">No images available</p>
          )}
        </TabsContent>
        
        {/* Videos Tab */}
        <TabsContent value="videos" className="w-full">
          {data.videos && data.videos.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {data.videos.map((video, index) => (
                <Card key={index} className="overflow-hidden hover:bg-accent/50 transition-colors">
                  <div className="aspect-video relative overflow-hidden">
                    <Image
                      src={video.thumbnail}
                      alt={video.title || 'Video thumbnail'}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Play className="size-16 text-white" weight="fill" />
                    </div>
                  </div>
                  <CardFooter className="p-4">
                    <a 
                      href={video.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {video.title}
                    </a>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">No videos available</p>
          )}
        </TabsContent>
        
        {/* Weather Tab */}
        <TabsContent value="weather" className="w-full">
          {data.weather ? (
            <Card>
              <CardHeader className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">{data.weather.location}</CardTitle>
                    <CardDescription>{data.weather.date}</CardDescription>
                  </div>
                  {data.weather.thumbnail && (
                    <div className="relative size-16">
                      <Image
                        src='https://ssl.gstatic.com/onebox/weather/64/sunny_s_cloudy.png'
                        alt={data.weather.weather}
                        width={64}
                        height={64}
                        className="object-contain"
                      />
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="text-4xl font-bold">
                    {data.weather.temperature}°{data.weather.unit.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{data.weather.weather}</p>
                    <div className="grid grid-cols-2 gap-x-4 text-sm mt-2">
                      <p>Humidity: {data.weather.humidity}</p>
                      <p>Wind: {data.weather.wind}</p>
                      <p>Precipitation: {data.weather.precipitation}</p>
                    </div>
                  </div>
                </div>
                
                {data.weather.forecast && data.weather.forecast.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-medium mb-2">Forecast</h4>
                    <div className="flex overflow-x-auto pb-2 gap-2">
                      {data.weather.forecast.map((day, index) => (
                        <div key={index} className="flex-shrink-0 text-center p-2 border rounded-md w-24">
                          <p className="font-medium">{day.day.substring(0, 3)}</p>
                          {day.thumbnail && (
                            <div className="relative size-10 mx-auto my-1">
                              <Image
                                src='https://ssl.gstatic.com/onebox/weather/64/sunny_s_cloudy.png'
                                alt={day.weather}
                                width={40}
                                height={40}
                                className="object-contain"
                              />
                            </div>
                          )}
                          <p className="text-sm">{day.temperature.high}° / {day.temperature.low}°</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <p className="text-center text-muted-foreground">No weather information available</p>
          )}
        </TabsContent>
        
        {/* Map Tab */}
        <TabsContent value="map" className="w-full">
          {data.localMap ? (
            <Card>
              <div className="aspect-video relative">
                <Image
                  src={data.localMap.image}
                  alt="Map"
                  fill
                  className="object-cover"
                />
              </div>
              <CardFooter className="p-4">
                <Button asChild variant="outline" className="w-full">
                  <a 
                    href={data.localMap.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <MapPin className="size-4" />
                    Open in Google Maps
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <p className="text-center text-muted-foreground">No map information available</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BagoodexResults; 