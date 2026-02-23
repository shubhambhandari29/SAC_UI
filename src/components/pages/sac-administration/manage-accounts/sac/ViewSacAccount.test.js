import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ViewSacAccount from './ViewSacAccount';
import api from '../../../../../api/api';
import Swal from 'sweetalert2';

const mockNavigate = jest.fn();
let mockLocation = { pathname: '/sac-view-account', state: undefined };

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation,
  };
});

jest.mock('../../../../../api/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

jest.mock('../../../../ui/Loader', () => () => <div data-testid="loader" />);

jest.mock('sweetalert2', () => ({
  __esModule: true,
  default: {
    fire: jest.fn(),
    DismissReason: { cancel: 'cancel' },
  },
}));

describe('ViewSacAccount', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocation = { pathname: '/sac-view-account', state: undefined };
    api.get.mockResolvedValue({
      status: 200,
      data: [
        {
          'Customer Name': 'Acme Inc',
          'Customer Number': '1234567890',
          'Account Status': 'Active',
        },
      ],
    });
  });

  it('loads SAC accounts on mount with default search field', async () => {
    render(<ViewSacAccount />);

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/search_sac_account/', {
        params: { search_by: 'AccountName' },
      });
    });
  });

  it('navigates to affinity view when affinity is set to Yes', async () => {
    render(<ViewSacAccount />);

    await userEvent.click(screen.getByLabelText('Yes'));

    expect(mockNavigate).toHaveBeenCalledWith('/affinity-view-program', {
      replace: true,
    });
  });

  it('shows an error alert when account search fails', async () => {
    api.get.mockRejectedValue(new Error('request failed'));

    render(<ViewSacAccount />);

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Error',
          icon: 'error',
        }),
      );
    });
  });

  it('calls API with CustomerNum when Customer Number search is selected', async () => {
    render(<ViewSacAccount />);

    await userEvent.click(screen.getAllByRole('combobox')[0]);
    await userEvent.click(screen.getByRole('option', { name: 'Customer Number' }));

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/search_sac_account/', {
        params: { search_by: 'CustomerNum' },
      });
    });
  });

  it('calls API with ProducerCode when Producer Code search is selected', async () => {
    render(<ViewSacAccount />);

    await userEvent.click(screen.getAllByRole('combobox')[0]);
    await userEvent.click(screen.getByRole('option', { name: 'Producer Code' }));

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/search_sac_account/', {
        params: { search_by: 'ProducerCode' },
      });
    });
  });

  it('navigates to CCT affinity view when affinity is set to Yes on CCT route', async () => {
    mockLocation = { pathname: '/view-cct-accounts/affinity=false', state: undefined };

    render(<ViewSacAccount />);

    await userEvent.click(screen.getByLabelText('Yes'));

    expect(mockNavigate).toHaveBeenCalledWith('/view-cct-accounts/affinity=true', {
      replace: true,
    });
  });

  it('opens selected account on option click for non-CCT route', async () => {
    api.get.mockResolvedValue({
      status: 200,
      data: [
        {
          'Customer Name': 'Acme Inc',
          'Customer Number': '1234567890',
          'Account Status': 'Active',
          'Service Level': '01Gold',
        },
      ],
    });

    render(<ViewSacAccount />);

    const searchInput = screen.getByLabelText('Use this list to select your account');
    await userEvent.type(searchInput, 'Acme');

    expect(await screen.findByText('Gold')).toBeInTheDocument();
    await userEvent.click(screen.getByText('Acme Inc'));

    expect(mockNavigate).toHaveBeenCalledWith('/sac-view-account/CustomerNum=1234567890', {
      state: { from: '/sac-view-account' },
      replace: true,
    });
  });

  it('opens highlighted account on Enter key', async () => {
    api.get.mockResolvedValue({
      status: 200,
      data: [
        {
          'Customer Name': 'Beta Industries',
          'Customer Number': '5550001234',
          'Account Status': 'Active',
        },
      ],
    });

    render(<ViewSacAccount />);

    const searchInput = screen.getByLabelText('Use this list to select your account');
    await userEvent.type(searchInput, 'Beta');
    await screen.findByText('Beta Industries');
    fireEvent.keyDown(searchInput, { key: 'ArrowDown' });
    fireEvent.keyDown(searchInput, { key: 'Enter' });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/sac-view-account/CustomerNum=5550001234', {
        state: { from: '/sac-view-account' },
        replace: true,
      });
    });
  });

  it('opens selected account on CCT route', async () => {
    mockLocation = { pathname: '/view-cct-accounts/affinity=false', state: undefined };
    api.get.mockResolvedValue({
      status: 200,
      data: [
        {
          'Customer Name': 'CCT Account',
          'Customer Number': '9000000001',
          'Account Status': 'Active',
        },
      ],
    });

    render(<ViewSacAccount />);

    const searchInput = screen.getByLabelText('Use this list to select your account');
    await userEvent.type(searchInput, 'CCT');
    await userEvent.click(await screen.findByText('CCT Account'));

    expect(mockNavigate).toHaveBeenCalledWith('/view-cct-accounts-sac/CustomerNum=9000000001', {
      state: { from: '/view-cct-accounts/affinity=false' },
      replace: true,
    });
  });
});
