from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from langgraph.graph import START, END, StateGraph
from langchain.prompts import PromptTemplate
from typing import TypedDict, Generator
from pydantic import BaseModel, Field
from langchain_google_genai import ChatGoogleGenerativeAI

import os
import uuid
import shutil
from pathlib import Path
from dotenv import load_dotenv
from elevenlabs.client import ElevenLabs
import subprocess

# Load environment variables
load_dotenv()
elevenlabs = ElevenLabs(api_key=os.getenv("ELEVENLABS_API_KEY"))

# Initialize FastAPI app
app = FastAPI(title="Story Audio Generator API")

# Add CORS middleware to allow frontend requests (restrict via env in production)
FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN")  # e.g., https://your-frontend.vercel.app
allow_origins = [FRONTEND_ORIGIN] if FRONTEND_ORIGIN else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Define the state structure
class StoryState(TypedDict):
    topic: str
    length: str
    story: str
    music_description: str
    speech: Generator
    music: Generator
    speech_duration: float
    final_story: str
    session_id: str  # Add session ID for unique file handling


# Request model for API
class StoryRequest(BaseModel):
    topic: str = Field(..., description="The topic for the story")
    length: str = Field(default="Medium", description="Story length: Short, Medium, or Long")


# Response model for API
class StoryResponse(BaseModel):
    story: str
    music_description: str
    duration: float
    audio_url: str
    session_id: str


# Define the schema for structured output
class StorySchema(BaseModel):
    story: str = Field(..., description="engaging story based on the topic and length")


class MusicPromptSchema(BaseModel):
    music_description: str = Field(..., description="detailed music description based on the generated story")


def generate_story(state: StoryState):
    """Generate a story from the topic using Gemini API"""
    print("🎨 Generating story...")
    
    # Define length guidelines
    length_guidelines = {
        "Short": "1-2 minutes when narrated aloud (approximately 150-300 words)",
        "Medium": "3-4 minutes when narrated aloud (approximately 350-600 words)",
        "Long": "5-6 minutes when narrated aloud (approximately 750-900 words)"
    }
    
    prompt_template = PromptTemplate(
        template="""
Generate an engaging story based on the following topic: {topic}.

Length requirement: {length} - {length_guideline}

The story should be:
- Emotionally immersive and vivid in imagery
- Have a clear beginning, middle, and end
- Strong emotional pacing suitable for audio storytelling
- Written in a natural narrative style with dialogue when appropriate
- Use varied sentence structure and punctuation for natural speech rhythm
- Appropriate for the specified length

CRITICAL RULES:
- Write ONLY the pure story text - no stage directions, no sound effect descriptions
- Do NOT include any parenthetical notes like (Pause), (Footsteps), (Music begins), etc.
- Do NOT include any brackets or special formatting
- Just write clean, flowing narrative text that will be read aloud

Write only the story text, nothing else.
""",
        input_variables=["topic", "length", "length_guideline"],
    )
    
    prompt = prompt_template.format(
        topic=state["topic"],
        length=state["length"],
        length_guideline=length_guidelines.get(state["length"], length_guidelines["Medium"])
    )
    
    model = ChatGoogleGenerativeAI(model="gemini-2.5-pro")
    structured_model = model.with_structured_output(StorySchema)
    results = structured_model.invoke(prompt)
    
    print(f"✅ Story generated: {results.story[:100]}...")
    
    return {'story': results.story}


def generate_music_prompt(state: StoryState):
    """Generate music description based on the story using Gemini API"""
    print("🎵 Generating music prompt...")
    
    prompt_template = PromptTemplate(
        template="""
Based on the following story, generate a detailed prompt for background music that complements the mood, tone, and pacing of the story.

Story:
{story}

The music prompt should describe:
- The emotional atmosphere (e.g., mysterious, joyful, melancholic, suspenseful, adventurous, dreamy)
- Tempo and rhythm (e.g., slow and gentle, upbeat, dramatic, flowing, pulsing)
- Instrumentation (e.g., gentle piano, cinematic strings, ambient synths, orchestral tones, acoustic guitar, soft pads, cellos)
- Overall mood and energy level
- Any specific musical elements that would enhance the storytelling atmosphere

⚠️ CRITICAL REQUIREMENTS:
- The music MUST contain NO LYRICS or vocals - only instrumental elements
- Must explicitly state "no lyrics", "instrumental only", or "without vocals"
- Should be suitable as background music that doesn't overpower narration

Write a concise but descriptive music prompt (2-4 sentences) optimized for ElevenLabs music generation.
""",
        input_variables=["story"],
    )
    
    prompt = prompt_template.format(story=state["story"])
    
    model = ChatGoogleGenerativeAI(model="gemini-2.5-pro")
    structured_model = model.with_structured_output(MusicPromptSchema)
    results = structured_model.invoke(prompt)
    
    print(f"✅ Music prompt generated: {results.music_description}")
    
    return {'music_description': results.music_description}


