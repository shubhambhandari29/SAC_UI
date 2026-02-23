import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormProvider, useForm } from 'react-hook-form';
import ProgramGeneral from './ProgramGeneral';
import useDropdownData from '../../../../../hooks/useDropdownData';

jest.mock('../../../../../hooks/useDropdownData', () => jest.fn());

jest.mock('../../../../ui/Modal', () => ({ open, children, title }) =>
  open ? (
    <div>
      <div>{title}</div>
      {children}
    </div>
  ) : null,
);

jest.mock('./ViewAgentDetails', () => () => <div>ViewAgentDetailsContent</div>);

function ProgramGeneralForm({ isEnabled }) {
  const methods = useForm({
    defaultValues: {
      ProgramName: 'ABC Program',
      ServReq: '',
      ExceptYN: '',
      ExceptType: '',
      AcctNotes: '',
    },
  });

  return (
    <FormProvider {...methods}>
      <ProgramGeneral isEnabled={isEnabled} formData={null} />
    </FormProvider>
  );
}

describe('ProgramGeneral', () => {
  beforeEach(() => {
    useDropdownData.mockReturnValue({
      data: [{ DD_Type: 'ExceptType', DD_Value: 'Type A' }],
      loading: false,
    });
  });

  it('disables View Agent Details button when permission is denied', () => {
    render(<ProgramGeneralForm isEnabled={() => false} />);

    expect(screen.getByRole('button', { name: 'View Agent Details' })).toBeDisabled();
  });

  it('opens agent details modal when button is clicked', async () => {
    render(<ProgramGeneralForm isEnabled={() => true} />);

    await userEvent.click(screen.getByRole('button', { name: 'View Agent Details' }));

    expect(screen.getByText('Affinity Agent List')).toBeInTheDocument();
    expect(screen.getByText('ViewAgentDetailsContent')).toBeInTheDocument();
  });
});
