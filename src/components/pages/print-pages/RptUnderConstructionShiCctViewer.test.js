import { render, screen } from '@testing-library/react';
import RptUnderConstructionShiCctViewer from './RptUnderConstructionShiCctViewer';
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

jest.mock('./reports/RptUnderConstructionShiCctPDF', () => (props) => (
  <div data-testid="under-construction-pdf">owner-{props.acctOwner?.SACName || 'none'}</div>
));

describe('RptUnderConstructionShiCctViewer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loader while dropdown is loading', () => {
    useDropdownData.mockReturnValue({ data: [], loading: true });

    render(<RptUnderConstructionShiCctViewer data={{}} sacData={{}} />);

    expect(screen.getByText('loader:40')).toBeInTheDocument();
  });

  it('renders under-construction PDF when dropdown is loaded', () => {
    useDropdownData.mockReturnValue({
      data: [{ SACName: 'Owner One', EMailID: 'owner@x.com' }],
      loading: false,
    });

    render(
      <RptUnderConstructionShiCctViewer
        data={{ id: 1 }}
        sacData={{ AcctOwner: 'Owner One' }}
      />,
    );

    expect(screen.getByTestId('pdf-viewer')).toBeInTheDocument();
    expect(screen.getByTestId('under-construction-pdf')).toHaveTextContent('owner-Owner One');
  });
});
