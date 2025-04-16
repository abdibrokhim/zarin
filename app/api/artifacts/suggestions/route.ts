'use client'

import { NextRequest, NextResponse } from 'next/server';

// Maximum allowed duration for streaming (in seconds)
export const maxDuration = 30;

// Type for suggestion request
type SuggestionRequest = {
  documentId: string;
  suggestions: Array<{
    id: string;
    documentId: string;
    content: string;
    originalText?: string;
    suggestedText?: string;
  }>;
}

// API route for suggestions
export async function POST(req: NextRequest) {
  try {
    // All processing is done client-side via IndexedDB in the browser
    // This endpoint just validates and returns a success response
    const body = await req.json() as SuggestionRequest;
    
    if (!body.documentId) {
      return NextResponse.json(
        { error: 'Missing document ID' },
        { status: 400 }
      );
    }

    // The actual storage is handled by the client components
    // This is just a pass-through endpoint
    return NextResponse.json(
      { success: true, documentId: body.documentId },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error in suggestions API:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve suggestions (placeholder - actual retrieval is done client-side)
export async function GET(req: NextRequest) {
  try {
    // In a real implementation, you'd fetch from a database
    // Here we just return a placeholder since actual data is handled by IndexedDB
    const documentId = req.nextUrl.searchParams.get('documentId');
    
    if (!documentId) {
      return NextResponse.json(
        { error: 'Missing document ID' },
        { status: 400 }
      );
    }

    // Return a placeholder success response
    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error in suggestions API:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 