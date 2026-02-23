import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ViewAffiliates from './ViewAffiliates';
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
  DataGrid: ({ rows = [], columns = [] }) => (
    <div data-testid="mock-grid">
      <div data-testid="rows-count">{rows.length}</div>
      {rows.map((row) => (
        <div key={row.id}>
          {columns.map((col) => (
            <div key={col.field}>
              {col.renderCell
                ? col.renderCell({ row, value: row[col.field] })
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

describe('ViewAffiliates', () => {
  const originalRows = [
    {
      CustomerNum: '12345',
      AffiliateName: 'Affiliate One',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    api.get.mockResolvedValue({ data: originalRows });
    api.post.mockResolvedValue({ status: 200 });
    Swal.fire.mockResolvedValue({ isConfirmed: true });
  });

  function renderViewAffiliates() {
    return render(
      <ViewAffiliates
        accountName="Acme SAC"
        customerNum="12345"
        disableforDirector={false}
      />,
    );
  }

  it('fetches affiliates on mount', async () => {
    renderViewAffiliates();

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/sac_affiliates/', {
        params: { CustomerNum: '12345' },
      });
    });

    expect(await screen.findByRole('button', { name: 'Edit' })).toBeInTheDocument();
    expect(screen.getByText('Acme SAC')).toBeInTheDocument();
    expect(screen.getAllByText('12345').length).toBeGreaterThan(0);
  });

  it('adds row in edit mode and cancels back to original list', async () => {
    renderViewAffiliates();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: 'Edit' }));
    await userEvent.click(screen.getByRole('button', { name: 'Add Row' }));

    expect(screen.getByTestId('rows-count')).toHaveTextContent('2');

    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.getByTestId('rows-count')).toHaveTextContent('1');
  });

  it('saves edited affiliate list to upsert endpoint', async () => {
    renderViewAffiliates();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: 'Edit' }));
    await userEvent.click(screen.getByRole('button', { name: 'Add Row' }));

    const textboxes = screen.getAllByRole('textbox');
    await userEvent.type(textboxes[textboxes.length - 1], 'Affiliate Two');

    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/sac_affiliates/upsert', [
        { CustomerNum: '12345', AffiliateName: 'Affiliate One' },
        { CustomerNum: '12345', AffiliateName: 'Affiliate Two' },
      ]);
    });
  });

  it('shows validation alert when save has required field errors', async () => {
    renderViewAffiliates();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: 'Edit' }));
    await userEvent.click(screen.getByRole('button', { name: 'Add Row' }));
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Data Validation Error' }),
      );
    });
  });
});
