import { render, screen } from '@testing-library/react';
import Heading1 from './Heading1';

describe('Heading1', () => {
  it('renders heading text', () => {
    render(<Heading1 text="Policy Header" />);

    expect(screen.getByText('Policy Header')).toBeInTheDocument();
  });

  it('renders with heading semantics', () => {
    render(<Heading1 text="Section Heading" />);

    expect(screen.getByRole('heading', { level: 5, name: 'Section Heading' })).toBeInTheDocument();
  });

  it('updates text on rerender', () => {
    const { rerender } = render(<Heading1 text="Before" />);
    rerender(<Heading1 text="After" />);

    expect(screen.queryByText('Before')).not.toBeInTheDocument();
    expect(screen.getByText('After')).toBeInTheDocument();
  });
});
