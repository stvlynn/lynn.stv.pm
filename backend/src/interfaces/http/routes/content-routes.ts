import { apiRoutes } from '@lynn/contracts';
import { Hono } from 'hono';
import { z } from 'zod';
import { ok } from '../envelope';
import type { AppEnv } from '../middleware/request-context';
import type { HttpDependencies } from '../services';

const IdParam = z.object({ id: z.string().regex(/^[a-z0-9-]{1,64}$/) });

const ComposePromptBody = z.object({
  text: z.string().min(1).max(64),
  action: z.string().min(1).max(200),
});

/** Read-only content endpoints plus the sticker prompt composer. */
export function contentRoutes({ services }: HttpDependencies): Hono<AppEnv> {
  const routes = new Hono<AppEnv>();

  routes.get(apiRoutes.character, async (c) => c.json(ok(await services.getCharacterProfile.execute())));

  routes.get(apiRoutes.outfits, async (c) => c.json(ok(await services.listOutfits.execute())));
  routes.get('/outfits/:id', async (c) => {
    const { id } = IdParam.parse(c.req.param());
    return c.json(ok(await services.getOutfit.execute(id)));
  });

  routes.get(apiRoutes.artworks, async (c) => c.json(ok(await services.listArtworks.execute())));
  routes.get('/artworks/:id', async (c) => {
    const { id } = IdParam.parse(c.req.param());
    return c.json(ok(await services.getArtwork.execute(id)));
  });

  routes.get(apiRoutes.uiSpec, async (c) => c.json(ok(await services.getUiSpec.execute())));
  routes.get(apiRoutes.stickerSpec, async (c) => c.json(ok(await services.getStickerSpec.execute())));
  routes.post(apiRoutes.stickerPrompt, async (c) => {
    const command = ComposePromptBody.parse(await c.req.json().catch(() => ({})));
    return c.json(ok(await services.composeStickerPrompt.execute(command)), 201);
  });
  routes.get(apiRoutes.pvSpec, async (c) => c.json(ok(await services.getPvSpec.execute())));

  return routes;
}
