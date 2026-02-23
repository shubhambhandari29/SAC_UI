import { render, screen } from '@testing-library/react';
import RedContainer from './RedContainer';

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

describe('RedContainer', () => {
  it('renders title and children', () => {
    render(
      <RedContainer title="Red Header">
        <span>Body Content</span>
      </RedContainer>,
    );

    expect(screen.getByText('Red Header')).toBeInTheDocument();
    expect(screen.getByText('Body Content')).toBeInTheDocument();
  });

  it('centers title text when titleCentered is true', () => {
    render(<RedContainer title="Centered" titleCentered />);

    expect(screen.getByText('Centered')).toHaveStyle({ textAlign: 'center' });
  });

  it('does not set centered alignment by default', () => {
    render(<RedContainer title="Default Alignment" />);

    expect(screen.getByText('Default Alignment').style.textAlign).toBe('');
  });

  it('renders safely without children', () => {
    render(<RedContainer title="Only Title" />);

    expect(screen.getByText('Only Title')).toBeInTheDocument();
  });
});
