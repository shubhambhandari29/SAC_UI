import { render, screen } from '@testing-library/react';
import Body2 from './Body2';

describe('Body2', () => {
  it('renders provided text', () => {
    render(<Body2 text="Secondary contact" />);

    expect(screen.getByText('Secondary contact')).toBeInTheDocument();
  });

  it('renders a non-breaking space fallback when text is missing', () => {
    render(<Body2 />);

    expect(screen.getByRole('heading', { level: 5 }).textContent).toBe('\u00a0');
  });

  it('renders numeric text values', () => {
    render(<Body2 text={1234} />);

    expect(screen.getByText('1234')).toBeInTheDocument();
  });

  it('updates fallback content when text is later provided', () => {
    const { rerender } = render(<Body2 />);

    rerender(<Body2 text="Now set" />);

    expect(screen.getByText('Now set')).toBeInTheDocument();
  });
});
