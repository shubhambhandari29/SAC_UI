import { render, screen } from '@testing-library/react';
import PrivateRoute from './PrivateRoute';
import { useSelector } from 'react-redux';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Navigate: ({ to }) => <div>navigate:{to}</div>,
  Outlet: () => <div>private-content</div>,
}));

jest.mock('./ui/Loader', () => ({ size }) => <div>loader:{size}</div>);

describe('PrivateRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loader when auth status is loading', () => {
    useSelector.mockImplementation((selector) =>
      selector({ auth: { user: null, status: 'loading' } }),
    );

    render(<PrivateRoute />);

    expect(screen.getByText('loader:40')).toBeInTheDocument();
  });

  it('renders outlet when user exists', () => {
    useSelector.mockImplementation((selector) =>
      selector({ auth: { user: { role: 'Admin' }, status: 'idle' } }),
    );

    render(<PrivateRoute />);

    expect(screen.getByText('private-content')).toBeInTheDocument();
  });

  it('redirects to login when user is missing', () => {
    useSelector.mockImplementation((selector) =>
      selector({ auth: { user: null, status: 'idle' } }),
    );

    render(<PrivateRoute />);

    expect(screen.getByText('navigate:/login')).toBeInTheDocument();
  });
});
