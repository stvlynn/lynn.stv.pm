import { QueryClientProvider } from '@tanstack/react-query';
import { MotionConfig } from 'motion/react';
import { ThemeProvider } from 'next-themes';
import { type ReactNode, useState } from 'react';
import { createQueryClient } from 'shared/api';

export function AppProviders({ children }: { readonly children: ReactNode }) {
  const [queryClient] = useState(createQueryClient);
  return (
    <ThemeProvider
      attribute="data-theme"
      storageKey="lynn.theme"
      defaultTheme="system"
      enableSystem
      // Client-only app: index.html resolves the theme before paint, so the
      // SSR bootstrap script is inert here and marked as a data block.
      scriptProps={{ type: 'application/json' }}
    >
      <QueryClientProvider client={queryClient}>
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
