import { PrismaClient } from '@prisma/client';
import { AsyncLocalStorage } from 'node:async_hooks';

export const prismaContext = new AsyncLocalStorage();

// Create a proxy that dynamically gets the Prisma client from the current request context
const prismaProxy = new Proxy(
  {},
  {
    get: (target, prop) => {
      const prisma = prismaContext.getStore();
      if (!prisma) {
        throw new Error(
          'Prisma client not found in async local storage. Are you running outside of a request context?'
        );
      }
      return Reflect.get(prisma, prop);
    },
  }
);

export default prismaProxy;
