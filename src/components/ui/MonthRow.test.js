import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MonthRow from './MonthRow';

const mockSetValue = jest.fn();
const mockUseSelector = jest.fn();
let mockPathname = '/sac-view-account/CustomerNum=1';
const fieldValues = {};

jest.mock('react-redux', () => ({
  useSelector: (selector) => mockUseSelector(selector),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({ pathname: mockPathname }),
}));

jest.mock('@mui/x-date-pickers/LocalizationProvider', () => ({
  LocalizationProvider: ({ children }) => <>{children}</>,
}));

jest.mock('@mui/x-date-pickers/DatePicker', () => ({
  DatePicker: ({ onChange }) => (
    <button
      type="button"
      onClick={() =>
        onChange({
          format: () => '2025-01-15',
        })
      }
    >
      change-date
    </button>
  ),
}));

jest.mock('@mui/material', () => {
  const actual = jest.requireActual('@mui/material');
  return {
    ...actual,
    IconButton: ({ children, onClick, disabled }) => (
      <button
        type="button"
        aria-label="icon-button"
        disabled={disabled}
        onClick={onClick}
      >
        {children}
      </button>
    ),
    Select: ({ children, value, onChange, disabled }) => (
      <select
        aria-label="select"
        value={value || ''}
        disabled={disabled}
        onChange={(e) => onChange?.(e)}
      >
        {children}
      </select>
    ),
    MenuItem: ({ value, children }) => <option value={value}>{children}</option>,
  };
});

jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  useFormContext: () => ({ control: {}, setValue: mockSetValue }),
  Controller: ({ name, render }) =>
    render({
      field: {
        value:
          name in fieldValues
            ? fieldValues[name]
            : name.endsWith('.checked') ||
                name.endsWith('.NoClaims') ||
                name.endsWith('.AdHocReport')
              ? false
              : '',
        onChange: jest.fn(),
      },
    }),
}));

describe('MonthRow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPathname = '/sac-view-account/CustomerNum=1';
    mockUseSelector.mockImplementation((selector) =>
      selector({ auth: { user: { role: 'Admin' } } }),
    );
  });

  it('renders claim-review columns and updates sent/clear actions for admin', async () => {
    render(
      <MonthRow tabName="ClaimRevCheckboxes" month="Jan" index={0} />,
    );

    expect(screen.getByText('Report Type')).toBeInTheDocument();
    expect(screen.getByText('Delivery Method')).toBeInTheDocument();
    expect(screen.getByText(/Narratives/i)).toBeInTheDocument();
    expect(screen.getByText('No Report')).toBeInTheDocument();

    const iconButtons = screen.getAllByLabelText('icon-button');
    await userEvent.click(iconButtons[0]);

    expect(mockSetValue).toHaveBeenCalledWith(
      'ClaimRevCheckboxes.0.lastSendDate',
      new Date().toISOString().split('T')[0],
    );

    await userEvent.click(iconButtons[1]);

    expect(mockSetValue).toHaveBeenCalledWith('ClaimRevCheckboxes.0.checked', false);
    expect(mockSetValue).toHaveBeenCalledWith('ClaimRevCheckboxes.0.lastSendDate', null);
    expect(mockSetValue).toHaveBeenCalledWith('ClaimRevCheckboxes.0.NoClaims', false);
    expect(mockSetValue).toHaveBeenCalledWith('ClaimRevCheckboxes.0.AdHocReport', false);
    expect(mockSetValue).toHaveBeenCalledWith('ClaimRevCheckboxes.0.reportType', null);
    expect(mockSetValue).toHaveBeenCalledWith('ClaimRevCheckboxes.0.deliveryMethod', null);
    expect(mockSetValue).toHaveBeenCalledWith(
      'ClaimRevCheckboxes.0.narrativesProcessed',
      null,
    );
  });

  it('renders loss-run specific columns', () => {
    render(<MonthRow tabName="LossRunCheckboxes" month="Jan" index={0} />);

    expect(screen.getByText(/No\s*Claims/i)).toBeInTheDocument();
    expect(screen.getByText(/Ad\s*Hoc\s*Report/i)).toBeInTheDocument();
  });

  it('disables sent and clear actions for non-admin users', () => {
    mockUseSelector.mockImplementation((selector) =>
      selector({ auth: { user: { role: 'Underwriter' } } }),
    );

    render(<MonthRow tabName="LossRunCheckboxes" month="Jan" index={0} />);

    const iconButtons = screen.getAllByLabelText('icon-button');
    expect(iconButtons[0]).toBeDisabled();
    expect(iconButtons[1]).toBeDisabled();
  });

  it('does not include No Report option on non-sac paths', () => {
    mockPathname = '/affinity-view-program/ProgramName=A1';

    render(<MonthRow tabName="ClaimRevCheckboxes" month="Jan" index={0} />);

    expect(screen.queryByText('No Report')).not.toBeInTheDocument();
  });
});
