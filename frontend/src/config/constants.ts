export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const STORY_LENGTHS = [
  { value: "Short", label: "Short (1-2 minutes)" },
  { value: "Medium", label: "Medium (3-4 minutes)" },
  { value: "Long", label: "Long (5-6 minutes)" },
] as const;

export type StoryLength = (typeof STORY_LENGTHS)[number]["value"];
