
import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { z } from 'zod';

// Import schemas
import { 
  createSparePartInputSchema, 
  updateSparePartInputSchema,
  searchSparePartsInputSchema,
  createUserInputSchema,
  updateUserInputSchema
} from './schema';

// Import handlers
import { createSparePart } from './handlers/create_spare_part';
import { getSpareParts } from './handlers/get_spare_parts';
import { getSparePartById } from './handlers/get_spare_part_by_id';
import { updateSparePart } from './handlers/update_spare_part';
import { deleteSparePart } from './handlers/delete_spare_part';
import { getLowStockSpareParts } from './handlers/get_low_stock_spare_parts';
import { createUser } from './handlers/create_user';
import { getUsers } from './handlers/get_users';
import { updateUser } from './handlers/update_user';
import { deleteUser } from './handlers/delete_user';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // Spare Parts routes
  createSparePart: publicProcedure
    .input(createSparePartInputSchema)
    .mutation(({ input }) => createSparePart(input)),
    
  getSpareParts: publicProcedure
    .input(searchSparePartsInputSchema.optional())
    .query(({ input }) => getSpareParts(input)),
    
  getSparePartById: publicProcedure
    .input(z.number())
    .query(({ input }) => getSparePartById(input)),
    
  updateSparePart: publicProcedure
    .input(updateSparePartInputSchema)
    .mutation(({ input }) => updateSparePart(input)),
    
  deleteSparePart: publicProcedure
    .input(z.number())
    .mutation(({ input }) => deleteSparePart(input)),
    
  getLowStockSpareParts: publicProcedure
    .query(() => getLowStockSpareParts()),

  // User management routes
  createUser: publicProcedure
    .input(createUserInputSchema)
    .mutation(({ input }) => createUser(input)),
    
  getUsers: publicProcedure
    .query(() => getUsers()),
    
  updateUser: publicProcedure
    .input(updateUserInputSchema)
    .mutation(({ input }) => updateUser(input)),
    
  deleteUser: publicProcedure
    .input(z.number())
    .mutation(({ input }) => deleteUser(input)),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC server listening at port: ${port}`);
}

start();
