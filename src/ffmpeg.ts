import ffmpeg from "fluent-ffmpeg";
import ffprobeStatic from "ffprobe-static";

ffmpeg.setFfprobePath(ffprobeStatic.path);

export function getAudioDuration(filePath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err: Error | null, metadata: any) => {
      if (err) return reject(err);

      const duration = metadata?.format?.duration;

      resolve(duration || 0);
    });
  });
}