def generate_speech(state: StoryState):
    """Generate speech audio from the story using ElevenLabs TTS API"""
    print("🎙️ Generating speech audio...")
    
    audio = elevenlabs.text_to_speech.convert(
        text=state["story"],
        voice_id="kdmDKE6EkgrWrrykO9Qt",  
        model_id="eleven_multilingual_v2",  
        output_format="mp3_44100_128",
    )
    
    print("✅ Speech audio generated")
    return {'speech': audio}


def get_audio_duration(filename):
    """Get the duration of an audio file using ffprobe"""
    result = subprocess.run(
        [
            "ffprobe", "-v", "error", "-show_entries",
            "format=duration", "-of",
            "default=noprint_wrappers=1:nokey=1", filename
        ],
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT
    )
    # Decode bytes -> string -> float
    return float(result.stdout.decode().strip())


@app.on_event("startup")
async def _check_ffmpeg():
    """Warn if ffmpeg/ffprobe are not available at runtime."""
    missing = [b for b in ("ffmpeg", "ffprobe") if shutil.which(b) is None]
    if missing:
        print(f"WARNING: Missing binaries: {', '.join(missing)}. Install them in the image/server.")


def save_and_get_duration(state: StoryState):
    """Save speech to temporary file and get its duration"""
    print("⏱️ Getting audio duration...")
    
    session_id = state['session_id']
    temp_dir = Path(f"temp_{session_id}")
    temp_dir.mkdir(exist_ok=True)
    
    # Save speech audio to temporary file
    speech_bytes = b''.join(state['speech'])
    speech_file = temp_dir / "speech.mp3"
    with open(speech_file, "wb") as f:
        f.write(speech_bytes)
    
    # Get duration
    duration = get_audio_duration(str(speech_file))
    print(f"✅ Speech duration: {duration:.2f} seconds")
    
    return {'speech_duration': duration}


def generate_music(state: StoryState):
    """Generate background music using ElevenLabs Music API"""
    print("🎵 Generating background music...")
    
    # Calculate music length in milliseconds (add a bit extra to ensure coverage)
    music_length_ms = int(state['speech_duration'] * 1000) + 2000
    
    track = elevenlabs.music.compose(
        prompt=state['music_description'],
        music_length_ms=music_length_ms,
    )
    
    print("✅ Music generated")
    return {'music': track}


def mix_audio(state: StoryState):
    """Mix speech and music into final audio file"""
    print("🎧 Mixing audio files...")
    
    session_id = state['session_id']
    temp_dir = Path(f"temp_{session_id}")
    output_dir = Path("outputs")
    output_dir.mkdir(exist_ok=True)
    
    speech_file = temp_dir / "speech.mp3"
    music_file = temp_dir / "music.mp3"
    
    # Save music to temporary file
    music_bytes = b''.join(state['music'])
    with open(music_file, "wb") as f:
        f.write(music_bytes)
    
    output = output_dir / f"{session_id}.mp3"
    duration = state['speech_duration']
    
    # FFmpeg command to mix audio with music at 15% volume
    command = [
        "ffmpeg",
        "-y",  # Overwrite output file
        "-i", str(speech_file),
        "-stream_loop", "-1",  # Loop music if needed
        "-i", str(music_file),
        "-filter_complex",
        "[1:a]volume=0.15[a1];[0:a][a1]amix=inputs=2:duration=first:dropout_transition=2",
        "-t", str(duration),
        str(output)
    ]
    
    subprocess.run(command, check=True)
    
    # Clean up temporary files
    shutil.rmtree(temp_dir)
    
    print(f"✅ Final audio saved as: {output}")
    return {"final_story": str(output)}


