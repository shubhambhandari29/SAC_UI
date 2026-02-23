import "./App.css";
import { useEffect } from "react";
import { useRoutes } from "react-router-dom";
import store from "./redux/store";
import { fetchCurrentUser, logout, refreshTokenThunk } from "./redux/authSlice";
import setupInterceptors from "./api/setupInterceptors";
import { useDispatch, useSelector } from "react-redux";
import Login from "./components/Login";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./components/Home";
import PendingItems from "./components/pages/PendingItems";
import ViewSacAccount from "./components/pages/sac-administration/manage-accounts/sac/ViewSacAccount";
import SacCreateNewAccount from "./components/pages/sac-administration/manage-accounts/sac/SacCreateNewAccount";
import CreateNewPolicy from "./components/pages/sac-administration/manage-accounts/view-policies/CreateNewPolicy";
import ListManagement from "./components/pages/sac-administration/sac-list-management/ListManagement";
import AffinityCreateNewProgram from "./components/pages/sac-administration/manage-accounts/affinity/AffinityCreateNewProgram";
import ViewAffinityProgram from "./components/pages/sac-administration/manage-accounts/affinity/ViewAffiniftyProgram";
import CreateNewPolicyTypes from "./components/pages/sac-administration/manage-accounts/view-policy-types/CreateNewPolicyType";
import CreateNewSacAccountStepper from "./components/pages/sac-administration/manage-accounts/CreateNewSacAccountStepper";
import CreateNewAffinityProgramStepper from "./components/pages/sac-administration/manage-accounts/CreateNewAffinityProgramStepper";
// import ViewCctAccounts from "./components/pages/cct-team/ViewCctAccounts";
import CctViewSacAccount from "./components/pages/cct-team/CctViewSacAccount";
import CctViewAffinityProgram from "./components/pages/cct-team/CctViewAffinityProgram";
import CctViewPolicy from "./components/pages/cct-team/CctViewPolicy";
import CctViewPolicyType from "./components/pages/cct-team/CctViewPolicyType";

setupInterceptors(store, logout, refreshTokenThunk);

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  const routes = [
    {
      path: "/login",
      element: <Login />,
    },
    {
      element: <PrivateRoute />,
      children: [
        {
          path: "/",
          element: <Home />,
          children: [
            {
              path: "pending-items",
              element: <PendingItems />,
            },
            {
              path: "sac-view-account",
              element: <ViewSacAccount />,
            },
            {
              path: "sac-view-account/:column_name",
              element:
                user?.role === "Underwriter" ? (
                  <CreateNewSacAccountStepper />
                ) : (
                  <SacCreateNewAccount />
                ),
            },
            {
              path: "sac-create-new-account",
              element:
                user?.role === "Underwriter" ? (
                  <CreateNewSacAccountStepper />
                ) : (
                  <SacCreateNewAccount />
                ),
            },
            {
              path: "view-policy/:column_name",
              element: <CreateNewPolicy />,
            },
            {
              path: "create-new-policy",
              element: <CreateNewPolicy />,
            },
            {
              path: "list-management",
              element: <ListManagement />,
            },
            {
              path: "affinity-view-program",
              element: <ViewAffinityProgram />,
            },
            {
              path: "affinity-view-program/:column_name",
              element:
                user?.role === "Underwriter" ? (
                  <CreateNewAffinityProgramStepper />
                ) : (
                  <AffinityCreateNewProgram />
                ),
            },
            {
              path: "affinity-create-new-program",
              element:
                user?.role === "Underwriter" ? (
                  <CreateNewAffinityProgramStepper />
                ) : (
                  <AffinityCreateNewProgram />
                ),
            },
            {
              path: "view-policy-types/:column_name",
              element: <CreateNewPolicyTypes />,
            },
            {
              path: "create-new-policy-type",
              element: <CreateNewPolicyTypes />,
            },
            {
              path: "view-cct-accounts/affinity=false",
              element: <ViewSacAccount />,
            },
            {
              path: "view-cct-accounts/affinity=true",
              element: <ViewAffinityProgram />,
            },
            {
              path: "view-cct-accounts-sac/:column_name",
              element: <CctViewSacAccount />,
            },
            {
              path: "cct-view-policy/:column_name",
              element: <CctViewPolicy />,
            },
            {
              path: "view-cct-accounts-affinity/:column_name",
              element: <CctViewAffinityProgram />,
            },
            {
              path: "cct-view-policy-types/:column_name",
              element: <CctViewPolicyType />,
            },
          ],
        },
      ],
    },
  ];

  const element = useRoutes(routes);

  return element;
}

export default App;
