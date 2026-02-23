import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormProvider, useForm } from 'react-hook-form';
import PhoneField from './PhoneField';

function PhoneFieldForm({ isMobile = false }) {
  const methods = useForm({ defaultValues: { phone: '' } });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(jest.fn())}>
        <PhoneField
          name="phone"
          control={methods.control}
          label="Phone"
          isMobile={isMobile}
        />
        <button type="submit">Submit</button>
      </form>
    </FormProvider>
  );
}

describe('PhoneField', () => {
  it('formats mobile number as user types', async () => {
    render(<PhoneFieldForm isMobile />);

    const input = screen.getByLabelText('Phone');
    await userEvent.type(input, '1234567890');

    expect(input).toHaveValue('(123) 456-7890');
  });

  it('shows validation message for short non-mobile number', async () => {
    render(<PhoneFieldForm />);

    const input = screen.getByLabelText('Phone');
    await userEvent.type(input, '12345');
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(screen.getByText('Phone number should have at least 10 digits')).toBeInTheDocument();
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });
  });
});
