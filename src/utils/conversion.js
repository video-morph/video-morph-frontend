import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

function getFileExtension(file_name) {
  const regex = /(?:\.([^.]+))?$/;
  const match = regex.exec(file_name);
  if (match && match[1]) {
    return match[1];
  }
  return "";
}

function removeFileExtension(file_name) {
  const lastDotIndex = file_name.lastIndexOf(".");
  if (lastDotIndex !== -1) {
    return file_name.slice(0, lastDotIndex);
  }
  return file_name;
}

export default async function convert(ffmpeg, action) {
  await ffmpeg.load();

  const { file, to, file_name, file_type } = action;
  const input = getFileExtension(file_name);
  const output = removeFileExtension(file_name) + "." + to;
  
  ffmpeg.FS('writeFile', input, await fetchFile(file));

  let ffmpeg_cmd = [];

  if (to === "3gp") {
    ffmpeg_cmd = [
      "-i", input,
      "-r", "20",
      "-s", "352x288",
      "-vb", "400k",
      "-acodec", "aac",
      "-strict", "experimental",
      "-ac", "1",
      "-ar", "8000",
      "-ab", "24k",
      output
    ];
  } else {
    ffmpeg_cmd = ["-i", input, output];
  }

  await ffmpeg.run(...ffmpeg_cmd);

  const data = ffmpeg.FS('readFile', output);
  const blob = new Blob([data.buffer], { type: file_type.split("/")[0] });
  const url = URL.createObjectURL(blob);
  return { url, output };
}
