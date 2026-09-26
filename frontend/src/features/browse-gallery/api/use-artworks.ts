import { apiRoutes } from '@lynn/contracts';
import { useQuery } from '@tanstack/react-query';
import type { Artwork } from 'entities/artwork';
import { getJson } from 'shared/api';

export const useArtworks = () =>
  useQuery({
    queryKey: ['artworks'],
    queryFn: ({ signal }) => getJson<Artwork[]>(apiRoutes.artworks, signal),
  });
