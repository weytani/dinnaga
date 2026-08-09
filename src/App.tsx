// ABOUTME: Root application component — defines the route table and renders the router.
// ABOUTME: Shared chrome lives in Layout; each route renders only its own content.
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './routes/Home/Home';
import { Atisha } from './routes/Atisha/Atisha';
import { Method } from './routes/Method/Method';
import { Colophon } from './routes/Colophon/Colophon';
import { Loadout } from './routes/Loadout/Loadout';
import { Artifacts } from './routes/Artifacts/Artifacts';
import { ArtifactViewer } from './routes/Artifacts/ArtifactViewer';
import { NotFound } from './routes/NotFound/NotFound';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'atisha', element: <Atisha /> },
      { path: 'method', element: <Method /> },
      { path: 'colophon', element: <Colophon /> },
      { path: 'loadout', element: <Loadout /> },
      { path: 'artifacts', element: <Artifacts /> },
      { path: 'artifacts/:slug', element: <ArtifactViewer /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
