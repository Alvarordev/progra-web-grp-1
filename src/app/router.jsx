import {
  MyPresentationPage,
  PublicProgramPage,
  SessionAssignmentPage,
  SessionBuilderPage,
  MetricsPage,
  ReviewerCompliancePage,
  UsersPage,
  ReceivedWorksPage,
  ReviewersListPage,
  ReviewsTrackingPage,
  InformationPage,
  ExamplePage,
  AuthorHomePage,
  History1Page,
  CongressRulesPage,
  LoginPage,
  PasswordRecoveryPage,
  RegistrationPage,
  AccountPage,
  NotFoundPage,
  RoleAccess,
  RoleAccessError,
  EditionSettingsPage,
  ThematicAxesPage,
  WorkTypesPage,
  SchedulePage,
  CriteriaPage,
  NewWorkPage,
  CoauthorsPage,
  MyWorksPage,
  WorkDetailPage,
  ReadOnlyWorkPage,
  ReviewerInboxPage,
  EvaluationPage,
  ConsolidatedReviewPage,
} from './routePages.js'
import { createBrowserRouter, redirect } from 'react-router'
import { createAccessLoader } from './access.js'

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
    loader: createAccessLoader(
      ['author', 'both'],
      'El área del autor es exclusiva de participantes con rol autor.'
    ),
    errorElement: <RoleAccessError />,
    children: [
      { path: '/autor/presentacion', element: <MyPresentationPage /> },
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
    element: <RoleAccess />,
    loader: createAccessLoader(
      ['author', 'reviewer', 'both'],
      'Esta sección requiere una cuenta de participante.'
    ),
    errorElement: <RoleAccessError />,
    children: [
      { path: '/mi-cuenta', element: <AccountPage /> },
      { path: '/autor/cuenta', element: <AccountPage /> },
    ],
  },
  {
    element: <RoleAccess />,
    loader: createAccessLoader(
      ['reviewer', 'both'],
      'La bandeja de revisión es exclusiva del rol revisor.'
    ),
    errorElement: <RoleAccessError />,
    children: [{ path: '/bandeja-revision', element: <ReviewerInboxPage /> }],
  },
  {
    element: <RoleAccess />,
    loader: createAccessLoader(
      ['reviewer', 'both'],
      'La evaluación de trabajos es exclusiva del rol revisor.',
      true
    ),
    errorElement: <RoleAccessError />,
    children: [{ path: '/evaluacion/:codigo', element: <EvaluationPage /> }],
  },
  {
    element: <RoleAccess />,
    loader: createAccessLoader(
      ['committee'],
      'Esta sección es exclusiva del comité organizador.'
    ),
    errorElement: <RoleAccessError />,
    children: [
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
        path: '/programa',
        element: <SessionBuilderPage />,
      },
      { path: '/programa/asignar-trabajos', element: <SessionAssignmentPage /> },
    ],
  },
  { path: '/programa-publico', element: <PublicProgramPage /> },
  {
    path: '/mi-presentacion',
    loader: () => {
      throw redirect('/autor/presentacion')
    },
  },
  ...[
    'guia-autores',
    'guia-revisores',
    'preguntas-frecuentes',
    'terminos',
    'privacidad',
  ].map(section => ({
    path: `/${section}`,
    element: <InformationPage seccion={section} />,
  })),
  {
    path: '*',
    element: <NotFoundPage />,
  },
])

export default router
