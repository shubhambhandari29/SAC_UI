import { render, screen } from '@testing-library/react';
import LabeledText from './LabeledText';

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

describe('LabeledText', () => {
  it('renders the label text', () => {
    render(<LabeledText label="Program:" value="Affinity" />);

    expect(screen.getByText('Program:')).toBeInTheDocument();
  });

  it('renders the value text', () => {
    render(<LabeledText label="Phone" value="(555) 888-0000" />);

    expect(screen.getByText('(555) 888-0000')).toBeInTheDocument();
  });

  it('renders blank placeholder when value is missing', () => {
    const { container } = render(<LabeledText label="Email" value="" />);

    const spans = container.querySelectorAll('span');
    expect(spans[1].textContent).toBe(' ');
  });

  it('uses blue text color by default for value', () => {
    render(<LabeledText label="Color" value="Default" />);

    expect(screen.getByText('Default')).toHaveStyle({ color: 'blue' });
  });

  it('uses black text color when valueBlack is true', () => {
    render(<LabeledText label="Color" value="Black" valueBlack />);

    expect(screen.getByText('Black')).toHaveStyle({ color: 'black' });
  });
});
