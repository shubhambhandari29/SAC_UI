import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormProvider, useForm } from 'react-hook-form';
import GeneralProgram from './GeneralProgram';

jest.mock('../../../../ui/Modal', () => ({ open, title, children }) => (
  <div data-testid="mock-modal">
    <div>{title}</div>
    {open ? <div data-testid="modal-open">{children}</div> : null}
  </div>
));

jest.mock('../ReportRecipientList', () => ({ url, parameter }) => (
  <div data-testid="recipient-list" data-url={url} data-program-name={parameter?.ProgramName} />
));

function GeneralProgramForm({ isEnabled }) {
  const methods = useForm({
    defaultValues: {
      ProgramName: 'Program A',
      PolicyNotes: '',
    },
  });

  return (
    <FormProvider {...methods}>
      <GeneralProgram isEnabled={isEnabled} />
    </FormProvider>
  );
}

describe('view-policy-types/GeneralProgram', () => {
  it('renders report recipients button and policy notes field', () => {
    render(<GeneralProgramForm isEnabled={() => true} />);

    expect(
      screen.getByRole('button', { name: 'Report Recipients' }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Affinity Program Notes')).toBeInTheDocument();
  });

  it('disables report recipients button when not enabled', () => {
    render(
      <GeneralProgramForm
        isEnabled={(fieldName) => fieldName !== 'ReportRecipientBtn'}
      />,
    );

    expect(screen.getByRole('button', { name: 'Report Recipients' })).toBeDisabled();
  });

  it('opens modal and passes ProgramName to recipient list', async () => {
    render(<GeneralProgramForm isEnabled={() => true} />);

    await userEvent.click(screen.getByRole('button', { name: 'Report Recipients' }));

    const recipientList = screen.getByTestId('recipient-list');
    expect(screen.getByTestId('modal-open')).toBeInTheDocument();
    expect(recipientList).toHaveAttribute('data-url', '/policy_type_distribution_affinity/');
    expect(recipientList).toHaveAttribute('data-program-name', 'Program A');
  });

  it('disables policy notes field when not enabled', () => {
    render(
      <GeneralProgramForm isEnabled={(fieldName) => fieldName !== 'PolicyNotes'} />,
    );

    expect(screen.getByLabelText('Affinity Program Notes')).toBeDisabled();
  });
});
