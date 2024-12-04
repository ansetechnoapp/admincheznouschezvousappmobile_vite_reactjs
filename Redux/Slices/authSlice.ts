import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { login as firebaseLogin, logout as firebaseLogout, UserData } from '../../services/Auth';
import { auth } from '../../services/firebase';
import { deleteAccountFirebase } from '../../services/Auth';

interface AuthState {
  user: UserData | null;
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
  loading: boolean; // For deleteAccount-specific loading state
  success: boolean | null; // For indicating deleteAccount success
}

const initialState: AuthState = {
  user: null,
  status: 'idle',
  error: null,
  loading: false,
  success: null,
};


export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      await firebaseLogin(email, password); 
      const user = auth.currentUser;
      if (user) {
        const userData: UserData = {
          email: user.email!,
          role: 'user',
        };
        return userData;
      }
      return rejectWithValue('No user found');
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await firebaseLogout();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);


interface DeleteAccountPayload {
  email: string;
  password: string;
  userId: string;
}

export const deleteAccount = createAsyncThunk(
  'auth/deleteAccount',
  async ({ email, password, userId }: DeleteAccountPayload, { rejectWithValue }) => {
    try {
      await deleteAccountFirebase({ email, password, userId });
      return { success: true };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserData | null>) {
      state.user = action.payload;
    },
    resetState(state) {
      state.loading = false;
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<UserData>) => {
        state.status = 'idle';
        state.user = action.payload;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(logout.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.status = 'idle';
        state.user = null;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(deleteAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(deleteAccount.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      });
  },
});


export const selectAuth = (state: RootState) => state.auth;
export const { setUser, resetState } = authSlice.actions;

export default authSlice.reducer;
