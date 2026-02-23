import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ViewPolicyTypes from './ViewPolicyTypes';
import api from '../../../../../api/api';

const mockNavigate = jest.fn();
let mockLocation = {
  pathname: '/affinity-view-program/ProgramName=AcmeAffinity',
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

jest.mock('../../../../ui/Loader', () => () => <div data-testid="loader" />);

jest.mock('sweetalert2', () => ({
  __esModule: true,
  default: {
    fire: jest.fn(),
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
            select-{row.PolicyType}
          </button>
        );
      })}
    </div>
  ),
}));

const policyTypeRows = [
  {
    PK_Number: 1,
    ProgramName: 'AcmeAffinity',
    PolicyType: 'GL',
    AgentName: 'John Doe',
    AgentCode: 'A123',
  },
  {
    PK_Number: 2,
    ProgramName: 'AcmeAffinity',
    PolicyType: 'WC',
    AgentName: 'Jane Doe',
    AgentCode: 'B456',
  },
];

describe('ViewPolicyTypes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocation = {
      pathname: '/affinity-view-program/ProgramName=AcmeAffinity',
      state: undefined,
    };
    api.get.mockResolvedValue({ data: policyTypeRows });
  });

  it('fetches policy types and reports count in stepper mode', async () => {
    const onDataFetch = jest.fn();

    render(
      <ViewPolicyTypes
        ProgramName="AcmeAffinity"
        isStepper
        onDataFetch={onDataFetch}
        onCreatePolicy={jest.fn()}
        onViewPolicy={jest.fn()}
      />,
    );

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/affinity_policy_types/', {
        params: { ProgramName: 'AcmeAffinity' },
      });
    });

    expect(onDataFetch).toHaveBeenCalledWith(2);
  });

  it('uses callback when creating policy type in stepper mode', async () => {
    const onCreatePolicy = jest.fn();

    render(
      <ViewPolicyTypes
        ProgramName="AcmeAffinity"
        isStepper
        onCreatePolicy={onCreatePolicy}
        onViewPolicy={jest.fn()}
      />,
    );

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /Create a New Policy Type/i }),
      ).toBeInTheDocument();
    });

    await userEvent.click(
      screen.getByRole('button', { name: /Create a New Policy Type/i }),
    );

    expect(onCreatePolicy).toHaveBeenCalled();
  });

  it('navigates to create policy type page in non-stepper mode', async () => {
    render(
      <ViewPolicyTypes
        ProgramName="AcmeAffinity"
        isStepper={false}
      />,
    );

    await userEvent.click(
      screen.getByRole('button', { name: /Create a New Policy Type/i }),
    );

    expect(mockNavigate).toHaveBeenCalledWith(
      '/create-new-policy-type/?ProgramName=AcmeAffinity',
      {
        state: { from: '/affinity-view-program/ProgramName=AcmeAffinity' },
        replace: true,
      },
    );
  });

  it('calls onViewPolicy in stepper mode when selected policy type is opened', async () => {
    const onViewPolicy = jest.fn();

    render(
      <ViewPolicyTypes
        ProgramName="AcmeAffinity"
        isStepper
        onCreatePolicy={jest.fn()}
        onViewPolicy={onViewPolicy}
      />,
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'select-GL' })).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: 'select-GL' }));
    await userEvent.click(
      screen.getByRole('button', { name: /Go To Selected Policy Type/i }),
    );

    expect(onViewPolicy).toHaveBeenCalledWith(1);
  });

  it('navigates to selected policy type in non-stepper mode', async () => {
    render(
      <ViewPolicyTypes
        ProgramName="AcmeAffinity"
        isStepper={false}
      />,
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'select-GL' })).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: 'select-GL' }));
    await userEvent.click(
      screen.getByRole('button', { name: /Go To Selected Policy Type/i }),
    );

    expect(mockNavigate).toHaveBeenCalledWith('/view-policy-types/PK_Number=1', {
      state: { from: '/affinity-view-program/ProgramName=AcmeAffinity' },
      replace: true,
    });
  });

  it('does not show create button on cct routes', () => {
    mockLocation = {
      pathname: '/cct-view-affinity-program/ProgramName=AcmeAffinity',
      state: undefined,
    };

    render(
      <ViewPolicyTypes
        ProgramName="AcmeAffinity"
        isStepper={false}
      />,
    );

    expect(
      screen.queryByRole('button', { name: /Create a New Policy Type/i }),
    ).not.toBeInTheDocument();
  });
});
