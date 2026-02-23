import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ViewAffinityProgram from './ViewAffiniftyProgram';
import api from '../../../../../api/api';
import Swal from 'sweetalert2';

const mockNavigate = jest.fn();
let mockLocation = { pathname: '/affinity-view-program', state: undefined };

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

describe('ViewAffinityProgram', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocation = { pathname: '/affinity-view-program', state: undefined };
    api.get.mockResolvedValue({ status: 200, data: [] });
  });

  it('calls search API when Search By is selected', async () => {
    render(<ViewAffinityProgram />);

    await userEvent.click(screen.getAllByRole('combobox')[0]);
    await userEvent.click(screen.getByRole('option', { name: 'Program Name' }));

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/search_affinity_program/', {
        params: { search_by: 'ProgramName' },
      });
    });
  });

  it('navigates to SAC view when affinity is set to No', async () => {
    render(<ViewAffinityProgram />);

    await userEvent.click(screen.getByLabelText('No'));

    expect(mockNavigate).toHaveBeenCalledWith('/sac-view-account', {
      replace: true,
    });
  });

  it('shows an error alert when search API fails', async () => {
    api.get.mockRejectedValue(new Error('request failed'));

    render(<ViewAffinityProgram />);

    await userEvent.click(screen.getAllByRole('combobox')[0]);
    await userEvent.click(screen.getByRole('option', { name: 'Program Name' }));

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
