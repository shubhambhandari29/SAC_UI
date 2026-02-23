import { render, screen } from '@testing-library/react';
import Body1 from './Body1';

describe('Body1', () => {
  it('renders provided text', () => {
    render(<Body1 text="Primary contact" />);

    expect(screen.getByText('Primary contact')).toBeInTheDocument();
  });

  it('renders as heading level 5 typography', () => {
    render(<Body1 text="Heading Text" />);

    expect(screen.getByRole('heading', { level: 5, name: 'Heading Text' })).toBeInTheDocument();
  });

  it('updates rendered text on rerender', () => {
    const { rerender } = render(<Body1 text="Old" />);

    rerender(<Body1 text="New" />);

    expect(screen.queryByText('Old')).not.toBeInTheDocument();
    expect(screen.getByText('New')).toBeInTheDocument();
  });
});
