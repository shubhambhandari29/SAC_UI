import { render, screen } from '@testing-library/react';
import YellowContainer from './YellowContainer';

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

describe('YellowContainer', () => {
  it('renders title and children', () => {
    render(
      <YellowContainer title="Yellow Header">
        <span>Contained Content</span>
      </YellowContainer>,
    );

    expect(screen.getByText('Yellow Header')).toBeInTheDocument();
    expect(screen.getByText('Contained Content')).toBeInTheDocument();
  });

  it('applies custom wrapper styles', () => {
    const { container } = render(
      <YellowContainer title="Styled" style={{ marginTop: 10 }}>
        <span>Child</span>
      </YellowContainer>,
    );

    expect(container.firstChild).toHaveStyle({ marginTop: '10px' });
  });

  it('forces wrap=false on wrapper', () => {
    const { container } = render(<YellowContainer title="No Wrap" />);

    expect(container.firstChild).toHaveAttribute('data-wrap', 'false');
  });

  it('renders safely without children', () => {
    render(<YellowContainer title="Only Title" />);

    expect(screen.getByText('Only Title')).toBeInTheDocument();
  });
});
