export * from './types';
export * from './client';

// Create and export a default instance of the Bagoodex client
import { BagoodexClient } from './client';
export const bagoodexClient = new BagoodexClient(); 