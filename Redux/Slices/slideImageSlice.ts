
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const selectImages = (state: { images: ImageState }) => state.images.images;



interface ImageState {
  images: string[];
}

const initialState: ImageState = {
  images: ["", "", "", ""], // Ensure four entries
}; 

const imagesSlice = createSlice({
  name: "images",
  initialState,
  reducers: {
    setImages: (state, action: PayloadAction<string[]>) => {
      state.images = action.payload;
    },
    addImage: (state, action: PayloadAction<{ imageId: string; imageUrl: string }>) => {
      const { imageId, imageUrl } = action.payload;
      const index = parseInt(imageId.replace("image", "")) - 1;
      if (index >= 0 && index < state.images.length) {
        state.images[index] = imageUrl;
      }
    },
  },
});

export const { setImages, addImage } = imagesSlice.actions;

export default imagesSlice.reducer;