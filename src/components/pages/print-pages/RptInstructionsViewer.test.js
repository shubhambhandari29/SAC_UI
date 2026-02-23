import { render, screen } from '@testing-library/react';
import RptInstructionsViewer from './RptInstructionsViewer';
import useDropdownData from '../../../hooks/useDropdownData';

jest.mock('../../../hooks/useDropdownData', () => jest.fn());

jest.mock(
  '@react-pdf/renderer',
  () => ({
    PDFViewer: ({ children }) => <div data-testid="pdf-viewer">{children}</div>,
  }),
  { virtual: true },
);

jest.mock('../../ui/Loader', () => ({ size }) => <div>loader:{size}</div>);

jest.mock('./reports/RptAdjusterInstructionsPDF', () => (props) => (
  <div data-testid="adjuster-pdf">adjuster-{props.data?.AccountName}</div>
));

jest.mock('./reports/RptAgentInstructionsPDF', () => (props) => (
  <div data-testid="agent-pdf">agent-{props.data?.AccountName}</div>
));

const dropdownData = [
  { SACName: 'SAC One', EmpTitle: 'Rep 1' },
  { RepName: 'Risk One', EmpTitle: 'Risk Rep' },
  { 'UW Last': 'Smith', EmpTitle: 'UW' },
];

describe('RptInstructionsViewer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loader while any dropdown is loading', () => {
    useDropdownData
      .mockReturnValueOnce({ data: [], loading: true })
      .mockReturnValueOnce({ data: [], loading: false })
      .mockReturnValueOnce({ data: [], loading: false });

    render(<RptInstructionsViewer data={{}} sacData={{}} type="Adjuster" />);

    expect(screen.getByText('loader:40')).toBeInTheDocument();
  });

  it('renders adjuster PDF for Adjuster type', () => {
    useDropdownData
      .mockReturnValueOnce({ data: dropdownData, loading: false })
      .mockReturnValueOnce({ data: dropdownData, loading: false })
      .mockReturnValueOnce({ data: dropdownData, loading: false });

    render(
      <RptInstructionsViewer
        data={{ AccountName: 'Acme', UnderwriterName: 'Smith' }}
        sacData={{ SAC_Contact1: 'SAC One', LossCtlRep1: 'Risk One' }}
        type="Adjuster"
      />,
    );

    expect(screen.getByTestId('pdf-viewer')).toBeInTheDocument();
    expect(screen.getByTestId('adjuster-pdf')).toBeInTheDocument();
    expect(screen.queryByTestId('agent-pdf')).not.toBeInTheDocument();
  });

  it('renders agent PDF for non-adjuster type', () => {
    useDropdownData
      .mockReturnValueOnce({ data: dropdownData, loading: false })
      .mockReturnValueOnce({ data: dropdownData, loading: false })
      .mockReturnValueOnce({ data: dropdownData, loading: false });

    render(
      <RptInstructionsViewer
        data={{ AccountName: 'Acme', UnderwriterName: 'Smith' }}
        sacData={{ SAC_Contact1: 'SAC One', LossCtlRep1: 'Risk One' }}
        type="Agent"
      />,
    );

    expect(screen.getByTestId('agent-pdf')).toBeInTheDocument();
    expect(screen.queryByTestId('adjuster-pdf')).not.toBeInTheDocument();
  });
});
