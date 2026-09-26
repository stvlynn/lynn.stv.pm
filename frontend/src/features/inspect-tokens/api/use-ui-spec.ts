import { apiRoutes } from '@lynn/contracts';
import { useQuery } from '@tanstack/react-query';
import type { UiSpec } from 'entities/design-token';
import { getJson } from 'shared/api';

export const useUiSpec = () =>
  useQuery({
    queryKey: ['specs', 'ui'],
    queryFn: ({ signal }) => getJson<UiSpec>(apiRoutes.uiSpec, signal),
  });
