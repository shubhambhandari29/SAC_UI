import { configureStore } from '@reduxjs/toolkit';
import reducer, {
  setAccessToken,
  logout,
  loginThunk,
  fetchCurrentUser,
  refreshTokenThunk,
  logoutThunk,
} from './authSlice';
import api from '../api/api';

jest.mock('../api/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

const createStore = (preloadedState) =>
  configureStore({
    reducer: { auth: reducer },
    preloadedState,
  });

describe('authSlice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('sets access token via reducer action', () => {
    const store = createStore();

    store.dispatch(setAccessToken('token-123'));

    expect(store.getState().auth.accessToken).toBe('token-123');
  });

  it('clears user and token on logout reducer action', () => {
    const store = createStore({
      auth: {
        user: { id: 1, name: 'Test' },
        accessToken: 'token-xyz',
        status: 'idle',
        error: null,
      },
    });

    store.dispatch(logout());

    expect(store.getState().auth.user).toBeNull();
    expect(store.getState().auth.accessToken).toBeNull();
  });

  it('handles loginThunk fulfilled', async () => {
    const store = createStore();
    api.post.mockResolvedValue({
      data: {
        user: { UserName: 'Admin User' },
        token: 'token-abc',
      },
    });

    await store.dispatch(loginThunk({ email: 'admin@test.com', password: 'pw' }));

    expect(store.getState().auth.user).toEqual({ UserName: 'Admin User' });
    expect(store.getState().auth.accessToken).toBe('token-abc');
    expect(store.getState().auth.status).toBe('idle');
    expect(store.getState().auth.error).toBeNull();
  });

  it('handles loginThunk rejected with backend detail', async () => {
    const store = createStore();
    api.post.mockRejectedValue({
      response: { data: { detail: 'Invalid credentials' } },
    });

    await store.dispatch(loginThunk({ email: 'admin@test.com', password: 'bad' }));

    expect(store.getState().auth.error).toBe('Invalid credentials');
    expect(store.getState().auth.status).toBe('idle');
  });

  it('handles fetchCurrentUser fulfilled', async () => {
    const store = createStore();
    api.get.mockResolvedValue({
      data: {
        user: { UserName: 'Fetched User' },
        token: 'token-fetched',
      },
    });

    await store.dispatch(fetchCurrentUser());

    expect(store.getState().auth.user).toEqual({ UserName: 'Fetched User' });
    expect(store.getState().auth.accessToken).toBe('token-fetched');
    expect(store.getState().auth.status).toBe('idle');
  });

  it('handles refreshTokenThunk fulfilled', async () => {
    const store = createStore();
    api.post.mockResolvedValue({ data: { token: 'token-refresh' } });

    await store.dispatch(refreshTokenThunk());

    expect(store.getState().auth.accessToken).toBe('token-refresh');
    expect(store.getState().auth.status).toBe('idle');
  });

  it('handles logoutThunk and clears auth state', async () => {
    const store = createStore({
      auth: {
        user: { UserName: 'Before Logout' },
        accessToken: 'token-before',
        status: 'idle',
        error: null,
      },
    });

    api.post.mockResolvedValue({});

    await store.dispatch(logoutThunk());

    expect(store.getState().auth.user).toBeNull();
    expect(store.getState().auth.accessToken).toBeNull();
    expect(store.getState().auth.status).toBe('idle');
  });
});
