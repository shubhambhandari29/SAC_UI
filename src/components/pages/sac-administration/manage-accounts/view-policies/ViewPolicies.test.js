import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ViewPolicies from './ViewPolicies';
import api from '../../../../../api/api';
import useDropdownData from '../../../../../hooks/useDropdownData';

const mockNavigate = jest.fn();
let mockLocation = {
  pathname: '/sac-view-account/CustomerNum=1234567890',
  state: undefined,
};

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

jest.mock('../../../../../hooks/useDropdownData', () => jest.fn());

jest.mock('../../../../ui/Loader', () => () => <div data-testid="loader" />);

jest.mock('sweetalert2', () => ({
  __esModule: true,
  default: {
    fire: jest.fn(),
    DismissReason: { cancel: 'cancel' },
  },
}));

jest.mock('@mui/x-data-grid', () => ({
  DataGrid: ({ rows, onRowSelectionModelChange, getRowId }) => (
    <div data-testid="mock-data-grid">
      <div data-testid="rows-count">{rows.length}</div>
      {rows.map((row) => {
        const id = getRowId(row);
        return (
          <button
            key={id}
            type="button"
            onClick={() => onRowSelectionModelChange({ ids: new Set([id]) })}
          >
            select-{row.PolicyNum}
          </button>
        );
      })}
    </div>
  ),
}));

const policyRows = [
  {
    PK_Number: 1,
    PolicyNum: 'Pol-1',
    PolMod: '01',
    PolicyStatus: 'Active',
    PolicyType: 'GL',
    AccountName: 'Acme Inc',
    InceptDate: '01-01-2025',
    ExpDate: '01-01-2026',
  },
];

describe('ViewPolicies', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocation = {
      pathname: '/sac-view-account/CustomerNum=1234567890',
      state: undefined,
    };
    useDropdownData.mockReturnValue({ data: [], loading: false });
    api.get.mockResolvedValue({ data: policyRows });
  });

  it('fetches policies and reports count in stepper mode', async () => {
    const onDataFetch = jest.fn();

    render(
      <ViewPolicies
        CustomerNum="1234567890"
        CustomerName="Acme Inc"
        isStepper
        onDataFetch={onDataFetch}
        onCreatePolicy={jest.fn()}
        onViewPolicy={jest.fn()}
      />,
    );

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/sac_policies/', {
        params: { CustomerNum: '1234567890' },
      });
    });

    expect(onDataFetch).toHaveBeenCalledWith(1);
  });

  it('uses callback when creating policy in stepper mode', async () => {
    const onCreatePolicy = jest.fn();

    render(
      <ViewPolicies
        CustomerNum="1234567890"
        CustomerName="Acme Inc"
        isStepper
        onCreatePolicy={onCreatePolicy}
        onViewPolicy={jest.fn()}
      />,
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Create a New Policy/i })).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: /Create a New Policy/i }));

    expect(onCreatePolicy).toHaveBeenCalled();
  });

  it('navigates to selected policy in non-stepper mode', async () => {
    render(
      <ViewPolicies
        CustomerNum="1234567890"
        CustomerName="Acme Inc"
        isStepper={false}
      />,
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'select-Pol-1' })).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: 'select-Pol-1' }));
    await userEvent.click(screen.getByRole('button', { name: /Go To Selected Policy/i }));

    expect(mockNavigate).toHaveBeenCalledWith('/view-policy/PK_Number=1', {
      state: { from: '/sac-view-account/CustomerNum=1234567890' },
      replace: true,
    });
  });
});
