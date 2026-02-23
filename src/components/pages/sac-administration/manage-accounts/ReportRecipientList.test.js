import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Controller } from 'react-hook-form';
import ReportRecipientList from './ReportRecipientList';
import api from '../../../../api/api';
import useDropdownData from '../../../../hooks/useDropdownData';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

jest.mock('../../../../api/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

jest.mock('../../../../hooks/useDropdownData', () => jest.fn());

jest.mock('../../../ui/Loader', () => ({ size }) => <div>loader:{size}</div>);

jest.mock('../../../ui/EmailField', () => ({ name, control }) => (
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

jest.mock('@mui/x-data-grid', () => ({
  DataGrid: ({ rows = [], columns = [] }) => (
    <div data-testid="mock-grid">
      <div data-testid="rows-count">{rows.length}</div>
      {rows.map((row) => (
        <div key={row.id}>
          {columns.map((col) => {
            if (col.field === 'actions' && col.renderCell) {
              const actionElement = col.renderCell({ row });
              if (!actionElement) return null;
              return (
                <button
                  key={`remove-${row.id}`}
                  type="button"
                  onClick={actionElement.props.children.props.onClick}
                >
                  remove-{row.id}
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

describe('ReportRecipientList', () => {
  const recipients = [
    {
      PK_Number: 10,
      CustomerNum: '12345',
      RecipCat: 'Insured',
      DistVia: 'Email',
      AttnTo: 'John Doe',
      EMailAddress: 'john@example.com',
    },
  ];

  const getValuesSac = (field) => {
    if (field === 'Stage') return 'Underwriter';
    if (field === 'IsSubmitted') return 0;
    return '';
  };

  beforeEach(() => {
    jest.clearAllMocks();

    useSelector.mockImplementation((selector) =>
      selector({ auth: { user: { role: 'Admin' } } }),
    );

    useDropdownData.mockReturnValue({
      data: [
        { DD_Type: 'RecipCat', DD_Value: 'Insured' },
        { DD_Type: 'DistVia', DD_Value: 'Email' },
      ],
      loading: false,
    });

    api.get.mockResolvedValue({ data: recipients });
    api.post.mockResolvedValue({ data: { url: 'https://outlook.test/compose' } });
    Swal.fire.mockResolvedValue({ isConfirmed: true });
  });

  function renderComponent() {
    return render(
      <ReportRecipientList
        url="/loss_run_distribution/"
        parameter={{ CustomerNum: '12345' }}
        getValuesSac={getValuesSac}
      />,
    );
  }

  it('fetches recipients and renders edit/email actions', async () => {
    renderComponent();

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/loss_run_distribution/', {
        params: { CustomerNum: '12345' },
      });
    });

    expect(await screen.findByRole('button', { name: 'Edit' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Send Email' })).toBeInTheDocument();
  });

  it('shows warning when compose pop-up is blocked', async () => {
    window.open = jest.fn(() => null);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Send Email' })).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: 'Send Email' }));

    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Pop-up blocked',
        icon: 'warning',
      }),
    );
  });

  it('opens compose URL when send email succeeds', async () => {
    const popup = { location: { href: '' }, close: jest.fn() };
    window.open = jest.fn(() => popup);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Send Email' })).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: 'Send Email' }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/outlook/compose_link', {
        recipients: ['john@example.com'],
      });
    });

    expect(popup.location.href).toBe('https://outlook.test/compose');
  });

  it('deletes removed recipients on save', async () => {
    renderComponent();

    expect(await screen.findByRole('button', { name: 'Edit' })).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Edit' }));
    await userEvent.click(screen.getAllByRole('button', { name: /remove-/i })[0]);
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/loss_run_distribution/delete', [
        {
          PK_Number: 10,
          CustomerNum: '12345',
          RecipCat: 'Insured',
          DistVia: 'Email',
          AttnTo: 'John Doe',
          EMailAddress: 'john@example.com',
        },
      ]);
    });
  });

  it('shows fetch error alert when recipient loading fails', async () => {
    api.get.mockRejectedValue(new Error('load failed'));

    renderComponent();

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Error',
          icon: 'error',
        }),
      );
    });
  });

  it('exits edit mode without save API call when data is unchanged', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: 'Edit' }));
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    });
    expect(api.post).not.toHaveBeenCalled();
  });

  it('upserts recipients when edited without deletions', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: 'Edit' }));

    const attnInput = await screen.findByDisplayValue('John Doe');
    await userEvent.clear(attnInput);
    await userEvent.type(attnInput, 'Jane Doe');
    fireEvent.keyDown(attnInput, { key: 'A' });

    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(
        '/loss_run_distribution/upsert',
        expect.arrayContaining([
          expect.objectContaining({
            AttnTo: 'Jane Doe',
          }),
        ]),
      );
    });
  });

  it('shows validation error when mandatory fields are blank', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: 'Edit' }));
    await userEvent.click(screen.getByRole('button', { name: 'Add Row' }));
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Data Validation Error',
          icon: 'error',
        }),
      );
    });
  });

  it('restores original rows on cancel', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: 'Edit' }));
    await userEvent.click(screen.getByRole('button', { name: 'Add Row' }));
    expect(screen.getByTestId('rows-count')).toHaveTextContent('2');

    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    expect(screen.getByTestId('rows-count')).toHaveTextContent('1');
  });

  it('shows compose error and closes popup when compose URL is missing', async () => {
    const popup = { location: { href: '' }, close: jest.fn() };
    window.open = jest.fn(() => popup);
    api.post.mockResolvedValue({ data: {} });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Send Email' })).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: 'Send Email' }));

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Error',
          text: 'Unable to open Outlook compose window',
        }),
      );
    });
    expect(popup.close).toHaveBeenCalled();
  });
});
