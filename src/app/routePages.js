import { lazy } from 'react'

const pantallas = {
  MyPresentationPage: () => import('../features/history-6/pages/MyPresentationPage.jsx'),
  PublicProgramPage: () => import('../features/history-6/pages/PublicProgramPage.jsx'),
  SessionAssignmentPage: () =>
    import('../features/history-6/pages/SessionAssignmentPage.jsx'),
  SessionBuilderPage: () => import('../features/history-6/pages/SessionBuilderPage.jsx'),
  MetricsPage: () => import('../features/history-7/pages/MetricsPage.jsx'),
  ReviewerCompliancePage: () =>
    import('../features/history-7/pages/ReviewerCompliancePage.jsx'),
  UsersPage: () => import('../features/history-7/pages/UsersPage.jsx'),
  ReceivedWorksPage: () => import('../features/history-4/pages/ReceivedWorksPage.jsx'),
  ReviewersListPage: () => import('../features/history-4/pages/ReviewersListPage.jsx'),
  ReviewsTrackingPage: () =>
    import('../features/history-4/pages/ReviewsTrackingPage.jsx'),
  InformationPage: () => import('../features/history-1/pages/InformationPage.jsx'),
  AuthorHomePage: () => import('../features/history-1/pages/AuthorHomePage.jsx'),
  History1Page: () => import('../features/history-1/pages/History1Page.jsx'),
  CongressRulesPage: () => import('../features/history-1/pages/CongressRulesPage.jsx'),
  LoginPage: () => import('../features/history-1/pages/LoginPage.jsx'),
  PasswordRecoveryPage: () =>
    import('../features/history-1/pages/PasswordRecoveryPage.jsx'),
  RegistrationPage: () => import('../features/history-1/pages/RegistrationPage.jsx'),
  AccountPage: () => import('../features/history-1/pages/AccountPage.jsx'),
  NotFoundPage: () => import('../features/history-1/pages/NotFoundPage.jsx'),
  RoleAccess: () => import('../features/history-1/components/RoleAccess/RoleAccess.jsx'),
  RoleAccessError: () =>
    import('../features/history-1/components/RoleAccess/RoleAccessError.jsx'),
  EditionSettingsPage: () =>
    import('../features/history-2/pages/EditionSettingsPage.jsx'),
  ThematicAxesPage: () => import('../features/history-2/pages/ThematicAxesPage.jsx'),
  WorkTypesPage: () => import('../features/history-2/pages/WorkTypesPage.jsx'),
  SchedulePage: () => import('../features/history-2/pages/SchedulePage.jsx'),
  CriteriaPage: () => import('../features/history-2/pages/CriteriaPage.jsx'),
  NewWorkPage: () => import('../features/history-3/pages/NewWorkPage.jsx'),
  CoauthorsPage: () => import('../features/history-3/pages/CoauthorsPage.jsx'),
  MyWorksPage: () => import('../features/history-3/pages/MyWorksPage.jsx'),
  WorkDetailPage: () => import('../features/history-3/pages/WorkDetailPage.jsx'),
  ReadOnlyWorkPage: () => import('../features/history-3/pages/ReadOnlyWorkPage.jsx'),
  ReviewerInboxPage: () => import('../features/history-5/pages/ReviewerInboxPage.jsx'),
  EvaluationPage: () => import('../features/history-5/pages/EvaluationPage.jsx'),
  ConsolidatedReviewPage: () =>
    import('../features/history-5/pages/ConsolidatedReviewPage.jsx'),
}

export const precargarPantallas = () =>
  Object.values(pantallas).forEach(cargar => cargar().catch(() => {}))

export const MyPresentationPage = lazy(pantallas.MyPresentationPage)
export const PublicProgramPage = lazy(pantallas.PublicProgramPage)
export const SessionAssignmentPage = lazy(pantallas.SessionAssignmentPage)
export const SessionBuilderPage = lazy(pantallas.SessionBuilderPage)
export const MetricsPage = lazy(pantallas.MetricsPage)
export const ReviewerCompliancePage = lazy(pantallas.ReviewerCompliancePage)
export const UsersPage = lazy(pantallas.UsersPage)
export const ReceivedWorksPage = lazy(pantallas.ReceivedWorksPage)
export const ReviewersListPage = lazy(pantallas.ReviewersListPage)
export const ReviewsTrackingPage = lazy(pantallas.ReviewsTrackingPage)
export const InformationPage = lazy(pantallas.InformationPage)
export const AuthorHomePage = lazy(pantallas.AuthorHomePage)
export const History1Page = lazy(pantallas.History1Page)
export const CongressRulesPage = lazy(pantallas.CongressRulesPage)
export const LoginPage = lazy(pantallas.LoginPage)
export const PasswordRecoveryPage = lazy(pantallas.PasswordRecoveryPage)
export const RegistrationPage = lazy(pantallas.RegistrationPage)
export const AccountPage = lazy(pantallas.AccountPage)
export const NotFoundPage = lazy(pantallas.NotFoundPage)
export const RoleAccess = lazy(pantallas.RoleAccess)
export const RoleAccessError = lazy(pantallas.RoleAccessError)
export const EditionSettingsPage = lazy(pantallas.EditionSettingsPage)
export const ThematicAxesPage = lazy(pantallas.ThematicAxesPage)
export const WorkTypesPage = lazy(pantallas.WorkTypesPage)
export const SchedulePage = lazy(pantallas.SchedulePage)
export const CriteriaPage = lazy(pantallas.CriteriaPage)
export const NewWorkPage = lazy(pantallas.NewWorkPage)
export const CoauthorsPage = lazy(pantallas.CoauthorsPage)
export const MyWorksPage = lazy(pantallas.MyWorksPage)
export const WorkDetailPage = lazy(pantallas.WorkDetailPage)
export const ReadOnlyWorkPage = lazy(pantallas.ReadOnlyWorkPage)
export const ReviewerInboxPage = lazy(pantallas.ReviewerInboxPage)
export const EvaluationPage = lazy(pantallas.EvaluationPage)
export const ConsolidatedReviewPage = lazy(pantallas.ConsolidatedReviewPage)
