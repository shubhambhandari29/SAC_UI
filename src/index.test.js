const mockRender = jest.fn();

jest.mock('react-dom/client', () => ({
  createRoot: jest.fn(() => ({ render: mockRender })),
}));

jest.mock('./App', () => ({
  __esModule: true,
  default: () => <div data-testid="app" />,
}));

jest.mock('./reportWebVitals', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }) => <>{children}</>,
}));

jest.mock('@mui/material', () => ({
  ThemeProvider: ({ children }) => <>{children}</>,
}));

jest.mock('react-redux', () => ({
  Provider: ({ children }) => <>{children}</>,
}));

jest.mock('./redux/store', () => ({
  __esModule: true,
  default: {
    getState: () => ({}),
    dispatch: () => {},
    subscribe: () => () => {},
  },
}));

describe('index entrypoint', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    document.body.innerHTML = '<div id="root"></div>';
  });

  it('creates root, renders app tree, and calls reportWebVitals', () => {
    const { createRoot } = require('react-dom/client');
    const reportWebVitals = require('./reportWebVitals').default;

    require('./index');

    expect(createRoot).toHaveBeenCalledWith(document.getElementById('root'));
    expect(mockRender).toHaveBeenCalledTimes(1);
    expect(reportWebVitals).toHaveBeenCalledTimes(1);
  });
});
