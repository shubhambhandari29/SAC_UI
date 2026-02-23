import { render, screen } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import Deductible from './Deductible';

let mockPathname = '/view-policy/PK_Number=1';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({ pathname: mockPathname }),
}));

jest.mock('../../../../ui/CurrencyField', () => ({ label }) => (
  <input aria-label={label} />
));

function DeductibleForm({ isEnabled = () => true, isNextMod = false, pkProp = 1 }) {
  const methods = useForm({
    defaultValues: {
      BillExpYN: '',
      BillName: '',
      LargeDeductYN: '',
      AggMet: '',
      LCYN: '',
      LCFrate: '',
      LCBank: '',
      FeatType: '',
      SentParagon: '',
      DeductNotesOne: '',
      DeductNotesTwo: '',
    },
  });

  return (
    <FormProvider {...methods}>
      <Deductible isEnabled={isEnabled} isNextMod={isNextMod} pkProp={pkProp} />
    </FormProvider>
  );
}

describe('view-policies/Deductible', () => {
  beforeEach(() => {
    mockPathname = '/view-policy/PK_Number=1';
  });

  it('renders core deductible fields', () => {
    render(<DeductibleForm />);

    expect(
      screen.getByText('This is for a 3rd Party Liability deductible'),
    ).toBeInTheDocument();
    expect(screen.getAllByText('Bill for Expenses?').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Biller Name').length).toBeGreaterThan(0);
    expect(screen.getAllByRole('combobox').length).toBeGreaterThanOrEqual(5);
    expect(screen.getByLabelText('Deductible Amt $')).toBeInTheDocument();
    expect(screen.getByLabelText('Amount $')).toBeInTheDocument();
  });

  it('shows report visibility notes on view-policy screen', () => {
    render(<DeductibleForm isNextMod={false} pkProp={1} />);

    expect(
      screen.getByText('This comment section WILL appear on report'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('This comment section WILL NOT appear on report'),
    ).toBeInTheDocument();
  });

  it('hides report visibility notes on create-new-policy screen', () => {
    mockPathname = '/create-new-policy';

    render(<DeductibleForm isNextMod={false} pkProp={1} />);

    expect(
      screen.queryByText('This comment section WILL appear on report'),
    ).not.toBeInTheDocument();
  });
});
