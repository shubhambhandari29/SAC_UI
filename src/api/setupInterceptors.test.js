jest.mock('./api', () => {
  const apiFn = jest.fn();
  apiFn.interceptors = {
    request: { use: jest.fn() },
    response: { use: jest.fn() },
  };
  return {
    __esModule: true,
    default: apiFn,
  };
});

import setupInterceptors from './setupInterceptors';
import api from './api';

describe('setupInterceptors', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('attaches bearer token in request interceptor when token exists', () => {
    const store = {
      getState: () => ({ auth: { accessToken: 'token-123' } }),
      dispatch: jest.fn(),
    };

    setupInterceptors(store, jest.fn(), jest.fn());

    const requestHandler = api.interceptors.request.use.mock.calls[0][0];
    const result = requestHandler({ headers: {} });

    expect(result.headers.Authorization).toBe('Bearer token-123');
  });

  it('rejects immediately when response is missing', async () => {
    const store = {
      getState: () => ({ auth: { accessToken: null } }),
      dispatch: jest.fn(),
    };

    setupInterceptors(store, jest.fn(), jest.fn());

    const responseErrorHandler = api.interceptors.response.use.mock.calls[0][1];
    const error = { config: { url: '/secure', headers: {} } };

    await expect(responseErrorHandler(error)).rejects.toBe(error);
  });

  it('does not refresh for login/refresh endpoints', async () => {
    const store = {
      getState: () => ({ auth: { accessToken: null } }),
      dispatch: jest.fn(),
    };

    setupInterceptors(store, jest.fn(), jest.fn());

    const responseErrorHandler = api.interceptors.response.use.mock.calls[0][1];
    const loginError = {
      config: { url: '/auth/login', headers: {}, _retry: false },
      response: { status: 401 },
    };

    await expect(responseErrorHandler(loginError)).rejects.toBe(loginError);
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('refreshes token and retries original request on 401', async () => {
    const mockLogout = jest.fn(() => ({ type: 'auth/logout' }));
    const mockRefreshThunk = jest.fn(() => ({ type: 'auth/refresh' }));

    const store = {
      getState: () => ({ auth: { accessToken: 'old-token' } }),
      dispatch: jest.fn().mockResolvedValue('new-token'),
    };

    api.mockResolvedValue({ status: 200, data: { ok: true } });

    setupInterceptors(store, mockLogout, mockRefreshThunk);

    const responseErrorHandler = api.interceptors.response.use.mock.calls[0][1];
    const error = {
      config: { url: '/secure-endpoint', headers: {}, _retry: false },
      response: { status: 401 },
    };

    const result = await responseErrorHandler(error);

    expect(mockRefreshThunk).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledWith({ type: 'auth/refresh' });
    expect(error.config.headers.Authorization).toBe('Bearer new-token');
    expect(api).toHaveBeenCalledWith(error.config);
    expect(result).toEqual({ status: 200, data: { ok: true } });
  });

  it('dispatches logout when token refresh fails', async () => {
    const mockLogout = jest.fn(() => ({ type: 'auth/logout' }));
    const mockRefreshThunk = jest.fn(() => ({ type: 'auth/refresh' }));

    const store = {
      getState: () => ({ auth: { accessToken: 'old-token' } }),
      dispatch: jest
        .fn()
        .mockImplementationOnce(() => Promise.reject(new Error('refresh failed')))
        .mockImplementationOnce(() => Promise.resolve()),
    };

    setupInterceptors(store, mockLogout, mockRefreshThunk);

    const responseErrorHandler = api.interceptors.response.use.mock.calls[0][1];
    const error = {
      config: { url: '/secure-endpoint', headers: {}, _retry: false },
      response: { status: 401 },
    };

    await expect(responseErrorHandler(error)).rejects.toBe(error);

    expect(mockLogout).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledWith({ type: 'auth/logout' });
  });
});
