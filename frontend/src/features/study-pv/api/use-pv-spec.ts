import { apiRoutes } from '@lynn/contracts';
import { useQuery } from '@tanstack/react-query';
import type { PvSpec } from 'entities/pv-guide';
import { getJson } from 'shared/api';

export const usePvSpec = () =>
  useQuery({
    queryKey: ['specs', 'pv'],
    queryFn: ({ signal }) => getJson<PvSpec>(apiRoutes.pvSpec, signal),
  });
