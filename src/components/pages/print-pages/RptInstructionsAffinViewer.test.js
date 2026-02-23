import { render, screen } from '@testing-library/react';
import RptInstructionsAffinViewer from './RptInstructionsAffinViewer';
import useDropdownData from '../../../hooks/useDropdownData';

jest.mock('../../../hooks/useDropdownData', () => jest.fn());

jest.mock('@react-pdf/renderer', () => ({
  PDFViewer: ({ children }) => <div data-testid="pdf-viewer">{children}</div>,
}));

jest.mock('../../ui/Loader', () => ({ size }) => <div>loader:{size}</div>);

jest.mock('./reports/RptAdjusterInstructionsAffinPDF', () => (props) => (
  <div data-testid="adjuster-affin-pdf">adjuster-{props.data?.PolicyType}</div>
));

jest.mock('./reports/RptAgentInstructionsAffinPDF', () => (props) => (
  <div data-testid="agent-affin-pdf">agent-{props.data?.PolicyType}</div>
));

const dropdownData = [
  { SACName: 'SAC One', EmpTitle: 'Rep 1' },
  { RepName: 'Risk One', EmpTitle: 'Risk Rep' },
  { 'UW Last': 'Smith', EmpTitle: 'UW' },
];

describe('RptInstructionsAffinViewer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loader while dropdowns are loading', () => {
    useDropdownData
      .mockReturnValueOnce({ data: [], loading: false })
      .mockReturnValueOnce({ data: [], loading: true })
      .mockReturnValueOnce({ data: [], loading: false });

    render(<RptInstructionsAffinViewer data={{}} affinityData={{}} type="Adjuster" />);

    expect(screen.getByText('loader:40')).toBeInTheDocument();
  });

  it('renders adjuster affinity PDF for Adjuster type', () => {
    useDropdownData
      .mockReturnValueOnce({ data: dropdownData, loading: false })
      .mockReturnValueOnce({ data: dropdownData, loading: false })
      .mockReturnValueOnce({ data: dropdownData, loading: false });

    render(
      <RptInstructionsAffinViewer
        data={{ PolicyType: 'Commercial Auto', UnderwriterName: 'Smith' }}
        affinityData={{ SpecAcct1: 'SAC One', LossCtl1: 'Risk One' }}
        type="Adjuster"
      />,
    );

    expect(screen.getByTestId('adjuster-affin-pdf')).toBeInTheDocument();
    expect(screen.queryByTestId('agent-affin-pdf')).not.toBeInTheDocument();
  });

  it('renders agent affinity PDF for non-adjuster type', () => {
    useDropdownData
      .mockReturnValueOnce({ data: dropdownData, loading: false })
      .mockReturnValueOnce({ data: dropdownData, loading: false })
      .mockReturnValueOnce({ data: dropdownData, loading: false });

    render(
      <RptInstructionsAffinViewer
        data={{ PolicyType: 'GL', UnderwriterName: 'Smith' }}
        affinityData={{ SpecAcct1: 'SAC One', LossCtl1: 'Risk One' }}
        type="Agent"
      />,
    );

    expect(screen.getByTestId('agent-affin-pdf')).toBeInTheDocument();
    expect(screen.queryByTestId('adjuster-affin-pdf')).not.toBeInTheDocument();
  });
});
