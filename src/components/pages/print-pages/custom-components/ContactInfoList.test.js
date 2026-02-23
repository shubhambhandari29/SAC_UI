import { render, screen } from '@testing-library/react';
import ContactInfoList from './ContactInfoList';

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

describe('ContactInfoList', () => {
  it('renders nothing when data is missing', () => {
    const { container } = render(<ContactInfoList data={null} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing when data is empty', () => {
    const { container } = render(<ContactInfoList data={{}} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('renders each key and value row', () => {
    render(
      <ContactInfoList data={{ Phone: '(555) 123-4567', Email: 'insured@demo.com' }} />,
    );

    expect(screen.getByText('Phone:')).toBeInTheDocument();
    expect(screen.getByText('(555) 123-4567')).toBeInTheDocument();
    expect(screen.getByText('Email:')).toBeInTheDocument();
    expect(screen.getByText('insured@demo.com')).toBeInTheDocument();
  });

  it('uses a blank placeholder when value is missing', () => {
    const { container } = render(<ContactInfoList data={{ Contact: '' }} />);

    const spans = container.querySelectorAll('span');
    expect(spans[0]).toHaveTextContent('Contact:');
    expect(spans[1].textContent).toBe(' ');
  });

  it('renders one label per entry', () => {
    render(<ContactInfoList data={{ One: 'A', Two: 'B' }} />);

    expect(screen.getAllByText(/:$/)).toHaveLength(2);
  });
});
