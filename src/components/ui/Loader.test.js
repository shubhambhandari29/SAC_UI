import { render, screen } from '@testing-library/react';
import Loader from './Loader';

describe('Loader', () => {
  it('renders a progress indicator', () => {
    render(<Loader size={24} height="50px" />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('supports default props', () => {
    render(<Loader size={20} />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
