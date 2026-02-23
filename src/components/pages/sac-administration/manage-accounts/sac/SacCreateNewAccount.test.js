import { createRef } from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SacCreateNewAccount from './SacCreateNewAccount';
import api from '../../../../../api/api';
import Swal from 'sweetalert2';
import useDropdownData from '../../../../../hooks/useDropdownData';
import { useSelector } from 'react-redux';

const mockNavigate = jest.fn();
let mockLocation = {
  pathname: '/sac-view-account/CustomerNum=1234567890',
  state: { from: '/pending-items' },
};
let mockParams = { column_name: 'CustomerNum=1234567890' };

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation,
    useParams: () => mockParams,
  };
});

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

jest.mock('../../../../../api/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

jest.mock('../../../../../hooks/useDropdownData', () => jest.fn());

jest.mock('../../../../ui/Loader', () => () => <div data-testid="loader" />);

jest.mock('../../../../ui/TabPanel', () => ({ children, value, index }) =>
  value === index ? <div>{children}</div> : null,
);

jest.mock('../../../../ui/Modal', () => ({ open, children }) =>
  open ? <div data-testid="modal">{children}</div> : null,
);

jest.mock('./AccountService', () => () => <div>Account Service Content</div>);
jest.mock('./NcmTab', () => () => <div>NCM Content</div>);
jest.mock('../LossRunScheduling', () => () => <div>Loss Run Scheduling Content</div>);
jest.mock('../Notes', () => ({ label }) => <div>{label}</div>);
jest.mock('./DeductibleBill', () => () => <div>Deductible Bill Content</div>);
jest.mock('../ClaimReviewScheduling', () => () => <div>Claim Review Scheduling Content</div>);
jest.mock('../Shi', () => () => <div>SHI Content</div>);
jest.mock('../view-policies/ViewPolicies', () => () => (
  <div>ViewPoliciesModalContent</div>
));
jest.mock('../ViewAffiliates', () => () => <div>ViewAffiliatesModalContent</div>);
jest.mock('./ViewAssociatedAccounts', () => () => (
  <div>ViewAssociatedAccountsModalContent</div>
));

jest.mock('@mui/x-date-pickers/LocalizationProvider', () => ({
  LocalizationProvider: ({ children }) => <>{children}</>,
}));

jest.mock('@mui/x-date-pickers/DatePicker', () => ({
  DatePicker: ({ label }) => <div>{label}</div>,
}));

jest.mock('sweetalert2', () => ({
  __esModule: true,
  default: {
    fire: jest.fn(),
    DismissReason: { cancel: 'cancel' },
  },
}));

const sacMainResponse = {
  status: 200,
  data: [
    {
      CustomerNum: '1234567890',
      CustomerName: 'Acme Inc',
      AcctStatus: 'Active',
      RelatedEnt: 'No',
      DateCreated: '2025-01-01',
      DateNotif: null,
      OnBoardDate: '2025-01-10',
      TermDate: null,
      EffectiveDate: null,
      DiscDate: null,
      RenewLetterDt: null,
      NCMStartDt: null,
      NCMEndDt: null,
      BranchName: 'NY',
    },
  ],
};

describe('SacCreateNewAccount', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockLocation = {
      pathname: '/sac-view-account/CustomerNum=1234567890',
      state: { from: '/pending-items' },
    };
    mockParams = { column_name: 'CustomerNum=1234567890' };

    useSelector.mockImplementation((selector) =>
      selector({ auth: { user: { role: 'Admin' } } }),
    );

    useDropdownData.mockReturnValue({ data: [], loading: false });

    api.get.mockImplementation((url) => {
      if (url === '/sac_account/') return Promise.resolve(sacMainResponse);
      if (url === '/loss_run_frequency/')
        return Promise.resolve({ status: 200, data: [] });
      if (url === '/deduct_bill_frequency/')
        return Promise.resolve({ status: 200, data: [] });
      if (url === '/claim_review_frequency/')
        return Promise.resolve({ status: 200, data: [] });
      return Promise.resolve({ status: 200, data: [] });
    });

    Swal.fire.mockResolvedValue({ isConfirmed: true });
  });

  it('fetches account and related schedule data when route param exists', async () => {
    render(<SacCreateNewAccount />);

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/sac_account/', {
        params: { CustomerNum: '1234567890' },
      });
    });

    expect(api.get).toHaveBeenCalledWith('/loss_run_frequency/', {
      params: { CustomerNum: '1234567890' },
    });

    expect(api.get).toHaveBeenCalledWith('/deduct_bill_frequency/', {
      params: { CustomerNum: '1234567890' },
    });

    expect(api.get).toHaveBeenCalledWith('/claim_review_frequency/', {
      params: { CustomerNum: '1234567890' },
    });
  });

  it('opens the policies modal automatically when arriving from policy context', async () => {
    mockLocation = {
      pathname: '/sac-view-account/CustomerNum=1234567890',
      state: { from: '/view-policy/PK_Number=33' },
    };

    render(<SacCreateNewAccount />);

    await waitFor(() => {
      expect(screen.getByText('ViewPoliciesModalContent')).toBeInTheDocument();
    });
  });

  it('opens affiliates modal when View Affiliates is clicked', async () => {
    render(<SacCreateNewAccount />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'View Affiliates' })).toBeInTheDocument();
    });
    await userEvent.click(screen.getByRole('button', { name: 'View Affiliates' }));

    expect(screen.getByText('ViewAffiliatesModalContent')).toBeInTheDocument();
  });

  it('navigates back to pending items when back confirmation is accepted', async () => {
    mockLocation = { pathname: '/sac-create-new-account', state: undefined };
    mockParams = {};

    render(<SacCreateNewAccount />);

    await userEvent.click(screen.getByRole('button', { name: 'Back' }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/pending-items', {
        replace: true,
      });
    });
  });

  it('submits save via imperative handle in stepper mode', async () => {
    const ref = createRef();
    api.post.mockResolvedValue({ status: 200 });

    render(<SacCreateNewAccount ref={ref} isStepper />);

    await waitFor(() => {
      expect(ref.current).toBeTruthy();
    });

    let result;
    await act(async () => {
      result = await ref.current.submit('save');
    });

    expect(api.post).toHaveBeenCalledWith(
      '/sac_account/upsert',
      expect.objectContaining({
        CustomerNum: '1234567890',
        Stage: 'Admin',
      }),
    );
    expect(result).toEqual(
      expect.objectContaining({
        CustomerNum: '1234567890',
      }),
    );
  });

  it('submits to production and navigates to pending items', async () => {
    const ref = createRef();
    api.post.mockResolvedValue({ status: 200 });

    render(<SacCreateNewAccount ref={ref} />);

    await waitFor(() => {
      expect(ref.current).toBeTruthy();
    });

    await act(async () => {
      await ref.current.submit('submit');
    });

    expect(mockNavigate).toHaveBeenCalledWith('/pending-items', {
      replace: true,
    });
  });

  it('blocks duplicate customer number for underwriter create-new flow', async () => {
    const ref = createRef();
    mockLocation = { pathname: '/sac-create-new-account', state: undefined };
    mockParams = { column_name: 'CustomerNum=1234567890' };
    useSelector.mockImplementation((selector) =>
      selector({ auth: { user: { role: 'Underwriter' } } }),
    );

    api.get.mockImplementation((url, config) => {
      if (url === '/sac_account/') {
        if (config?.params?.CustomerNum === '1111111111') {
          return Promise.resolve({
            status: 200,
            data: [{ CustomerNum: '1111111111' }],
          });
        }
        return Promise.resolve({
          ...sacMainResponse,
        });
      }
      return Promise.resolve({ status: 200, data: [] });
    });

    render(<SacCreateNewAccount ref={ref} />);

    await waitFor(() => {
      expect(ref.current).toBeTruthy();
    });
    await waitFor(() => {
      expect(screen.getByDisplayValue('Acme Inc')).toBeInTheDocument();
    });

    const accountNameInput = screen.getByLabelText(/Special Account Name/i);
    const custNumberInput = screen.getByLabelText(/Cust #/i);
    await userEvent.clear(accountNameInput);
    await userEvent.type(accountNameInput, 'Duplicate Account');
    await userEvent.clear(custNumberInput);
    await userEvent.type(custNumberInput, '1111111111');

    await act(async () => {
      await ref.current.submit('save');
    });

    expect(api.get).toHaveBeenCalledWith('/sac_account/', {
      params: { CustomerNum: '1111111111' },
    });
    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Data Validation Error',
        text: 'This Customer Number already exists, duplicate records are not permitted',
      }),
    );
    expect(api.post).not.toHaveBeenCalled();
  });
});
