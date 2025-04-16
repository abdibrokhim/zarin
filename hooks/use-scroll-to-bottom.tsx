'use client';

import { RefObject, useEffect, useRef } from 'react';

export const useScrollToBottom = <T extends HTMLElement>(): [
  RefObject<T>,
  RefObject<T>,
] => {
  const containerRef = useRef<T>(null);
  const endElementRef = useRef<T>(null);

  useEffect(() => {
    if (endElementRef.current) {
      endElementRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [endElementRef]);

  return [containerRef as RefObject<T>, endElementRef as RefObject<T>];
}; 