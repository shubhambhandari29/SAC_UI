import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormProvider, useForm } from 'react-hook-form';
import CctInstructionsPolicy from './CctInstructionsPolicy';

function CctInstructionsPolicyForm() {
  const methods = useForm({
    defaultValues: {
      CCTBusLine: 'Auto',
      AcctProdClaims: 'No',
      AcctValetCov: 'No',
      UnManPol: '1',
      CCTAutoYN: '1',
      RentedHired: '1',
    },
  });

  return (
    <FormProvider {...methods}>
      <CctInstructionsPolicy isEnabled={() => true} />
    </FormProvider>
  );
}

describe('CctInstructionsPolicy', () => {
  it('clears CCT Auto policy selection when first cancel button is clicked', async () => {
    render(<CctInstructionsPolicyForm />);

    const cctAutoCompositeRated = screen.getAllByLabelText('Composite Rated')[0];
    expect(cctAutoCompositeRated).toBeChecked();

    await userEvent.click(
      screen.getByRole('button', { name: /clear cct auto policy/i }),
    );

    await waitFor(() => expect(cctAutoCompositeRated).not.toBeChecked());
  });

  it('clears Rented or Hired selection when second cancel button is clicked', async () => {
    render(<CctInstructionsPolicyForm />);

    const compositeRatedRadios = screen.getAllByLabelText('Composite Rated');
    expect(compositeRatedRadios[1]).toBeChecked();

    await userEvent.click(
      screen.getByRole('button', { name: /clear rented or hired/i }),
    );

    await waitFor(() => expect(compositeRatedRadios[1]).not.toBeChecked());
  });
});
