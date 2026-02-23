import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ShiPrint from './ShiPrint';
import api from '../../api/api';
import Swal from 'sweetalert2';

let mockPathname = '/view-policy-types/PK_Number=2';
const mockGetValues = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({ pathname: mockPathname }),
}));

jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  useFormContext: () => ({ getValues: mockGetValues }),
}));

jest.mock('../../api/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

jest.mock('../ui/Modal', () => ({ open, children }) =>
  open ? <div data-testid="modal">{children}</div> : null,
);

jest.mock('../ui/Loader', () => ({ size }) => <div data-testid="loader">{size}</div>);

jest.mock('./print-pages/RptInstructionsViewer', () => ({ type }) => (
  <div>{`sac-viewer-${type}`}</div>
));

jest.mock('./print-pages/RptInstructionsAffinViewer', () => ({ type }) => (
  <div>{`affinity-viewer-${type}`}</div>
));

jest.mock('./print-pages/RptUnderConstructionShiCctViewer', () => () => (
  <div>under-construction-viewer</div>
));

jest.mock('sweetalert2', () => ({
  __esModule: true,
  default: {
    fire: jest.fn(),
  },
}));

describe('ShiPrint', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPathname = '/view-policy-types/PK_Number=2';
    mockGetValues.mockImplementation((field) => {
      const values = {
        ProgramName: 'Prog-A',
        CustomerNum: '100',
      };
      if (!field) return values;
      return values[field];
    });
  });

  it('loads affinity data and renders affinity print viewer in modal', async () => {
    api.get
      .mockResolvedValueOnce({
        data: [{ PrimaryAgt: 'Yes', AgentCode: 'A1' }, { PrimaryAgt: 'No', AgentCode: 'A2' }],
      })
      .mockResolvedValueOnce({
        data: [{ ProgramName: 'Prog-A', BusinessType: 'Affinity' }],
      });

    render(<ShiPrint />);

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/affinity_agents/', {
        params: { ProgramName: 'Prog-A' },
      });
    });

    await waitFor(() => {
      expect(screen.getByText('Report Options')).toBeInTheDocument();
    });

    const printButtons = screen.getAllByRole('button');
    await userEvent.click(printButtons[0]);

    expect(screen.getByText('affinity-viewer-Adjuster')).toBeInTheDocument();
  });

  it('renders SAC viewer for agent report when business type is Special Account', async () => {
    mockPathname = '/view-policy/PK_Number=3';
    api.get.mockResolvedValueOnce({
      data: [{ BusinessType: 'Special Account', AcctStatus: 'Active' }],
    });

    render(<ShiPrint />);

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/sac_account/', {
        params: { CustomerNum: '100' },
      });
    });

    const printButtons = screen.getAllByRole('button');
    await userEvent.click(printButtons[1]);

    expect(screen.getByText('sac-viewer-Agent')).toBeInTheDocument();
  });

  it('renders under-construction viewer for non-special business type', async () => {
    mockPathname = '/view-policy/PK_Number=3';
    api.get.mockResolvedValueOnce({
      data: [{ BusinessType: 'Other', AcctStatus: 'Under Construction' }],
    });

    render(<ShiPrint />);

    await waitFor(() => {
      expect(api.get).toHaveBeenCalled();
    });

    const printButtons = screen.getAllByRole('button');
    await userEvent.click(printButtons[0]);

    expect(screen.getByText('under-construction-viewer')).toBeInTheDocument();
  });

  it('shows error alert when account fetch fails', async () => {
    mockPathname = '/view-policy/PK_Number=3';
    api.get.mockRejectedValueOnce(new Error('fetch failed'));

    render(<ShiPrint />);

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Error',
          text: 'Some error occoured, unable to load data',
        }),
      );
    });
  });
});
