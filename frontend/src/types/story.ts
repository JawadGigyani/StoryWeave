export interface StoryResponse {
  story: string;
  music_description: string;
  duration: number;
  audio_url: string;
  session_id: string;
}

export interface StoryRequest {
  topic: string;
  length: "Short" | "Medium" | "Long";
}
