import { render, screen } from '@testing-library/react';
import Footer from './Footer';

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

describe('Footer', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-01-15T10:00:00.000Z'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('renders page number text from render callback', () => {
    render(<Footer />);

    expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();
  });

  it('renders current formatted date', () => {
    render(<Footer />);

    expect(screen.getByText('Wednesday, January 15, 2025')).toBeInTheDocument();
  });

  it('renders footer logo image with expected source', () => {
    render(<Footer />);

    expect(screen.getByRole('img')).toHaveAttribute('src', '/hanover-logo-1.png');
  });

  it('marks footer wrapper as fixed', () => {
    const { container } = render(<Footer />);

    expect(container.querySelector('[data-fixed="true"]')).toBeInTheDocument();
  });
});
