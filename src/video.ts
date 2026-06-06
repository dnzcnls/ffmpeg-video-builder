import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import ffprobeStatic from "ffprobe-static";

ffmpeg.setFfmpegPath(ffmpegPath!);
ffmpeg.setFfprobePath(ffprobeStatic.path);

export async function createVideo(duration: number) {
  console.log("Building video with duration:", duration);

  const imageDuration = duration / 3;

  return new Promise((resolve, reject) => {
    ffmpeg()
      // 🎞 IMAGE SEQUENCE (FOR TIMELINE)
      .input("assets/image1.jpg")
      .inputOptions(["-loop 1", "-t", String(imageDuration)])

      .input("assets/image2.jpg")
      .inputOptions(["-loop 1", "-t", String(imageDuration)])

      .input("assets/image3.jpg")
      .inputOptions(["-loop 1", "-t", String(imageDuration)])

      // 🎧 AUDIO
      .input("assets/voice.mp3")
      .input("assets/music.mp3")

      .output("output/output.mp4")
        .outputOptions([
        "-filter_complex",

        `
        [0:v]scale=1080:1920,setsar=1[v0];
        [1:v]scale=1080:1920,setsar=1[v1];
        [2:v]scale=1080:1920,setsar=1[v2];

        [v0][v1][v2]concat=n=3:v=1:a=0[v];

        [3:a]volume=1[a1];
        [4:a]volume=0.2[a2];
        [a1][a2]amix=inputs=2:duration=longest[aout];

        [v]subtitles=assets/captions.srt:force_style='Fontsize=18'[vsub]
        `,

        // 🔥 FINAL MAPPING (THIS IS CRITICAL)
        "-map", "[vsub]",
        "-map", "[aout]",

        "-r", "30",
        "-pix_fmt", "yuv420p",
        "-movflags", "+faststart"
        ])

      .videoCodec("libx264")
      .audioCodec("aac")
      .format("mp4")

      .on("start", (cmd: string) => {
        console.log("FFmpeg started:", cmd);
      })

      .on("end", () => {
        console.log("Video created successfully");
        resolve(true);
      })

      .on("error", (err: Error) => {
        console.error("FFmpeg error:", err);
        reject(err);
      })

      .run();
  });
}