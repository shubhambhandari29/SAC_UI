import { render, screen } from '@testing-library/react';
import GreenContainer from './GreenContainer';

jest.mock('@react-pdf/renderer', () => {
  const React = require('react');
  const normalizeStyle = (style) =>
    Array.isArray(style) ? Object.assign({}, ...style.filter(Boolean)) : style;

  return {
    Text: ({ children, render, style, ...rest }) =>
      React.createElement(
        'span',
        { ...rest, style: normalizeStyle(style) },
        render ? render({ pageNumber: 1, totalPages: 3 }) : children,
      ),
    View: ({ children, style, wrap, fixed, ...rest }) =>
      React.createElement(
        'div',
        {
          ...rest,
          style: normalizeStyle(style),
          ...(wrap !== undefined ? { 'data-wrap': String(wrap) } : {}),
          ...(fixed !== undefined ? { 'data-fixed': String(fixed) } : {}),
        },
        children,
      ),
    Image: ({ style, ...rest }) =>
      React.createElement('img', { ...rest, style: normalizeStyle(style) }),
    StyleSheet: { create: (styles) => styles },
  };
});

describe('GreenContainer', () => {
  it('renders title and child content', () => {
    render(
      <GreenContainer title="Green Header">
        <span>Child Content</span>
      </GreenContainer>,
    );

    expect(screen.getByText('Green Header')).toBeInTheDocument();
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });

  it('centers title text when titleCentered is true', () => {
    render(
      <GreenContainer title="Centered" titleCentered>
        <span>Body</span>
      </GreenContainer>,
    );

    expect(screen.getByText('Centered')).toHaveStyle({ textAlign: 'center' });
  });

  it('uses wrap=true by default for outer container', () => {
    const { container } = render(<GreenContainer title="Default Wrap" />);

    const wrappedViews = container.querySelectorAll('[data-wrap]');
    expect(wrappedViews[0]).toHaveAttribute('data-wrap', 'true');
  });

  it('uses wrap=false for outer container when noWrap is true', () => {
    const { container } = render(<GreenContainer title="No Wrap" noWrap />);

    const wrappedViews = container.querySelectorAll('[data-wrap]');
    expect(wrappedViews[0]).toHaveAttribute('data-wrap', 'false');
  });
});
