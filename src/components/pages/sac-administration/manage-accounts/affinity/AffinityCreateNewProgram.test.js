import { createRef } from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AffinityCreateNewProgram from './AffinityCreateNewProgram';
import api from '../../../../../api/api';
import Swal from 'sweetalert2';
import useDropdownData from '../../../../../hooks/useDropdownData';
import { useSelector } from 'react-redux';

const mockNavigate = jest.fn();
let mockLocation = {
  pathname: '/affinity-view-program/ProgramName=ABC',
  state: { from: '/pending-items' },
};
let mockParams = { column_name: 'ProgramName=ABC' };

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

jest.mock('./ProgramGeneral', () => () => <div>Program General Content</div>);
jest.mock('../Notes', () => ({ label }) => <div>{label}</div>);
jest.mock('../Shi', () => () => <div>SHI Content</div>);
jest.mock('../LossRunScheduling', () => () => <div>Loss Run Scheduling Content</div>);
jest.mock('../ClaimReviewScheduling', () => () => <div>Claim Review Scheduling Content</div>);
jest.mock('../view-policy-types/ViewPolicyTypes', () => () => (
  <div>ViewPolicyTypesContent</div>
));
jest.mock('../../../../ui/CurrencyField', () => () => <input aria-label="Total Premium" />);

jest.mock('@mui/x-date-pickers/LocalizationProvider', () => ({
  LocalizationProvider: ({ children }) => <>{children}</>,
}));

jest.mock('@mui/x-date-pickers/DatePicker', () => ({
  DatePicker: ({ label, value, onChange }) => (
    <input
      aria-label={label}
      value={value?.format ? value.format('YYYY-MM-DD') : value || ''}
      onChange={(e) => onChange?.({ format: () => e.target.value })}
    />
  ),
}));

jest.mock('sweetalert2', () => ({
  __esModule: true,
  default: {
    fire: jest.fn(),
    DismissReason: { cancel: 'cancel' },
  },
}));

const mainProgramResponse = {
  status: 200,
  data: [
    {
      ProgramName: 'ABC',
      AcctStatus: 'Active',
      DtCreated: '2025-01-01',
      DateNotif: null,
      OnBoardDt: '2025-01-10',
      TermDate: null,
      BranchVal: 'NY',
    },
  ],
};

