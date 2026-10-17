import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './main.css'

import App from "./App";
import { Users } from "./views/Users";
import { User } from "./views/User";
import { Consumers } from "./views/Consumers";
import { Consumer } from "./views/Consumer";
import { Definitions } from "./views/Definitions";
import { Assets } from "./views/Assets";
import { Packages } from "./views/Packages";
import { Package } from "./views/Package";
import { PackageDiscussions } from "./views/PackageDiscussions";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <h1>Home</h1>,
      },
      {
        path: "users",
        element: <Users />,
      },
      {
        path: "users/:id",
        element: <User />
      },
      {
        path: "consumers",
        element: <Consumers />

      },
      {
        path: "consumers/:id",
        element: <Consumer />
      },
      {
        path: "definitions",
        element: <Definitions />
      },
      {
        path: "assets",
        element: <Assets />
      },
      {
        path: "packages",
        element: <Packages />
      },
      {
        path: "packages/:id",
        element: <Package />
      },
      {
        path: "packages/:id/discussions",
        element: <PackageDiscussions />
      }
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);