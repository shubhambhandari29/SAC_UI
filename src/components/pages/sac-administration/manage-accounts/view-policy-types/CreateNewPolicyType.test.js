import { createRef } from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateNewPolicyType from './CreateNewPolicyType';
import api from '../../../../../api/api';
import Swal from 'sweetalert2';
import useDropdownData from '../../../../../hooks/useDropdownData';
import { useSelector } from 'react-redux';

const mockNavigate = jest.fn();
let mockLocation = {
  pathname: '/create-new-policy-type',
  state: { from: '/affinity-view-program/ProgramName=AcmeAffinity' },
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

jest.mock('./GeneralProgram', () => () => <div>General Program Tab</div>);
jest.mock('./InsuredContacts', () => () => <div>Insured Contacts Tab</div>);
jest.mock('./ClaimHandling1', () => () => <div>Claim Handling 1 Tab</div>);
jest.mock('./ClaimHandling2', () => () => <div>Claim Handling 2 Tab</div>);
jest.mock('./ClaimHandling3', () => () => <div>Claim Handling 3 Tab</div>);
jest.mock('./CctInstructionsOther', () => () => <div>CCT Other Tab</div>);
jest.mock('./CctAssignment', () => () => <div>CCT Assignment Tab</div>);
jest.mock('../../../ShiPrint', () => () => <div>SHI Print Tab</div>);

jest.mock('@mui/x-date-pickers/LocalizationProvider', () => ({
  LocalizationProvider: ({ children }) => <>{children}</>,
}));

jest.mock('@mui/x-date-pickers/DatePicker', () => ({
  DatePicker: ({ label }) => <input aria-label={label} />,
}));

jest.mock('sweetalert2', () => ({
  __esModule: true,
  default: {
    fire: jest.fn(),
    DismissReason: { cancel: 'cancel' },
  },
}));

const policyTypeResponse = {
  status: 200,
  data: [
    {
      PK_Number: 99,
      ProgramName: 'AcmeAffinity',
      PolicyType: 'GL',
      PolicyStatus: 'Active',
      PolicyBusinessType: 'Affinity',
      DateCreated: '2025-01-01',
      UnderwriterName: 'Smith',
      UWMgr: 'Smith',
      LOCCoded: 'Yes',
      TermReason: '',
      TermDate: null,
      PolicyNotes: 'Notes',
    },
  ],
};

const dropdownData = [
  { DD_Type: 'PolicyStatus', DD_Value: 'Active', DD_SortOrder: 1 },
  { DD_Type: 'PolicyType', DD_Value: 'GL', DD_SortOrder: 1 },
  { DD_Type: 'GenPolicyStatus', DD_Value: 'Affinity', DD_SortOrder: 1 },
];

const underwritersData = [{ 'UW Last': 'Smith', 'UW Email': 'smith@test.com' }];
const termReasonData = [{ DD_Value: 'Expired' }];

describe('CreateNewPolicyType', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockLocation = {
      pathname: '/create-new-policy-type',
      state: { from: '/affinity-view-program/ProgramName=AcmeAffinity' },
    };
    mockParams = {};
    mockSearchParams = { size: 0, get: () => null };

    useSelector.mockImplementation((selector) =>
      selector({ auth: { user: { role: 'Admin' } } }),
    );

    useDropdownData.mockImplementation((url) => {
      if (url === '/dropdowns/all') return { data: dropdownData, loading: false };
      if (url === '/dropdowns/Underwriters') {
        return { data: underwritersData, loading: false };
      }
      if (url === '/dropdowns/DNRStatus') {
        return { data: termReasonData, loading: false };
      }
      return { data: [], loading: false };
    });

    api.get.mockImplementation((url) => {
      if (url === '/affinity_policy_types/') return Promise.resolve(policyTypeResponse);
      if (url === '/affinity_program/') {
        return Promise.resolve({
          status: 200,
          data: [{ ProgramName: 'AcmeAffinity', Stage: 'Admin', IsSubmitted: 0 }],
        });
      }
      return Promise.resolve({ status: 200, data: [] });
    });

    api.post.mockResolvedValue({ status: 200, data: { pk: 123 } });
    Swal.fire.mockResolvedValue({ isConfirmed: true });
  });

  it('prefills program name from query params in create mode', async () => {
    const params = new URLSearchParams('ProgramName=AcmeAffinity');
    mockSearchParams = { size: 1, get: (key) => params.get(key) };

    render(<CreateNewPolicyType />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('AcmeAffinity')).toBeInTheDocument();
    });
  });

  it('fetches policy type and affinity data when opening existing policy type', async () => {
    mockLocation = {
      pathname: '/view-policy-types/PK_Number=99',
      state: { from: '/affinity-view-program/ProgramName=AcmeAffinity' },
    };
    mockParams = { column_name: 'PK_Number=99' };

    render(<CreateNewPolicyType />);

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/affinity_policy_types/', {
        params: { PK_Number: '99' },
      });
    });

    expect(api.get).toHaveBeenCalledWith('/affinity_program/', {
      params: { ProgramName: 'AcmeAffinity' },
    });
  });

  it('exposes stepper methods for creating new policy type and next mod', async () => {
    const ref = createRef();
    const onCreatePolicy = jest.fn();
    const onModStart = jest.fn();

    render(
      <CreateNewPolicyType
        ref={ref}
        isStepper
        accountData={{ ProgramName: 'AcmeAffinity' }}
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

  it('navigates back to affinity program when Back is confirmed', async () => {
    mockLocation = {
      pathname: '/view-policy-types/PK_Number=99',
      state: { from: '/affinity-view-program/ProgramName=AcmeAffinity' },
    };
    mockParams = { column_name: 'PK_Number=99' };

    render(<CreateNewPolicyType />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('AcmeAffinity')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: 'Back' }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(
        '/affinity-view-program/ProgramName=AcmeAffinity',
        {
          state: { from: '/view-policy-types/PK_Number=99' },
          replace: true,
        },
      );
    });
  });

  it('navigates to create-new-policy-type with context when creating brand new', async () => {
    mockLocation = {
      pathname: '/view-policy-types/PK_Number=99',
      state: { from: '/affinity-view-program/ProgramName=AcmeAffinity' },
    };
    mockParams = { column_name: 'PK_Number=99' };

    render(<CreateNewPolicyType />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('AcmeAffinity')).toBeInTheDocument();
    });

    await userEvent.click(
      screen.getByRole('button', { name: 'Create New Policy Type' }),
    );

    expect(mockNavigate).toHaveBeenCalledWith(
      '/create-new-policy-type?ProgramName=AcmeAffinity',
      {
        state: { from: '/affinity-view-program/ProgramName=AcmeAffinity' },
        replace: true,
      },
    );
  });

  it('saves and navigates to the newly saved policy type route', async () => {
    const ref = createRef();

    mockLocation = {
      pathname: '/view-policy-types/PK_Number=99',
      state: { from: '/affinity-view-program/ProgramName=AcmeAffinity' },
    };
    mockParams = { column_name: 'PK_Number=99' };

    render(<CreateNewPolicyType ref={ref} />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('AcmeAffinity')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(ref.current).toBeTruthy();
    });

    await act(async () => {
      await ref.current.submit('save');
    });

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(
        '/affinity_policy_types/upsert',
        expect.objectContaining({ ProgramName: 'AcmeAffinity', PolicyType: 'GL' }),
      );
    });

    expect(mockNavigate).toHaveBeenCalledWith('/view-policy-types/PK_Number=123', {
      replace: true,
    });
  });
});
