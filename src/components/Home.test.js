import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from './Home';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { logoutThunk } from '../redux/authSlice';

const mockDispatch = jest.fn();
const mockNavigate = jest.fn();

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
  Outlet: () => <div>outlet-content</div>,
}));

jest.mock('./RecursiveNavigationList', () => () => (
  <div data-testid="recursive-nav">recursive-nav</div>
));

jest.mock('../navigation-tree', () => [
  { id: '1', name: 'Node', type: 'file', visibility: ['Admin'], url: '/pending-items' },
]);

jest.mock('../redux/authSlice', () => ({
  logoutThunk: jest.fn(() => ({ type: 'auth/logoutThunk' })),
}));

describe('Home', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useDispatch.mockReturnValue(mockDispatch);
    useNavigate.mockReturnValue(mockNavigate);
    useSelector.mockImplementation((selector) =>
      selector({ auth: { user: { role: 'Admin' } } }),
    );
    useLocation.mockReturnValue({ pathname: '/pending-items' });
    mockDispatch.mockResolvedValue({ meta: { requestStatus: 'fulfilled' } });
  });

  it('renders computed page header and logged in role', () => {
    render(<Home />);

    expect(screen.getByText('Pending Items')).toBeInTheDocument();
    expect(screen.getByText('Logged in as: Admin')).toBeInTheDocument();
    expect(screen.getAllByTestId('recursive-nav').length).toBeGreaterThan(0);
    expect(screen.getByText('outlet-content')).toBeInTheDocument();
  });

  it('uses CCT header mapping for cct routes', () => {
    useLocation.mockReturnValue({ pathname: '/cct-view-policy/PK_Number=100' });

    render(<Home />);

    expect(screen.getByText('Special Account Policy')).toBeInTheDocument();
  });

  it('dispatches logout thunk and navigates to login when fulfilled', async () => {
    render(<Home />);

    await userEvent.click(screen.getAllByText('Logout')[0]);

    await waitFor(() => {
      expect(logoutThunk).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true });
    });
  });

  it('does not navigate when logout thunk is not fulfilled', async () => {
    mockDispatch.mockResolvedValue({ meta: { requestStatus: 'rejected' } });

    render(<Home />);

    await userEvent.click(screen.getAllByText('Logout')[0]);

    await waitFor(() => {
      expect(logoutThunk).toHaveBeenCalled();
    });
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
