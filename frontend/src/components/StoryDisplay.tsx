"use client";

import AudioPlayer from "./AudioPlayer";
import type { StoryResponse } from "@/types/story";

interface StoryDisplayProps {
  story: StoryResponse;
  onReset: () => void;
}

export default function StoryDisplay({ story, onReset }: StoryDisplayProps) {
  return (
    <div className="space-y-4 sm:space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          Your Story
        </h2>
        <button
          onClick={onReset}
          className="text-sm text-gray-600 hover:text-black transition-colors text-left sm:text-right"
        >
          Generate New Story
        </button>
      </div>

      {/* Audio Player */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-2 sm:mb-3">
          Listen to Your Story
        </h3>
        <AudioPlayer audioUrl={story.audio_url} duration={story.duration} />
      </div>

      {/* Story Text */}
      <div className="bg-white border-2 border-gray-200 rounded-lg p-4 sm:p-6">
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-wrap">
          {story.story}
        </p>
      </div>
    </div>
  );
}
