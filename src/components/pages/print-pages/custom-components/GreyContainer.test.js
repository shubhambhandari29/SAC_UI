import { render, screen } from '@testing-library/react';
import GreyContainer from './GreyContainer';

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
}, { virtual: true });

describe('GreyContainer', () => {
  it('renders title and children', () => {
    render(
      <GreyContainer title="Grey Header">
        <span>Inner Content</span>
      </GreyContainer>,
    );

    expect(screen.getByText('Grey Header')).toBeInTheDocument();
    expect(screen.getByText('Inner Content')).toBeInTheDocument();
  });

  it('marks header section with wrap=false', () => {
    const { container } = render(<GreyContainer title="Wrap Check" />);

    expect(container.querySelector('[data-wrap="false"]')).toBeInTheDocument();
  });

  it('renders without children safely', () => {
    render(<GreyContainer title="Only Header" />);

    expect(screen.getByText('Only Header')).toBeInTheDocument();
  });
});
