import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LossRunScheduling from './LossRunScheduling';
import useDropdownData from '../../../../hooks/useDropdownData';

const mockSetValue = jest.fn();
const mockGetValues = jest.fn();
let mockPathname = '/sac-view-account/CustomerNum=100';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({ pathname: mockPathname }),
}));

jest.mock('../../../../hooks/useDropdownData', () => jest.fn());

jest.mock('../../../ui/MonthRow', () => ({ tabName, index }) => (
  <div data-testid="month-row">{`${tabName}-${index}`}</div>
));

jest.mock('../../../ui/Modal', () => ({ open, children }) =>
  open ? <div data-testid="modal">{children}</div> : null,
);

jest.mock('./ReportRecipientList', () => ({ url, parameter }) => (
  <div data-testid="recipient-list">{`${url}::${JSON.stringify(parameter)}`}</div>
));

jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  useFormContext: () => ({
    control: {},
    setValue: mockSetValue,
    getValues: mockGetValues,
  }),
  Controller: ({ name, render }) =>
    render({
      field: {
        value: name === 'AddCommentLossRun' ? true : '',
        onChange: jest.fn(),
        ref: jest.fn(),
      },
    }),
}));

describe('LossRunScheduling', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPathname = '/sac-view-account/CustomerNum=100';
    mockGetValues.mockImplementation((name) => {
      if (name === 'AddCommentLossRun') return true;
      if (name === 'CustomerNum') return '100';
      if (name === 'ProgramName') return 'Prog-A';
      return '';
    });
    useDropdownData.mockReturnValue({
      data: [{ DD_Value: 'Monthly' }],
      loading: false,
    });
  });

  it('renders SAC note, month rows, and updates AddComment flag', async () => {
    render(<LossRunScheduling isEnabled={() => true} />);

    expect(
      screen.getByText('See additional notes for special instructions'),
    ).toBeInTheDocument();
    expect(screen.getAllByTestId('month-row')).toHaveLength(12);

    await userEvent.click(screen.getByRole('checkbox'));

    expect(mockSetValue).toHaveBeenCalledWith('AddCommentLossRun', false);
  });

  it('checks and unchecks all month flags', async () => {
    render(<LossRunScheduling isEnabled={() => true} />);

    await userEvent.click(screen.getByRole('button', { name: 'Check All' }));
    await userEvent.click(screen.getByRole('button', { name: 'Un-Check All' }));

    expect(mockSetValue).toHaveBeenCalledWith('LossRunCheckboxes.0.checked', true);
    expect(mockSetValue).toHaveBeenCalledWith('LossRunCheckboxes.11.checked', true);
    expect(mockSetValue).toHaveBeenCalledWith('LossRunCheckboxes.0.checked', false);
    expect(mockSetValue).toHaveBeenCalledWith('LossRunCheckboxes.11.checked', false);
  });

  it('opens recipients list with SAC endpoint', async () => {
    render(<LossRunScheduling isEnabled={() => true} />);

    await userEvent.click(
      screen.getByRole('button', { name: 'See Loss Run Report Recipients List' }),
    );

    expect(screen.getByTestId('modal')).toBeInTheDocument();
    expect(screen.getByTestId('recipient-list')).toHaveTextContent(
      '/loss_run_distribution/',
    );
    expect(screen.getByTestId('recipient-list')).toHaveTextContent('"CustomerNum":"100"');
  });

  it('uses affinity endpoint on affinity routes', async () => {
    mockPathname = '/affinity-view-program/ProgramName=Prog-A';

    render(<LossRunScheduling isEnabled={() => true} />);

    await userEvent.click(
      screen.getByRole('button', { name: 'See Loss Run Report Recipients List' }),
    );

    expect(screen.getByTestId('recipient-list')).toHaveTextContent(
      '/loss_run_distribution_affinity/',
    );
    expect(screen.getByTestId('recipient-list')).toHaveTextContent(
      '"ProgramName":"Prog-A"',
    );
  });
});
