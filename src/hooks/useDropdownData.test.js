import { renderHook, waitFor } from '@testing-library/react';
import useDropdownData from './useDropdownData';
import api from '../api/api';

jest.mock('../api/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

describe('useDropdownData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches dropdown data and updates loading state', async () => {
    api.get.mockResolvedValue({ data: [{ DD_Value: 'A' }, { DD_Value: 'B' }] });

    const { result } = renderHook(() => useDropdownData('/dropdowns/test'));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(api.get).toHaveBeenCalledWith('/dropdowns/test');
    expect(result.current.data).toEqual([{ DD_Value: 'A' }, { DD_Value: 'B' }]);
  });

  it('handles API failure and returns empty data', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    api.get.mockRejectedValue(new Error('network failure'));

    const { result } = renderHook(() => useDropdownData('/dropdowns/fail'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(api.get).toHaveBeenCalledWith('/dropdowns/fail');
    expect(result.current.data).toEqual([]);
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('refetches when url changes', async () => {
    api.get
      .mockResolvedValueOnce({ data: [{ DD_Value: 'First' }] })
      .mockResolvedValueOnce({ data: [{ DD_Value: 'Second' }] });

    const { result, rerender } = renderHook(({ url }) => useDropdownData(url), {
      initialProps: { url: '/dropdowns/one' },
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual([{ DD_Value: 'First' }]);

    rerender({ url: '/dropdowns/two' });

    await waitFor(() => {
      expect(result.current.data).toEqual([{ DD_Value: 'Second' }]);
    });
  });
});
