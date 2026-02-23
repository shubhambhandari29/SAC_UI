import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from './Login';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginThunk } from '../redux/authSlice';

const mockDispatch = jest.fn();
const mockNavigate = jest.fn();

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

jest.mock('../redux/authSlice', () => ({
  loginThunk: jest.fn((payload) => ({ type: 'auth/login', payload })),
}));

jest.mock('./ui/Loader', () => ({ size }) => <div>loader:{size}</div>);

describe('Login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useDispatch.mockReturnValue(mockDispatch);
    useNavigate.mockReturnValue(mockNavigate);
    mockDispatch.mockResolvedValue({ meta: { requestStatus: 'fulfilled' } });
    useSelector.mockImplementation((selector) =>
      selector({ auth: { error: null, status: 'idle', user: null } }),
    );
  });

  it('shows page content when not loading', () => {
    render(<Login />);

    expect(screen.getByText('Sign in')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
  });

  it('renders loader while auth status is loading', () => {
    useSelector.mockImplementation((selector) =>
      selector({ auth: { error: null, status: 'loading', user: null } }),
    );

    render(<Login />);

    expect(screen.getByText('loader:40')).toBeInTheDocument();
  });

  it('navigates immediately when user already exists', async () => {
    useSelector.mockImplementation((selector) =>
      selector({ auth: { error: null, status: 'idle', user: { role: 'Admin' } } }),
    );

    render(<Login />);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/pending-items', {
        replace: true,
      });
    });
  });

  it('submits credentials and navigates on fulfilled login', async () => {
    render(<Login />);

    await userEvent.type(screen.getByLabelText('Email Address'), 'user@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'password123');
    await userEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => {
      expect(loginThunk).toHaveBeenCalledWith({
        email: 'user@example.com',
        password: 'password123',
      });
    });

    expect(mockDispatch).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/pending-items', {
      replace: true,
    });
  });

  it('shows validation messages for invalid inputs', async () => {
    render(<Login />);

    await userEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    expect(await screen.findByText('Email is required')).toBeInTheDocument();
    expect(await screen.findByText('Password is required')).toBeInTheDocument();
  });

  it('renders server error message when auth has error', () => {
    useSelector.mockImplementation((selector) =>
      selector({
        auth: {
          error: { error: 'Invalid credentials' },
          status: 'idle',
          user: null,
        },
      }),
    );

    render(<Login />);

    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
  });
});
