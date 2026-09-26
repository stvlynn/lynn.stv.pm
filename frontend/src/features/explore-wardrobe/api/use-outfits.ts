import { apiRoutes } from '@lynn/contracts';
import { useQuery } from '@tanstack/react-query';
import type { Outfit } from 'entities/outfit';
import { getJson } from 'shared/api';

export const useOutfits = () =>
  useQuery({
    queryKey: ['outfits'],
    queryFn: ({ signal }) => getJson<Outfit[]>(apiRoutes.outfits, signal),
  });
