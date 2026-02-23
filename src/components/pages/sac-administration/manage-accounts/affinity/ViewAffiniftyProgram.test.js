import { fireEvent, render, screen, waitFor } from '@testing-library/react';
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

  it('does not call search API until a search field is selected', () => {
    render(<ViewAffinityProgram />);

    expect(api.get).not.toHaveBeenCalled();
  });

  it('calls search API using ProducerCode when Producer Code is selected', async () => {
    render(<ViewAffinityProgram />);

    await userEvent.click(screen.getAllByRole('combobox')[0]);
    await userEvent.click(screen.getByRole('option', { name: 'Producer Code' }));

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/search_affinity_program/', {
        params: { search_by: 'ProducerCode' },
      });
    });
  });

  it('navigates to CCT SAC list when affinity is set to No on CCT route', async () => {
    mockLocation = { pathname: '/view-cct-accounts/affinity=true', state: undefined };

    render(<ViewAffinityProgram />);

    await userEvent.click(screen.getByLabelText('No'));

    expect(mockNavigate).toHaveBeenCalledWith('/view-cct-accounts/affinity=false', {
      replace: true,
    });
  });

  it('opens selected option on click for non-CCT route', async () => {
    api.get.mockResolvedValue({
      status: 200,
      data: [
        {
          'Program Name': 'Alpha Program',
          'Producer Code': 'P-123',
          'Service Level': '01Gold',
        },
      ],
    });

    render(<ViewAffinityProgram />);

    await userEvent.click(screen.getAllByRole('combobox')[0]);
    await userEvent.click(screen.getByRole('option', { name: 'Program Name' }));

    const searchInput = screen.getByLabelText('Use this list to select your account');
    await userEvent.type(searchInput, 'Alpha');

    expect(await screen.findByText('Gold')).toBeInTheDocument();
    await userEvent.click(screen.getByText('Alpha Program'));

    expect(mockNavigate).toHaveBeenCalledWith('/affinity-view-program/ProgramName=Alpha Program', {
      state: { from: '/affinity-view-program' },
      replace: true,
    });
  });

  it('opens selected option on Enter key', async () => {
    api.get.mockResolvedValue({
      status: 200,
      data: [
        {
          'Program Name': 'Beta Program',
          'Producer Code': 'P-456',
        },
      ],
    });

    render(<ViewAffinityProgram />);

    await userEvent.click(screen.getAllByRole('combobox')[0]);
    await userEvent.click(screen.getByRole('option', { name: 'Program Name' }));

    const searchInput = screen.getByLabelText('Use this list to select your account');
    await userEvent.type(searchInput, 'Beta');
    await screen.findByText('Beta Program');
    fireEvent.keyDown(searchInput, { key: 'ArrowDown' });
    fireEvent.keyDown(searchInput, { key: 'Enter' });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/affinity-view-program/ProgramName=Beta Program', {
        state: { from: '/affinity-view-program' },
        replace: true,
      });
    });
  });

  it('opens selected option to CCT account route when pathname includes cct', async () => {
    mockLocation = { pathname: '/view-cct-accounts/affinity=true', state: undefined };
    api.get.mockResolvedValue({
      status: 200,
      data: [
        {
          'Program Name': 'CCT Program',
          'Producer Code': 'P-789',
        },
      ],
    });

    render(<ViewAffinityProgram />);

    await userEvent.click(screen.getAllByRole('combobox')[0]);
    await userEvent.click(screen.getByRole('option', { name: 'Program Name' }));

    const searchInput = screen.getByLabelText('Use this list to select your account');
    await userEvent.type(searchInput, 'CCT');
    await userEvent.click(await screen.findByText('CCT Program'));

    expect(mockNavigate).toHaveBeenCalledWith('/view-cct-accounts-affinity/ProgramName=CCT Program', {
      state: { from: '/view-cct-accounts/affinity=true' },
      replace: true,
    });
  });
});
