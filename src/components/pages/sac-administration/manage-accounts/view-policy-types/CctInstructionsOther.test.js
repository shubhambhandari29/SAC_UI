import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormProvider, useForm } from 'react-hook-form';
import CctInstructionsOther from './CctInstructionsOther';

function CctInstructionsOtherForm({ isEnabled }) {
  const methods = useForm({
    defaultValues: {
      AddLDocs: 'No',
      AcctLocID: '',
      AcctLocNotes: '',
      CCTOtherNotes: '',
      AcctProdClaims: 'No',
      AcctValetCov: 'No',
    },
  });

  return (
    <FormProvider {...methods}>
      <CctInstructionsOther isEnabled={isEnabled} />
    </FormProvider>
  );
}

describe('view-policy-types/CctInstructionsOther', () => {
  it('renders core controls and notes fields', () => {
    render(<CctInstructionsOtherForm isEnabled={() => true} />);

    expect(screen.getAllByRole('combobox')[0]).toBeInTheDocument();
    expect(screen.getByLabelText('Account Location Notes')).toBeInTheDocument();
    expect(screen.getByLabelText('Other Additional Instructions')).toBeInTheDocument();
  });

  it('sets account location notes for Use Desktop Shortcut option', async () => {
    render(<CctInstructionsOtherForm isEnabled={() => true} />);

    await userEvent.click(screen.getByLabelText('Use Desktop Shortcut'));

    expect(screen.getByLabelText('Account Location Notes')).toHaveValue(
      'Use Desktop Shortcut',
    );
  });

  it('sets account location notes to empty for See Notes option', async () => {
    render(<CctInstructionsOtherForm isEnabled={() => true} />);

    await userEvent.click(screen.getByLabelText('Use Desktop Shortcut'));
    await userEvent.click(screen.getByLabelText('See Notes'));

    expect(screen.getByLabelText('Account Location Notes')).toHaveValue('');
  });

  it('sets account location notes to None for None option', async () => {
    render(<CctInstructionsOtherForm isEnabled={() => true} />);

    await userEvent.click(screen.getByLabelText('None'));

    expect(screen.getByLabelText('Account Location Notes')).toHaveValue('None');
  });

  it('undo button clears account location notes', async () => {
    render(<CctInstructionsOtherForm isEnabled={() => true} />);

    await userEvent.click(screen.getByLabelText('Use Desktop Shortcut'));
    await userEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByLabelText('Account Location Notes')).toHaveValue('');
    });
  });

  it('disables account location radios when AcctLocID is not enabled', () => {
    render(
      <CctInstructionsOtherForm isEnabled={(fieldName) => fieldName !== 'AcctLocID'} />,
    );

    expect(screen.getByLabelText('Use Desktop Shortcut')).toBeDisabled();
    expect(screen.getByLabelText('See Notes')).toBeDisabled();
    expect(screen.getByLabelText('None')).toBeDisabled();
  });

  it('disables additional-documents select when AddLDocs is not enabled', () => {
    render(
      <CctInstructionsOtherForm isEnabled={(fieldName) => fieldName !== 'AddLDocs'} />,
    );

    expect(screen.getAllByRole('combobox')[0]).toHaveAttribute(
      'aria-disabled',
      'true',
    );
  });
});
