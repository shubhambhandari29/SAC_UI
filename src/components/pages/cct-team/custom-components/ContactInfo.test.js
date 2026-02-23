import { render, screen } from '@testing-library/react';
import ContactInfo from './ContactInfo';

describe('ContactInfo', () => {
  it('returns empty output when data is missing', () => {
    const { container } = render(<ContactInfo data={null} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('returns empty output when data is an empty object', () => {
    const { container } = render(<ContactInfo data={{}} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('renders labels and values from data entries', () => {
    render(
      <ContactInfo
        data={{
          Phone: '(555) 111-2222',
          Email: 'adjuster@example.com',
        }}
      />,
    );

    expect(screen.getByText('Phone:')).toBeInTheDocument();
    expect(screen.getByText('(555) 111-2222')).toBeInTheDocument();
    expect(screen.getByText('Email:')).toBeInTheDocument();
    expect(screen.getByText('adjuster@example.com')).toBeInTheDocument();
  });

  it('renders one label and one value per entry', () => {
    render(<ContactInfo data={{ One: 'A', Two: 'B' }} />);

    expect(screen.getAllByRole('heading', { level: 5 })).toHaveLength(4);
  });
});
