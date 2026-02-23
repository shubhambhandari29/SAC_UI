import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CctViewAffinityProgram from './CctViewAffinityProgram';
import api from '../../../api/api';
import Swal from 'sweetalert2';

const mockNavigate = jest.fn();
let mockParams = { column_name: 'ProgramName=Affinity-X' };
let mockLocation = { pathname: '/view-cct-accounts-affinity/ProgramName=Affinity-X', state: undefined };

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => mockParams,
  useLocation: () => mockLocation,
}));

jest.mock('../../../api/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

jest.mock('../../ui/Loader', () => () => <div data-testid="loader" />);

jest.mock('../../ui/Modal', () => ({ open, children }) =>
  open ? <div data-testid="modal">{children}</div> : null,
);

jest.mock('../sac-administration/manage-accounts/view-policy-types/ViewPolicyTypes', () => () => (
  <div>ViewPolicyTypesEmbedded</div>
));

jest.mock('./custom-components/BlueTextField', () => ({ label, value = '' }) => (
  <input aria-label={label} value={value || ''} readOnly />
));

jest.mock('sweetalert2', () => ({
  __esModule: true,
  default: {
    fire: jest.fn(),
  },
}));

describe('CctViewAffinityProgram', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockParams = { column_name: 'ProgramName=Affinity-X' };
    mockLocation = {
      pathname: '/view-cct-accounts-affinity/ProgramName=Affinity-X',
      state: undefined,
    };

    api.get.mockImplementation((url) => {
      if (url === '/affinity_program/') {
        return Promise.resolve({
          data: [
            {
              ProgramName: 'Affinity-X',
              AcctStatus: 'Active',
              TermDate: '2025-12-31',
            },
          ],
        });
      }
      if (url === '/affinity_agents/') {
        return Promise.resolve({
          data: [
            {
              PrimaryAgt: 'Yes',
              AgentName: 'Primary Agent',
              AgentCode: 'A1',
            },
            {
              PrimaryAgt: 'No',
              AgentCode: 'A2',
            },
          ],
        });
      }
      return Promise.resolve({ data: [] });
    });
  });

  it('fetches program and agent data', async () => {
    render(<CctViewAffinityProgram />);

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/affinity_program/', {
        params: { ProgramName: 'Affinity-X' },
      });
    });

    expect(api.get).toHaveBeenCalledWith('/affinity_agents/', {
      params: { ProgramName: 'Affinity-X' },
    });
  });

  it('opens policy types modal from from-state and view button', async () => {
    mockLocation = {
      pathname: '/view-cct-accounts-affinity/ProgramName=Affinity-X',
      state: { from: '/cct-view-policy-types/PK_Number=7' },
    };

    render(<CctViewAffinityProgram />);

    await waitFor(() => {
      expect(screen.getByText('ViewPolicyTypesEmbedded')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: 'View Policies' }));
    expect(screen.getByText('ViewPolicyTypesEmbedded')).toBeInTheDocument();
  });

  it('navigates back to affinity list', async () => {
    render(<CctViewAffinityProgram />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: 'Back' }));

    expect(mockNavigate).toHaveBeenCalledWith('/view-cct-accounts/affinity=true', {
      replace: true,
    });
  });

  it('shows error alert when fetch fails', async () => {
    api.get.mockRejectedValue(new Error('request failed'));

    render(<CctViewAffinityProgram />);

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Error', icon: 'error' }),
      );
    });
  });
});
