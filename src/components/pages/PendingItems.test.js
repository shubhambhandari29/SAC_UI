import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PendingItems from './PendingItems';
import api from '../../api/api';
import { useSelector } from 'react-redux';

const mockNavigate = jest.fn();

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('../../api/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

jest.mock('../ui/Loader', () => () => <div data-testid="loader" />);

jest.mock('sweetalert2', () => ({
  __esModule: true,
  default: {
    fire: jest.fn(),
  },
}));

jest.mock('@mui/x-data-grid', () => ({
  DataGrid: ({ rows, onRowClick, getRowId }) => (
    <div data-testid="mock-data-grid">
      <div data-testid="rows-count">{rows.length}</div>
      {rows.map((row) => {
        const id = getRowId(row);
        return (
          <button key={id} type="button" onClick={() => onRowClick?.({ row })}>
            open-{id}
          </button>
        );
      })}
    </div>
  ),
}));

const sacRows = [
  {
    CustomerNum: '12345',
    CustomerName: 'Acme SAC',
    DateCreated: '2025-01-01',
  },
];

const affinityRows = [
  {
    ProgramName: 'Affinity-X',
    BusType: 'Affinity',
    DtCreated: '2025-01-01',
  },
];

describe('PendingItems', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches SAC work-in-progress and new review items for Director role', async () => {
    useSelector.mockImplementation((selector) =>
      selector({ auth: { user: { role: 'Director', branch: 'Boston' } } }),
    );

    api.get.mockImplementation((url, { params }) => {
      if (url === '/sac_account/' && params.Stage === 'Director') {
        return Promise.resolve({ status: 200, data: sacRows });
      }
      if (url === '/sac_account/' && params.Stage === 'Underwriter') {
        return Promise.resolve({ status: 200, data: sacRows });
      }
      return Promise.resolve({ status: 200, data: [] });
    });

    render(<PendingItems />);

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/sac_account/', {
        params: {
          Stage: 'Director',
          IsSubmitted: 0,
          BranchName: 'Boston',
        },
      });
    });

    expect(api.get).toHaveBeenCalledWith('/sac_account/', {
      params: {
        Stage: 'Underwriter',
        IsSubmitted: 1,
        BranchName: 'Boston',
      },
    });
  });

  it('navigates to selected SAC account on row click', async () => {
    useSelector.mockImplementation((selector) =>
      selector({ auth: { user: { role: 'Director', branch: 'Boston' } } }),
    );

    api.get.mockResolvedValue({ status: 200, data: sacRows });

    render(<PendingItems />);

    await waitFor(() => {
      expect(screen.getAllByRole('button', { name: 'open-12345' }).length).toBe(2);
    });

    await userEvent.click(screen.getAllByRole('button', { name: 'open-12345' })[0]);

    expect(mockNavigate).toHaveBeenCalledWith('/sac-view-account/CustomerNum=12345', {
      state: { from: '/pending-items' },
      replace: true,
    });
  });

  it('switches to affinity list and fetches affinity endpoints', async () => {
    useSelector.mockImplementation((selector) =>
      selector({ auth: { user: { role: 'Director', branch: 'Boston' } } }),
    );

    api.get.mockImplementation((url, { params }) => {
      if (url === '/sac_account/') return Promise.resolve({ status: 200, data: sacRows });
      if (url === '/affinity_program/' && params.Stage === 'Director') {
        return Promise.resolve({ status: 200, data: affinityRows });
      }
      if (url === '/affinity_program/' && params.Stage === 'Underwriter') {
        return Promise.resolve({ status: 200, data: affinityRows });
      }
      return Promise.resolve({ status: 200, data: [] });
    });

    render(<PendingItems />);

    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });

    const selector = screen.getByRole('combobox');
    fireEvent.mouseDown(selector);
    await userEvent.click(screen.getByRole('option', { name: 'Affinity' }));

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/affinity_program/', {
        params: {
          Stage: 'Director',
          IsSubmitted: 0,
          BranchVal: 'Boston',
        },
      });
    });

    expect(api.get).toHaveBeenCalledWith('/affinity_program/', {
      params: {
        Stage: 'Underwriter',
        IsSubmitted: 1,
        BranchVal: 'Boston',
      },
    });
  });

  it('shows no-pending-items state when both lists are empty', async () => {
    useSelector.mockImplementation((selector) =>
      selector({ auth: { user: { role: 'Director', branch: 'Boston' } } }),
    );

    api.get.mockResolvedValue({ status: 200, data: [] });

    render(<PendingItems />);

    await waitFor(() => {
      expect(screen.getByText('No Pending Items')).toBeInTheDocument();
    });
  });

  it('does not request new-items list for Underwriter role', async () => {
    useSelector.mockImplementation((selector) =>
      selector({ auth: { user: { role: 'Underwriter', branch: 'Boston' } } }),
    );

    api.get.mockResolvedValue({ status: 200, data: sacRows });

    render(<PendingItems />);

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/sac_account/', {
        params: {
          Stage: 'Underwriter',
          IsSubmitted: 0,
          BranchName: 'Boston',
        },
      });
    });

    expect(api.get).toHaveBeenCalledTimes(1);
  });
});
