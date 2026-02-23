import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Modal from './Modal';

describe('Modal', () => {
  it('renders title, children, and actions when open', () => {
    render(
      <Modal
        open
        onClose={jest.fn()}
        title="Confirm Action"
        actions={<button type="button">Save</button>}
      >
        <div>Body text</div>
      </Modal>,
    );

    expect(screen.getByText('Confirm Action')).toBeInTheDocument();
    expect(screen.getByText('Body text')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('calls onClose when close icon is clicked', async () => {
    const onClose = jest.fn();

    render(
      <Modal open onClose={onClose} title="Close me">
        <div>Body</div>
      </Modal>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'close' }));

    expect(onClose).toHaveBeenCalled();
  });

  it('hides close icon when hideCloseIcon is true', () => {
    render(
      <Modal open onClose={jest.fn()} title="No close" hideCloseIcon>
        <div>Body</div>
      </Modal>,
    );

    expect(screen.queryByRole('button', { name: 'close' })).not.toBeInTheDocument();
  });
});
