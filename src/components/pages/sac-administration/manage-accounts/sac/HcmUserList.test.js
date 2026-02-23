import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Controller } from 'react-hook-form';
import HcmUserList from './HcmUserList';
import api from '../../../../../api/api';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';

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

jest.mock('../../../../ui/Loader', () => ({ size }) => <div>loader:{size}</div>);

jest.mock('../../../../ui/PhoneField', () => ({ name, control }) => (
  (() => {
    const { Controller: RHFController } = require('react-hook-form');
    return (
      <RHFController
    name={name}
    control={control}
    render={({ field }) => (
      <input aria-label={name} value={field.value || ''} onChange={field.onChange} />
    )}
      />
    );
  })()
));

jest.mock('@mui/x-date-pickers/LocalizationProvider', () => ({
  LocalizationProvider: ({ children }) => <>{children}</>,
}));

jest.mock('@mui/x-date-pickers/DatePicker', () => ({
  DatePicker: ({ value, onChange }) => (
    <input
      aria-label="date-picker"
      value={value || ''}
      onChange={(e) => onChange?.(e.target.value ? { format: () => e.target.value } : null)}
    />
  ),
}));

jest.mock('@mui/x-data-grid', () => ({
  DataGrid: ({ rows = [], columns = [], getRowId, onRowSelectionModelChange, apiRef }) => {
    if (apiRef) {
      apiRef.current = {
        scrollToIndexes: jest.fn(),
      };
    }

    return (
      <div data-testid="mock-grid">
        <div data-testid="rows-count">{rows.length}</div>
        {rows.map((row) => {
          const id = getRowId ? getRowId(row) : row.id;
          return (
            <div key={id}>
              <button
                type="button"
                onClick={() => onRowSelectionModelChange?.({ ids: new Set([id]) })}
              >
                select-{id}
              </button>
              {columns.map((col) => (
                <div key={col.field}>
                  {col.renderCell
                    ? col.renderCell({ row, value: row[col.field] })
                    : String(row[col.field] ?? '')}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    );
  },
}));

jest.mock('sweetalert2', () => ({
  __esModule: true,
  default: {
    fire: jest.fn(),
  },
}));

describe('HcmUserList', () => {
  const users = [
    {
      PK_Number: 1,
      CustomerNum: '12345',
      UserName: 'Alice Smith',
      UserTitle: 'Manager',
      UserEmail: 'alice@example.com',
      TelNum: '1111111111',
      UserAction: 'Add',
      UserID: 'alice.s',
      PROD_Password: 'abc123',
      DateDeleted: null,
      DateAdded: null,
      ChangeDate: null,
    },
  ];

  const getValuesSac = (field) => {
    if (field === 'CustomerNum') return '12345';
    if (field === 'CustomerName') return 'Acme Corp';
    if (field === 'Stage') return 'Underwriter';
    if (field === 'IsSubmitted') return 0;
    return '';
  };

  beforeEach(() => {
    jest.clearAllMocks();

    useSelector.mockImplementation((selector) =>
      selector({ auth: { user: { role: 'Admin' } } }),
    );

    api.get.mockResolvedValue({ data: users });
    api.post.mockResolvedValue({ status: 200 });
    Swal.fire.mockResolvedValue({ isConfirmed: true });

    global.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
    global.URL.revokeObjectURL = jest.fn();
  });

  function renderComponent() {
    return render(<HcmUserList getValuesSac={getValuesSac} />);
  }

  it('fetches HCM users on mount', async () => {
    renderComponent();

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/hcm_users/', {
        params: { CustomerNum: '12345' },
      });
    });

    expect(await screen.findByRole('button', { name: 'Edit' })).toBeInTheDocument();
  });

  it('downloads email draft for selected user', async () => {
    const appendSpy = jest.spyOn(document.body, 'appendChild');
    const removeSpy = jest.spyOn(document.body, 'removeChild');
    const clickSpy = jest
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(() => {});

    renderComponent();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'select-1' })).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: 'select-1' }));
    await userEvent.click(screen.getByRole('button', { name: 'Download Email Draft' }));

    await waitFor(() => {
      expect(global.URL.createObjectURL).toHaveBeenCalled();
      expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
    });

    expect(appendSpy).toHaveBeenCalled();
    expect(removeSpy).toHaveBeenCalled();

    appendSpy.mockRestore();
    removeSpy.mockRestore();
    clickSpy.mockRestore();
  });

  it('does not post when save is clicked with unchanged data', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: 'Edit' }));
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => {
      expect(api.post).not.toHaveBeenCalledWith('/hcm_users/upsert', expect.anything());
    });
  });

  it('posts updated users on save when data changes', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: 'Edit' }));

    const textboxes = screen.getAllByRole('textbox');
    await userEvent.clear(textboxes[0]);
    await userEvent.type(textboxes[0], 'Alice Updated');

    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(
        '/hcm_users/upsert',
        expect.arrayContaining([
          expect.objectContaining({
            UserName: 'Alice Updated',
            CustomerNum: '12345',
          }),
        ]),
      );
    });
  });

  it('shows validation alert when submitting invalid new row', async () => {
    renderComponent();

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
