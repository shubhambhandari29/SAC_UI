import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CctViewPolicy from './CctViewPolicy';
import api from '../../../api/api';
import Swal from 'sweetalert2';

const mockNavigate = jest.fn();
let mockParams = { column_name: 'PK_Number=33' };
let mockLocation = { pathname: '/cct-view-policy/PK_Number=33', state: undefined };
let mockSearchParams = new URLSearchParams('CustomerNum=12345');

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
jest.mock('./custom-components/Note', () => ({ text }) => <div>{text}</div>);
jest.mock('./custom-components/BlueTextField', () => ({ label, value = '' }) => (
  <input aria-label={label || 'blue-text-field'} value={value || ''} readOnly />
));
jest.mock('./custom-components/ContactInfo', () => ({ data }) => (
  <div>{Object.values(data || {}).filter(Boolean).join(' | ')}</div>
));

jest.mock('../../ui/Modal', () => ({ open, children }) =>
  open ? <div data-testid="modal">{children}</div> : null,
);

jest.mock('../print-pages/RptInstructionsViewer', () => () => <div>RptInstructionsViewer</div>);
jest.mock('../print-pages/RptUnderConstructionShiCctViewer', () => () => (
  <div>RptUnderConstructionShiCctViewer</div>
));

jest.mock('sweetalert2', () => ({
  __esModule: true,
  default: {
    fire: jest.fn(),
  },
}));

describe('CctViewPolicy', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockParams = { column_name: 'PK_Number=33' };
    mockSearchParams = new URLSearchParams('CustomerNum=12345');
    mockLocation = { pathname: '/cct-view-policy/PK_Number=33', state: undefined };

    api.get.mockImplementation((url) => {
      if (url === '/sac_policies/') {
        return Promise.resolve({
          data: [
            {
              PK_Number: 33,
              PolicyNum: 'P-100',
              PolPref: 'ABC',
              CCTBusLine: 'Auto',
              RentedHired: '1',
              LocCoded: 'Yes',
              PolicyStatus: 'Pending Renewal',
              AddLDocs: 'Yes',
            },
          ],
        });
      }
      if (url === '/sac_account/') {
        return Promise.resolve({
          data: [
            {
              CustomerNum: '12345',
              BusinessType: 'Special Account',
              AcctStatus: 'Active',
            },
          ],
        });
      }
      return Promise.resolve({ data: [] });
    });
  });

  it('fetches policy and sac account data based on params', async () => {
    render(<CctViewPolicy />);

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/sac_policies/', {
        params: { PK_Number: '33' },
      });
    });

    expect(api.get).toHaveBeenCalledWith('/sac_account/', {
      params: { CustomerNum: '12345' },
    });
  });

  it('opens adjuster instructions modal when print button is clicked', async () => {
    render(<CctViewPolicy />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Print Adjuster Instructions' })).toBeInTheDocument();
    });

    const printButton = screen.getByRole('button', { name: 'Print Adjuster Instructions' });
    expect(printButton).toBeEnabled();

    await userEvent.click(printButton);

    expect(screen.getByText('RptInstructionsViewer')).toBeInTheDocument();
  });

  it('navigates to pending items and back target', async () => {
    mockLocation = {
      pathname: '/cct-view-policy/PK_Number=33',
      state: { from: '/view-cct-accounts-sac/CustomerNum=12345' },
    };

    render(<CctViewPolicy />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Return to Main Menu' })).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: 'Return to Main Menu' }));
    expect(mockNavigate).toHaveBeenCalledWith('/pending-items', { replace: true });

    await userEvent.click(screen.getByRole('button', { name: 'Back' }));
    expect(mockNavigate).toHaveBeenCalledWith('/view-cct-accounts-sac/CustomerNum=12345', {
      state: { from: '/cct-view-policy/PK_Number=33' },
      replace: true,
    });
  });

  it('shows error alert when fetch fails', async () => {
    api.get.mockRejectedValue(new Error('request failed'));

    render(<CctViewPolicy />);

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Error', icon: 'error' }),
      );
    });
  });

  it('disables print button when account type does not support instructions', async () => {
    api.get.mockImplementation((url) => {
      if (url === '/sac_policies/') {
        return Promise.resolve({ data: [{ PK_Number: 33 }] });
      }
      if (url === '/sac_account/') {
        return Promise.resolve({
          data: [{ CustomerNum: '12345', BusinessType: 'Other', AcctStatus: 'Active' }],
        });
      }
      return Promise.resolve({ data: [] });
    });

    render(<CctViewPolicy />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Print Adjuster Instructions' })).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: 'Print Adjuster Instructions' })).toBeDisabled();
  });
});
