import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import RecursiveNavigationList from './RecursiveNavigationList';
import { useSelector } from 'react-redux';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

const nodes = [
  {
    id: 'root-folder',
    name: 'Root Folder',
    type: 'folder',
    isRoot: true,
    openByDefault: false,
    visibility: ['Admin', 'Underwriter'],
    children: [
      {
        id: 'child-file',
        name: 'Child File',
        type: 'file',
        visibility: ['Admin'],
        url: '/child-file',
      },
    ],
  },
  {
    id: 'top-file',
    name: 'Top File',
    type: 'file',
    isRoot: true,
    visibility: ['Admin'],
    url: '/top-file',
  },
  {
    id: 'hidden-file',
    name: 'Hidden File',
    type: 'file',
    visibility: ['Underwriter'],
    url: '/hidden',
  },
];

function renderList(initialPath = '/top-file') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <RecursiveNavigationList nodes={nodes} />
    </MemoryRouter>,
  );
}

describe('RecursiveNavigationList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useSelector.mockImplementation((selector) =>
      selector({ auth: { user: { role: 'Admin' } } }),
    );
  });

  it('renders only items visible for current role', () => {
    renderList();

    expect(screen.getByText('Root Folder')).toBeInTheDocument();
    expect(screen.getByText('Top File')).toBeInTheDocument();
    expect(screen.queryByText('Hidden File')).not.toBeInTheDocument();
  });

  it('toggles folder and shows nested children', async () => {
    renderList('/pending-items');

    expect(screen.queryByText('Child File')).not.toBeInTheDocument();

    await userEvent.click(screen.getByText('Root Folder'));

    expect(screen.getByText('Child File')).toBeInTheDocument();
  });

  it('renders link href for file nodes', () => {
    renderList();

    const topFileLink = screen.getByText('Top File').closest('a');
    expect(topFileLink).toHaveAttribute('href', '/top-file');
  });
});
