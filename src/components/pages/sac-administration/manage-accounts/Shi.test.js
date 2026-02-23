import { render, screen } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import Shi from './Shi';

let mockPathname = '/sac-view-account/CustomerNum=1';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({ pathname: mockPathname }),
}));

function ShiForm({ isEnabled = () => true }) {
  const methods = useForm({
    defaultValues: {
      SHI_Complete: 'Yes',
      SHI_Comments: '',
      SHIComplete: 'Yes',
      SHINotes: '',
    },
  });

  return (
    <FormProvider {...methods}>
      <Shi isEnabled={isEnabled} />
    </FormProvider>
  );
}

describe('manage-accounts/Shi', () => {
  it('uses SAC field names on SAC routes', () => {
    const isEnabled = jest.fn(() => true);
    mockPathname = '/sac-view-account/CustomerNum=1';

    render(<ShiForm isEnabled={isEnabled} />);

    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByLabelText('SHI Notes')).toBeInTheDocument();
    expect(isEnabled).toHaveBeenCalledWith('SHI_Complete');
    expect(isEnabled).toHaveBeenCalledWith('SHI_Comments');
  });

  it('uses affinity field names on non-SAC routes', () => {
    const isEnabled = jest.fn(() => true);
    mockPathname = '/affinity-view-program/ProgramName=A1';

    render(<ShiForm isEnabled={isEnabled} />);

    expect(isEnabled).toHaveBeenCalledWith('SHIComplete');
    expect(isEnabled).toHaveBeenCalledWith('SHINotes');
  });

  it('disables controls when SHI fields are not enabled', () => {
    mockPathname = '/sac-view-account/CustomerNum=1';

    render(<ShiForm isEnabled={() => false} />);

    expect(screen.getByRole('combobox')).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByLabelText('SHI Notes')).toBeDisabled();
  });
});
