import { render, screen } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import ClaimHandling3 from './ClaimHandling3';
import { useSelector } from 'react-redux';

let mockLocation = { pathname: '/view-policy/PK_Number=1' };

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => mockLocation,
}));

jest.mock('react-redux', () => ({ useSelector: jest.fn() }));

jest.mock('./UpdateAllBtn', () => ({ fieldName }) => (
  <button type="button">Update-{fieldName}</button>
));

function ClaimHandling3Form() {
  const methods = useForm({
    defaultValues: { RecoveryInstruct: '', MiscCovInstruct: '' },
  });

  return (
    <FormProvider {...methods}>
      <ClaimHandling3 isEnabled={() => true} />
    </FormProvider>
  );
}

describe('ClaimHandling3', () => {
  beforeEach(() => {
    useSelector.mockImplementation((selector) =>
      selector({ auth: { user: { role: 'Admin' } } }),
    );
  });

  it('shows update buttons on view-policy routes', () => {
    mockLocation = { pathname: '/view-policy/PK_Number=1' };

    render(<ClaimHandling3Form />);

    expect(screen.getByText('Update-RecoveryInstruct')).toBeInTheDocument();
    expect(screen.getByText('Update-MiscCovInstruct')).toBeInTheDocument();
  });

  it('hides update buttons on create-new-policy routes', () => {
    mockLocation = { pathname: '/create-new-policy' };

    render(<ClaimHandling3Form />);

    expect(screen.queryByText('Update-RecoveryInstruct')).not.toBeInTheDocument();
    expect(screen.queryByText('Update-MiscCovInstruct')).not.toBeInTheDocument();
  });
});
