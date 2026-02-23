import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormProvider, useForm } from 'react-hook-form';
import UpdateAllBtn from './UpdateAllBtn';
import api from '../../../../../api/api';
import Swal from 'sweetalert2';

jest.mock('../../../../../api/api', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
  },
}));

jest.mock('sweetalert2', () => ({
  __esModule: true,
  default: {
    fire: jest.fn(),
  },
}));

jest.mock('../../../../ui/Loader', () => () => <div data-testid="loader" />);

function UpdateAllBtnForm() {
  const methods = useForm({
    defaultValues: {
      CustomerNum: '1234567890',
      PolicyNum: 'POL1001',
      ContactInstruct: 'Call insured',
    },
  });

  return (
    <FormProvider {...methods}>
      <UpdateAllBtn fieldName="ContactInstruct" disabled={false} />
    </FormProvider>
  );
}

describe('UpdateAllBtn', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('updates by customer number when C is clicked', async () => {
    api.post.mockResolvedValue({ status: 200, data: { count: 2 } });

    render(<UpdateAllBtnForm />);

    await userEvent.click(screen.getByRole('button', { name: 'C' }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(
        '/sac_policies/update_field_for_all_policies',
        {
          updateVia: 'CustomerNum',
          updateViaValue: '1234567890',
          fieldName: 'ContactInstruct',
          fieldValue: 'Call insured',
        },
      );
    });

    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Update Successful',
        icon: 'success',
      }),
    );
  });

  it('shows no-match message when policy update affects only one row', async () => {
    api.post.mockResolvedValue({ status: 200, data: { count: 1 } });

    render(<UpdateAllBtnForm />);

    await userEvent.click(screen.getByRole('button', { name: 'P' }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(
        '/sac_policies/update_field_for_all_policies',
        expect.objectContaining({
          updateVia: 'PolicyNum',
          updateViaValue: 'POL1001',
        }),
      );
    });

    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'No Match',
        icon: 'error',
      }),
    );
  });
});