# Build the workflow graph
def create_workflow():
    """Create and compile the LangGraph workflow"""
    graph = StateGraph(StoryState)
    
    # Add nodes
    graph.add_node('generate_story', generate_story)
    graph.add_node('generate_music_prompt', generate_music_prompt)
    graph.add_node('generate_speech', generate_speech)
    graph.add_node('save_and_get_duration', save_and_get_duration)
    graph.add_node('generate_music', generate_music)
    graph.add_node('mix_audio', mix_audio)
    
    # Define edges (workflow sequence)
    graph.add_edge(START, 'generate_story')
    graph.add_edge('generate_story', 'generate_music_prompt')
    graph.add_edge('generate_music_prompt', 'generate_speech')
    graph.add_edge('generate_speech', 'save_and_get_duration')
    graph.add_edge('save_and_get_duration', 'generate_music')
    graph.add_edge('generate_music', 'mix_audio')
    graph.add_edge('mix_audio', END)
    
    return graph.compile()


# FastAPI Endpoints

@app.get("/")
async def root():
    """Health check endpoint"""
    return {"status": "ok", "message": "Story Audio Generator API is running"}


@app.post("/generate-story", response_model=StoryResponse)
async def generate_story_endpoint(request: StoryRequest):
    """
    Generate a story with background music
    
    - **topic**: The topic for the story
    - **length**: Story length (Short, Medium, or Long)
    """
    try:
        # Validate length
        if request.length not in ["Short", "Medium", "Long"]:
            raise HTTPException(status_code=400, detail="Length must be Short, Medium, or Long")
        
        if not request.topic.strip():
            raise HTTPException(status_code=400, detail="Topic cannot be empty")
        
        # Generate unique session ID
        session_id = str(uuid.uuid4())
        
        print("\n" + "=" * 60)
        print(f"🚀 Starting story generation for session: {session_id}")
        print(f"📝 Topic: {request.topic}")
        print(f"📏 Length: {request.length}")
        print("=" * 60 + "\n")
        
        # Create and run workflow
        workflow = create_workflow()
        
        initial_state = {
            "topic": request.topic,
            "length": request.length,
            "session_id": session_id
        }
        
        results = workflow.invoke(initial_state)
        
        print("\n" + "=" * 60)
        print("🎉 Story generation completed!")
        print("=" * 60 + "\n")
        
        # Return response
        return StoryResponse(
            story=results['story'],
            music_description=results['music_description'],
            duration=results['speech_duration'],
            audio_url=f"/audio/{session_id}",
            session_id=session_id
        )
    
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating story: {str(e)}")


@app.get("/audio/{session_id}")
async def get_audio(session_id: str):
    """
    Get the generated audio file
    
    - **session_id**: The session ID returned from generate-story endpoint
    """
    audio_file = Path("outputs") / f"{session_id}.mp3"
    
    if not audio_file.exists():
        raise HTTPException(status_code=404, detail="Audio file not found")
    
    return FileResponse(
        path=audio_file,
        media_type="audio/mpeg",
        filename=f"story_{session_id}.mp3"
    )


def main():
    """Main function to run the workflow"""
    # Get topic from user
    print("=" * 60)
    print("🎬 Story Audio Generator with Background Music")
    print("=" * 60)
    
    topic = input("\n📝 Enter a story topic: ")
    
    if not topic.strip():
        print("❌ Topic cannot be empty!")
        return
    
    print("\n📏 Select story length:")
    print("  1. Short (30-45 seconds)")
    print("  2. Medium (1-2 minutes)")
    print("  3. Long (3-4 minutes)")
    
    length_choice = input("\nEnter your choice (1/2/3): ").strip()
    
    length_map = {
        "1": "Short",
        "2": "Medium",
        "3": "Long"
    }
    
    length = length_map.get(length_choice, "Medium")
    print(f"✅ Selected length: {length}")
    
    # Generate unique session ID
    session_id = str(uuid.uuid4())
    
    # Create and run workflow
    workflow = create_workflow()
    
    initial_state = {
        "topic": topic,
        "length": length,
        "session_id": session_id
    }
    
    print("\n🚀 Starting workflow...\n")
    results = workflow.invoke(initial_state)
    
    print("\n" + "=" * 60)
    print("🎉 Workflow completed!")
    print("=" * 60)
    print(f"\n📖 Story: {results['story'][:200]}...")
    print(f"\n🎵 Music Description: {results['music_description']}")
    print(f"\n⏱️ Duration: {results['speech_duration']:.2f} seconds")
    print(f"\n🎧 Final audio file: {results['final_story']}")
    print("\n✨ Done! You can now play the final audio file!")


if __name__ == "__main__":
    import uvicorn
    print("\n🚀 Starting FastAPI server...")
    print("📡 API will be available at: http://localhost:8000")
    print("📚 API docs available at: http://localhost:8000/docs")
    print("\n" + "=" * 60 + "\n")
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", "8000")))
