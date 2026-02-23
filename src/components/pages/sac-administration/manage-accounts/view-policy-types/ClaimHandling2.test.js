import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormProvider, useForm } from 'react-hook-form';
import ClaimHandling2 from './ClaimHandling2';

function ClaimHandling2Form({ isEnabled }) {
  const methods = useForm({
    defaultValues: {
      PrefCounselYN: 'No',
      LitigationInstruct: '',
    },
  });

  return (
    <FormProvider {...methods}>
      <ClaimHandling2 isEnabled={isEnabled} />
    </FormProvider>
  );
}

describe('view-policy-types/ClaimHandling2', () => {
  it('renders preferred counsel and litigation controls', () => {
    render(<ClaimHandling2Form isEnabled={() => true} />);

    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByLabelText('Litigation Instructions')).toBeInTheDocument();
  });

  it('disables preferred counsel select when field is not enabled', () => {
    render(
      <ClaimHandling2Form
        isEnabled={(fieldName) => fieldName !== 'PrefCounselYN'}
      />,
    );

    expect(screen.getByRole('combobox')).toHaveAttribute('aria-disabled', 'true');
  });

  it('disables litigation instructions when field is not enabled', () => {
    render(
      <ClaimHandling2Form
        isEnabled={(fieldName) => fieldName !== 'LitigationInstruct'}
      />,
    );

    expect(screen.getByLabelText('Litigation Instructions')).toBeDisabled();
  });

  it('changes preferred counsel value to Pending', async () => {
    render(<ClaimHandling2Form isEnabled={() => true} />);

    const select = screen.getByRole('combobox');
    await userEvent.click(select);
    await userEvent.click(screen.getByRole('option', { name: 'Pending' }));

    expect(select).toHaveTextContent('Pending');
  });

  it('updates litigation instructions text', async () => {
    render(<ClaimHandling2Form isEnabled={() => true} />);

    const input = screen.getByLabelText('Litigation Instructions');
    await userEvent.type(input, 'Escalate to legal team');

    expect(input).toHaveValue('Escalate to legal team');
  });
});
