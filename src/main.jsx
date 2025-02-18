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
import Analytics from './dashboard/participant/Analytics';
import RegisteredCamps from './dashboard/participant/RegisteredCamps';
import Payment from './payment/Payment';
import PaymentHistory from './payment/PaymentHistory';
import YourFeedbacks from './dashboard/participant/YourFeedbacks';
import AvailableCamps from './pages/common/AvailableCamps';
import ManageFeedback from './dashboard/organizer/ManageFeedback';
import PrivateRoute from './routes/PrivateRoute';
import ErrorPage from './pages/common/ErrorPage';
import AboutUs from './pages/common/AboutUs';
import OrganizerDashboard from './dashboard/organizer/OrganizerDashboard';
import AllFeedbacks from './pages/common/AllFeedbacks';
const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/about",
        element: <AboutUs />,
      },
      {
        path: "/feedbacks",
        element: <AllFeedbacks />,
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
        element: <PrivateRoute><CampDetails /></PrivateRoute>,
      },
      {
        path: "/available-camps",
        element: <AvailableCamps />,
      }
    ],
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    errorElement: <ErrorPage />,
    children: [
      // Organizer's routes
      {
        path: "/dashboard/organizer-profile",
        element: <OrganizerProfile />,
      },
      {
        path: "/dashboard/organizer-dashboard",
        element: <OrganizerDashboard />,
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
      },
      {
        path: "/dashboard/manage-feedbacks",
        element: <ManageFeedback />,
      },
      // Participant's route
      {
        path: "/dashboard/analytics",
        element: <Analytics />,
      },
      {
        path: "/dashboard/participant-profile",
        element: <OrganizerProfile />,
      },
      {
        path: "/dashboard/registered-camps",
        element: <RegisteredCamps />,
      },
      {
        path: "/dashboard/payment/:id",
        element: <Payment />,
      },
      {
        path: "/dashboard/payment-history",
        element: <PaymentHistory />,
      },
      {
        path: "/dashboard/your-feedback",
        element: <YourFeedbacks />,
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
