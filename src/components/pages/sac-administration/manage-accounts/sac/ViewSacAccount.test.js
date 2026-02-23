import { render, screen, waitFor } from '@testing-library/react';
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
});
