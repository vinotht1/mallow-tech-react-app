import { lazy } from "react";
import constants from "./routeLinks";

const Signin = lazy(() => import("../screens/user/component/signin.tsx"));
const Dashboard = lazy(
  () => import("../screens/dashboard/component/index.tsx")
);
const { routeLinks } = constants;

const { signin, dashboard } = routeLinks;

export const PublicRoutesPath = [
  {
    path: signin,
    element: Signin,
  },
];
export const PrivateRoutesPath = [
  {
    path: dashboard,
    element: Dashboard,
  },
];
