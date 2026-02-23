import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ViewAssociatedAccounts from './ViewAssociatedAccounts';
import api from '../../../../../api/api';
import Swal from 'sweetalert2';

jest.mock('../../../../../api/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

jest.mock('../../../../ui/Loader', () => () => <div data-testid="loader" />);

jest.mock('@mui/x-data-grid', () => ({
  DataGrid: ({ rows = [], columns = [] }) => (
    <div data-testid="mock-grid">
      <div data-testid="rows-count">{rows.length}</div>
      {rows.map((row) => (
        <div key={row.id || row.CustomerNum}>
          {columns.map((col) => {
            if (col.field === 'actions' && col.renderCell) {
              const actionElement = col.renderCell({ row });
              if (!actionElement) return null;
              return (
                <button
                  key={`remove-${row.id || row.CustomerNum}`}
                  type="button"
                  onClick={actionElement.props.onClick}
                >
                  remove-{row.CustomerNum}
                </button>
              );
            }

            return (
              <div key={col.field}>
                {col.renderCell
                  ? col.renderCell({ row, value: row[col.field] })
                  : String(row[col.field] ?? '')}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  ),
}));

jest.mock('sweetalert2', () => ({
  __esModule: true,
  default: {
    fire: jest.fn(),
  },
}));

describe('ViewAssociatedAccounts', () => {
  const associationRows = [
    {
      AssociatedAccount: '20001',
      AssociatedCustomerName: 'Child One',
      AssociatedAcctStatus: 'Active',
    },
    {
      AssociatedAccount: '20002',
      AssociatedCustomerName: 'Child Two',
      AssociatedAcctStatus: 'Inactive',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    api.get.mockImplementation((url) => {
      if (url.startsWith('/sac_account_associations')) {
        return Promise.resolve({ status: 200, data: associationRows });
      }
      if (url === '/search_sac_account/') {
        return Promise.resolve({
          status: 200,
          data: [
            {
              'Customer Number': '30001',
              'Customer Name': 'Search Account',
              'Account Status': 'Active',
            },
          ],
        });
      }
      return Promise.resolve({ status: 200, data: [] });
    });

    api.post.mockResolvedValue({ status: 200 });
    Swal.fire.mockResolvedValue({ isConfirmed: true });
  });

  function renderComponent() {
    return render(
      <ViewAssociatedAccounts
        accountName="Parent Account"
        customerNum="12345"
        disableforDirector={false}
      />,
    );
  }

  it('fetches associated accounts on mount', async () => {
    renderComponent();

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith(
        '/sac_account_associations?ParentAccount=12345',
      );
    });

    expect(screen.getByText('Parent Account')).toBeInTheDocument();
    expect(screen.getByTestId('rows-count')).toHaveTextContent('2');
  });

  it('loads search options after entering edit mode', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: 'Edit' }));

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/search_sac_account/', {
        params: { search_by: 'AccountName' },
      });
    });
  });

  it('removes a row and submits delete payload', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: 'Edit' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'remove-20001' })).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: 'remove-20001' }));
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/sac_account_associations/delete', {
        parent_account: '12345',
        child_account: ['20001'],
      });
    });
  });

  it('shows error alert when save API fails', async () => {
    api.post.mockRejectedValue(new Error('save failed'));

    renderComponent();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: 'Edit' }));
    await userEvent.click(screen.getByRole('button', { name: 'remove-20001' }));
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Error', icon: 'error' }),
      );
    });
  });
});
