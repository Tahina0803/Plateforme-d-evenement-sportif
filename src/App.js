// src/App.js
import React from "react";
import * as ReactDOM from "react-dom/client";
import Root from "./pages/route/Root";
import AdminRouter from "./pages/admin/AdminRouter";  // Import de AdminRouter
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root/>,
  },
  {
    path: "/admin/*",  
    element: <AdminRouter />,
  },
  
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
