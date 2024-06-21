"use client"

import Image from "next/image";
import Dropzone from "../components/dropzone/dropzone";


export default function Home() {
  return (
      <main className="p-4 flex flex-col justify-center items-center h-screen">
        <div className="w-[80%] flex flex-col justify-center items-center">
          <p className="text-4xl">Convert your Video Format Online Easily</p>
          <p className="text-center">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam,
          </p>
        </div>
        <Dropzone />
      </main>
  );
}

// https://ffmpegwasm.netlify.app/docs/api/ffmpeg/classes/FFmpeg
// https://ffmpegwasm.netlify.app/docs/api/util/
