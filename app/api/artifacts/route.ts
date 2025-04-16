'use client'

import { NextRequest, NextResponse } from 'next/server';

// Maximum allowed duration for streaming (in seconds)
export const maxDuration = 30;

// Type for artifact request
type ArtifactRequest = {
  documentId: string;
  title: string;
  content: string;
  kind: string;
}

// API route for artifacts
export async function POST(req: NextRequest) {
  try {
    // All processing is done client-side via IndexedDB in the browser
    // This endpoint just validates and returns a success response
    const body = await req.json() as ArtifactRequest;
    
    if (!body.documentId || !body.kind) {
      return NextResponse.json(
        { error: 'Missing required fields' },
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
    console.error('Error in artifact API:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve artifacts (placeholder - actual retrieval is done client-side)
export async function GET(req: NextRequest) {
  try {
    // In a real implementation, you'd fetch from a database
    // Here we just return a placeholder since actual data is handled by IndexedDB
    const documentId = req.nextUrl.searchParams.get('id');
    
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
    console.error('Error in artifact API:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 