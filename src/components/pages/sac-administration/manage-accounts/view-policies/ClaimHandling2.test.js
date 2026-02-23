import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormProvider, useForm } from 'react-hook-form';
import ClaimHandling2 from './ClaimHandling2';
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

function ClaimHandling2Form() {
  const methods = useForm({
    defaultValues: {
      PrefCounselYN: 'No',
      LitigationInstruct: '',
    },
  });

  return (
    <FormProvider {...methods}>
      <ClaimHandling2 isEnabled={() => true} />
    </FormProvider>
  );
}

describe('ClaimHandling2', () => {
  beforeEach(() => {
    useSelector.mockImplementation((selector) =>
      selector({ auth: { user: { role: 'Admin' } } }),
    );
  });

  it('hides preferred counsel details when status is not Yes', () => {
    render(<ClaimHandling2Form />);

    expect(screen.queryByLabelText('Preferred Counsel Firm Name')).not.toBeInTheDocument();
  });

  it('shows preferred counsel details when status is changed to Yes', async () => {
    render(<ClaimHandling2Form />);

    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.click(screen.getByRole('option', { name: 'Yes' }));

    await waitFor(() => {
      expect(screen.getByLabelText('Preferred Counsel Firm Name')).toBeInTheDocument();
    });
  });

  it('renders update buttons on view-policy route', () => {
    mockLocation = { pathname: '/view-policy/PK_Number=1' };

    render(<ClaimHandling2Form />);

    expect(screen.getByText('Update-PrefCounselYN')).toBeInTheDocument();
    expect(screen.getByText('Update-LitigationInstruct')).toBeInTheDocument();
  });
});
