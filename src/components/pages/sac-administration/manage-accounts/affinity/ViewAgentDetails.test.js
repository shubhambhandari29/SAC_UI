import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ViewAgentDetails from './ViewAgentDetails';
import api from '../../../../../api/api';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';

let mockPathname = '/affinity-create-new-program';

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
    get: jest.fn(),
    post: jest.fn(),
  },
}));

jest.mock('../../../../ui/Loader', () => () => <div data-testid="loader" />);

jest.mock('./AgentForm', () => ({ index }) => <div>AgentForm-{index}</div>);

jest.mock('sweetalert2', () => ({
  __esModule: true,
  default: {
    fire: jest.fn(),
  },
}));

describe('ViewAgentDetails', () => {
  const getValuesSac = (field) => {
    if (field === 'Stage') return 'Underwriter';
    if (field === 'IsSubmitted') return 0;
    return '';
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockPathname = '/affinity-create-new-program';

    useSelector.mockImplementation((selector) =>
      selector({ auth: { user: { role: 'Admin' } } }),
    );

    api.get.mockResolvedValue({ data: [] });
    api.post.mockResolvedValue({ status: 200 });
    Swal.fire.mockResolvedValue({ isConfirmed: true });
  });

  function renderComponent(extraProps = {}) {
    return render(
      <ViewAgentDetails
        ProgramName="Affinity-X"
        isEnabled={() => true}
        formData={{ ProgramName: 'Affinity-X' }}
        getValuesSac={getValuesSac}
        {...extraProps}
      />,
    );
  }

  it('fetches agent data on mount and shows empty state', async () => {
    renderComponent();

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/affinity_agents/', {
        params: { ProgramName: 'Affinity-X' },
      });
    });

    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });

    expect(screen.getByText('No Agents Found')).toBeInTheDocument();
  });

  it('shows error when adding agents before account is saved', async () => {
    renderComponent({ formData: null });

    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: 'Edit' }));
    await userEvent.click(screen.getByRole('button', { name: 'Add' }));

    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Error',
        text: 'Save account before adding the agent details',
      }),
    );
  });

  it('saves existing agents to upsert endpoint', async () => {
    api.get.mockResolvedValue({
      data: [
        {
          AgentName: 'Primary Agent',
          AgentCode: 'A1',
          PrimaryAgt: 'Yes',
          AgentContact1: 'Agent Contact',
        },
      ],
    });

    mockPathname = '/affinity-view-program/ProgramName=Affinity-X';

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('AgentForm-0')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: 'Edit' }));
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/affinity_agents/upsert', [
        {
          AgentName: 'Primary Agent',
          AgentCode: 'A1',
          PrimaryAgt: 'Yes',
          AgentContact1: 'Agent Contact',
          ProgramName: 'Affinity-X',
        },
      ]);
    });
  });

  it('shows error alert when initial fetch fails', async () => {
    api.get.mockRejectedValue(new Error('failed'));

    renderComponent();

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Error', icon: 'error' }),
      );
    });
  });
});
