import { getAudioDuration } from "./audio";
import { createVideo } from "./video";

async function main() {
  try {
    console.log("Starting video generation...");

    const voicePath = "assets/voice.mp3";

    const duration = await getAudioDuration(voicePath);

    if (!duration || duration <= 0) {
      throw new Error("Invalid audio duration");
    }

    console.log(`Audio duration detected: ${duration}s`);

    await createVideo(duration);

    console.log("Video generation completed successfully!");
  } catch (error) {
    console.error("Error while generating video:", error);
    process.exit(1);
  }
}

main();