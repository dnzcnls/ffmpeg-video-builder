import ffmpeg from "fluent-ffmpeg";
import ffprobe from "ffprobe-static";

ffmpeg.setFfprobePath(ffprobe.path);

export function getAudioDuration(file: string): Promise<number> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(file, (err: Error | null, metadata: any) => {
      if (err) return reject(err);

      const duration = metadata?.format?.duration;

      resolve(duration || 0);
    });
  });
}

