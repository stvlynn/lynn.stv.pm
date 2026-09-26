import { apiRoutes } from '@lynn/contracts';
import { useQuery } from '@tanstack/react-query';
import type { StickerSpec } from 'entities/sticker';
import { getJson } from 'shared/api';

export const useStickerSpec = () =>
  useQuery({
    queryKey: ['specs', 'sticker'],
    queryFn: ({ signal }) => getJson<StickerSpec>(apiRoutes.stickerSpec, signal),
  });
