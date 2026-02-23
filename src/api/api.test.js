const mockCreate = jest.fn((config) => ({ defaults: config }));

jest.mock('axios', () => ({
  __esModule: true,
  default: {
    create: (...args) => mockCreate(...args),
  },
}));

describe('api module', () => {
  const originalBaseUrl = process.env.REACT_APP_API_BASE_URL;

  afterEach(() => {
    process.env.REACT_APP_API_BASE_URL = originalBaseUrl;
    jest.resetModules();
    mockCreate.mockClear();
  });

  it('uses REACT_APP_API_BASE_URL when provided', () => {
    process.env.REACT_APP_API_BASE_URL = 'https://example.test/api';

    jest.isolateModules(() => {
      const apiModule = require('./api');

      expect(apiModule.API_BASE_URL).toBe('https://example.test/api');
      expect(mockCreate).toHaveBeenCalledWith({
        baseURL: 'https://example.test/api',
        withCredentials: true,
      });
    });
  });

  it('falls back to default API URL when env variable is missing', () => {
    delete process.env.REACT_APP_API_BASE_URL;

    jest.isolateModules(() => {
      const apiModule = require('./api');

      expect(apiModule.API_BASE_URL).toBeUndefined();
      expect(mockCreate).toHaveBeenCalledWith({
        baseURL: 'https://sacplatformapipreprd.azurewebsites.net',
        withCredentials: true,
      });
    });
  });
});
