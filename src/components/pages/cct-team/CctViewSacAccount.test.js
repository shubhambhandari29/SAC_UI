import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CctViewSacAccount from './CctViewSacAccount';
import api from '../../../api/api';
import Swal from 'sweetalert2';

const mockNavigate = jest.fn();
let mockParams = { column_name: 'CustomerNum=12345' };
let mockLocation = { pathname: '/view-cct-accounts-sac/CustomerNum=12345', state: undefined };

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

jest.mock('../sac-administration/manage-accounts/view-policies/ViewPolicies', () => () => (
  <div>ViewPoliciesEmbedded</div>
));

jest.mock('./custom-components/Heading1', () => ({ text }) => <div>{text}</div>);
jest.mock('./custom-components/Body1', () => ({ text }) => <div>{String(text || '')}</div>);
jest.mock('./custom-components/BorderedContainer', () => ({ title, children }) => (
  <section>
    <div>{title}</div>
    {children}
  </section>
));
jest.mock('./custom-components/Note', () => ({ text }) => <div>{text}</div>);
jest.mock('./custom-components/BlueTextField', () => ({ label, value = '' }) => (
  <input aria-label={label} value={value || ''} readOnly />
));

jest.mock('sweetalert2', () => ({
  __esModule: true,
  default: {
    fire: jest.fn(),
  },
}));

describe('CctViewSacAccount', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockParams = { column_name: 'CustomerNum=12345' };
    mockLocation = { pathname: '/view-cct-accounts-sac/CustomerNum=12345', state: undefined };

    api.get.mockResolvedValue({
      data: [
        {
          CustomerNum: '12345',
          CustomerName: 'Acme SAC',
          AcctStatus: 'Under Construction',
          HCM_LOC_ONLY: 'Yes',
        },
      ],
    });
  });

  it('fetches account data using column_name params', async () => {
    render(<CctViewSacAccount />);

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/sac_account/', {
        params: { CustomerNum: '12345' },
      });
    });

    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Customer Account Name:')).toBeInTheDocument();
  });

  it('opens policies modal when arriving from policy route', async () => {
    mockLocation = {
      pathname: '/view-cct-accounts-sac/CustomerNum=12345',
      state: { from: '/cct-view-policy/PK_Number=8' },
    };

    render(<CctViewSacAccount />);

    await waitFor(() => {
      expect(screen.getByText('ViewPoliciesEmbedded')).toBeInTheDocument();
    });
  });

  it('opens policies modal from button and navigates back', async () => {
    render(<CctViewSacAccount />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'View Policies' })).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: 'View Policies' }));
    expect(screen.getByText('ViewPoliciesEmbedded')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Back' }));
    expect(mockNavigate).toHaveBeenCalledWith('/view-cct-accounts/affinity=false', {
      replace: true,
    });
  });

  it('shows error alert when fetch fails', async () => {
    api.get.mockRejectedValue(new Error('fetch failed'));

    render(<CctViewSacAccount />);

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Error', icon: 'error' }),
      );
    });
  });
});
