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
