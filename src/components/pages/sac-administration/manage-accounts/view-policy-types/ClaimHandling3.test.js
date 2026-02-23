import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormProvider, useForm } from 'react-hook-form';
import ClaimHandling3 from './ClaimHandling3';

function ClaimHandling3Form({ isEnabled }) {
  const methods = useForm({
    defaultValues: {
      RecoveryInstruct: '',
      MiscCovInstruct: '',
    },
  });

  return (
    <FormProvider {...methods}>
      <ClaimHandling3 isEnabled={isEnabled} />
    </FormProvider>
  );
}

describe('view-policy-types/ClaimHandling3', () => {
  it('renders recovery and miscellaneous instruction fields', () => {
    render(<ClaimHandling3Form isEnabled={() => true} />);

    expect(screen.getByLabelText('Recovery Instructions')).toBeInTheDocument();
    expect(screen.getByLabelText('Miscellaneous Instructions')).toBeInTheDocument();
  });

  it('disables recovery instructions when field is not enabled', () => {
    render(
      <ClaimHandling3Form
        isEnabled={(fieldName) => fieldName !== 'RecoveryInstruct'}
      />,
    );

    expect(screen.getByLabelText('Recovery Instructions')).toBeDisabled();
    expect(screen.getByLabelText('Miscellaneous Instructions')).toBeEnabled();
  });

  it('disables miscellaneous instructions when field is not enabled', () => {
    render(
      <ClaimHandling3Form
        isEnabled={(fieldName) => fieldName !== 'MiscCovInstruct'}
      />,
    );

    expect(screen.getByLabelText('Recovery Instructions')).toBeEnabled();
    expect(screen.getByLabelText('Miscellaneous Instructions')).toBeDisabled();
  });

  it('updates miscellaneous instructions text', async () => {
    render(<ClaimHandling3Form isEnabled={() => true} />);

    const input = screen.getByLabelText('Miscellaneous Instructions');
    await userEvent.type(input, 'Coordinate with adjuster');

    expect(input).toHaveValue('Coordinate with adjuster');
  });
});
