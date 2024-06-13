import React, { useEffect, useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FFmpeg } from '@ffmpeg/ffmpeg';

const Dropzone = () => {
  const [ready, setReady] = useState(false);
  const [video, setVideo] = useState(null);
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ffmpeg, setFfmpeg] = useState(null);

  useEffect(() => {
    const loadFFmpeg = async () => {
      const ffmpeg = new FFmpeg();
      setFfmpeg(ffmpeg);

      try {
        console.log('Loading FFmpeg...');
        await ffmpeg.load();
        setReady(true);
        console.log('FFmpeg loaded successfully.');
      } catch (err) {
        console.error('Failed to load FFmpeg:', err);
        setError('Failed to load FFmpeg.');
      }
    };

    loadFFmpeg();
  }, []);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setVideo(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: 'video/*' });

  const handleTranscode = async (format) => {
    if (!video || !ffmpeg) {
      setError('FFmpeg is not ready or no video selected.');
      return;
    }

    setLoading(true);
    setError(null);

    const reader = new FileReader();
    reader.readAsArrayBuffer(video);

    reader.onloadend = async () => {
      try {
        ffmpeg.FS('writeFile', 'input.mp4', new Uint8Array(reader.result));

        await ffmpeg.run('-i', 'input.mp4', `output.${format}`);

        const data = ffmpeg.FS('readFile', `output.${format}`);
        const url = URL.createObjectURL(new Blob([data.buffer], { type: `video/${format}` }));

        setOutput(url);
      } catch (err) {
        console.error('Transcoding failed:', err);
        setError('Transcoding failed.');
      } finally {
        setLoading(false);
      }
    };

    reader.onerror = () => {
      setError('Failed to read video file.');
      setLoading(false);
    };
  };

  return (
    <div>
      <h1>Video Transcoder</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {ready ? (
        <>
          <div {...getRootProps()} style={{ border: '2px dashed #ccc', padding: '20px', textAlign: 'center' }}>
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the files here...</p>
            ) : (
              <p>Drag 'n' drop a video file here, or click to select one</p>
            )}
          </div>
          {video && <p>Selected video: {video.name}</p>}
          <button onClick={() => handleTranscode('mp4')} disabled={loading || !video}>
            {loading ? 'Transcoding...' : 'Transcode to MP4'}
          </button>
          <button onClick={() => handleTranscode('webm')} disabled={loading || !video}>
            {loading ? 'Transcoding...' : 'Transcode to WEBM'}
          </button>
          <button onClick={() => handleTranscode('ogg')} disabled={loading || !video}>
            {loading ? 'Transcoding...' : 'Transcode to OGG'}
          </button>
          {output && (
            <div>
              <h3>Transcoded Video</h3>
              <video src={output} controls></video>
              <a href={output} download={`output.${output.split('.').pop()}`}>Download</a>
            </div>
          )}
        </>
      ) : (
        <p>Loading FFmpeg...</p>
      )}
    </div>
  );
};

export default Dropzone;
