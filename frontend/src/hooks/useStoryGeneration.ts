import { useState } from "react";
import axios from "axios";
import { API_URL } from "@/config/constants";
import type { StoryResponse, StoryRequest } from "@/types/story";

export function useStoryGeneration() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [story, setStory] = useState<StoryResponse | null>(null);

  const generateStory = async (request: StoryRequest) => {
    setLoading(true);
    setError(null);
    setStory(null);

    try {
      const response = await axios.post<StoryResponse>(
        `${API_URL}/generate-story`,
        request,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setStory(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.detail || err.message
        : "Failed to generate story. Please try again.";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStory(null);
    setError(null);
  };

  return {
    loading,
    error,
    story,
    generateStory,
    reset,
  };
}
