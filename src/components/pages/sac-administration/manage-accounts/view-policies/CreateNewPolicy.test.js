import { createRef } from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateNewPolicy from './CreateNewPolicy';
import api from '../../../../../api/api';
import Swal from 'sweetalert2';
import useDropdownData from '../../../../../hooks/useDropdownData';
import { useSelector } from 'react-redux';

const mockNavigate = jest.fn();
let mockLocation = {
  pathname: '/create-new-policy',
  state: { from: '/sac-view-account/CustomerNum=1234567890' },
};
let mockParams = {};
let mockSearchParams = { size: 0, get: () => null };

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation,
    useParams: () => mockParams,
    useSearchParams: () => [mockSearchParams],
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

jest.mock('./Policy', () => () => <div>Policy Tab Content</div>);
jest.mock('./InsuredContacts', () => () => <div>Insured Contacts Tab Content</div>);
jest.mock('./ClaimHandling1', () => () => <div>Claim Handling 1 Content</div>);
jest.mock('./ClaimHandling2', () => () => <div>Claim Handling 2 Content</div>);
jest.mock('./ClaimHandling3', () => () => <div>Claim Handling 3 Content</div>);
jest.mock('./CctInstructionsOther', () => () => <div>CCT Other Content</div>);
jest.mock('./Agent', () => () => <div>Agent Tab Content</div>);
jest.mock('./CctInstructionsPolicy', () => () => <div>CCT Policy Content</div>);
jest.mock('./CctAssignment', () => () => <div>CCT Assignment Content</div>);
jest.mock('./Deductible', () => () => <div>Deductible Tab Content</div>);
jest.mock('../../../ShiPrint', () => () => <div>SHI Print Content</div>);

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

const policyResponse = {
  status: 200,
  data: [
    {
      PK_Number: 99,
      PolPref: 'ABC',
      PolicyNum: 'POL1001',
      PolMod: '01',
      AccountName: 'Acme LLC',
      CustomerNum: '1234567890',
      AcctOnPolicyName: 'Acme LLC',
      PolicyStatus: 'Active',
      LocList: 'N/A',
      LocCoded: 'Yes',
      InceptDate: '2025-01-01',
      LocCompDate: null,
      ExpDate: '2026-01-01',
      PolicyType: 'GL',
      PolicyBusinessType: 'New Business',
      DateCreated: '2025-01-01',
      DNRDate: null,
      RenewDiaryDT: null,
    },
  ],
};

describe('CreateNewPolicy', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockLocation = {
      pathname: '/create-new-policy',
      state: { from: '/sac-view-account/CustomerNum=1234567890' },
    };
    mockParams = {};
    mockSearchParams = { size: 0, get: () => null };

    useSelector.mockImplementation((selector) =>
      selector({ auth: { user: { role: 'Admin' } } }),
    );

    useDropdownData.mockReturnValue({ data: [], loading: false });

    api.get.mockImplementation((url) => {
      if (url === '/sac_policies/') return Promise.resolve(policyResponse);
      if (url === '/sac_account/')
        return Promise.resolve({
          status: 200,
          data: [{ Stage: 'Admin', IsSubmitted: 0 }],
        });
      return Promise.resolve({ status: 200, data: [] });
    });

    Swal.fire.mockResolvedValue({ isConfirmed: true });
  });

  it('prefills customer fields from query params in create mode', async () => {
    const params = new URLSearchParams(
      'CustomerNum=1234567890&CustomerName=Acme%20LLC',
    );
    mockSearchParams = { size: 2, get: (key) => params.get(key) };

    render(<CreateNewPolicy />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('Acme LLC')).toBeInTheDocument();
    });

    expect(screen.getByDisplayValue('1234567890')).toBeInTheDocument();
  });

  it('fetches policy and SAC account data when opening an existing policy', async () => {
    mockLocation = {
      pathname: '/view-policy/PK_Number=99',
      state: { from: '/sac-view-account/CustomerNum=1234567890' },
    };
    mockParams = { column_name: 'PK_Number=99' };
    mockSearchParams = { size: 0, get: () => null };

    render(<CreateNewPolicy />);

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/sac_policies/', {
        params: { PK_Number: '99' },
      });
    });

    expect(api.get).toHaveBeenCalledWith('/sac_account/', {
      params: { CustomerNum: '1234567890' },
    });
  });

  it('exposes stepper methods for create new policy and next mod', async () => {
    const ref = createRef();
    const onCreatePolicy = jest.fn();
    const onModStart = jest.fn();

    render(
      <CreateNewPolicy
        ref={ref}
        isStepper
        accountData={{ CustomerNum: '1234567890', CustomerName: 'Acme LLC' }}
        onCreatePolicy={onCreatePolicy}
        onModStart={onModStart}
      />,
    );

    await waitFor(() => {
      expect(ref.current).toBeTruthy();
    });

    act(() => {
      ref.current.createNewPolicy();
      ref.current.createNextMod();
    });

    expect(onCreatePolicy).toHaveBeenCalled();
    expect(onModStart).toHaveBeenCalled();
  });

  it('navigates back to SAC account when Back is confirmed', async () => {
    mockLocation = {
      pathname: '/view-policy/PK_Number=99',
      state: { from: '/sac-view-account/CustomerNum=1234567890' },
    };
    mockParams = { column_name: 'PK_Number=99' };
    mockSearchParams = { size: 0, get: () => null };

    render(<CreateNewPolicy />);

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/sac_policies/', {
        params: { PK_Number: '99' },
      });
    });
    await waitFor(() => {
      expect(screen.getByDisplayValue('1234567890')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: 'Back' }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(
        '/sac-view-account/CustomerNum=1234567890',
        {
          state: { from: '/view-policy/PK_Number=99' },
          replace: true,
        },
      );
    });
  });

  it('navigates to create-new-policy with account context when creating a brand new policy', async () => {
    mockLocation = {
      pathname: '/view-policy/PK_Number=99',
      state: { from: '/sac-view-account/CustomerNum=1234567890' },
    };
    mockParams = { column_name: 'PK_Number=99' };
    mockSearchParams = { size: 0, get: () => null };

    render(<CreateNewPolicy />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('1234567890')).toBeInTheDocument();
    });

    await userEvent.click(
      screen.getByRole('button', { name: 'Create a Brand New Policy' }),
    );

    expect(mockNavigate).toHaveBeenCalledWith(
      '/create-new-policy?CustomerNum=1234567890&CustomerName=Acme LLC',
      {
        state: { from: '/sac-view-account/CustomerNum=1234567890' },
        replace: true,
      },
    );
  });
});
