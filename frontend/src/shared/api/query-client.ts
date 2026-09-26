import { QueryClient } from '@tanstack/react-query';

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Specification content changes only on deploy.
        staleTime: Number.POSITIVE_INFINITY,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });
}
