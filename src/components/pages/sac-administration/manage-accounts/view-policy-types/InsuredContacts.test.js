import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InsuredContacts from './InsuredContacts';
import api from '../../../../../api/api';
import Swal from 'sweetalert2';

const mockGetValues = jest.fn();

jest.mock('../../../../../api/api', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
  },
}));

jest.mock('../../../../ui/Loader', () => () => <div data-testid="loader" />);

jest.mock('../../../../ui/PhoneField', () => ({ label }) => (
  <input aria-label={label} />
));

jest.mock('../../../../ui/EmailField', () => ({ label }) => (
  <input aria-label={label} />
));

jest.mock('sweetalert2', () => ({
  __esModule: true,
  default: {
    fire: jest.fn(),
  },
}));

jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  useFormContext: () => ({
    control: {},
    getValues: mockGetValues,
  }),
  Controller: ({ name, render }) =>
    render({
      field: {
        value: mockGetValues(name) || '',
        onChange: jest.fn(),
      },
    }),
}));

describe('view-policy-types/InsuredContacts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetValues.mockImplementation((name) => {
      const values = {
        ProgramName: 'Prog-A',
        InsuredContact1: 'John Doe',
        InsuredEMail1: 'john@example.com',
        InsuredContact2: 'Jane Roe',
        InsuredEMail2: 'jane@example.com',
      };
      return values[name];
    });
    api.post.mockResolvedValue({ status: 200 });
  });

  it('shows validation error when primary email is missing', async () => {
    mockGetValues.mockImplementation((name) => {
      if (name === 'InsuredEMail1') return '';
      if (name === 'InsuredContact1') return 'John Doe';
      if (name === 'ProgramName') return 'Prog-A';
      return '';
    });

    render(<InsuredContacts isEnabled={() => true} disableForDirector={false} />);

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
    render(<InsuredContacts isEnabled={() => true} disableForDirector={false} />);

    await userEvent.click(
      screen.getByRole('button', { name: 'Send Primary Contact to Recipient List' }),
    );

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(
        '/loss_run_distribution_affinity/upsert',
        [
          expect.objectContaining({
            ProgramName: 'Prog-A',
            RecipCat: 'Insured',
            AttnTo: 'John Doe',
            EMailAddress: 'john@example.com',
          }),
        ],
      );
    });

    expect(api.post).toHaveBeenCalledWith(
      '/claim_review_distribution_affinity/upsert',
      [
        expect.objectContaining({
          ProgramName: 'Prog-A',
          AttnTo: 'John Doe',
        }),
      ],
    );
  });

  it('shows error when recipient API calls fail', async () => {
    api.post.mockRejectedValueOnce(new Error('upsert failed'));

    render(<InsuredContacts isEnabled={() => true} disableForDirector={false} />);

    await userEvent.click(
      screen.getByRole('button', { name: 'Send Secondary Contact to Recipient List' }),
    );

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Error',
          text: 'Some error occoured, unable to add data to Recipient Lists',
        }),
      );
    });
  });

  it('disables recipient buttons for director-locked state', () => {
    render(<InsuredContacts isEnabled={() => true} disableForDirector />);

    expect(
      screen.getByRole('button', { name: 'Send Primary Contact to Recipient List' }),
    ).toBeDisabled();
    expect(
      screen.getByRole('button', { name: 'Send Secondary Contact to Recipient List' }),
    ).toBeDisabled();
  });
});
