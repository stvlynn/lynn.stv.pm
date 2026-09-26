import { useArtworks } from 'features/browse-gallery';
import { t } from 'shared/i18n';
import { Page, PageHeader, QueryState, Skeleton } from 'shared/ui';
import { ArtworkGallery } from 'widgets/artwork-gallery';

export function GalleryPage() {
  const artworks = useArtworks();
  return (
    <Page>
      <PageHeader title={t('gallery.title')} code="ART-03" lead={t('gallery.lead')} />
      <QueryState query={artworks} fallback={<Skeleton height="40rem" />}>
        {(data) => <ArtworkGallery artworks={data} />}
      </QueryState>
    </Page>
  );
}
