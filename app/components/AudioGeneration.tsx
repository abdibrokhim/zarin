"use client";

import { useState } from "react";
import { saveAndPlayAudio } from "@/lib/db/audio";

export default function AudioGeneration() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAudioGeneration = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const result = await fetch("/api/audio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          userId: "user_" + Date.now(), // Replace with actual user ID
          isAuthenticated: true,
        }),
      });

      if (!result.ok) {
        const errorData = await result.json();
        throw new Error(errorData.error || "Failed to generate audio");
      }

      const data = await result.json();
      setResponse(data.response);

      // If audio was generated, play it
      if (data.audio && data.audio.audio) {
        const audioBase64 = data.audio.audio;
        const binary = atob(audioBase64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        const blob = new Blob([bytes.buffer], { type: "audio/mpeg" });
        
        // Save and play the audio
        await saveAndPlayAudio(blob);
      }
    } catch (error: any) {
      console.error("Error generating audio:", error);
      setError(error.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-4 p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold">Audio Generation</h1>
      
      <div className="flex flex-col space-y-2">
        <label htmlFor="prompt" className="text-sm font-medium">
          Describe what audio you want to generate
        </label>
        <textarea
          id="prompt"
          rows={4}
          className="border rounded-md p-2 resize-none"
          placeholder="e.g., 'make this text into audio, use a girl's voice. text=hey guys, my name is Zarina. glad to be here!'"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      </div>
      
      <button
        onClick={handleAudioGeneration}
        disabled={loading || !prompt.trim()}
        className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? "Generating..." : "Generate Audio"}
      </button>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      {response && (
        <div className="bg-gray-100 p-4 rounded-md">
          <h2 className="font-medium mb-2">Response:</h2>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
} 