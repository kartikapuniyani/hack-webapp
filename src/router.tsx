import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/layout/Layout";
import NotFound from "./pages/NotFound";
import MapPage from "./pages/MapPage";
import TablePage from "./pages/TablePage";
import NotificationsPage from "./pages/NotificationsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <MapPage />,
      },
      {
        path: "/table",
        element: <TablePage />,
      },
      {
        path: "/notifications",
        element: <NotificationsPage />,
      },
    ],
  },
]);
