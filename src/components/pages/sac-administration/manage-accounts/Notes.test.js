import { render, screen } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import Notes from './Notes';

function NotesForm({ isEnabled }) {
  const methods = useForm({ defaultValues: { ChangeNotes: 'hello' } });

  return (
    <FormProvider {...methods}>
      <Notes name="ChangeNotes" label="Change Notes" isEnabled={isEnabled} />
    </FormProvider>
  );
}

describe('Notes', () => {
  it('renders editable textarea when field is enabled', () => {
    render(<NotesForm isEnabled={() => true} />);

    expect(screen.getByLabelText('Change Notes')).toBeEnabled();
  });

  it('disables textarea when field is not enabled', () => {
    render(<NotesForm isEnabled={() => false} />);

    expect(screen.getByLabelText('Change Notes')).toBeDisabled();
  });
});
