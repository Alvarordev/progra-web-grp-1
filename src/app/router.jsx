import MyPresentationPage from '../features/history-6/pages/MyPresentationPage.jsx'
import PublicProgramPage from '../features/history-6/pages/PublicProgramPage.jsx'
import SessionAssignmentPage from '../features/history-6/pages/SessionAssignmentPage.jsx'
import SessionBuilderPage from '../features/history-6/pages/SessionBuilderPage.jsx'
import MetricsPage from '../features/history-7/pages/MetricsPage.jsx'
import ReviewerCompliancePage from '../features/history-7/pages/ReviewerCompliancePage.jsx'
import UsersPage from '../features/history-7/pages/UsersPage.jsx'
import ReceivedWorksPage from '../features/history-4/pages/ReceivedWorksPage.jsx'
import ReviewersListPage from '../features/history-4/pages/ReviewersListPage.jsx'
import ReviewsTrackingPage from '../features/history-4/pages/ReviewsTrackingPage.jsx'
import { createBrowserRouter } from 'react-router'
import ExamplePage from '../ejemplo/ExamplePage.jsx'
import AuthorHomePage from '../features/history-1/pages/AuthorHomePage.jsx'
import History1Page from '../features/history-1/pages/History1Page.jsx'
import CongressRulesPage from '../features/history-1/pages/CongressRulesPage.jsx'
import LoginPage from '../features/history-1/pages/LoginPage.jsx'
import PasswordRecoveryPage from '../features/history-1/pages/PasswordRecoveryPage.jsx'
import RegistrationPage from '../features/history-1/pages/RegistrationPage.jsx'
import AccountPage from '../features/history-1/pages/AccountPage.jsx'
import NotFoundPage from '../features/history-1/pages/NotFoundPage.jsx'
import RoleAccess from '../features/history-1/components/RoleAccess/RoleAccess.jsx'
import RoleAccessError from '../features/history-1/components/RoleAccess/RoleAccessError.jsx'
import { createAccessLoader } from './access.js'
import EditionSettingsPage from '../features/history-2/pages/EditionSettingsPage.jsx'
import ThematicAxesPage from '../features/history-2/pages/ThematicAxesPage.jsx'
import WorkTypesPage from '../features/history-2/pages/WorkTypesPage.jsx'
import SchedulePage from '../features/history-2/pages/SchedulePage.jsx'
import CriteriaPage from '../features/history-2/pages/CriteriaPage.jsx'
import NewWorkPage from '../features/history-3/pages/NewWorkPage.jsx'
import CoauthorsPage from '../features/history-3/pages/CoauthorsPage.jsx'
import MyWorksPage from '../features/history-3/pages/MyWorksPage.jsx'
import WorkDetailPage from '../features/history-3/pages/WorkDetailPage.jsx'
import ReadOnlyWorkPage from '../features/history-3/pages/ReadOnlyWorkPage.jsx'
import ReviewerInboxPage from '../features/history-5/pages/ReviewerInboxPage.jsx'
import EvaluationPage from '../features/history-5/pages/EvaluationPage.jsx'
import ConsolidatedReviewPage from '../features/history-5/pages/ConsolidatedReviewPage.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <History1Page />,
  },
  {
    path: '/ejemplo',
    element: <ExamplePage />,
  },
  {
    path: '/history-1',
    element: <History1Page />,
  },
  {
    path: '/bases',
    element: <CongressRulesPage />,
  },
  {
    path: '/iniciar-sesion',
    element: <LoginPage />,
  },
  {
    path: '/recuperar-contrasena',
    element: <PasswordRecoveryPage />,
  },
  {
    path: '/registro',
    element: <RegistrationPage />,
  },
  {
    element: <RoleAccess />,
    loader: createAccessLoader(['author', 'both'], 'El área del autor es exclusiva de participantes con rol autor.'),
    errorElement: <RoleAccessError />,
    children: [
      { path: '/autor', element: <AuthorHomePage /> },
      { path: '/autor/nuevo-trabajo', element: <NewWorkPage /> },
      { path: '/autor/nuevo-trabajo/coautores', element: <CoauthorsPage /> },
      { path: '/autor/trabajos', element: <MyWorksPage /> },
      { path: '/autor/trabajos/:codigo', element: <WorkDetailPage /> },
      { path: '/autor/trabajos/:codigo/lectura', element: <ReadOnlyWorkPage /> },
      { path: '/nuevo-trabajo', element: <NewWorkPage /> },
      { path: '/nuevo-trabajo/coautores', element: <CoauthorsPage /> },
    ],
  },
  {
    path: '/configuracion',
    element: <EditionSettingsPage />,
  },
  {
    path: '/configuracion/ejes-tematicos',
    element: <ThematicAxesPage />,
  },
  {
    path: '/configuracion/tipos-trabajo',
    element: <WorkTypesPage />,
  },
  {
    path: '/configuracion/fechas',
    element: <SchedulePage />,
  },
  {
    path: '/configuracion/criterios',
    element: <CriteriaPage />,
  },
  {
    element: <RoleAccess />,
    loader: createAccessLoader(['author', 'reviewer', 'both'], 'Esta sección requiere una cuenta de participante.'),
    errorElement: <RoleAccessError />,
    children: [
      { path: '/mi-cuenta', element: <AccountPage /> },
      { path: '/autor/cuenta', element: <AccountPage /> },
    ],
  },
  {
    element: <RoleAccess />,
    loader: createAccessLoader(['reviewer', 'both'], 'La bandeja de revisión es exclusiva del rol revisor.'),
    errorElement: <RoleAccessError />,
    children: [{ path: '/bandeja-revision', element: <ReviewerInboxPage /> }],
  },
  {
    element: <RoleAccess />,
    loader: createAccessLoader(['reviewer', 'both'], 'La evaluación de trabajos es exclusiva del rol revisor.', true),
    errorElement: <RoleAccessError />,
    children: [{ path: '/evaluacion/:codigo', element: <EvaluationPage /> }],
  },
  {
    path: '/trabajos-recibidos/:codigo/consolidado',
    element: <ConsolidatedReviewPage />,
  },
  {
    path: '/trabajos-recibidos/:codigo/decision',
    element: <ConsolidatedReviewPage mostrarDecision />,
  },
  {
    path: '/trabajos-recibidos',
    element: <ReceivedWorksPage />,
  },
  {
    path: '/revisores',
    element: <ReviewersListPage />,
  },
  {
    path: '/seguimiento',
    element: <ReviewsTrackingPage />,
  },
  {
    path: '/tablero',
    element: <MetricsPage />,
  },
  {
    path: '/tablero/cumplimiento',
    element: <ReviewerCompliancePage />,
  },
  {
    path: '/usuarios',
    element: <UsersPage />,
  },
  {
    path: '/programa', element: <SessionBuilderPage />,
  },
  { path: '/programa/asignar-trabajos', element: <SessionAssignmentPage /> },
  { path: '/programa-publico', element: <PublicProgramPage /> },
  { path: '/mi-presentacion', element: <MyPresentationPage /> },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])

export default router;
