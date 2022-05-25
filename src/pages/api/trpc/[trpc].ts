import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { z } from "zod";

import { prisma } from "../../../db/client";

export const appRouter = trpc
  .router()
  .query("checkSlug", {
    input: z.object({ slug: z.string() }),
    async resolve({ input }) {
      const slugCount = await prisma.shortLink.count({
        where: {
          slug: {
            equals: input.slug,
          },
        },
      });

      return { used: slugCount > 0 };
    },
  })
  .mutation("createShortLink", {
    input: z.object({ slug: z.string(), url: z.string() }),
    async resolve({ input }) {
      try {
        await prisma.shortLink.create({
          data: {
            slug: input.slug,
            url: input.url,
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
  });

export type AppRouter = typeof appRouter;

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => null,
});
