"use client";

import { useStoryGeneration } from "@/hooks/useStoryGeneration";
import StoryForm from "@/components/StoryForm";
import StoryDisplay from "@/components/StoryDisplay";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";

export default function Home() {
  const { loading, error, story, generateStory, reset } = useStoryGeneration();

  const handleSubmit = async (
    topic: string,
    length: "Short" | "Medium" | "Long"
  ) => {
    try {
      await generateStory({ topic, length });
    } catch (err) {
      // Error is already handled in the hook
    }
  };

  const scrollToGenerator = () => {
    const element = document.getElementById("generator");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full border-b border-gray-200 bg-white/95 backdrop-blur-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SW</span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-black tracking-tight">
                StoryWeave
              </h1>
            </div>
            <div className="flex items-center space-x-3 sm:space-x-8">
              <a
                href="#features"
                className="hidden sm:block text-sm text-gray-600 hover:text-black transition-colors"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="hidden sm:block text-sm text-gray-600 hover:text-black transition-colors"
              >
                How It Works
              </a>
              <button
                onClick={scrollToGenerator}
                className="px-3 py-2 sm:px-4 text-xs sm:text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-colors"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight px-4">
            Transform Ideas Into
            <br className="hidden sm:block" />
            <span className="block sm:inline"> </span>
            <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Immersive Audio Stories
            </span>
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto mb-8 sm:mb-12 leading-relaxed px-4">
            Create captivating narratives with AI-generated stories and
            cinematic background music in minutes
          </p>

          {/* CTA Scroll Indicator */}
          <div className="flex items-center justify-center space-x-3 sm:space-x-4 mb-12 sm:mb-16">
            <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-gray-300 rounded-full flex items-start justify-center p-2">
              <div className="w-1 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            </div>
            <span className="text-xs sm:text-sm text-gray-500">
              Scroll to create your story
            </span>
          </div>
        </div>
      </section>

      {/* Generator Section */}
      <section
        id="generator"
        className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white"
      >
        <div className="max-w-4xl mx-auto">
          {!story && !loading && (
            <div>
              <div className="text-center mb-8 sm:mb-12">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">
                  Create Your Story
                </h2>
                <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-4">
                  Enter a topic and let our AI craft a unique audio story with
                  background music
                </p>
              </div>

              <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-200 p-4 sm:p-6 lg:p-8">
                <StoryForm onSubmit={handleSubmit} isLoading={loading} />
              </div>
            </div>
          )}

          {loading && (
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-8 lg:p-10">
              <LoadingSpinner />
            </div>
          )}

          {error && (
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-8 lg:p-10">
              <ErrorMessage message={error} onDismiss={() => reset()} />
            </div>
          )}

          {story && !loading && (
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-8 lg:p-10">
              <StoryDisplay story={story} onReset={reset} />
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">
              Why Choose StoryWeave?
            </h2>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-4">
              Professional-grade storytelling powered by cutting-edge AI
              technology
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Feature 1 */}
            <div className="group p-6 sm:p-8 rounded-xl sm:rounded-2xl border border-gray-200 hover:border-black transition-all hover:shadow-lg">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black rounded-lg flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                Lightning Fast
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Generate complete audio stories in under 2 minutes with our
                optimized AI pipeline
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-6 sm:p-8 rounded-xl sm:rounded-2xl border border-gray-200 hover:border-black transition-all hover:shadow-lg">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black rounded-lg flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                  />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                Cinematic Audio
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Professional voice narration with perfectly matched background
                music
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-6 sm:p-8 rounded-xl sm:rounded-2xl border border-gray-200 hover:border-black transition-all hover:shadow-lg sm:col-span-2 lg:col-span-1">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black rounded-lg flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                Fully Customizable
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Choose story length and theme to match your exact needs
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">
              How It Works
            </h2>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-4">
              From idea to audio story in three simple steps
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Step 1 */}
            <div className="relative">
              <div className="bg-white p-6 sm:p-8 rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black text-white rounded-full flex items-center justify-center font-bold text-lg sm:text-xl mb-3 sm:mb-4">
                  1
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                  Enter Your Idea
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Simply describe the story you want to create and choose your
                  preferred length
                </p>
              </div>
              {/* Arrow for desktop */}
              <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                <svg
                  className="w-8 h-8 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="bg-white p-6 sm:p-8 rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black text-white rounded-full flex items-center justify-center font-bold text-lg sm:text-xl mb-3 sm:mb-4">
                  2
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                  AI Creates Magic
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Our AI generates the narrative, voice narration, and
                  background music
                </p>
              </div>
              {/* Arrow for desktop */}
              <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                <svg
                  className="w-8 h-8 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>

            {/* Step 3 */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="bg-white p-6 sm:p-8 rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black text-white rounded-full flex items-center justify-center font-bold text-lg sm:text-xl mb-3 sm:mb-4">
                  3
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                  Listen & Enjoy
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Your complete audio story is ready to play instantly
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex justify-center items-center">
          <div className="text-xs sm:text-sm text-gray-500 text-center">
            © 2025 StoryWeave. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
