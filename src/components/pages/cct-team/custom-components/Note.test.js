import { render, screen } from '@testing-library/react';
import Note from './Note';

describe('Note', () => {
  it('renders note text', () => {
    render(<Note text="Important note" />);

    expect(screen.getByText('Important note')).toBeInTheDocument();
  });

  it('renders as text content block', () => {
    render(<Note text="Read this" />);

    expect(screen.getByText('Read this')).toHaveTextContent('Read this');
  });

  it('updates note text on rerender', () => {
    const { rerender } = render(<Note text="Old note" />);

    rerender(<Note text="New note" />);

    expect(screen.queryByText('Old note')).not.toBeInTheDocument();
    expect(screen.getByText('New note')).toBeInTheDocument();
  });
});
