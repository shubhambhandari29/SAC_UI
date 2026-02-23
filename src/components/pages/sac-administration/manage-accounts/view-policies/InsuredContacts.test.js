import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import InsuredContacts from './InsuredContacts';
import api from '../../../../../api/api';
import Swal from 'sweetalert2';

let mockPathname = '/view-policy/PK_Number=11';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({ pathname: mockPathname }),
}));

jest.mock('../../../../../api/api', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
  },
}));

jest.mock('./UpdateAllBtn', () => ({ fieldName }) => <button type="button">update-{fieldName}</button>);

jest.mock('../../../../ui/PhoneField', () => ({ name, label, control, disabled }) => (
  (() => {
    const { Controller: RHFController } = require('react-hook-form');
    return (
      <RHFController
    name={name}
    control={control}
    render={({ field }) => (
      <input aria-label={label || name} disabled={disabled} value={field.value || ''} onChange={field.onChange} />
    )}
      />
    );
  })()
));

jest.mock('../../../../ui/EmailField', () => ({ name, label, control, disabled }) => (
  (() => {
    const { Controller: RHFController } = require('react-hook-form');
    return (
      <RHFController
    name={name}
    control={control}
    render={({ field }) => (
      <input aria-label={label || name} disabled={disabled} value={field.value || ''} onChange={field.onChange} />
    )}
      />
    );
  })()
));

jest.mock('../../../../ui/Loader', () => ({ size }) => <div>loader:{size}</div>);

jest.mock('sweetalert2', () => ({
  __esModule: true,
  default: {
    fire: jest.fn(),
  },
}));

function renderWithForm(values = {}) {
  const Wrapper = ({ children }) => {
    const methods = useForm({
      defaultValues: {
        CustomerNum: '12345',
        InsuredContact1: 'Insured One',
        InsuredTitle1: 'Manager',
        InsuredPhone1: '1111111111',
        InsuredCell1: '2222222222',
        InsuredEMail1: 'insured1@example.com',
        InsuredContact2: 'Insured Two',
        InsuredTitle2: 'Director',
        InsuredPhone2: '3333333333',
        InsuredCell2: '4444444444',
        InsuredEMail2: 'insured2@example.com',
        AdjusterContact1: '',
        AdjusterTitle1: '',
        AdjusterPhone1: '',
        AdjusterCell1: '',
        AdjusterEMail1: '',
        AdjusterContact2: '',
        AdjusterTitle2: '',
        AdjusterPhone2: '',
        AdjusterCell2: '',
        AdjusterEMail2: '',
        ...values,
      },
    });

    return <FormProvider {...methods}>{children}</FormProvider>;
  };

  return render(
    <Wrapper>
      <InsuredContacts isEnabled={() => true} disableForDirector={false} />
    </Wrapper>,
  );
}

describe('InsuredContacts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPathname = '/view-policy/PK_Number=11';
    api.post.mockResolvedValue({ status: 200 });
  });

  it('copies SAC contacts into adjuster fields', async () => {
    renderWithForm();

    expect(screen.getAllByDisplayValue('Insured One')).toHaveLength(1);
    expect(screen.getAllByDisplayValue('insured1@example.com')).toHaveLength(1);
    expect(screen.getAllByDisplayValue('Insured Two')).toHaveLength(1);

    await userEvent.click(screen.getByRole('button', { name: 'Copy SAC to Adjuster' }));

    await waitFor(() => {
      expect(screen.getAllByDisplayValue('Insured One')).toHaveLength(2);
      expect(screen.getAllByDisplayValue('insured1@example.com')).toHaveLength(2);
      expect(screen.getAllByDisplayValue('Insured Two')).toHaveLength(2);
    });
  });

  it('sends SAC primary contact to recipient lists', async () => {
    renderWithForm();

    const recipientButtons = screen.getAllByRole('button', {
      name: 'Send to Recipient List',
    });

    await userEvent.click(recipientButtons[0]);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/loss_run_distribution/upsert', [
        {
          CustomerNum: '12345',
          RecipCat: 'Insured',
          DistVia: 'Email',
          AttnTo: 'Insured One',
          EMailAddress: 'insured1@example.com',
        },
      ]);
    });

    expect(api.post).toHaveBeenCalledWith('/claim_review_distribution/upsert', [
      {
        CustomerNum: '12345',
        RecipCat: 'Insured',
        DistVia: 'Email',
        AttnTo: 'Insured One',
        EMailAddress: 'insured1@example.com',
      },
    ]);
  });

  it('shows validation error when HCM user email is missing', async () => {
    renderWithForm({ InsuredEMail1: '' });

    const hcmButtons = screen.getAllByRole('button', { name: 'Send to HCM Users' });
    await userEvent.click(hcmButtons[0]);

    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Data Validation Error',
        text: 'Invalid entry email',
      }),
    );
  });

  it('sends SAC primary contact to HCM users endpoint', async () => {
    renderWithForm();

    const hcmButtons = screen.getAllByRole('button', { name: 'Send to HCM Users' });
    await userEvent.click(hcmButtons[0]);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/hcm_users/upsert', [
        {
          CustomerNum: '12345',
          UserName: 'Insured One',
          UserTitle: 'Manager',
          UserEmail: 'insured1@example.com',
          TelNum: '1111111111',
        },
      ]);
    });
  });

  it('shows validation error when adjuster secondary name is invalid', async () => {
    renderWithForm({ AdjusterContact2: 'n/a' });

    const recipientButtons = screen.getAllByRole('button', {
      name: 'Send to Recipient List',
    });

    await userEvent.click(recipientButtons[3]);

    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Data Validation Error',
        text: 'Invalid entry name',
      }),
    );
  });
});
