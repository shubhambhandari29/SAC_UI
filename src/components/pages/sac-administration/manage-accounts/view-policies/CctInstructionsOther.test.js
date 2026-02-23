import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormProvider, useForm } from 'react-hook-form';
import { MemoryRouter } from 'react-router-dom';
import CctInstructionsOther from './CctInstructionsOther';

let mockPathname = '/view-policy/PK_Number=5';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({ pathname: mockPathname }),
}));

jest.mock('./UpdateAllBtn', () => ({ fieldName }) => (
  <button type="button">update-{fieldName}</button>
));

function CctInstructionsOtherForm({ isEnabled = () => true, defaults = {} }) {
  const methods = useForm({
    defaultValues: {
      AddLDocs: 'No',
      AcctLocID: '',
      AcctLocNotes: '',
      PMSUnit: '',
      PMSUnitNotes: '',
      CCTOtherNotes: '',
      ...defaults,
    },
  });

  return (
    <MemoryRouter>
      <FormProvider {...methods}>
        <CctInstructionsOther isEnabled={isEnabled} />
      </FormProvider>
    </MemoryRouter>
  );
}

describe('view-policies/CctInstructionsOther', () => {
  beforeEach(() => {
    mockPathname = '/view-policy/PK_Number=5';
  });

  it('renders base fields and update button on view-policy route', () => {
    render(<CctInstructionsOtherForm />);

    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByLabelText('Account Location Notes')).toBeInTheDocument();
    expect(screen.getByLabelText('PMS Unit Notes')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'update-UnderwriterName' })).toBeInTheDocument();
  });

  it('shows network-drive link when additional docs are Yes', () => {
    render(<CctInstructionsOtherForm defaults={{ AddLDocs: 'Yes' }} />);

    expect(screen.getByText('Network Drive Folder')).toBeInTheDocument();
  });

  it('sets account location note text based on radio option and supports undo', async () => {
    render(<CctInstructionsOtherForm />);

    await userEvent.click(screen.getAllByLabelText('Use Desktop Shortcut')[0]);

    expect(screen.getByLabelText('Account Location Notes')).toHaveValue(
      'Use Desktop Shortcut',
    );

    const undoButtons = screen.getAllByRole('button');
    await userEvent.click(undoButtons[0]);

    await waitFor(() => {
      expect(screen.getByLabelText('Account Location Notes')).toHaveValue('');
    });
  });

  it('sets PMS unit note text and clears via undo', async () => {
    render(<CctInstructionsOtherForm />);

    await userEvent.click(screen.getAllByLabelText('Use Desktop Shortcut')[1]);

    expect(screen.getByLabelText('PMS Unit Notes')).toHaveValue(
      'Use Desktop Shortcut',
    );

    const undoButtons = screen.getAllByRole('button');
    await userEvent.click(undoButtons[1]);

    await waitFor(() => {
      expect(screen.getByLabelText('PMS Unit Notes')).toHaveValue('');
    });
  });

  it('hides update button on create-new-policy route', () => {
    mockPathname = '/create-new-policy';

    render(<CctInstructionsOtherForm />);

    expect(
      screen.queryByRole('button', { name: 'update-UnderwriterName' }),
    ).not.toBeInTheDocument();
  });
});
