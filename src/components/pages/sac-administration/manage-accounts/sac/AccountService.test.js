import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormProvider, useForm } from 'react-hook-form';
import AccountService from './AccountService';
import api from '../../../../../api/api';
import useDropdownData from '../../../../../hooks/useDropdownData';
import Swal from 'sweetalert2';

let mockPathname = '/sac-view-account/CustomerNum=12345';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({ pathname: mockPathname }),
}));

jest.mock('../../../../../api/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

jest.mock('../../../../../hooks/useDropdownData', () => jest.fn());

jest.mock('../../../../ui/Modal', () => ({ open, children }) =>
  open ? <div data-testid="modal">{children}</div> : null,
);

jest.mock('./HcmUserList', () => () => <div>HcmUserListContent</div>);

jest.mock('../../../../ui/Loader', () => ({ size }) => <div>loader:{size}</div>);

jest.mock('../../../../ui/CurrencyField', () => ({ label }) => (
  <input aria-label={label} readOnly />
));

jest.mock('@mui/x-date-pickers/LocalizationProvider', () => ({
  LocalizationProvider: ({ children }) => <>{children}</>,
}));

jest.mock('@mui/x-date-pickers/DatePicker', () => ({
  DatePicker: ({ label }) => <input aria-label={label} readOnly />,
}));

jest.mock('sweetalert2', () => ({
  __esModule: true,
  default: {
    fire: jest.fn(),
  },
}));

function renderWithForm() {
  const Wrapper = ({ children }) => {
    const methods = useForm({
      defaultValues: {
        CustomerNum: '12345',
        CustomerName: 'Acme',
      },
    });
    return <FormProvider {...methods}>{children}</FormProvider>;
  };

  return render(
    <Wrapper>
      <AccountService isEnabled={() => true} />
    </Wrapper>,
  );
}

describe('AccountService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPathname = '/sac-view-account/CustomerNum=12345';

    api.get.mockResolvedValue({ status: 200, data: 2500.55 });

    useDropdownData.mockImplementation((url) => {
      if (url === '/dropdowns/ServLevel') {
        return {
          data: [{ 'service Level': 'SL1', 'Dollar Threshold': '1000' }],
          loading: false,
        };
      }

      return {
        data: [
          { DD_Type: 'HCMAccess', DD_Value: 'Enrolled' },
          { DD_Type: 'AccomType', DD_Value: 'Type A' },
          { DD_Type: 'ExceptType', DD_Value: 'Ex A' },
          { DD_Type: 'BusinessType', DD_Value: 'Special Account' },
        ],
        loading: false,
      };
    });
  });

  it('recalculates premium on mount for non-create route', async () => {
    renderWithForm();

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/sac_policies/get_premium', {
        params: { CustomerNum: '12345' },
      });
    });

    expect(
      await screen.findByRole('button', { name: 'Recalculate Premium' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'HCM Users List' })).toBeInTheDocument();
  });

  it('recalculates premium again when button is clicked', async () => {
    renderWithForm();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Recalculate Premium' })).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: 'Recalculate Premium' }));

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledTimes(2);
    });
  });

  it('shows disabled HCM user button on create-new-account route', async () => {
    mockPathname = '/sac-create-new-account';

    renderWithForm();

    expect(
      screen.queryByRole('button', { name: 'Recalculate Premium' }),
    ).not.toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'HCM Users List' })).toBeDisabled();
  });

  it('shows error alert when premium recalculation fails', async () => {
    api.get.mockRejectedValue(new Error('recalc failed'));

    renderWithForm();

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Error', icon: 'error' }),
      );
    });
  });
});
