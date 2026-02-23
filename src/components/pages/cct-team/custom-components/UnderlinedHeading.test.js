import { render, screen } from '@testing-library/react';
import UnderlinedHeading from './UnderlinedHeading';

describe('UnderlinedHeading', () => {
  it('renders the provided text', () => {
    render(<UnderlinedHeading text="Claim Instructions" />);

    expect(screen.getByText('Claim Instructions')).toBeInTheDocument();
  });

  it('renders heading role for typography variant h6', () => {
    render(<UnderlinedHeading text="Underlined" />);

    expect(screen.getByRole('heading', { level: 6, name: 'Underlined' })).toBeInTheDocument();
  });

  it('updates heading text on rerender', () => {
    const { rerender } = render(<UnderlinedHeading text="Start" />);
    rerender(<UnderlinedHeading text="Finish" />);

    expect(screen.queryByText('Start')).not.toBeInTheDocument();
    expect(screen.getByText('Finish')).toBeInTheDocument();
  });
});
