import api from './api';

export default function setupInterceptors(store, logout, refreshTokenThunk) {
  // Attach access token from Redux state
  api.interceptors.request.use((config) => {
    const token = store.getState().auth.accessToken;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  // Auto-refresh on 401
  let refreshing = null;
  api.interceptors.response.use(
    (res) => res,
    async (error) => {
      const original = error.config;

      // if no response or already retried, just reject
      if (!error.response || original._retry) {
        return Promise.reject(error);
      }

      // Don't refresh if the failed request was login or refresh
      if (
        original.url.includes('/auth/login') ||
        original.url.includes('/auth/refresh')
      ) {
        return Promise.reject(error);
      }

      if (error.response.status === 401) {
        original._retry = true;

        if (!refreshing) {
          refreshing = store.dispatch(refreshTokenThunk()).finally(() => {
            refreshing = null;
          });
        }

        try {
          const newToken = await refreshing;
          if (newToken) {
            original.headers.Authorization = `Bearer ${newToken}`;
            return api(original);
          }
        } catch (err) {
          store.dispatch(logout());
        }
      }

      return Promise.reject(error);
    }
  );
}
