import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormProvider, useForm } from 'react-hook-form';
import NcmTab from './NcmTab';

jest.mock('@mui/x-date-pickers/LocalizationProvider', () => ({
  LocalizationProvider: ({ children }) => <>{children}</>,
}));

jest.mock('@mui/x-date-pickers/DatePicker', () => ({
  DatePicker: ({ label, disabled }) => (
    <input aria-label={label} disabled={disabled} readOnly />
  ),
}));

function NcmTabForm() {
  const methods = useForm({
    defaultValues: {
      NCMStatus: 'Active',
      NCMStartDt: '',
      NCMEndDt: '',
    },
  });

  return (
    <FormProvider {...methods}>
      <NcmTab isEnabled={() => true} />
    </FormProvider>
  );
}

describe('NcmTab', () => {
  it('keeps NT24 End Date disabled while status is Active', async () => {
    render(<NcmTabForm />);

    await waitFor(() => {
      expect(screen.getByLabelText('NT24 End Date')).toBeDisabled();
    });
  });

  it('enables NT24 End Date after changing status to Inactive', async () => {
    render(<NcmTabForm />);

    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.click(screen.getByRole('option', { name: 'Inactive' }));

    await waitFor(() => {
      expect(screen.getByLabelText('NT24 End Date')).toBeEnabled();
    });
  });
});
