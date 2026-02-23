import { render } from '@testing-library/react';
import { useDispatch, useSelector } from 'react-redux';
import setupInterceptors from './api/setupInterceptors';
import { fetchCurrentUser } from './redux/authSlice';

const mockDispatch = jest.fn();
const mockUseRoutes = jest.fn(() => <div>routes-rendered</div>);

jest.mock('./redux/store', () => ({ __esModule: true, default: { id: 'mock-store' } }));

jest.mock('./api/setupInterceptors', () => jest.fn());

jest.mock('./redux/authSlice', () => ({
  fetchCurrentUser: jest.fn(),
  logout: jest.fn(),
  refreshTokenThunk: jest.fn(),
}));

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useRoutes: (...args) => mockUseRoutes(...args),
}));

jest.mock('./components/Login', () => () => <div>Login</div>);
jest.mock('./components/PrivateRoute', () => () => <div>PrivateRoute</div>);
jest.mock('./components/Home', () => () => <div>Home</div>);
jest.mock('./components/pages/PendingItems', () => () => <div>PendingItems</div>);
jest.mock('./components/pages/sac-administration/manage-accounts/sac/ViewSacAccount', () => () => <div>ViewSacAccount</div>);
jest.mock('./components/pages/sac-administration/manage-accounts/sac/SacCreateNewAccount', () => () => <div>SacCreateNewAccount</div>);
jest.mock('./components/pages/sac-administration/manage-accounts/view-policies/CreateNewPolicy', () => () => <div>CreateNewPolicy</div>);
jest.mock('./components/pages/sac-administration/sac-list-management/ListManagement', () => () => <div>ListManagement</div>);
jest.mock('./components/pages/sac-administration/manage-accounts/affinity/AffinityCreateNewProgram', () => () => <div>AffinityCreateNewProgram</div>);
jest.mock('./components/pages/sac-administration/manage-accounts/affinity/ViewAffiniftyProgram', () => () => <div>ViewAffinityProgram</div>);
jest.mock('./components/pages/sac-administration/manage-accounts/view-policy-types/CreateNewPolicyType', () => () => <div>CreateNewPolicyType</div>);
jest.mock('./components/pages/sac-administration/manage-accounts/CreateNewSacAccountStepper', () => () => <div>CreateNewSacAccountStepper</div>);
jest.mock('./components/pages/sac-administration/manage-accounts/CreateNewAffinityProgramStepper', () => () => <div>CreateNewAffinityProgramStepper</div>);
jest.mock('./components/pages/cct-team/CctViewSacAccount', () => () => <div>CctViewSacAccount</div>);
jest.mock('./components/pages/cct-team/CctViewAffinityProgram', () => () => <div>CctViewAffinityProgram</div>);
jest.mock('./components/pages/cct-team/CctViewPolicy', () => () => <div>CctViewPolicy</div>);
jest.mock('./components/pages/cct-team/CctViewPolicyType', () => () => <div>CctViewPolicyType</div>);

function renderApp() {
  // Require lazily so the module-level interceptor setup runs with mocks.
  // eslint-disable-next-line global-require
  const App = require('./App').default;
  return render(<App />);
}

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useDispatch.mockReturnValue(mockDispatch);
    useSelector.mockImplementation((selector) =>
      selector({ auth: { user: { role: 'Admin' } } }),
    );
    fetchCurrentUser.mockReturnValue({ type: 'auth/fetchCurrentUser' });
  });

  it('renders routes and dispatches fetchCurrentUser on mount', () => {
    renderApp();

    expect(fetchCurrentUser).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'auth/fetchCurrentUser' });
    expect(mockUseRoutes).toHaveBeenCalled();
    expect(setupInterceptors).toHaveBeenCalledTimes(1);
  });
});
