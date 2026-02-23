import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormProvider, useForm } from 'react-hook-form';
import CctAssignment from './CctAssignment';

function CctAssignmentForm({ isEnabled }) {
  const methods = useForm({
    defaultValues: {
      SpecHand: 'Auto Assign',
      CCTAssgInstruct: '',
    },
  });

  return (
    <FormProvider {...methods}>
      <CctAssignment isEnabled={isEnabled} />
    </FormProvider>
  );
}

describe('view-policy-types/CctAssignment', () => {
  it('renders assignment select and instruction textarea', () => {
    render(<CctAssignmentForm isEnabled={() => true} />);

    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByLabelText('CCT Assignment Instructions')).toBeInTheDocument();
  });

  it('disables assignment select when SpecHand is not enabled', () => {
    render(
      <CctAssignmentForm isEnabled={(fieldName) => fieldName !== 'SpecHand'} />,
    );

    expect(screen.getByRole('combobox')).toHaveAttribute('aria-disabled', 'true');
  });

  it('disables instructions textarea when CCTAssgInstruct is not enabled', () => {
    render(
      <CctAssignmentForm
        isEnabled={(fieldName) => fieldName !== 'CCTAssgInstruct'}
      />,
    );

    expect(screen.getByLabelText('CCT Assignment Instructions')).toBeDisabled();
  });

  it('changes assignment selection to See Assignment Instructions', async () => {
    render(<CctAssignmentForm isEnabled={() => true} />);

    const select = screen.getByRole('combobox');

    await userEvent.click(select);
    await userEvent.click(
      screen.getByRole('option', { name: 'See Assignment Instructions' }),
    );

    expect(select).toHaveTextContent('See Assignment Instructions');
  });

  it('accepts textarea input when enabled', async () => {
    render(<CctAssignmentForm isEnabled={() => true} />);

    const input = screen.getByLabelText('CCT Assignment Instructions');
    await userEvent.type(input, 'Handle this account manually');

    expect(input).toHaveValue('Handle this account manually');
  });
});
