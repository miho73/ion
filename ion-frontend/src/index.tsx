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

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root/>,
        errorElement: <ErrorPage/>,
        children: [
            {
                path: "auth",
                element: <AuthBox/>
            },
            {
                path: "signup",
                element: <SignupBox/>
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
