import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ListManagement from './ListManagement';
import api from '../../../../api/api';
import Swal from 'sweetalert2';

jest.mock('../../../../api/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

jest.mock('../../../ui/Loader', () => () => <div data-testid="loader" />);

jest.mock('@mui/x-data-grid', () => ({
  GridRowModes: { Edit: 'edit' },
  DataGrid: ({ rows = [], columns = [], onRowClick, processRowUpdate }) => (
    <div data-testid="mock-grid">
      <div data-testid="rows-count">{rows.length}</div>
      <button
        type="button"
        onClick={() => {
          if (rows[0]) onRowClick?.({ id: rows[0].id, row: rows[0] });
        }}
      >
        row-click
      </button>
      <button
        type="button"
        onClick={() => {
          if (rows[0]) {
            processRowUpdate?.(
              { ...rows[0], DD_Value: 'Updated Value' },
              rows[0],
            );
          }
        }}
      >
        process-update
      </button>
      <button
        type="button"
        onClick={() => {
          if (rows[0]) {
            processRowUpdate?.(
              { ...rows[0], DD_SortOrder: 'bad-number' },
              rows[0],
            );
          }
        }}
      >
        process-invalid-number
      </button>
      {rows.map((row) => (
        <div key={row.id}>
          {columns.map((col) => (
            <div key={col.field}>
              {col.renderCell
                ? col.renderCell({ id: row.id, row, value: row[col.field] })
                : String(row[col.field] ?? '')}
            </div>
          ))}
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

describe('ListManagement', () => {
  const rowsResponse = [
    {
      PK_Number: 1,
      DD_Key: 'BranchName',
      DD_Value: 'Boston',
      DD_SortOrder: 1,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    api.get.mockResolvedValue({ data: rowsResponse });
    api.post.mockResolvedValue({ status: 200, data: {} });
    Swal.fire.mockResolvedValue({ isConfirmed: true });
  });

  async function selectBranchList() {
    render(<ListManagement />);

    await userEvent.click(screen.getByLabelText('Select List to Update'));
    await userEvent.click(await screen.findByRole('option', { name: 'Branch List' }));

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/dropdowns/BranchName');
    });

    await screen.findByTestId('rows-count');
  }

  it('loads selected list data and renders grid', async () => {
    await selectBranchList();

    expect(screen.getByTestId('rows-count')).toHaveTextContent('1');
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
  });

  it('adds and cancels new row in edit mode', async () => {
    await selectBranchList();

    await userEvent.click(screen.getByRole('button', { name: 'Edit' }));
    await userEvent.click(screen.getByRole('button', { name: 'Add Row' }));

    expect(screen.getByTestId('rows-count')).toHaveTextContent('2');

    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.getByTestId('rows-count')).toHaveTextContent('1');
  });

  it('shows validation error for non-numeric DD_SortOrder updates', async () => {
    await selectBranchList();

    await userEvent.click(screen.getByRole('button', { name: 'Edit' }));
    await userEvent.click(screen.getByRole('button', { name: 'process-invalid-number' }));

    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Data Validation Error',
        text: 'DD_SortOrder must be a number',
      }),
    );
  });

  it('saves modified rows to upsert endpoint', async () => {
    await selectBranchList();

    await userEvent.click(screen.getByRole('button', { name: 'Edit' }));
    await userEvent.click(screen.getByRole('button', { name: 'process-update' }));
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/dropdowns/BranchName/upsert', [
        {
          DD_Key: 'BranchName',
          DD_Value: 'Updated Value',
          DD_SortOrder: 1,
          PK_Number: 1,
        },
      ]);
    });
  });

  it('shows error alert when fetch fails', async () => {
    api.get.mockRejectedValueOnce(new Error('fetch failed'));

    render(<ListManagement />);

    await userEvent.click(screen.getByLabelText('Select List to Update'));
    await userEvent.click(await screen.findByRole('option', { name: 'Branch List' }));

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith('Error', 'Unable to load list data', 'error');
    });
  });
});
