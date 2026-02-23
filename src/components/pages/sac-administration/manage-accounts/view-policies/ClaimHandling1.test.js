import { render, screen } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import ClaimHandling1 from './ClaimHandling1';
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

function ClaimHandling1Form() {
  const methods = useForm({
    defaultValues: { ContactInstruct: '', CoverageInstruct: '' },
  });

  return (
    <FormProvider {...methods}>
      <ClaimHandling1 isEnabled={() => true} />
    </FormProvider>
  );
}

describe('ClaimHandling1', () => {
  beforeEach(() => {
    useSelector.mockImplementation((selector) =>
      selector({ auth: { user: { role: 'Admin' } } }),
    );
  });

  it('shows update buttons on view-policy routes', () => {
    mockLocation = { pathname: '/view-policy/PK_Number=1' };

    render(<ClaimHandling1Form />);

    expect(screen.getByText('Update-ContactInstruct')).toBeInTheDocument();
    expect(screen.getByText('Update-CoverageInstruct')).toBeInTheDocument();
  });

  it('hides update buttons on create-new-policy routes', () => {
    mockLocation = { pathname: '/create-new-policy' };

    render(<ClaimHandling1Form />);

    expect(screen.queryByText('Update-ContactInstruct')).not.toBeInTheDocument();
    expect(screen.queryByText('Update-CoverageInstruct')).not.toBeInTheDocument();
  });
});
