"use client";

import { useState, useEffect, useRef } from "react";
import { saveAndPlayAudio } from "@/lib/db/audio";
import { AudioAttachment } from "@/lib/chat/message";
import { Play, Pause, SpeakerSimpleHigh, SkipBack } from "@phosphor-icons/react";

interface AudioPlayerProps {
  audio: AudioAttachment;
}

export function AudioPlayer({ audio }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element
    const audioElement = new Audio();
    audioRef.current = audioElement;
    
    // Set up event listeners
    audioElement.addEventListener("loadedmetadata", () => {
      setDuration(audioElement.duration);
    });
    
    audioElement.addEventListener("timeupdate", () => {
      setCurrentTime(audioElement.currentTime);
    });
    
    audioElement.addEventListener("ended", () => {
      setIsPlaying(false);
      setCurrentTime(0);
    });
    
    // Convert the audio data to a playable format
    if (audio.audioBlob) {
      const url = URL.createObjectURL(audio.audioBlob);
      setAudioUrl(url);
      audioElement.src = url;
    } else if (audio.base64Audio) {
      const binary = atob(audio.base64Audio);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const blob = new Blob([bytes.buffer], { type: "audio/mpeg" });
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      audioElement.src = url;
      
      // Save to IndexedDB for future use
      saveAndPlayAudio(blob).catch(err => 
        console.error("Error saving audio to IndexedDB:", err)
      );
    }
    
    return () => {
      // Clean up
      audioElement.pause();
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      audioElement.src = "";
      audioElement.removeEventListener("loadedmetadata", () => {});
      audioElement.removeEventListener("timeupdate", () => {});
      audioElement.removeEventListener("ended", () => {});
    };
  }, [audio]);

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    
    setIsPlaying(!isPlaying);
  };

  const restartAudio = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    if (!isPlaying) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const newTime = Number(e.target.value);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  return (
    <div className="flex flex-col p-3 my-2 bg-gray-100 rounded-md dark:bg-gray-800">
      <div className="mb-2 text-sm">
        <p>Generated audio using <span className="font-medium">{audio.model}</span></p>
        <p className="text-gray-500">{audio.text}</p>
      </div>
      
      <div className="flex items-center gap-2">
        <button
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={restartAudio}
          aria-label="Restart"
        >
          <SkipBack className="w-5 h-5" />
        </button>
        
        <button
          className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white hover:bg-blue-600"
          onClick={togglePlayPause}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5" />
          )}
        </button>
        
        <div className="flex-1 flex items-center gap-2">
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-300 dark:bg-gray-600"
          />
          <span className="text-xs whitespace-nowrap">
            {formatTime(currentTime)} / {duration ? formatTime(duration) : "0:00"}
          </span>
        </div>
        
        <div className="flex items-center justify-center w-8 h-8">
          <SpeakerSimpleHigh className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
} 