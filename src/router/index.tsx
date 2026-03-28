import { createBrowserRouter } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { ROUTES } from './routes'
import ProtectedRoute from './ProtectedRoute'
import AppLayout from '../components/layout/AppLayout'

const InstallmentPlanDetailPage = lazy(() => import('../pages/InstallmentPlanDetailPage'))
const LoginPage = lazy(() => import('../pages/LoginPage'))
const RegisterPage = lazy(() => import('../pages/RegisterPage'))
const DashboardPage = lazy(() => import('../pages/DashboardPage'))
const AccountsPage = lazy(() => import('../pages/AccountsPage'))
const AccountDetailPage = lazy(() => import('../pages/AccountDetailPage'))
const CardsPage = lazy(() => import('../pages/CardsPage'))
const TransactionsPage = lazy(() => import('../pages/TransactionsPage'))
const InstallmentsPage = lazy(() => import('../pages/InstallmentsPage'))
const ReportsPage = lazy(() => import('../pages/ReportsPage'))
const SettingsPage = lazy(() => import('../pages/SettingsPage'))

const router = createBrowserRouter([
  {
    path: ROUTES.LOGIN,
    element: (
      <Suspense fallback={null}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: ROUTES.REGISTER,
    element: (
      <Suspense fallback={null}>
        <RegisterPage />
      </Suspense>
    ),
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: ROUTES.DASHBOARD,
            element: (
              <Suspense fallback={null}>
                <DashboardPage />
              </Suspense>
            ),
          },
          {
            path: ROUTES.ACCOUNTS,
            element: (
              <Suspense fallback={null}>
                <AccountsPage />
              </Suspense>
            ),
          },
          {
            path: ROUTES.ACCOUNT_DETAIL_PATTERN,
            element: (
              <Suspense fallback={null}>
                <AccountDetailPage />
              </Suspense>
            ),
          },
          {
            path: ROUTES.CARDS,
            element: (
              <Suspense fallback={null}>
                <CardsPage />
              </Suspense>
            ),
          },
          {
            path: ROUTES.TRANSACTIONS,
            element: (
              <Suspense fallback={null}>
                <TransactionsPage />
              </Suspense>
            ),
          },
          {
            path: ROUTES.INSTALLMENTS,
            element: (
              <Suspense fallback={null}>
                <InstallmentsPage />
              </Suspense>
            ),
          },
          {
            path: ROUTES.INSTALLMENT_DETAIL_PATTERN,
            element: (
              <Suspense fallback={null}>
                <InstallmentPlanDetailPage />
              </Suspense>
            ),
          },
          {
            path: ROUTES.REPORTS,
            element: (
              <Suspense fallback={null}>
                <ReportsPage />
              </Suspense>
            ),
          },
          {
            path: ROUTES.SETTINGS,
            element: (
              <Suspense fallback={null}>
                <SettingsPage />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
])

export default router
