import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Root from './routes/Root';
import AuthProvider from './providers/AuthProviders';
import ThemeProvider from './providers/ThemeProvider';
import Home from './pages/home/Home';
import Login from './pages/common/Login';
import Registration from './pages/common/Registration';
import CampDetails from './pages/camps/CampDetails';

// tanstackQuery
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import Dashboard from './dashboard/Dashboard';
import OrganizerProfile from './dashboard/organizer/OrganizerProfile';
import AddCamp from './dashboard/organizer/AddCamp';
import ManageCamps from './dashboard/organizer/ManageCamps';
import UpdateCamp from './dashboard/organizer/UpdateCamp';
import ManageRegistrations from './dashboard/organizer/ManageRegistrations';

const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <div>Error</div>,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Registration />,
      },
      {
        path: "/camp-details/:campId",
        element: <CampDetails />,
      }
    ],
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    errorElement: <div>Error</div>,
    children: [
      {
        path: "/dashboard/organizer-profile",
        element: <OrganizerProfile />,
      },
      {
        path: "/dashboard/add-camp",
        element: <AddCamp />,
      },
      {
        path: "/dashboard/manage-camps",
        element: <ManageCamps />,
      },
      {
        path: "/dashboard/update-camp/:id",
        element: <UpdateCamp />,
      },
      {
        path: "/dashboard/manage-registrations",
        element: <ManageRegistrations />,
      }
    ],
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>,
)
