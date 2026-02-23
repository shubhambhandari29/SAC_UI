import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormProvider, useForm } from 'react-hook-form';
import ClaimHandling1 from './ClaimHandling1';

function ClaimHandling1Form({ isEnabled }) {
  const methods = useForm({
    defaultValues: {
      ContactInstruct: '',
      CoverageInstruct: '',
    },
  });

  return (
    <FormProvider {...methods}>
      <ClaimHandling1 isEnabled={isEnabled} />
    </FormProvider>
  );
}

describe('view-policy-types/ClaimHandling1', () => {
  it('renders both instruction fields', () => {
    render(<ClaimHandling1Form isEnabled={() => true} />);

    expect(screen.getByLabelText('Contact Instructions')).toBeInTheDocument();
    expect(screen.getByLabelText('Coverage Instructions')).toBeInTheDocument();
  });

  it('disables contact instructions when field is not enabled', () => {
    render(
      <ClaimHandling1Form
        isEnabled={(fieldName) => fieldName !== 'ContactInstruct'}
      />,
    );

    expect(screen.getByLabelText('Contact Instructions')).toBeDisabled();
    expect(screen.getByLabelText('Coverage Instructions')).toBeEnabled();
  });

  it('disables coverage instructions when field is not enabled', () => {
    render(
      <ClaimHandling1Form
        isEnabled={(fieldName) => fieldName !== 'CoverageInstruct'}
      />,
    );

    expect(screen.getByLabelText('Contact Instructions')).toBeEnabled();
    expect(screen.getByLabelText('Coverage Instructions')).toBeDisabled();
  });

  it('updates contact instructions when typing', async () => {
    render(<ClaimHandling1Form isEnabled={() => true} />);

    const input = screen.getByLabelText('Contact Instructions');
    await userEvent.type(input, 'Reach insured first');

    expect(input).toHaveValue('Reach insured first');
  });
});
