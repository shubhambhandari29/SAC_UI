import { render, screen } from '@testing-library/react';
import BlueHeader from './BlueHeader';

describe('BlueHeader', () => {
  it('renders the provided title text', () => {
    render(<BlueHeader title="Claim Report" />);

    expect(screen.getByText('Claim Report')).toBeInTheDocument();
  });

  it('renders as a heading element', () => {
    render(<BlueHeader title="Program Summary" />);

    expect(screen.getByRole('heading', { name: 'Program Summary' })).toBeInTheDocument();
  });

  it('updates the heading text when title changes', () => {
    const { rerender } = render(<BlueHeader title="Initial" />);
    rerender(<BlueHeader title="Updated" />);

    expect(screen.queryByText('Initial')).not.toBeInTheDocument();
    expect(screen.getByText('Updated')).toBeInTheDocument();
  });
});
