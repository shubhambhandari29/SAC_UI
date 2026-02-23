import { render, screen } from '@testing-library/react';
import BorderedContainer from './BorderedContainer';

describe('BorderedContainer', () => {
  it('renders the legend title', () => {
    render(<BorderedContainer title="Account Details" />);

    expect(screen.getByText('Account Details')).toBeInTheDocument();
  });

  it('renders child content', () => {
    render(
      <BorderedContainer title="Container">
        <div>Inside content</div>
      </BorderedContainer>,
    );

    expect(screen.getByText('Inside content')).toBeInTheDocument();
  });

  it('renders multiple children', () => {
    render(
      <BorderedContainer title="Multi">
        <span>One</span>
        <span>Two</span>
      </BorderedContainer>,
    );

    expect(screen.getByText('One')).toBeInTheDocument();
    expect(screen.getByText('Two')).toBeInTheDocument();
  });
});
