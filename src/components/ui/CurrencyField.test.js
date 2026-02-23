import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormProvider, useForm } from 'react-hook-form';
import CurrencyField from './CurrencyField';

function CurrencyFieldForm() {
  const methods = useForm({ defaultValues: { amount: '' } });

  return (
    <FormProvider {...methods}>
      <CurrencyField name="amount" control={methods.control} label="Amount" />
    </FormProvider>
  );
}

describe('CurrencyField', () => {
  it('formats currency input and applies two decimals on blur', async () => {
    render(<CurrencyFieldForm />);

    const input = screen.getByLabelText('Amount');
    await userEvent.type(input, '1234');

    expect(input).toHaveValue('1,234');

    fireEvent.blur(input);

    await waitFor(() => expect(input).toHaveValue('1,234.00'));
  });

  it('ignores non-numeric characters', async () => {
    render(<CurrencyFieldForm />);

    const input = screen.getByLabelText('Amount');
    await userEvent.type(input, '12ab');

    expect(input).toHaveValue('12');
  });
});
