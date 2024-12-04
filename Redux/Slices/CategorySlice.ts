import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Category, getCategories, addCategory, updateCategory, deleteCategory, uploadImage } from '../../services/Categories';
import { handleError } from '../../utils/errorHandler';

interface CategoriesState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoriesState = {
  categories: [],
  loading: false,
  error: null,
};

export const fetchCategories = createAsyncThunk('categories/fetchAll', async (_, thunkAPI) => {
  try {
    return await getCategories();
  } catch (error) {
    handleError(error, 'Failed to fetch categories');
    return thunkAPI.rejectWithValue('Failed to fetch categories');
  }
});

export const createCategory = createAsyncThunk(
  'categories/add',
  async (category: Omit<Category, 'id'>, thunkAPI) => { 
    try {
      let imageUrl = null;
      if (category.image instanceof File) { 
        imageUrl = await uploadImage(category.image, 'categories');
      }

      const response = await addCategory({
        ...category,
        image: imageUrl || category.image,
      });

      if (response.success && response.id) {
        return {
          ...category,
          id: response.id,
          image: imageUrl || response.imageUrl || category.image,
        };
      } else {
        return thunkAPI.rejectWithValue('Failed to add category');
      }
    } catch (error) {
      handleError(error, 'Failed to add category');
      return thunkAPI.rejectWithValue('Failed to add category');
    }
  }
);

export const removeCategory = createAsyncThunk(
  'categories/delete',
  async ({ categoryId, deleteAssociatedItems }: { categoryId: string; deleteAssociatedItems: boolean }, thunkAPI) => {
    try {
      const response = await deleteCategory(categoryId, deleteAssociatedItems);
      if (response.success) {
        return categoryId;
      } else {
        return thunkAPI.rejectWithValue(response.message || 'Failed to delete category');
      }
    } catch (error) {
      handleError(error, 'Failed to delete category');
      return thunkAPI.rejectWithValue('Failed to delete category');
    }
  }
);

export const modifyCategory = createAsyncThunk(
  'categories/update',
  async (category: Category, thunkAPI) => {
    try {
      let imageUrl = category.image;
      if (category.image instanceof File) {
        imageUrl = await uploadImage(category.image, 'categories');
      }

      const response = await updateCategory({
        ...category,
        image: imageUrl || category.image,
      });

      if (response.success) {
        return {
          ...category,
          image: imageUrl || category.image,
        };
      } else {
        return thunkAPI.rejectWithValue('Failed to update category');
      }
    } catch (error) {
      handleError(error, 'Failed to update category');
      return thunkAPI.rejectWithValue('Failed to update category');
    }
  }
);



const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(modifyCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(createCategory.fulfilled, (state, action: PayloadAction<Category>) => {
        state.loading = false;
        state.categories.push(action.payload);
      })
      .addCase(removeCategory.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.categories = state.categories.filter((category) => category.id !== action.payload);
      })
      .addCase(modifyCategory.fulfilled, (state, action: PayloadAction<Category>) => {
        state.loading = false;
        state.categories = state.categories.map((category) => 
          category.id === action.payload.id ? action.payload : category
        );
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(removeCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(modifyCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default categorySlice.reducer;
