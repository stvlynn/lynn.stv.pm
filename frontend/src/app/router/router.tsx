import { HomePage } from 'pages/home';
import { NotFoundPage } from 'pages/not-found';
import { createBrowserRouter } from 'react-router';
import { paths } from 'shared/config';
import { AppShell } from 'widgets/app-shell';

/** The drawing sheet loads eagerly; every other sheet is its own chunk. */
export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { path: paths.home, element: <HomePage /> },
      { path: paths.character, lazy: async () => ({ Component: (await import('pages/character')).CharacterPage }) },
      { path: paths.wardrobe, lazy: async () => ({ Component: (await import('pages/wardrobe')).WardrobePage }) },
      { path: paths.gallery, lazy: async () => ({ Component: (await import('pages/gallery')).GalleryPage }) },
      { path: paths.ui, lazy: async () => ({ Component: (await import('pages/ui-spec')).UiSpecPage }) },
      { path: paths.sticker, lazy: async () => ({ Component: (await import('pages/sticker-spec')).StickerSpecPage }) },
      { path: paths.pv, lazy: async () => ({ Component: (await import('pages/pv-spec')).PvSpecPage }) },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
