"use client";

import { useState } from "react";
import { STORY_LENGTHS } from "@/config/constants";
import type { StoryLength } from "@/config/constants";

interface StoryFormProps {
  onSubmit: (topic: string, length: StoryLength) => void;
  isLoading: boolean;
}

export default function StoryForm({ onSubmit, isLoading }: StoryFormProps) {
  const [topic, setTopic] = useState("");
  const [length, setLength] = useState<StoryLength>("Medium");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onSubmit(topic, length);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Topic Input */}
      <div>
        <label
          htmlFor="topic"
          className="block text-sm font-medium text-gray-900 mb-2"
        >
          Story Topic
        </label>
        <input
          type="text"
          id="topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g., A robot discovering friendship in a digital world"
          className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors text-gray-900 placeholder:text-gray-400"
          required
          disabled={isLoading}
        />
      </div>

      {/* Length Dropdown */}
      <div>
        <label
          htmlFor="length"
          className="block text-sm font-medium text-gray-900 mb-2"
        >
          Story Length
        </label>
        <select
          id="length"
          value={length}
          onChange={(e) => setLength(e.target.value as StoryLength)}
          className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors text-gray-900 cursor-pointer appearance-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23000'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 0.75rem center",
            backgroundSize: "1.5em 1.5em",
          }}
          disabled={isLoading}
        >
          {STORY_LENGTHS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || !topic.trim()}
        className="w-full bg-black hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {isLoading ? "Generating..." : "Generate Story"}
      </button>
    </form>
  );
}
