import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BlueTextField from './BlueTextField';

describe('BlueTextField', () => {
  it('renders with label and value', () => {
    render(
      <BlueTextField
        label="Program Name"
        value="Affinity Alpha"
        onChange={jest.fn()}
      />,
    );

    expect(screen.getByLabelText('Program Name')).toHaveValue('Affinity Alpha');
  });

  it('keeps the input read-only', () => {
    render(
      <BlueTextField label="Readonly Field" value="Fixed" onChange={jest.fn()} />,
    );

    expect(screen.getByLabelText('Readonly Field')).toHaveAttribute('readonly');
  });

  it('honors disabled prop', () => {
    render(
      <BlueTextField label="Disabled Field" value="Blocked" onChange={jest.fn()} disabled />,
    );

    expect(screen.getByLabelText('Disabled Field')).toBeDisabled();
  });

  it('does not allow typing into read-only input', async () => {
    render(<BlueTextField label="ReadOnly" defaultValue="Base" />);

    const input = screen.getByLabelText('ReadOnly');
    await userEvent.type(input, '123');

    expect(input).toHaveValue('Base');
  });
});
