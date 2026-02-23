import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DeductibleBill from './DeductibleBill';
import useDropdownData from '../../../../../hooks/useDropdownData';

const mockSetValue = jest.fn();
const mockGetValues = jest.fn();

jest.mock('../../../../../hooks/useDropdownData', () => jest.fn());

jest.mock('../../../../ui/MonthRow', () => ({ tabName, index }) => (
  <div data-testid="month-row">{`${tabName}-${index}`}</div>
));

jest.mock('../../../../ui/Modal', () => ({ open, children }) =>
  open ? <div data-testid="modal">{children}</div> : null,
);

jest.mock('../../../../ui/CurrencyField', () => ({ label }) => (
  <input aria-label={label} />
));

jest.mock('../ReportRecipientList', () => ({ url, parameter }) => (
  <div data-testid="recipient-list">{`${url}::${JSON.stringify(parameter)}`}</div>
));

jest.mock('@mui/x-date-pickers/LocalizationProvider', () => ({
  LocalizationProvider: ({ children }) => <>{children}</>,
}));

jest.mock('@mui/x-date-pickers/DatePicker', () => ({
  DatePicker: ({ label }) => <input aria-label={label} />,
}));

jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  useFormContext: () => ({
    control: {},
    setValue: mockSetValue,
    getValues: mockGetValues,
  }),
  Controller: ({ render, name }) =>
    render({
      field: {
        value: name === 'DeductNotes' ? '' : '',
        onChange: jest.fn(),
        ref: jest.fn(),
      },
    }),
}));

describe('DeductibleBill', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetValues.mockImplementation((name) => {
      if (name === 'CustomerNum') return '100';
      return '';
    });
    useDropdownData.mockReturnValue({
      data: [{ DD_Value: 'Monthly' }],
      loading: false,
    });
  });

  it('renders key controls and month rows', () => {
    render(<DeductibleBill isEnabled={() => true} />);

    expect(screen.getByLabelText('Distribution Frequency')).toBeInTheDocument();
    expect(screen.getByLabelText('Due Date')).toBeInTheDocument();
    expect(screen.getByLabelText('Received Date')).toBeInTheDocument();
    expect(screen.getByLabelText('Total Amount Due')).toBeInTheDocument();
    expect(screen.getAllByTestId('month-row')).toHaveLength(12);
  });

  it('checks and unchecks all deductible months', async () => {
    render(<DeductibleBill isEnabled={() => true} />);

    await userEvent.click(screen.getByRole('button', { name: 'Check All' }));
    await userEvent.click(screen.getByRole('button', { name: 'Un-Check All' }));

    expect(mockSetValue).toHaveBeenCalledWith('DeductCheckboxes.0', true);
    expect(mockSetValue).toHaveBeenCalledWith('DeductCheckboxes.11', true);
    expect(mockSetValue).toHaveBeenCalledWith('DeductCheckboxes.0', false);
    expect(mockSetValue).toHaveBeenCalledWith('DeductCheckboxes.11', false);
  });

  it('opens report recipients modal with customer parameter', async () => {
    render(<DeductibleBill isEnabled={() => true} />);

    await userEvent.click(screen.getByRole('button', { name: 'Report Recipients' }));

    expect(screen.getByTestId('modal')).toBeInTheDocument();
    expect(screen.getByTestId('recipient-list')).toHaveTextContent(
      '/deduct_bill_distribution/',
    );
    expect(screen.getByTestId('recipient-list')).toHaveTextContent('"CustomerNum":"100"');
  });
});
