import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

const ffmpeg = createFFmpeg({ log: true });

export const cropVideoToMobileSize = async (videoFile: File): Promise<Blob> => {
  if (!ffmpeg.isLoaded()) {
    await ffmpeg.load();
  }

  const inputFileName = 'input.mp4';
  const outputFileName = 'output.mp4';

  // Write the file to ffmpeg's file system
  ffmpeg.FS('writeFile', inputFileName, await fetchFile(videoFile));

  // Run the ffmpeg command to crop the video
  await ffmpeg.run(
    '-i', inputFileName,
    '-vf', 'crop=360:640', // Example crop for mobile size (360x640)
    outputFileName
  );

  // Read the result
  const data = ffmpeg.FS('readFile', outputFileName);

  // Create a Blob from the output file
  const croppedBlob = new Blob([data.buffer], { type: 'video/mp4' });

  return croppedBlob;
};
