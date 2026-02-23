import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import Agent from './Agent';
import api from '../../../../../api/api';
import useDropdownData from '../../../../../hooks/useDropdownData';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';

let mockPathname = '/view-policy/PK_Number=1';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

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

jest.mock('../../../../../hooks/useDropdownData', () => jest.fn());

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

function renderWithForm(values = {}, disableForDirector = false) {
  const Wrapper = ({ children }) => {
    const methods = useForm({
      defaultValues: {
        CustomerNum: '12345',
        AgentName: 'Agent One',
        AgentCode: 'A1',
        AgentContact1: 'Primary Agent',
        AgentTel1: '1111111111',
        AgentCell1: '2222222222',
        AgentEmail1: 'agent1@example.com',
        AgentContact2: 'Secondary Agent',
        AgentTel2: '3333333333',
        AgentCell2: '4444444444',
        AgentEmail2: 'agent2@example.com',
        ...values,
      },
    });

    return <FormProvider {...methods}>{children}</FormProvider>;
  };

  return render(
    <Wrapper>
      <Agent isEnabled={() => true} disableForDirector={disableForDirector} />
    </Wrapper>,
  );
}

describe('Agent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPathname = '/view-policy/PK_Number=1';

    useSelector.mockImplementation((selector) =>
      selector({ auth: { user: { role: 'Admin' } } }),
    );

    useDropdownData.mockReturnValue({
      data: [
        { Agent_Name: 'Agent One', Agent_Code: 'A1' },
        { Agent_Name: 'Agent Two', Agent_Code: 'A2' },
      ],
      loading: false,
    });

    api.post.mockResolvedValue({ status: 200 });
  });

  it('renders update-all buttons on view-policy route for admin', () => {
    renderWithForm();

    expect(screen.getByText('update-AgentContact1')).toBeInTheDocument();
    expect(screen.getByText('update-AgentEmail2')).toBeInTheDocument();
  });

  it('shows validation error when sending primary recipient without email', async () => {
    renderWithForm({ AgentEmail1: '' });

    await userEvent.click(
      screen.getByRole('button', { name: 'Send Primary Contact to Recipient List' }),
    );

    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Data Validation Error',
        text: 'Invalid entry email',
      }),
    );

    expect(api.post).not.toHaveBeenCalled();
  });

  it('sends primary contact to both recipient endpoints', async () => {
    renderWithForm();

    await userEvent.click(
      screen.getByRole('button', { name: 'Send Primary Contact to Recipient List' }),
    );

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/loss_run_distribution/upsert', [
        {
          CustomerNum: '12345',
          RecipCat: 'Agent',
          DistVia: 'Email',
          AttnTo: 'Primary Agent',
          EMailAddress: 'agent1@example.com',
        },
      ]);
    });

    expect(api.post).toHaveBeenCalledWith('/claim_review_distribution/upsert', [
      {
        CustomerNum: '12345',
        RecipCat: 'Agent',
        DistVia: 'Email',
        AttnTo: 'Primary Agent',
        EMailAddress: 'agent1@example.com',
      },
    ]);
  });

  it('disables send buttons when disableForDirector is true', () => {
    renderWithForm({}, true);

    expect(
      screen.getByRole('button', { name: 'Send Primary Contact to Recipient List' }),
    ).toBeDisabled();
    expect(
      screen.getByRole('button', { name: 'Send Secondary Contact to Recipient List' }),
    ).toBeDisabled();
  });
});
