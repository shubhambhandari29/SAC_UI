const reportWebVitals = (
  onPerfEntry,
  loadMetrics = () => import('web-vitals'),
) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    loadMetrics().then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;
