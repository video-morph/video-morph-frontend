import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { FFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

let ffmpeg;

if (typeof FFmpeg !== 'undefined') {
  ffmpeg = new FFmpeg({ log: true });
}

export const loadFFmpeg = createAsyncThunk('transcode/loadFFmpeg', async () => {
  if (ffmpeg) {
    await ffmpeg.load();
    return true;
  }
  throw new Error('FFmpeg can only be loaded in a browser environment.');
});

export const transcodeVideo = createAsyncThunk('transcode/transcodeVideo', async ({ video, format }) => {
  if (!ffmpeg) {
    throw new Error('FFmpeg is not available. Ensure it is loaded before transcoding.');
  }

  const reader = new FileReader();
  reader.readAsArrayBuffer(video);
  return new Promise((resolve, reject) => {
    reader.onloadend = async () => {
      ffmpeg.FS('writeFile', 'input.mp4', new Uint8Array(reader.result));
      await ffmpeg.run('-i', 'input.mp4', `output.${format}`);
      const data = ffmpeg.FS('readFile', `output.${format}`);
      const url = URL.createObjectURL(new Blob([data.buffer], { type: `video/${format}` }));
      resolve(url);
    };
    reader.onerror = (error) => reject(error);
  });
});

const transcodeSlice = createSlice({
  name: 'transcode',
  initialState: {
    ready: false,
    video: null,
    output: null,
    loading: false,
    error: null,
  },
  reducers: {
    setVideo: (state, action) => {
      state.video = action.payload;
    },
    resetState: (state) => {
      state.ready = false;
      state.video = null;
      state.output = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadFFmpeg.fulfilled, (state) => {
        state.ready = true;
      })
      .addCase(transcodeVideo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(transcodeVideo.fulfilled, (state, action) => {
        state.loading = false;
        state.output = action.payload;
      })
      .addCase(transcodeVideo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setVideo, resetState } = transcodeSlice.actions;

export default transcodeSlice.reducer;

