import { createBrowserRouter, Navigate } from 'react-router';
import ExamplePage from '../ejemplo/ExamplePage.jsx';
import ReviewerInbox from '../History-5/ReviewerInbox.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate replace to="/mi-bandeja" />,
  },
  {
    path: '/ejemplo',
    element: <ExamplePage />,
  },
  {
    path: '/mi-bandeja',
    element: <ReviewerInbox />,
  }
]);

export default router;