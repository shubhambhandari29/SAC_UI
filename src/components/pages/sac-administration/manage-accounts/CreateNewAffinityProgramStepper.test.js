import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Swal from 'sweetalert2';
import CreateNewAffinityProgramStepper from './CreateNewAffinityProgramStepper';

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

jest.mock('./affinity/AffinityCreateNewProgram', () => {
  const React = require('react');
  return React.forwardRef((props, ref) => {
    React.useImperativeHandle(ref, () => ({
      submit: mockAccountSubmit,
    }));
    return <div data-testid="affinity-form">Affinity Form</div>;
  });
});

jest.mock('./view-policy-types/ViewPolicyTypes', () => {
  const React = require('react');
  return function MockViewPolicyTypes(props) {
    React.useEffect(() => {
      props.onDataFetch?.(1);
    }, [props.onDataFetch]);

    return (
      <div data-testid="view-policy-types">
        <button type="button" onClick={() => props.onCreatePolicy?.()}>
          mock-create-policy-type
        </button>
        <button type="button" onClick={() => props.onViewPolicy?.(777)}>
          mock-open-policy-type-form
        </button>
      </div>
    );
  };
});

jest.mock('./view-policy-types/CreateNewPolicyType', () => {
  const React = require('react');
  return React.forwardRef((props, ref) => {
    React.useImperativeHandle(ref, () => ({
      submit: mockPolicySubmit,
      createNewPolicy: mockPolicyCreateNew,
      createNextMod: mockPolicyCreateNext,
    }));

    return <div data-testid="policy-type-form">Policy Type Form</div>;
  });
});

jest.mock('sweetalert2', () => ({
  __esModule: true,
  default: {
    fire: jest.fn(),
    DismissReason: { cancel: 'cancel' },
  },
}));

describe('CreateNewAffinityProgramStepper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockParams = {};
    Swal.fire.mockResolvedValue({ isConfirmed: true });
  });

  it('moves to step 2 after successful account save on next', async () => {
    mockAccountSubmit.mockResolvedValueOnce({ ProgramName: 'Affinity Program' });

    render(<CreateNewAffinityProgramStepper />);

    await userEvent.click(
      screen.getByRole('button', { name: 'Next: Add Policy Types' }),
    );

    await waitFor(() => {
      expect(mockAccountSubmit).toHaveBeenCalledWith('save');
    });

    await waitFor(() => {
      expect(screen.getByTestId('view-policy-types')).toBeInTheDocument();
    });
  });

  it('submits and navigates to pending items from list view', async () => {
    mockAccountSubmit
      .mockResolvedValueOnce({ ProgramName: 'Affinity Program' })
      .mockResolvedValueOnce(true);

    render(<CreateNewAffinityProgramStepper />);

    await userEvent.click(
      screen.getByRole('button', { name: 'Next: Add Policy Types' }),
    );

    await waitFor(() => {
      expect(screen.getByTestId('view-policy-types')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(mockAccountSubmit).toHaveBeenLastCalledWith('submit');
    });

    expect(mockNavigate).toHaveBeenCalledWith('/pending-items', { replace: true });
  });

  it('opens policy type form and saves policy type in step 2', async () => {
    mockAccountSubmit.mockResolvedValueOnce({ ProgramName: 'Affinity Program' });
    mockPolicySubmit.mockResolvedValueOnce(777);

    render(<CreateNewAffinityProgramStepper />);

    await userEvent.click(
      screen.getByRole('button', { name: 'Next: Add Policy Types' }),
    );

    await waitFor(() => {
      expect(screen.getByTestId('view-policy-types')).toBeInTheDocument();
    });

    await userEvent.click(
      screen.getByRole('button', { name: 'mock-open-policy-type-form' }),
    );

    expect(screen.getByTestId('policy-type-form')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => {
      expect(mockPolicySubmit).toHaveBeenCalledWith('save');
    });

    expect(
      screen.getByRole('button', { name: 'Create New Policy Type' }),
    ).toBeInTheDocument();
  });

  it('calls create policy type actions from policy type form shortcuts', async () => {
    mockAccountSubmit.mockResolvedValueOnce({ ProgramName: 'Affinity Program' });
    mockPolicySubmit.mockResolvedValueOnce(777);

    render(<CreateNewAffinityProgramStepper />);

    await userEvent.click(
      screen.getByRole('button', { name: 'Next: Add Policy Types' }),
    );

    await waitFor(() => {
      expect(screen.getByTestId('view-policy-types')).toBeInTheDocument();
    });

    await userEvent.click(
      screen.getByRole('button', { name: 'mock-open-policy-type-form' }),
    );
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Create New Policy Type' })).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: 'Create New Policy Type' }));
    await userEvent.click(
      screen.getByRole('button', { name: 'Create Next Policy Type' }),
    );

    expect(mockPolicyCreateNew).toHaveBeenCalled();
    expect(mockPolicyCreateNext).toHaveBeenCalled();
  });

  it('confirms back on step 1 and navigates to pending items', async () => {
    render(<CreateNewAffinityProgramStepper />);

    await userEvent.click(screen.getByRole('button', { name: 'Back' }));

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalled();
    });

    expect(mockNavigate).toHaveBeenCalledWith('/pending-items', {
      replace: true,
    });
  });

  it('returns from policy type form to list on confirmed back', async () => {
    mockAccountSubmit.mockResolvedValueOnce({ ProgramName: 'Affinity Program' });

    render(<CreateNewAffinityProgramStepper />);

    await userEvent.click(
      screen.getByRole('button', { name: 'Next: Add Policy Types' }),
    );

    await waitFor(() => {
      expect(screen.getByTestId('view-policy-types')).toBeInTheDocument();
    });

    await userEvent.click(
      screen.getByRole('button', { name: 'mock-open-policy-type-form' }),
    );

    expect(screen.getByTestId('policy-type-form')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Back' }));

    await waitFor(() => {
      expect(screen.getByTestId('view-policy-types')).toBeInTheDocument();
    });
  });
});
