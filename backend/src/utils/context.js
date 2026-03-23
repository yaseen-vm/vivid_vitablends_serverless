import { AsyncLocalStorage } from 'node:async_hooks';

export const honoContext = new AsyncLocalStorage();

export const getHonoContext = () => honoContext.getStore();
