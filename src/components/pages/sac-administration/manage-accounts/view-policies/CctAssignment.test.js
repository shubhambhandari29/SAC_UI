import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormProvider, useForm } from 'react-hook-form';
import CctAssignment from './CctAssignment';

function CctAssignmentForm() {
  const methods = useForm({
    defaultValues: {
      SpecHand: 'Auto Assign',
      CCTAssgInstruct: '',
    },
  });

  return (
    <FormProvider {...methods}>
      <CctAssignment isEnabled={() => true} />
    </FormProvider>
  );
}

describe('CctAssignment', () => {
  it('keeps assignment instructions disabled for Auto Assign', () => {
    render(<CctAssignmentForm />);

    expect(screen.getByLabelText('CCT Assignment Instructions')).toBeDisabled();
  });

  it('enables assignment instructions when selection is See Assignment Instructions', async () => {
    render(<CctAssignmentForm />);

    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.click(
      screen.getByRole('option', { name: 'See Assignment Instructions' }),
    );

    expect(screen.getByLabelText('CCT Assignment Instructions')).toBeEnabled();
  });
});
