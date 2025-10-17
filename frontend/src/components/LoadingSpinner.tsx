"use client";

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
      <p className="mt-6 text-sm text-gray-600 font-medium">
        Generating your story...
      </p>
      <p className="mt-2 text-xs text-gray-400">This may take 1-2 minutes</p>
    </div>
  );
}
