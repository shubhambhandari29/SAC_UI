describe('reportWebVitals', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('invokes all web-vitals collectors for function callbacks', async () => {
    const getCLS = jest.fn();
    const getFID = jest.fn();
    const getFCP = jest.fn();
    const getLCP = jest.fn();
    const getTTFB = jest.fn();

    const reportWebVitals = require('./reportWebVitals').default;
    const callback = reportWebVitals;
    const loadMetrics = () =>
      Promise.resolve({
        getCLS,
        getFID,
        getFCP,
        getLCP,
        getTTFB,
      });

    reportWebVitals(callback, loadMetrics);
    await Promise.resolve();

    expect(getCLS).toHaveBeenCalledWith(callback);
    expect(getFID).toHaveBeenCalledWith(callback);
    expect(getFCP).toHaveBeenCalledWith(callback);
    expect(getLCP).toHaveBeenCalledWith(callback);
    expect(getTTFB).toHaveBeenCalledWith(callback);
  });

  it('ignores non-function callback', () => {
    const reportWebVitals = require('./reportWebVitals').default;

    expect(() => reportWebVitals(undefined)).not.toThrow();
  });
});
