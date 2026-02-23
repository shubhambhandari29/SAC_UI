import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Swal from 'sweetalert2';
import CreateNewSacAccountStepper from './CreateNewSacAccountStepper';

const mockNavigate = jest.fn();
let mockParams = {};
const mockAccountSubmit = jest.fn();
const mockPolicySubmit = jest.fn();
const mockPolicyCreateNew = jest.fn();
const mockPolicyCreateNext = jest.fn();

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => mockParams,
  };
});

jest.mock('./sac/SacCreateNewAccount', () => {
  const React = require('react');
  return React.forwardRef((props, ref) => {
    React.useImperativeHandle(ref, () => ({
      submit: mockAccountSubmit,
    }));
    return <div data-testid="sac-form">Sac Form</div>;
  });
});

jest.mock('./view-policies/ViewPolicies', () => {
  const React = require('react');
  return function MockViewPolicies(props) {
    React.useEffect(() => {
      props.onDataFetch?.(1);
    }, [props.onDataFetch]);

    return (
      <div data-testid="view-policies">
        <button type="button" onClick={() => props.onCreatePolicy?.()}>
          mock-create-policy
        </button>
        <button type="button" onClick={() => props.onViewPolicy?.(777)}>
          mock-open-policy-form
        </button>
      </div>
    );
  };
});

jest.mock('./view-policies/CreateNewPolicy', () => {
  const React = require('react');
  return React.forwardRef((props, ref) => {
    React.useImperativeHandle(ref, () => ({
      submit: mockPolicySubmit,
      createNewPolicy: mockPolicyCreateNew,
      createNextMod: mockPolicyCreateNext,
    }));

    return <div data-testid="policy-form">Policy Form</div>;
  });
});

jest.mock('sweetalert2', () => ({
  __esModule: true,
  default: {
    fire: jest.fn(),
    DismissReason: { cancel: 'cancel' },
  },
}));

describe('CreateNewSacAccountStepper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockParams = {};
    Swal.fire.mockResolvedValue({ isConfirmed: true });
  });

  it('moves to step 2 after successful account save on next', async () => {
    mockAccountSubmit.mockResolvedValueOnce({
      CustomerNum: '1234567890',
      CustomerName: 'Acme Inc',
    });

    render(<CreateNewSacAccountStepper />);

    await userEvent.click(screen.getByRole('button', { name: 'Next: Add Policy' }));

    await waitFor(() => {
      expect(mockAccountSubmit).toHaveBeenCalledWith('save');
    });

    await waitFor(() => {
      expect(screen.getByTestId('view-policies')).toBeInTheDocument();
    });
  });

  it('submits and navigates to pending items from list view', async () => {
    mockAccountSubmit
      .mockResolvedValueOnce({ CustomerNum: '1234567890', CustomerName: 'Acme Inc' })
      .mockResolvedValueOnce(true);

    render(<CreateNewSacAccountStepper />);

    await userEvent.click(screen.getByRole('button', { name: 'Next: Add Policy' }));

    await waitFor(() => {
      expect(screen.getByTestId('view-policies')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(mockAccountSubmit).toHaveBeenLastCalledWith('submit');
    });

    expect(mockNavigate).toHaveBeenCalledWith('/pending-items', { replace: true });
  });

  it('opens policy form and saves policy in step 2', async () => {
    mockAccountSubmit.mockResolvedValueOnce({
      CustomerNum: '1234567890',
      CustomerName: 'Acme Inc',
    });
    mockPolicySubmit.mockResolvedValueOnce(777);

    render(<CreateNewSacAccountStepper />);

    await userEvent.click(screen.getByRole('button', { name: 'Next: Add Policy' }));

    await waitFor(() => {
      expect(screen.getByTestId('view-policies')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: 'mock-open-policy-form' }));

    expect(screen.getByTestId('policy-form')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => {
      expect(mockPolicySubmit).toHaveBeenCalledWith('save');
    });

    expect(
      screen.getByRole('button', { name: 'Create a Brand New Policy' }),
    ).toBeInTheDocument();
  });

  it('calls create policy actions from policy form shortcuts', async () => {
    mockAccountSubmit.mockResolvedValueOnce({
      CustomerNum: '1234567890',
      CustomerName: 'Acme Inc',
    });
    mockPolicySubmit.mockResolvedValueOnce(777);

    render(<CreateNewSacAccountStepper />);

    await userEvent.click(screen.getByRole('button', { name: 'Next: Add Policy' }));

    await waitFor(() => {
      expect(screen.getByTestId('view-policies')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: 'mock-open-policy-form' }));
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Create a Brand New Policy' })).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: 'Create a Brand New Policy' }));
    await userEvent.click(
      screen.getByRole('button', { name: 'Create Next Mod on Same Policy' }),
    );

    expect(mockPolicyCreateNew).toHaveBeenCalled();
    expect(mockPolicyCreateNext).toHaveBeenCalled();
  });

  it('confirms back on step 1 and navigates to pending items', async () => {
    render(<CreateNewSacAccountStepper />);

    await userEvent.click(screen.getByRole('button', { name: 'Back' }));

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalled();
    });

    expect(mockNavigate).toHaveBeenCalledWith('/pending-items', {
      replace: true,
    });
  });

  it('returns from policy form to list on confirmed back', async () => {
    mockAccountSubmit.mockResolvedValueOnce({
      CustomerNum: '1234567890',
      CustomerName: 'Acme Inc',
    });

    render(<CreateNewSacAccountStepper />);

    await userEvent.click(screen.getByRole('button', { name: 'Next: Add Policy' }));

    await waitFor(() => {
      expect(screen.getByTestId('view-policies')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: 'mock-open-policy-form' }));

    expect(screen.getByTestId('policy-form')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Back' }));

    await waitFor(() => {
      expect(screen.getByTestId('view-policies')).toBeInTheDocument();
    });
  });
});
