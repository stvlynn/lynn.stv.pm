import { apiRoutes, type ComposeStickerPromptRequest, type ComposeStickerPromptResponse } from '@lynn/contracts';
import { useMutation } from '@tanstack/react-query';
import { postJson } from 'shared/api';

export const useComposePrompt = () =>
  useMutation({
    mutationFn: (request: ComposeStickerPromptRequest) =>
      postJson<ComposeStickerPromptResponse>(apiRoutes.stickerPrompt, request),
  });
