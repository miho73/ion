import React from 'react';
import ReactDOM from 'react-dom/client';
import './scss/ion.scss';
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import Root from "./elements/root";
import ErrorPage from "./error-page";
import AuthBox from "./pages/authentication";
import SignupBox from "./pages/signup";
import {OverrideLayout} from "./elements/layout";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root/>,
        errorElement: <ErrorPage/>,
        children: [
            {
                path: "auth",
                element:
                    <OverrideLayout center={true}>
                        <AuthBox/>
                    </OverrideLayout>
            },
            {
                path: "signup",
                element:
                    <OverrideLayout center={true}>
                        <SignupBox/>
                    </OverrideLayout>
            }
        ],
    },
]);

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
