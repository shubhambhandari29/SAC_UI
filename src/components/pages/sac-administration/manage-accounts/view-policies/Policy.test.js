import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormProvider, useForm } from 'react-hook-form';
import Policy from './Policy';
import api from '../../../../../api/api';
import useDropdownData from '../../../../../hooks/useDropdownData';
import Swal from 'sweetalert2';

let mockPathname = '/view-policy/PK_Number=10';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({ pathname: mockPathname }),
}));

jest.mock('../../../../../api/api', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
  },
}));

jest.mock('../../../../../hooks/useDropdownData', () => jest.fn());

jest.mock('../../../../ui/Loader', () => ({ size }) => <div>loader:{size}</div>);

jest.mock('../../../../ui/CurrencyField', () => ({ label }) => (
  <input aria-label={label} />
));

jest.mock('./UpdateAllBtn', () => ({ fieldName }) => (
  <button type="button">update-{fieldName}</button>
));

jest.mock('@mui/x-date-pickers/LocalizationProvider', () => ({
  LocalizationProvider: ({ children }) => <>{children}</>,
}));

jest.mock('@mui/x-date-pickers/DatePicker', () => ({
  DatePicker: ({ label }) => <input aria-label={label} />,
}));

jest.mock('@mui/material', () => {
  const actual = jest.requireActual('@mui/material');
  return {
    ...actual,
    Autocomplete: ({ options = [], onChange, renderInput }) => {
      const input = renderInput({ inputProps: {}, InputProps: {} });
      const label = input?.props?.label || 'autocomplete';
      return (
        <div>
          {input}
          <button
            type="button"
            onClick={() => onChange({}, options[0] || null)}
          >
            {`pick-${label}`}
          </button>
        </div>
      );
    },
  };
});

jest.mock('sweetalert2', () => ({
  __esModule: true,
  default: {
    fire: jest.fn(),
  },
}));

function PolicyForm({ isEnabled = () => true, disableForDirector = false }) {
  const methods = useForm({
    defaultValues: {
      CustomerNum: '12345',
      UnderwriterName: 'Old UW',
      UWMgr: 'Manager A',
      DNRStatus: '',
      PremiumAmt: '',
    },
  });

  return (
    <FormProvider {...methods}>
      <Policy isEnabled={isEnabled} disableForDirector={disableForDirector} />
    </FormProvider>
  );
}

describe('view-policies/Policy', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPathname = '/view-policy/PK_Number=10';

    useDropdownData.mockImplementation((url) => {
      if (url === '/dropdowns/Underwriters') {
        return {
          data: [{ 'UW Last': 'New UW', 'UW Email': 'new@example.com' }],
          loading: false,
        };
      }
      if (url === '/dropdowns/DNRStatus') {
        return {
          data: [{ DD_Value: 'Expired', DD_SortOrder: 1 }],
          loading: false,
        };
      }
      return { data: [], loading: false };
    });

    api.post.mockResolvedValue({ status: 200 });
  });

  it('renders base policy controls and update buttons on view route', () => {
    render(<PolicyForm />);

    expect(screen.getByLabelText('Created On')).toBeInTheDocument();
    expect(screen.getByLabelText('Policy Did Not Renew Date')).toBeInTheDocument();
    expect(screen.getByLabelText('Policy Premium Amount $')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'update-UnderwriterName' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'update-UWMgr' })).toBeInTheDocument();
  });

  it('updates recipient lists when underwriter changes', async () => {
    render(<PolicyForm />);

    await userEvent.click(screen.getByRole('button', { name: 'pick-Underwriter Name' }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/claim_review_distribution/delete', [
        { CustomerNum: '12345', AttnTo: 'Old UW' },
      ]);
    });

    expect(api.post).toHaveBeenCalledWith('/loss_run_distribution/delete', [
      { CustomerNum: '12345', AttnTo: 'Old UW' },
    ]);
    expect(api.post).toHaveBeenCalledWith('/claim_review_distribution/upsert', [
      {
        CustomerNum: '12345',
        RecipCat: 'Underwriter',
        DistVia: 'Email',
        AttnTo: 'New UW',
        EMailAddress: 'new@example.com',
      },
    ]);
    expect(api.post).toHaveBeenCalledWith('/loss_run_distribution/upsert', [
      {
        CustomerNum: '12345',
        RecipCat: 'Underwriter',
        DistVia: 'Email',
        AttnTo: 'New UW',
        EMailAddress: 'new@example.com',
      },
    ]);
  });

  it('shows error alert when distribution update throws', async () => {
    api.post.mockImplementationOnce(() => {
      throw new Error('sync failure');
    });

    render(<PolicyForm />);

    await userEvent.click(screen.getByRole('button', { name: 'pick-Underwriter Name' }));

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Error',
          text: 'Some error occoured, unable to update data in distribution table',
        }),
      );
    });
  });

  it('hides update buttons on create-new-policy route', () => {
    mockPathname = '/create-new-policy';

    render(<PolicyForm />);

    expect(
      screen.queryByRole('button', { name: 'update-UnderwriterName' }),
    ).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'update-UWMgr' })).not.toBeInTheDocument();
  });
});
