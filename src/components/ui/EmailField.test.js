import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormProvider, useForm } from 'react-hook-form';
import EmailField from './EmailField';

function EmailFieldForm() {
  const methods = useForm({ defaultValues: { email: '' } });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(jest.fn())}>
        <EmailField name="email" control={methods.control} label="Email" />
        <button type="submit">Submit</button>
      </form>
    </FormProvider>
  );
}

describe('EmailField', () => {
  it('marks input invalid for malformed email on submit', async () => {
    render(<EmailFieldForm />);

    const input = screen.getByLabelText('Email');
    await userEvent.type(input, 'bad-email');
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });
  });

  it('keeps input valid for well-formed email', async () => {
    render(<EmailFieldForm />);

    const input = screen.getByLabelText('Email');
    await userEvent.type(input, 'ok@example.com');
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(input).toHaveAttribute('aria-invalid', 'false');
    });
  });
});