describe('AffinityCreateNewProgram', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockLocation = {
      pathname: '/affinity-view-program/ProgramName=ABC',
      state: { from: '/pending-items' },
    };
    mockParams = { column_name: 'ProgramName=ABC' };

    useSelector.mockImplementation((selector) =>
      selector({ auth: { user: { role: 'Admin' } } }),
    );

    useDropdownData.mockImplementation((url) => {
      if (url === '/dropdowns/BranchName') {
        return {
          data: [{ BranchName: 'NY' }, { BranchName: 'CA' }],
          loading: false,
        };
      }
      return { data: [], loading: false };
    });

    api.get.mockImplementation((url) => {
      if (url === '/affinity_program/') return Promise.resolve(mainProgramResponse);
      if (url === '/loss_run_frequency_affinity/')
        return Promise.resolve({ status: 200, data: [] });
      if (url === '/claim_review_frequency_affinity/')
        return Promise.resolve({ status: 200, data: [] });
      return Promise.resolve({ status: 200, data: [] });
    });

    Swal.fire.mockResolvedValue({ isConfirmed: true });
  });

  it('fetches existing program data when a route param is present', async () => {
    render(<AffinityCreateNewProgram />);

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/affinity_program/', {
        params: { ProgramName: 'ABC' },
      });
    });

    expect(api.get).toHaveBeenCalledWith('/loss_run_frequency_affinity/', {
      params: { ProgramName: 'ABC' },
    });

    expect(api.get).toHaveBeenCalledWith('/claim_review_frequency_affinity/', {
      params: { ProgramName: 'ABC' },
    });
  });

  it('navigates back to pending items after confirmation', async () => {
    mockLocation = { pathname: '/affinity-create-new-program', state: undefined };
    mockParams = {};

    render(<AffinityCreateNewProgram />);

    await userEvent.click(screen.getByRole('button', { name: 'Back' }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/pending-items', {
        replace: true,
      });
    });
  });

  it('opens policy types modal when arriving from a policy route', async () => {
    mockLocation = {
      pathname: '/affinity-view-program/ProgramName=ABC',
      state: { from: '/view-policy/PK_Number=101' },
    };

    render(<AffinityCreateNewProgram />);

    await waitFor(() => {
      expect(screen.getByText('ViewPolicyTypesContent')).toBeInTheDocument();
    });
  });

  it('opens policy types modal when View Policy Types button is clicked', async () => {
    render(<AffinityCreateNewProgram />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'View Policy Types' })).toBeInTheDocument();
    });
    await userEvent.click(screen.getByRole('button', { name: 'View Policy Types' }));

    expect(screen.getByText('ViewPolicyTypesContent')).toBeInTheDocument();
  });

  it('does not render View Policy Types button on create-new path', () => {
    mockLocation = { pathname: '/affinity-create-new-program', state: undefined };
    mockParams = {};

    render(<AffinityCreateNewProgram />);

    expect(
      screen.queryByRole('button', { name: 'View Policy Types' }),
    ).not.toBeInTheDocument();
  });

  it('submits save via imperative handle in stepper mode', async () => {
    const ref = createRef();
    api.post.mockResolvedValue({ status: 200 });

    render(<AffinityCreateNewProgram ref={ref} isStepper />);

    await waitFor(() => {
      expect(ref.current).toBeTruthy();
    });
    await waitFor(() => {
      expect(screen.getByDisplayValue('ABC')).toBeInTheDocument();
    });

    let result;
    await act(async () => {
      result = await ref.current.submit('save');
    });

    expect(api.post).toHaveBeenCalledWith(
      '/affinity_program/upsert',
      expect.objectContaining({
        ProgramName: 'ABC',
        Stage: 'Admin',
      }),
    );
    expect(result).toEqual(
      expect.objectContaining({
        ProgramName: 'ABC',
      }),
    );
  });

  it('submits to production and navigates to pending items', async () => {
    const ref = createRef();
    api.post.mockResolvedValue({ status: 200 });

    render(<AffinityCreateNewProgram ref={ref} />);

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

  it('blocks duplicate program name for underwriter create-new flow', async () => {
    const ref = createRef();
    mockLocation = { pathname: '/affinity-create-new-program', state: undefined };
    mockParams = { column_name: 'ProgramName=ABC' };
    useSelector.mockImplementation((selector) =>
      selector({ auth: { user: { role: 'Underwriter' } } }),
    );

    api.get.mockImplementation((url, config) => {
      if (url === '/affinity_program/') {
        if (config?.params?.ProgramName === 'DUPLICATE') {
          return Promise.resolve({
            status: 200,
            data: [{ ProgramName: 'DUPLICATE', OnBoardDt: '2025-03-01', BranchVal: 'NY' }],
          });
        }
        return Promise.resolve(mainProgramResponse);
      }
      return Promise.resolve({ status: 200, data: [] });
    });

    render(<AffinityCreateNewProgram ref={ref} />);

    await waitFor(() => {
      expect(ref.current).toBeTruthy();
    });
    await waitFor(() => {
      expect(screen.getByDisplayValue('ABC')).toBeInTheDocument();
    });

    const programNameInput = screen.getByLabelText(/Affinity Program Name/i);
    await userEvent.clear(programNameInput);
    await userEvent.type(programNameInput, 'DUPLICATE');

    await act(async () => {
      await ref.current.submit('save');
    });

    expect(api.get).toHaveBeenCalledWith('/affinity_program/', {
      params: { ProgramName: 'DUPLICATE' },
    });
    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Data Validation Error',
        text: 'This Program Name already exists, duplicate records are not permitted',
      }),
    );
    expect(api.post).not.toHaveBeenCalled();
  });
});
