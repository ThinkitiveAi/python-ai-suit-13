import React from 'react';
import {
  RouterProvider,
  createRouter,
  createRootRoute,
  createRoute,
  Outlet,
  redirect,
} from '@tanstack/react-router';
import ProviderLogin from './ProviderLogin';
import ProviderRegistration from './ProviderRegistration';
import PatientLogin from './PatientLogin';
import PatientRegistration from './PatientRegistration';
import ProviderAvailabilityPage from './pages/ProviderAvailabilityPage';
import PatientBookingPage from './pages/PatientBookingPage';
import SchedulingDemo from './pages/SchedulingDemo';

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: ProviderLogin,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: ProviderRegistration,
});

const patientLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/patient/login',
  component: PatientLogin,
});

const patientRegisterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/patient/register',
  component: PatientRegistration,
});

// Provider scheduling routes
const providerAvailabilityRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/provider/availability',
  component: ProviderAvailabilityPage,
});

// Patient booking routes
const patientBookingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/patient/booking',
  component: PatientBookingPage,
});

// Demo route
const schedulingDemoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/scheduling-demo',
  component: SchedulingDemo,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  loader: () => redirect({ to: '/scheduling-demo' }),
});

const router = createRouter({
  routeTree: rootRoute.addChildren([
    loginRoute,
    registerRoute,
    patientLoginRoute,
    patientRegisterRoute,
    providerAvailabilityRoute,
    patientBookingRoute,
    schedulingDemoRoute,
    indexRoute,
  ]),
});

const App: React.FC = () => <RouterProvider router={router} />;
export default App;
