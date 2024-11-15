import { lazy } from "react";
import constants from "./routeLinks";

const Signin = lazy(() => import("../screens/user/component/signin.tsx"));
const { routeLinks } = constants;

const { signin } = routeLinks;

export const PublicRoutesPath = [
    {
        path: signin,
        element: Signin,
    },
];
export const PrivateRoutesPath = [
    {
        path: "",
        element: "",
    },
];
