import { render, screen } from '@testing-library/react';
import BlueHeaderContainer from './BlueHeaderContainer';

describe('BlueHeaderContainer', () => {
  it('renders the title through BlueHeader', () => {
    render(
      <BlueHeaderContainer title="Distribution">
        <div>Child Content</div>
      </BlueHeaderContainer>,
    );

    expect(screen.getByRole('heading', { name: 'Distribution' })).toBeInTheDocument();
  });

  it('renders children inside the container', () => {
    render(
      <BlueHeaderContainer title="Affinities">
        <span>First Child</span>
        <span>Second Child</span>
      </BlueHeaderContainer>,
    );

    expect(screen.getByText('First Child')).toBeInTheDocument();
    expect(screen.getByText('Second Child')).toBeInTheDocument();
  });

  it('renders even when children are not passed', () => {
    render(<BlueHeaderContainer title="No Children" />);

    expect(screen.getByRole('heading', { name: 'No Children' })).toBeInTheDocument();
  });
});
