import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CctViewPolicyType from './CctViewPolicyType';
import api from '../../../api/api';
import Swal from 'sweetalert2';

const mockNavigate = jest.fn();
let mockParams = { column_name: 'PK_Number=99' };
let mockLocation = { pathname: '/cct-view-policy-types/PK_Number=99', state: undefined };
let mockSearchParams = new URLSearchParams('ProgramName=Affinity-X');

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => mockParams,
  useLocation: () => mockLocation,
  useSearchParams: () => [mockSearchParams],
}));

jest.mock('../../../api/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

jest.mock('../../ui/Loader', () => () => <div data-testid="loader" />);

jest.mock('./custom-components/BlueHeaderContainer', () => ({ title, children }) => (
  <section>
    <h2>{title}</h2>
    {children}
  </section>
));
jest.mock('./custom-components/UnderlinedHeading', () => ({ text }) => <div>{text}</div>);
jest.mock('./custom-components/Body2', () => ({ text }) => <div>{String(text || '')}</div>);
jest.mock('./custom-components/BlueTextField', () => ({ label, value = '' }) => (
  <input aria-label={label || 'blue-text-field'} value={value || ''} readOnly />
));
jest.mock('./custom-components/Note', () => ({ text }) => <div>{text}</div>);
jest.mock('./custom-components/ContactInfo', () => ({ data }) => (
  <div>{Object.values(data || {}).filter(Boolean).join(' | ')}</div>
));

jest.mock('../../ui/Modal', () => ({ open, children }) =>
  open ? <div data-testid="modal">{children}</div> : null,
);

jest.mock('../print-pages/RptInstructionsAffinViewer', () => () => (
  <div>RptInstructionsAffinViewer</div>
));

jest.mock('sweetalert2', () => ({
  __esModule: true,
  default: {
    fire: jest.fn(),
  },
}));

describe('CctViewPolicyType', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockParams = { column_name: 'PK_Number=99' };
    mockSearchParams = new URLSearchParams('ProgramName=Affinity-X');
    mockLocation = { pathname: '/cct-view-policy-types/PK_Number=99', state: undefined };

    api.get.mockImplementation((url) => {
      if (url === '/affinity_policy_types/') {
        return Promise.resolve({
          data: [
            {
              ProgramName: 'Affinity-X',
              PolicyType: 'Commercial Auto',
              PolicyStatus: 'Active',
              PolicyBusinessType: 'Renewal',
              AcctProdClaims: 'Yes',
              AddLDocs: 'Yes',
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
              AgentCode: 'P1',
            },
            {
              PrimaryAgt: 'No',
              AgentCode: 'P2',
            },
          ],
        });
      }
      if (url === '/affinity_program/') {
        return Promise.resolve({ data: [{ ProgramName: 'Affinity-X' }] });
      }
      return Promise.resolve({ data: [] });
    });
  });

  it('fetches policy, agent, and affinity data from params', async () => {
    render(<CctViewPolicyType />);

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/affinity_policy_types/', {
        params: { PK_Number: '99' },
      });
    });

    expect(api.get).toHaveBeenCalledWith('/affinity_agents/', {
      params: { ProgramName: 'Affinity-X' },
    });
    expect(api.get).toHaveBeenCalledWith('/affinity_program/', {
      params: { ProgramName: 'Affinity-X' },
    });
  });

  it('opens and closes adjuster instructions modal through button', async () => {
    render(<CctViewPolicyType />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Print Adjuster Instructions' })).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: 'Print Adjuster Instructions' }));

    expect(screen.getByText('RptInstructionsAffinViewer')).toBeInTheDocument();
  });

  it('navigates via Return to Main Menu and Back buttons', async () => {
    mockLocation = {
      pathname: '/cct-view-policy-types/PK_Number=99',
      state: { from: '/view-cct-accounts-affinity/ProgramName=Affinity-X' },
    };

    render(<CctViewPolicyType />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Return to Main Menu' })).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: 'Return to Main Menu' }));
    expect(mockNavigate).toHaveBeenCalledWith('/pending-items', { replace: true });

    await userEvent.click(screen.getByRole('button', { name: 'Back' }));
    expect(mockNavigate).toHaveBeenCalledWith('/view-cct-accounts-affinity/ProgramName=Affinity-X', {
      state: { from: '/cct-view-policy-types/PK_Number=99' },
      replace: true,
    });
  });

  it('shows error alert when fetch fails', async () => {
    api.get.mockRejectedValue(new Error('fetch failed'));

    render(<CctViewPolicyType />);

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Error', icon: 'error' }),
      );
    });
  });
});
