import { apiRoutes } from '@lynn/contracts';
import { useQuery } from '@tanstack/react-query';
import type { CharacterProfile } from 'entities/character';
import { getJson } from 'shared/api';

export const characterQueryKey = ['character'] as const;

export const useCharacterProfile = () =>
  useQuery({
    queryKey: characterQueryKey,
    queryFn: ({ signal }) => getJson<CharacterProfile>(apiRoutes.character, signal),
  });
