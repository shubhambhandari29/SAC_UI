import { render, screen } from '@testing-library/react';
import TabPanel from './TabPanel';

describe('TabPanel', () => {
  it('shows children when active', () => {
    render(
      <TabPanel value={1} index={1}>
        <div>Panel content</div>
      </TabPanel>,
    );

    expect(screen.getByText('Panel content')).toBeInTheDocument();
  });

  it('hides children when inactive', () => {
    const { container } = render(
      <TabPanel value={0} index={1}>
        <div>Hidden content</div>
      </TabPanel>,
    );

    const root = container.firstChild;
    expect(root).toHaveAttribute('hidden');
    expect(screen.queryByText('Hidden content')).not.toBeInTheDocument();
  });
});
