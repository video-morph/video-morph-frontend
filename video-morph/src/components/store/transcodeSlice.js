import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

const ffmpeg = createFFmpeg({ log: true });

export const loadFFmpeg = createAsyncThunk('transcode/loadFFmpeg', async () => {
  await ffmpeg.load();
  return true;
});

export const transcodeVideo = createAsyncThunk(
  'transcode/transcodeVideo',
  async ({ video, format }, { rejectWithValue }) => {
    try {
      ffmpeg.FS('writeFile', 'input', await fetchFile(video));
      await ffmpeg.run('-i', 'input', `output.${format}`);
      const data = ffmpeg.FS('readFile', `output.${format}`);

      return URL.createObjectURL(new Blob([data.buffer], { type: `video/${format}` }));
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const transcodeSlice = createSlice({
  name: 'transcode',
  initialState: {
    ready: false,
    video: null,
    output: null,
    progress: 0,
    error: null,
    loading: false,
  },
  reducers: {
    setVideo: (state, action) => {
      state.video = action.payload;
    },
    resetState: (state) => {
      state.video = null;
      state.output = null;
      state.progress = 0;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadFFmpeg.fulfilled, (state) => {
        state.ready = true;
      })
      .addCase(transcodeVideo.pending, (state) => {
        state.loading = true;
        state.progress = 0;
        state.error = null;
      })
      .addCase(transcodeVideo.fulfilled, (state, action) => {
        state.loading = false;
        state.output = action.payload;
      })
      .addCase(transcodeVideo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(transcodeVideo, (state, action) => {
        ffmpeg.setProgress(({ ratio }) => {
          state.progress = ratio * 100;
        });
      });
  },
});

export const { setVideo, resetState } = transcodeSlice.actions;

export default transcodeSlice.reducer;
