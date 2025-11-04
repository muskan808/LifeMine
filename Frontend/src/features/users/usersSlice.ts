import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../api/axios';
import { User } from '../../types/user';


interface UsersState {
list: User[];
loading: boolean;
error?: string | null;
}


const initialState: UsersState = { list: [], loading: false, error: null };


export const fetchUsers = createAsyncThunk('users/fetch', async () => {
const res = await api.get<User[]>('/users');
return res.data;
});

export const updateUser = createAsyncThunk(
  'users/update',
  async ({ id, patch }: { id: string; patch: Partial<User> }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/users/${id}`, patch);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data ?? { message: err.message });
    }
  }
);

export const fetchUserById = createAsyncThunk('users/fetchById', async (id: string) => {
const res = await api.get<User>(`/users/${id}`);
return res.data;
});


export const addUser = createAsyncThunk(
  'users/add',
  async (user: User, { rejectWithValue }) => {
    try {
      const res = await api.post('/users', user);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data ?? { message: err.message });
    }
  }
);


export const deleteUser = createAsyncThunk('users/delete', async (id: string) => {
await api.delete(`/users/${id}`);
return id;
});


const usersSlice = createSlice({
name: 'users',
initialState,
reducers: {},
extraReducers: (builder) => {
builder
.addCase(fetchUsers.pending, (state) => { state.loading = true; })
.addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => { state.loading = false; state.list = action.payload; })
.addCase(fetchUsers.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })


.addCase(addUser.fulfilled, (state, action: PayloadAction<User>) => { state.list.push(action.payload); })
.addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
state.list = state.list.map((u) => (u.id === action.payload.id ? action.payload : u));
})
.addCase(deleteUser.fulfilled, (state, action: PayloadAction<string>) => {
state.list = state.list.filter((u) => u.id !== action.payload);
});
},
});


export default usersSlice.reducer;